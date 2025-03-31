<template>
  <div class="min-h-screen flex items-center justify-center bg-default">
    <div class="max-w-md w-full space-y-8 p-8 bg-red rounded-lg shadow-lg">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <PInput
              v-model="formData.username"
              type="text"
              label="Username"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
          <p-button
            type="submit"
            variant="primary"
            class="w-full"
            color="info"
            :loading="loading"
          >
            Sign in
          </p-button>
          <div class="text-center mt-4">
            <PButton
              type="button"
              variant="secondary"
              class="w-full"
              @click="handleRegister"
            >
              Create new account
            </PButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '~/stores/auth-store';
import PiProfile16 from '@privyid/persona-icon/vue/profile/16.vue'
import PiLock16 from '@privyid/persona-icon/vue/lock/16.vue'
import { navigateTo } from 'nuxt/app'

const emit = defineEmits(['register']);

const authStore = useAuthStore();
const loading = ref(false);

const formData = reactive({
  username: '',
  password: ''
});


const error = ref('')
const handleLogin = () => {
  const { username, password } = formData
  try {
    authStore.login(username, password)
    navigateTo('/')
  } catch (err) {
    error.value = (err as Error).message
    alert(error.value)
  }
}

const handleRegister = () => {
  emit('register');
};
</script>

<style scoped>

</style>
