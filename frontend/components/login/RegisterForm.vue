<template>
	<div class="min-h-screen flex items-center justify-center bg-default">
		<div class="max-w-md w-full space-y-8 p-8 bg-red rounded-lg shadow-lg">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-bold text-gray-900">
					Create new account
				</h2>
			</div>

			<form @submit.prevent="handleRegister" class="mt-8 space-y-6">
				<div class="space-y-4">
					<div>
						<PInput
							v-model="formData.full_name"
							type="text"
							label="Full Name"
							placeholder="Enter your full name"
							size="lg"
							required
						>
							<template #prepend>
								<PiProfile16 />
							</template>
						</PInput>
					</div>
					<div>
						<PInput
							v-model="formData.username"
							type="text"
							label="Username"
							placeholder="Choose a username"
							size="lg"
							required
						>
							<template #prepend>
								<PiProfile16 />
							</template>
						</PInput>
					</div>
					<div>
						<PInput
							v-model="formData.password"
							type="password"
							label="Password"
							placeholder="Create a password"
							size="lg"
							required
						>
							<template #prepend>
								<PiLock16 />
							</template>
						</PInput>
					</div>
				</div>

				<div>
					<PButton
						type="submit"
						variant="primary"
						class="w-full"
						:loading="loading"
					>
						Register
					</PButton>
					<div class="text-center mt-4">
						<PButton
							type="button"
							variant="secondary"
							class="w-full"
							@click="$emit('back')"
						>
							Back to Login
						</PButton>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "~/stores/auth-store";
import PiProfile16 from "@privyid/persona-icon/vue/profile/16.vue";
import PiLock16 from "@privyid/persona-icon/vue/lock/16.vue";
import { formatErrorMessages } from "~/utils/errorMessages";

defineEmits(["back"]);

const authStore = useAuthStore();
const loading = ref(false);
const errors = ref<string[]>([]);

const formData = reactive({
	full_name: "",
	username: "",
	password: "",
});

const handleRegister = async () => {
	try {
		loading.value = true;
		await authStore.register(formData);
		// await authStore.login(formData.username, formData.password);
		alert("Registration success");
	} catch (e) {
		console.log("=====", e.errors);
		errors.value = e.errors || ["Registration failed"];
		alert("Registration failed:\n\n" + formatErrorMessages(e.errors));
	} finally {
		loading.value = false;
	}
};
</script>
