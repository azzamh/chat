<template>
	<div class="chat-list p-4 space-y-4">
		<div v-if="loading" class="text-center text-gray-500 animate-pulse">
			Loading conversations...
		</div>
		<div
			v-else
			v-for="room in rooms"
			:key="room.id"
			class="chat-item"
			@click="selectChat(room)"
		>
			<PiUserCircle32 class="chat-avatar" />
			<div class="flex-1 ml-3">
				<div class="flex justify-between items-center">
					<h3 class="chat-name">{{ room.slug }}</h3>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import PiUserCircle32 from "@privyid/persona-icon/vue/user-circle/32.vue";
import { useRoomListStore } from "~/stores/room-list-store";
import type { Room } from "~/repositories/chatRepository";

const { fetchRoom } = useRoomListStore();
const { rooms, loading } = storeToRefs(useRoomListStore());

onMounted(async () => {
	await fetchRoom();
});

const selectChat = (room: Room) => {
	navigateTo(`/chat/${room.slug}`);
};
</script>

<style scoped>
.chat-list {
	max-height: calc(100vh - 4rem);
	overflow-y: auto;
	background: #f8f9fa;
	padding: 1rem;
	border: none;
	border-radius: 0;
	box-shadow: none;
}

.chat-list::-webkit-scrollbar {
	width: 6px;
}

.chat-list::-webkit-scrollbar-track {
	background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 3px;
}

.chat-item {
	display: flex;
	align-items: center;
	padding: 1rem;
	margin-bottom: 0.5rem;
	border-radius: 0.5rem;
	background-color: white;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	transition: all 0.2s ease;
	border: 1px solid #e2e8f0;
	position: relative;
	overflow: hidden;
  cursor: pointer;
}

.chat-item:hover {
	transform: none;
	background-color: #f8fafc;
	border-color: #e2e8f0;
}

.chat-item::before {
	display: none;
}

.chat-avatar {
	color: #64748b;
	min-width: 32px;
	transition: none;
}

.chat-name {
	font-size: 1rem;
	font-weight: 500;
	color: #334155;
	transition: none;

	.chat-item:hover .chat-name {
	}
	color: #334155;
}
</style>
