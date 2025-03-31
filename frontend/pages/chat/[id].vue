<template>
<Chatroom v-if="isReady" :roomId="id"/>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const route = useRoute()
const id = route.params.id as string
const isReady = ref(false)

onMounted(() => {
  isReady.value = true
})
</script>