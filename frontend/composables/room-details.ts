
import { useChatRepository, type Room, type Message, type Participant } from '~/repositories/chatRepository'

export const useRoomDetails = (roomId: string) => {
  const loading = ref(false)
  const participants = ref<Participant[]>([])
  const room = ref<Room | null>(null)
  async function fetchParticipants() {
    try {
      loading.value = true
      const chatRepo = useChatRepository()
      const result = await chatRepo.getParticipants(roomId)
      if(result.data)
        participants.value = result.data
    } catch (err: any) {
      console.error('error fetchParticipants', err)
    } finally {
      loading.value = false
    }
  } 

  async function fetchRoomDetail() {
    try {
      loading.value = true
      const chatRepo = useChatRepository()
      const result = await chatRepo.getRoomDetail(roomId)
      room.value = result.data
      participants.value = result.data.participants
    } catch (err: any) {
      console.error('error fetchRoomDetail', err)
    } finally {
      loading.value = false
    }
  }

  return { participants, loading, room, fetchParticipants, fetchRoomDetail }
}
