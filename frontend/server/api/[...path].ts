import { defineEventHandler, proxyRequest, useRuntimeConfig, getRequestURL, getCookie, setCookie } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const targetApi = config.public.targetApi ?? 'http://localhost:8888'
  const path = event.context.params?.path
  const targetUrl = `${targetApi}/api/${path}`

  // Get auth token from cookies
  const authToken = getCookie(event, 'auth_token')

  try {
    // Forward request with auth token
    console.log(`🚀 Proxying request to: ${getRequestURL(event)} -> ${targetUrl}`)
    
    const response = await proxyRequest(event, targetUrl, {
      headers: {
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      }
    })

    

    // Check if response is a 401 error
    if (response.status === 401) {
      // Clear the auth token cookie
      setCookie(event, 'auth_token', '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      // Return a specific error that will be handled by client
      return {
        status: 401,
        _unauthorized: true,
        message: 'Unauthorized - Session expired'
      }
    }

    return response
  } catch (error) {
    console.error(`❌ Proxy error: ${error.message}`)
    return { status: 502, message: 'Bad Gateway' }
  }
})