import { ref, computed } from 'vue'
import { useChatRepository, type Room, type Message } from '~/repositories/chatRepository'
import { AppError } from '~/repositories/type'


export function useRoomMessages (currentRoomId: string) {
  const messages = ref<Message[]>([])
  const messagesMap = ref<Map<string, Message[]>>(new Map())
  const loading = ref(false)
  const error = ref<AppError | null>(null)
  const { $socket } = useNuxtApp()
  initSocketEvents()

  async function fetchMessages(roomId: string, page: number = 1, limit: number = 20) {
    try {
      loading.value = true
      const chatRepo = useChatRepository()
      const result = await chatRepo.getMessageList(roomId, page, limit)
      messages.value = result.data.messages
      messagesMap.value.set(roomId, result.data)
      return result
    } catch (err: any) {
      error.value = err instanceof AppError ? err : new AppError({
        status: 500,
        message: err.message,
      })
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(roomId: string, content: string) {
    try {
      loading.value = true
      $socket?.emit('send_messages', { roomId: roomId, message: content })
    } catch (err: any) {
      error.value = err instanceof AppError ? err : new AppError({
        status: 500,
        message: err.message,
      })
      throw error.value
    } finally {
      loading.value = false
    }
  }

  watch($socket.socket, (newVal, oldVal) => {
    initSocketEvents()
  })

  function initSocketEvents() {
    $socket?.off('send_messages_success')
    $socket?.off('receive_message')
    $socket?.on('send_messages_success', onSendMessageOk)
    $socket?.on('receive_message', onReceiveMessage)
  }

  function onSendMessageOk(data: any) {
 
    messages.value.push(data)
    messages.value.toSorted((a, b) => Number(a.id) - Number(b.id))
    messagesMap.value.set(data.conversation_id, messages.value)
  }

  function onReceiveMessage(data: any) {
    const newMessages: Message = {
      id: data.id,
      room_id: data.room_id,
      sender_id: data.sender_id,
      sender_username: data.sender_username,
      sender_fullname: data.sender_fullname,
      content: data.content,
      delivered_at: data.delivered_at
    }
    if (currentRoomId && newMessages.room_id === currentRoomId) {
      messages.value.push(newMessages)
      messages.value.toSorted((a, b) => Number(a.id) - Number(b.id))
    }
    messagesMap.value.set(data, messages.value)
  }

  function setCurrentRoom(roomId: string) {
    currentRoomId = roomId

  }

  function clearError() {
    error.value = null
  }

  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)
  const getcurrentRoomId = computed(() => currentRoomId)
  const getMessages = computed(() => messages.value)

  return {
    // State
    messages,
    loading,
    error,
    // Actions
    fetchMessages,
    sendMessage,
    setCurrentRoom,
    clearError,
    initSocketEvents,
    // Getters
    isLoading,
    getError,
    getcurrentRoomId,
    getMessages
  }
}