<template>
	<div class="flex flex-col h-full bg-gray-10 border-l border-gray-200">
		<!-- Room Header -->
		<div
			class="p-4 border-b border-gray-200 flex justify-between items-center h-[80px]"
		>
			<div>
				<h2 class="text-xl font-semibold">Group Info</h2>
			</div>
			<button
				@click="$emit('close')"
				class="p-2 hover:bg-gray-10 rounded-full transition-colors"
			>
				<pi-close-16 />
			</button>
		</div>

		<!-- Members List -->
		<div class="flex-1 overflow-y-auto p-4">
			<!-- <p class="text-sm text-gray-600">{{ room?.last_seq_id }} messages</p> -->
			<h3 class="text-sm font-medium text-gray-500 mb-3">
				Members ({{ sortedParticipants.length }})
			</h3>
			<ul class="space-y-2">
				<li
					v-for="participant in sortedParticipants"
					:key="participant.id"
					class="flex items-center space-x-3 p-2 hover:bg-gray-10 rounded-lg"
				>
					<div class="relative">
						<p-avatar
							:name="participant.full_name"
							class="border border-gray-30"
						/>
						<p-dot
							:style="participant.is_online ? 'success' : 'gray'"
							:class="`absolute bottom-[10px] right-[0px] z-50 border border-gray-50 ${participant.is_online ? '!bg-green-40' : '!bg-gray-40'} `"
						/>
					</div>
					<div>
						<p class="text-sm font-medium">
							{{
								`${participant.full_name}  
								${
									currentUser?.username === participant.username ? " (You)" : ""
								}`
							}}
						</p>
						<p class="text-xs text-gray-500">@{{ participant.username }}</p>
						<!-- <p class="text-xs text-gray-500">
							{{ participant.last_seen }}
						</p> -->
					</div>
				</li>
			</ul>
			<!-- <p-button class="mt-4" block @click="subscribeAllUsersPresenceInRoom(roomId)">
				sub
			</p-button><br/>
			userPresences: {{ userPresences }} -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useChatRoomStore } from "~/stores/chat-room-store";
const authStore = useAuthStore();
const { user: currentUser } = toRefs(authStore);

const props = defineProps<{
	roomId: string;
}>();

const { fetchParticipants, fetchRoomDetail, subscribeAllUsersPresenceInRoom } = useChatRoomStore(props.roomId);
const { 
	participants, 
	userPresences,
	userPresencesMap
} = storeToRefs(useChatRoomStore(props.roomId));

const sortedParticipants = computed(() => {
	if (!participants.value) return [];

	let p = [...participants.value]

	p = p.map((participant) => {
		const p = {...participant};
		// let is_online = false;
		// userPresences.value.forEach((presence) => {
		// 	if (presence.username === participant.username && presence.isOnline) {
		// 		p.is_online = true;
		// 		p.last_seen = presence.lastSeen;
		// 	}
		// });
		p.is_online = userPresencesMap.value.get(p.username)?.isOnline ?? false;
		p.last_seen = userPresencesMap.value.get(p.username)?.lastSeen ?? '';
		return {...p};
	});
	return [...p].sort((a, b) => {
		if (a.username === currentUser.value?.username) return -1;
		if (b.username === currentUser.value?.username) return 1;
		return a.full_name.localeCompare(b.full_name);
	});

});



watch(
	() => props.roomId,
	async () => {
		if (props.roomId) {
			await fetchParticipants();
		}
	}
);


onMounted(() => {
	if (props.roomId) {
		fetchParticipants();
		fetchRoomDetail();
		subscribeAllUsersPresenceInRoom(props.roomId);
		setTimeout(() => {
			subscribeAllUsersPresenceInRoom(props.roomId);
		}, 1000);
	}
});

defineEmits(["close"]);
</script>
