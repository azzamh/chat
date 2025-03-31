import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  nuxtApp.hook('app:error', (error) => {
    // Check if the error is an unauthorized error from our API
    if (error?.data?._unauthorized === true) {
      // Redirect to login page
      router.push('/login')

      // Show a notification to the user (if you have a notification system)
      // You could use Nuxt's built-in useToast() or other notification library

      return false // Prevent default error handling
    }
  })
})
