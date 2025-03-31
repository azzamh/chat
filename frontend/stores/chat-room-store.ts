import { defineStore } from 'pinia'
import { useRoomMessages } from '~/composables/room-messages'
import { useRoomDetails } from '~/composables/room-details' 
import { useUserPresence } from '~/composables/user-presence'

export const useChatRoomStore = (roomId: string) => defineStore(`chat-room-${roomId}`, () => {
  const {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    setCurrentRoom,
    clearError,
    initSocketEvents: initSocketEventsMessages,
    isLoading,
    getError,
    getcurrentRoomId,
    getMessages,
  }  = useRoomMessages(roomId)

  const {
    participants,
    room,
    fetchRoomDetail,
    fetchParticipants
  } = useRoomDetails(roomId)

  const {
    users: userPresences,
    usersMap: userPresencesMap,
    subscribeAllUsersPresenceInRoom,
    initSocketEvents: initSocketEventsUserPresence
  } = useUserPresence()
  
  const initSocketEvents = () => {
    initSocketEventsMessages()
    initSocketEventsUserPresence()
  }

  return {
    // State
    messages,
    error,
    participants,
    room,
    userPresences,
    userPresencesMap,
    // Actions
    fetchMessages,
    sendMessage,
    setCurrentRoom,
    fetchParticipants,
    fetchRoomDetail,
    clearError,
    initSocketEvents,
    subscribeAllUsersPresenceInRoom,
    // Getters
    isLoading,
    getError,
    getcurrentRoomId,
    getMessages
  }
})()
