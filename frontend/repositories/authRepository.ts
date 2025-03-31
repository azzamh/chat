import { useRuntimeConfig } from 'nuxt/app'
import { AppError, type ApiError } from './type'
import type { ApiResponse } from './type'
import { useApiClient } from '../utils/apiClient'

export const useAuthRepository = () => {
  const { fetchApi } = useApiClient()

  const login = async (username: string, password: string): ApiResponse<LoginResponse> => {
    return fetchApi<LoginResponse>('/user/login', {
      method: 'POST',
      body: { username, password },
      requiresAuth: false
    })
  }

  const register = async (username: string, password: string, full_name: string) => {
    return fetchApi('/user/register', {
      method: 'POST',
      body: { username, password, full_name },
      requiresAuth: false
    })
  }

  return { login, register }
}

export interface LoginResponse {
  token: string
}