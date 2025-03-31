import { defineStore } from 'pinia'

export const useRoomListStore = defineStore('room-list', () => {
  const { rooms, loading, fetchRoom, joinRoom } = useRoomList()

  return{
    rooms, 
    loading, 
    fetchRoom, 
    joinRoom
  }
})