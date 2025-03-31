import { useRuntimeConfig } from 'nuxt/app'
import { AppError, type ApiError } from './type'
import type { ApiResponse } from './type'
import { useApiClient } from '../utils/apiClient'

export const useUserRepository = () => {
  const { fetchApi } = useApiClient()

  const getUserInfo = async (): ApiResponse<UserInfoResp> => {
    return fetchApi<UserInfoResp>('/user/info')
  }

  const getUserIdByUsername = async (username: string): ApiResponse<UserIdResp> => {
    return fetchApi<UserIdResp>(`/user/username/${username}`)
  }

  return { getUserInfo, getUserIdByUsername }
}

export interface UserInfoResp {
  id: string;
  username: string;
  full_name: string;
  last_online: string | null;
  is_online: string;
  created_at: string;
  updated_at: string;
}

export interface UserIdResp {
  user_id: string;
}