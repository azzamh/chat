<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth-store'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  auth.initAuth() // Inisialisasi session saat aplikasi dimuat
})
</script>
<style scoped lang="postcss">
.app {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  height: 100vh;
}
</style>