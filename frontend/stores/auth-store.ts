import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useAuthRepository } from '~/repositories/authRepository'
import { useUserRepository } from '~/repositories/userRepository'
import { useCookie } from '#app'

type User = { 
  username: string; 
  token?: string;
  full_name?: string;
  last_online?: string | null;
  is_online?: string;
}
type LoginResponse = { token: string; user: User }

export const useAuthStore = defineStore('auth', () => {
  const authRepository = useAuthRepository()
  const userRepository = useUserRepository()
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const { $socket } = useNuxtApp()

  const saveUserToStorage = (userData: User | null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  const token = computed(() => user.value?.token)

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      const { data, status, message } = await authRepository.login(username, password)
      if (status === 200) {
        const tokenCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: true,
          sameSite: true
        })
        tokenCookie.value = data.token
        
        user.value = {
          username,
          token: data.token
        }
        saveUserToStorage(user.value)
        await getUserInfo()
        navigateTo('/')
        return
      }
      throw new Error(message || 'Login failed')
    } catch(e){
        alert('invalid username or password')
    }finally {
      isLoading.value = false
    }
  }

  const getUserInfo = async () => {
    isLoading.value = true
    try {
      const response = await userRepository.getUserInfo()
        if (response.status === 200) {
          user.value = {
            ...user.value,
            ...response.data
          }
          saveUserToStorage(user.value)
          return
        }
      throw new Error(response.message || 'Failed to get user info')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: { username: string, password: string, full_name: string }) => {
    isLoading.value = true
    try {
      const response = await authRepository.register(data.username, data.password, data.full_name)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = null
    saveUserToStorage(null)
  }

  const initAuth = async () => {
    try {
      loadUserFromStorage()
      const tokenCookie = useCookie('auth_token')
      if (tokenCookie.value) {
        await getUserInfo()
      }
    } catch (e) {
      console.error('Failed to load user data', e)
      logout() // Clear invalid session
    }
  }

  // Initialize on store creation
  onMounted(() => {
    initAuth()
  })

  return { token, user, isAuthenticated, login, register, logout, initAuth, isLoading }
})
