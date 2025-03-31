<template>
	<div class="chat-room flex h-screen">
		<div class="flex-1 flex flex-col">
			<div
				class="header bg-base text-white p-4 flex items-center justify-between border-b shadow-xl"
			>
				<div class="flex items-center gap-4">
					<button
						@click="goBack"
						class="bg-gray-200 text-black px-2 py-1 rounded"
					>
						<PiChevronLeft24 />
					</button>
					<p-avatar class="avatar-group border border-gray-50" size="md">
						<PiUserGroups32 />
					</p-avatar>
					<div class="flex flex-col">
						<h2 class="text-lg font-bold text-default">
							{{ chatStore.getcurrentRoomId || "Chat Room" }}
						</h2>
						<p class="text-sm text-subtle">
							{{ participants.length }} participants
						</p>
					</div>
				</div>
				<button
					v-if="!showRoomInfo"
					@click="showRoomInfo = !showRoomInfo"
					class="bg-gray-200 text-black px-3 py-1 rounded flex items-center gap-2"
				>
					<span class="text-sm">Info</span>
					<i class="i-carbon-information"></i>
				</button>
			</div>

			<div
				ref="messagesContainer"
				class="messages flex-1 overflow-y-auto p-4 bg-pattern relative"
			>
				<div class="absolute inset-0 bg-white/20"></div>
				<div class="relative z-10">
					<template v-for="(message, index) in messages" :key="index">
						<div v-if="shouldShowDate(index)" class="date-separator">
							{{ formatMessageDate(message.delivered_at) }}
						</div>
						<div
							:class="`mb-4 flex items-end gap-0 ${
								isMine(message) ? 'flex-row-reverse ' : 'flex-row '
							}`"
						>
							<div v-if="!isMine(message)" class="relative">
								<p-avatar
									:name="message.sender_username"
									class="mb-3 border border-gray-20"
								/>

								<p-dot
									:class="`absolute bottom-[15px] right-[0px] z-50 border border-gray-50 ${
										userPresencesMap.get(message.sender_username)?.isOnline
											? '!bg-green-40'
											: '!bg-gray-40'
									}`"
								/>
							</div>
							<div
								:class="['message-wrapper', isMine(message) ? 'mine' : 'other']"
							>
								<div class="message-content">
									<div class="message-sender">
										{{
											message.sender_username === currentUser?.username
												? message.sender_fullname + " (You)"
												: message.sender_fullname
										}}
									</div>

									{{ message.content }}
									<span class="message-time">{{
										formatDeliveredAt(message.delivered_at)
									}}</span>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>

			<div class="input-bar p-4 bg-white flex items-center border-t">
				<input
					v-model="newMessage"
					type="text"
					placeholder="Type a message..."
					class="flex-1 border rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
					@keyup.enter="sendMessage"
				/>
				<button
					@click="sendMessage"
					class="bg-green-500 text-white px-4 py-2 rounded-lg"
				>
					Send
				</button>
			</div>
		</div>

		<!-- Room Info Sliding Panel -->
		<Transition name="app-slide" mode="out-in">
			<ChatroomInfo
				v-if="showRoomInfo"
				:room-id="roomId"
				class="w-80"
				@close="showRoomInfo = false"
			/>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useAuthStore } from "~/stores/auth-store";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

const route = useRoute();
// const roomId = computed(()=>route.params.id as string);

const props = defineProps<{
	roomId: string;
}>();

const authStore = useAuthStore();
const { user: currentUser } = toRefs(authStore);

const chatStore = useChatRoomStore(props.roomId);
const { messages, participants, userPresencesMap } = storeToRefs(chatStore);

const newMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const showRoomInfo = ref(true);

const isMine = (message) => {
	return message.sender_username === currentUser.value?.username;
};

const sendMessage = () => {
	if (newMessage.value.trim() !== "") {
		chatStore.sendMessage(props.roomId, newMessage.value);
		newMessage.value = "";
		scrollToBottom();
	}
};

const scrollToBottom = () => {
	nextTick(() => {
		if (messagesContainer.value) {
			messagesContainer.value.scrollTo({
				top: messagesContainer.value.scrollHeight,
				behavior: "smooth",
			});
		}
	});
};

const goBack = () => {
	// Implement navigation logic here
	navigateTo("/");
};
onMounted(() => {
	chatStore.initSocketEvents();
	scrollToBottom();
	chatStore.fetchMessages(props.roomId);
	chatStore.setCurrentRoom(props.roomId);
	chatStore.fetchParticipants();

	onMounted(() => {
		scrollToBottom();
		chatStore.fetchParticipants();
		chatStore.fetchRoomDetail();
	});
});

const formatDeliveredAt = (timestamp: string) => {
	const date = new Date(timestamp);

	if (isToday(date)) {
		return format(date, "HH:mm");
	} else if (isYesterday(date)) {
		return "Yesterday " + format(date, "HH:mm");
	} else {
		return format(date, "dd/MM/yyyy HH:mm");
	}
};

const formatMessageDate = (timestamp: string) => {
	const date = new Date(timestamp);

	if (isToday(date)) {
		return "Today";
	} else if (isYesterday(date)) {
		return "Yesterday";
	} else {
		return format(date, "EEEE, MMMM d, yyyy");
	}
};

const shouldShowDate = (index: number) => {
	if (index === 0) return true;

	const currentMessage = messages.value[index];
	const previousMessage = messages.value[index - 1];

	return !isSameDay(
		new Date(currentMessage.delivered_at),
		new Date(previousMessage.delivered_at)
	);
};

watch(
	messages,
	() => {
		scrollToBottom();
	},
	{ deep: true }
);
</script>

<style scoped lang="postcss">
.chat-room {
	background-color: #f8f9fa;
}

.message-wrapper {
	display: flex;
	margin-bottom: 10px;
	position: relative;
}

.message-wrapper.mine {
	@apply mr-0;
	justify-content: flex-end;
}

.message-wrapper.other {
	@apply ml-0 px-0 !important;
	justify-content: flex-start;
}

.message-content {
	max-width: 70%;
	min-width: 120px;
	word-wrap: break-word;
	padding: 8px 15px;
	border-radius: 18px;
	position: relative;
	margin: 0 12px;
	font-size: 16px;
}

.message-sender {
	font-size: 11px;
	color: #888585;
	font-weight: 600;
	margin-bottom: 2px;
}

.message-wrapper.mine .message-content {
	background-color: #dcf8c6;
	border-bottom-right-radius: 4px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-wrapper.other .message-content {
	background-color: #fff;
	border-bottom-left-radius: 4px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-time {
	display: block;
	font-size: 10px;
	color: #999;
	margin-top: 2px;
	text-align: right;
}

.input-bar input {
	border: 1px solid #ccc;
}

.messages {
	scroll-behavior: smooth;
	background-color: #f0f2f5;
	/* background-image: url('/images/chat-pattern-1.jpg'); */
	background-image: url("/images/chat-pattern.svg");
	background-repeat: repeat;
	background-size: 100px 100px;
	position: relative;
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}

.avatar-group {
	background-color: rgb(179, 179, 179);
	color: #fff;
}

.date-separator {
	text-align: center;
	margin: 1rem 0;
	position: relative;
	z-index: 1;
}

.date-separator::before {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	height: 1px;
	background-color: #e5e5e5;
	z-index: -1;
}

.date-separator span {
	background-color: rgba(255, 255, 255, 0.9);
	padding: 0.5rem 1rem;
	border-radius: 1rem;
	font-size: 0.875rem;
	color: #666;
	display: inline-block;
}
</style>
