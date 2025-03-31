<template>
	<p-modal v-model="model" centered>
		<h2 class="text-2xl font-bold mb-4">Join Chat Room</h2>
		<form @submit.prevent="handleSubmit" class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700">room id</label>
				<input
					v-model="targetRoomId"
					type="text"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
					placeholder="Enter room id"
				/>
			</div>

			<div class="flex justify-end gap-2 mt-6">
				<p-button type="button" @click="$emit('close')"> Cancel </p-button>
				<p-button
					variant="solid"
					color="info"
					type="submit"
					:disabled="!targetRoomId"
				>
					Continue
				</p-button>
			</div>
		</form>
	</p-modal>
</template>

<script setup lang="ts">
import { useRoomListStore } from "~/stores/room-list-store";

const {joinRoom} = useRoomListStore();
const emit = defineEmits(["close"]);

interface Emits {
	(e: "update:modelValue", data: boolean): void;
	(e: "close"): void;
	// (e: 'submit', data: { targetRoomId: string }): void,
}
interface Props {
	modelValue: boolean;
}
const props = defineProps<Props>();
const model = useModel(props, "modelValue");


const title = ref("");
const targetRoomId = ref("");

const handleSubmit = async () => {
	try {
		await joinRoom(targetRoomId.value);
		emit("close");
	} catch (error) {
		console.error("Failed to start conversation:", error);
	}
};
</script>
