import { ref, computed } from 'vue'
import { useChatRepository, type Room, type Message } from '~/repositories/chatRepository'

export const useRoomList = () => {
  const loading = ref(false)
  const rooms = ref<Room[]>([])
  
  async function fetchRoom() {
    try {
      loading.value = true
      const chatRepo = useChatRepository()
      const result = await chatRepo.geRoomList()
      rooms.value = result.data.rooms
      return result
    } catch (err: any) {
    } finally {
      loading.value = false
    }
  }


  async function joinRoom(roomId: string) {
    try {
      loading.value = true
      const chatRepo = useChatRepository()
      const resp = await chatRepo.joinRoom(roomId)
      fetchRoom()
      return resp.data
    } catch (err: any) {
    } finally {
      loading.value = false
    }
  }

  return { rooms, loading, fetchRoom, joinRoom }
} 
