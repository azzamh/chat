import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth-store'

export default defineNuxtRouteMiddleware((to, from) => {
  const { $socket } = useNuxtApp()
  const auth = useAuthStore()
  auth.initAuth()
  const isAuthenticated = auth.isAuthenticated

  if (auth.isAuthenticated) {
    $socket.connect(auth.token)
  }else{
    $socket.disconnect()
  }

  if (to.path === '/login' && isAuthenticated) {
    return navigateTo('/') 
  }

  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

})
