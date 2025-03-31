<template>
	<div class="app-container">
		<nav class="main-navbar border-b">
			<h1 class="navbar-title">{{ fullname }} - [ @{{ username }} ]</h1>
			<div class="flex gap-3">
				<p-button
					color="info"
					variant="ghost"
					@click="newConversation"
					class="action-button new-chat"
					>Join Chat Room</p-button
				>
				<p-button
					color="info"
					variant="ghost"
					@click="logout"
					class="action-button logout"
					>Logout</p-button
				>
			</div>
		</nav>
		<Chatlist />
		<ChatroomNewModal
			v-model="showNewChatModal"
			@close="showNewChatModal = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth-store";
import { navigateTo } from "nuxt/app";
import { ref, computed } from "vue";

const authStore = useAuthStore();
const username = computed(() => authStore.user?.username ?? "Guest");
const fullname = computed(() => authStore.user?.full_name ?? "Guest User");

const showNewChatModal = ref(false);

const logout = () => {
	authStore.logout();
	navigateTo("/login");
};

const newConversation = () => {
	showNewChatModal.value = true;
};
</script>

<style scoped>
.app-container {
	padding: 0;
	max-width: 100%;
	margin: 0;
	background-color: #f8f9fa;
	min-height: 100vh;
}

.main-navbar {
	padding: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0;
	color: #333;
	background: white;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-title {
	font-size: 1.125rem;
	font-weight: 600;
	color: #334155;
}

.action-button {
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-weight: 500;
	transition: all 0.2s;
}

.action-button.new-chat {
	color: #334155;
	border: 1px solid #e2e8f0;
	background: white;
}

.action-button.new-chat:hover {
	background: #f1f5f9;
	color: #334155;
	transform: none;
}

.action-button.logout {
	color: white;
	background: #ef4444;
}

.action-button.logout:hover {
	background: #dc2626;
	transform: none;
}
</style>
