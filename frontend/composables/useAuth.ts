export function useAuth() {
  const router = useRouter()

  const logout = async () => {
    // Clear the auth token cookie through an API call
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Error during logout:', error)
    }

    // Redirect to login page
    router.push('/login')
  }

  const checkUnauthorized = (error: any) => {
    if (error?.response?.status === 401 || error?.data?._unauthorized === true) {
      logout()
      return true
    }
    return false
  }

  return {
    logout,
    checkUnauthorized
  }
}
