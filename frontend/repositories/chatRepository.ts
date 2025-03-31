import { useRuntimeConfig } from 'nuxt/app'
import { AppError, type ApiError } from './type'
import type { ApiResponse } from './type'
import { useApiClient } from '../utils/apiClient'

export const useChatRepository = () => {
  const { fetchApi } = useApiClient()
  const baseChatPath = '/chat'

  const joinRoom = async (room_id: string): ApiResponse<StartConversationResponse> => {
    return fetchApi<StartConversationResponse>(`${baseChatPath}/room/${room_id}/join`, {
      method: 'POST'
    })
  }

  const geRoomList = async (): ApiResponse<geRoomListResponse> => {
    return fetchApi<geRoomListResponse>(`${baseChatPath}/room/list`)
  }

  const getMessageList = async (room_id: string, page: number = 1, limit: number = 20): ApiResponse<GetMessageListResponse> => {
    return fetchApi<GetMessageListResponse>(`${baseChatPath}/room/${room_id}/messages`, {
      params: { page, limit }
    })
  }

  const sendMessage = async (room_id: string, message: string): ApiResponse<Message> => {
    return fetchApi<Message>(`${baseChatPath}/message/send`, {
      method: 'POST',
      body: {
        conversation_id: room_id,
        message
      }
    })
  }

  const getParticipants = async (room_id: string): ApiResponse<GetParticipantsResponse> => {
    return fetchApi<GetParticipantsResponse>(`${baseChatPath}/room/${room_id}/participants`)
  }

  const getRoomDetail = async (room_id: string): ApiResponse<Room> => {
    return fetchApi<Room>(`${baseChatPath}/room/${room_id}/details`)
  }

  return { joinRoom, geRoomList, getMessageList, sendMessage, getParticipants, getRoomDetail }
}

export interface Room {
  id: number,
  name: string,
  slug: string,
  message_count: number,
  created_at: string,
  last_seq_id: number
}

export type pagination = {
  page: number,
  limit: number,
  count: number,
  total_count: number,
  total_pages: number
}

export type StartConversationResponse = Room

export type geRoomListResponse = {
  rooms: Room[],
  pagination: pagination
}

export interface Message {
  id: string,
  room_id: string,
  sender_id: string,
  sender_username: string,
  sender_fullname: string,
  content: string,
  delivered_at: string
}

export type GetMessageListResponse = {
  messages: Message[],
  pagination: pagination
}

export interface Participant {
  id: string,
  username: string,
  full_name: string,
  is_online: boolean,
  last_seen: string
}

export type GetParticipantsResponse = {
  participants: Participant[],
  pagination: pagination
}
