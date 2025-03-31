import { defineNuxtPlugin } from '#app';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '~/stores/auth-store';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig()
  const targetApi = config.public.targetApi
  const socketRef = ref<Socket | null>(null);
  let heartbeatInterval: NodeJS.Timeout | null = null;

  console.log('===socket defineNuxtPlugin', socketRef.value)
  // Socket service object
  const socketService = {
    socket: computed(() => socketRef.value),

    connect(token: string) {
      if (socketRef.value) {
        socketRef.value.disconnect();
      }
      if (!token || token === '') {
        return;
      }
      console.log('===socket isactive:', socketRef.value, socketRef.value?.connected)
      if (!socketRef.value?.connected) {
        socketRef.value = this.createSocket(token);
        socketRef.value.connect();
        this.startHeartbeat();
      }
    },

    disconnect() {
      this.stopHeartbeat();
      socketRef.value?.disconnect();
      socketRef.value = null;
    },

    emit(event: string, data: any) {
      socketRef.value?.emit(event, data);
    },

    on(event: string, callback: Function) {
      socketRef.value?.on(event, callback);
    },

    off(event: string) {
      socketRef.value?.off(event);
    },

    startHeartbeat() {
      this.stopHeartbeat();
      heartbeatInterval = setInterval(() => {
        socketRef.value?.emit('online_status_heartbeat', { time: new Date().toISOString() });
      }, 3000); // 10 seconds
    },

    stopHeartbeat() {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    },

    createSocket(token: string): Socket {
      console.log('===socket Creating with token:', token)
      const s = io(targetApi, {
        path: '/socket.io',
        transports: ['websocket'],
        query: { token }
      })

      s.on('connect', () => {
        console.log('===Socket connected, id:', s.id)
        socketRef.value = s
      })

      s.on('connect_error', (err) => {
        console.error('===Socket connect_error:', err)
      })

      s.on('disconnect', (reason) => {
        console.log('===Socket disconnected:', reason)
        socketService.stopHeartbeat();
      })

      return s
    }
  }



  // Initial connection if token exists
  if (authStore.token) {
    socketService.connect(authStore.token);
  }

  // Watch token changes
  watch(() => authStore.token, (newVal, oldVal) => {
    console.log('===socket Token changed:', newVal, oldVal)
    if (newVal !== oldVal) {
      if (newVal) {
        socketService.connect(newVal);
      } else {
        socketService.disconnect();
      }
    }
  })

  return {
    provide: {
      socket: socketService
    }
  }
});