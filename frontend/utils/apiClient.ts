import { useFetch, useRuntimeConfig } from 'nuxt/app'
import { useCookie } from '#app'
import { AppError, type ApiError } from '../repositories/type'
import type { ApiResponse } from '../repositories/type'
import { useAuthStore } from '~/stores/auth-store'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  params?: Record<string, any>
  requiresAuth?: boolean
}


export const useApiClient = () => {
  const authStore = useAuthStore()
  const getApiBase = () => {
    const config = useRuntimeConfig()
    return config.public.apiBase
  }

  const fetchApi = async <T>(url: string, options: RequestOptions = {}): ApiResponse<T> => {
    const apiBase = getApiBase()
    const fullUrl = url.startsWith('http') ? url : `${apiBase}${url}`

    const headers: Record<string, string> = {}

    // Add auth header if required
    if (options.requiresAuth !== false) {
      const tokenCookie = useCookie('auth_token')
      if (tokenCookie.value) {
        headers['Authorization'] = `Bearer ${tokenCookie.value}`
      }
    }

    const { data, error } = await useFetch(fullUrl, {
      method: options.method || 'GET',
      body: options.body,
      params: options.params,
      headers
    })


    if (error.value) {
      if(error.value.statusCode === 401) {
        await authStore.logout()
      }
      const apiError = error.value.data as ApiError
      throw new AppError({
        status: error.value.statusCode ?? 500,
        message: apiError?.message || error.value.message,
        errors: apiError?.errors,
      })
    }

    return data.value as T
  }

  return { fetchApi }
}
