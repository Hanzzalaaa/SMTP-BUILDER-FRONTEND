// Utility functions for authentication
export const AUTH_COOKIE_NAME = 'auth_token'
export const USER_DATA_KEY = 'user_data'
export const REDIRECT_KEY = 'auth_redirect'

export function setAuthCookie(token: string) {
  if (typeof document !== 'undefined') {
    // Set cookie with secure options
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict${
      process.env.NODE_ENV === 'production' ? '; secure' : ''
    }`
  }
}

export function removeAuthCookie() {
  if (typeof document !== 'undefined') {
    const cookieName = AUTH_COOKIE_NAME
    console.log('Attempting to remove cookie:', cookieName)
    
    // Get all cookies to see what we're working with
    const allCookies = document.cookie
    console.log('All cookies before removal:', allCookies)
    
    // Try multiple removal approaches
    const removalAttempts = [
      // Basic removal
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
      // With domain
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`,
      // With subdomain
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`,
      // Different paths
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/dashboard`,
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/login`,
      // Without path
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      // With secure flag if in production
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure`,
      // With samesite
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict`,
      // With both secure and samesite
      `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict`
    ]
    
    // Try each removal approach
    removalAttempts.forEach((attempt, index) => {
      document.cookie = attempt
      console.log(`Removal attempt ${index + 1}:`, attempt)
    })
    
    // Also try setting the cookie to an empty value with immediate expiration
    const immediateExpiration = new Date(0).toUTCString()
    document.cookie = `${cookieName}=; expires=${immediateExpiration}; path=/; max-age=0`
    document.cookie = `${cookieName}=; expires=${immediateExpiration}; path=/; domain=${window.location.hostname}; max-age=0`
    
    // Check if cookie was actually removed
    const cookiesAfterRemoval = document.cookie
    console.log('All cookies after removal:', cookiesAfterRemoval)
    
    const authCookieStillExists = cookiesAfterRemoval.includes(cookieName)
    console.log('Auth cookie after removal:', authCookieStillExists ? 'STILL EXISTS' : 'REMOVED')
    
    if (authCookieStillExists) {
      console.warn('Cookie removal failed. Cookie might be httpOnly or set by server.')
      console.log('Remaining cookies:', cookiesAfterRemoval)
      
      // Try one more approach - set cookie to empty string with very short max-age
      document.cookie = `${cookieName}=; path=/; max-age=1`
      document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; max-age=1`
      
      // Force a small delay and check again
      setTimeout(() => {
        const finalCheck = document.cookie
        console.log('Final cookie check after max-age=1:', finalCheck)
        const finalAuthCookie = finalCheck.includes(cookieName)
        console.log('Final auth cookie status:', finalAuthCookie ? 'STILL EXISTS' : 'REMOVED')
      }, 100)
    }
  }
}

export function getStoredRedirectUrl(): string | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('redirect')
  }
  return null
}

export function clearStoredRedirectUrl() {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    url.searchParams.delete('redirect')
    window.history.replaceState({}, '', url.toString())
  }
}

// Debug function to inspect all cookies
export function inspectCookies() {
  if (typeof document !== 'undefined') {
    console.log('=== COOKIE INSPECTION ===')
    console.log('document.cookie:', document.cookie)
    
    if (document.cookie) {
      const cookies = document.cookie.split(';')
      cookies.forEach((cookie, index) => {
        const [name, value] = cookie.trim().split('=')
        console.log(`Cookie ${index + 1}:`, { name: name.trim(), value: value?.trim() })
      })
    } else {
      console.log('No cookies found')
    }
    
    // Check for auth_token specifically
    const authCookie = document.cookie.split(';').find(cookie => 
      cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
    )
    console.log('Auth token cookie:', authCookie ? authCookie.trim() : 'NOT FOUND')
    
    // Check if cookie might be httpOnly by trying to read it
    try {
      const testCookie = document.cookie.split(';').find(cookie => 
        cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
      )
      if (!testCookie) {
        console.log('Cookie not found in document.cookie - might be httpOnly or set by server')
      }
    } catch (error) {
      console.log('Error reading cookie:', error)
    }
    
    console.log('=== END COOKIE INSPECTION ===')
  }
}

// Function to validate and clear expired tokens
export function validateAndClearExpiredToken() {
  if (typeof document !== 'undefined') {
    const authCookie = document.cookie.split(';').find(cookie => 
      cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
    )
    
    if (authCookie) {
      const tokenValue = authCookie.split('=')[1]
      
      try {
        // Try to decode the JWT token to check expiration
        const payload = JSON.parse(atob(tokenValue.split('.')[1]))
        const expirationTime = payload.exp * 1000 // Convert to milliseconds
        const currentTime = Date.now()
        
        if (currentTime > expirationTime) {
          console.log('Token is expired, clearing it...')
          removeAuthCookie()
          return false // Token is expired
        }
        
        return true // Token is valid
      } catch (error) {
        console.log('Error validating token:', error)
        // If we can't validate the token, assume it's invalid and clear it
        removeAuthCookie()
        return false
      }
    }
    
    return false // No token found
  }
  
  return false
}

// Function to force clear authentication state by reloading the page
export function forceClearAuthState() {
  if (typeof window !== 'undefined') {
    console.log('Force clearing authentication state...')
    
    // Clear all local storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Try to remove cookies one more time
    removeAuthCookie()
    
    // Force a page reload to clear all state
    console.log('Forcing page reload to clear authentication state...')
    window.location.reload()
  }
}
