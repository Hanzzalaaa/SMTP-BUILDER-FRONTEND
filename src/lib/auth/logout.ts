// Utility functions for logout functionality
import { removeAuthCookie, inspectCookies, validateAndClearExpiredToken, forceClearAuthState } from './auth'

export async function performLogout(token?: string): Promise<void> {
    try {
      // Call logout API to remove server-side cookie
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
  
      if (!response.ok) {
        console.warn('Logout API returned non-OK status:', response.status)
      } else {
        console.log('Server logout API called successfully')
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Don't throw error as local logout should still work
    }
  }
  
  export function clearAllUserData(): void {
  if (typeof window !== 'undefined') {
    console.log('Starting clearAllUserData...')
    
    // Remove authentication data immediately (synchronous)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_preferences')
    localStorage.removeItem('draft_emails')
    localStorage.removeItem('email_templates')
    localStorage.removeItem('campaign_drafts')
    
    // Clear any cached data
    sessionStorage.clear()
    
    // Remove auth cookie immediately
    removeAuthCookie()
    
    // Call server logout API in background (don't wait for it)
    try {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(err => console.log('Server logout call failed:', err))
    } catch (error) {
      console.log('Server logout call error:', error)
    }
    
    console.log('Immediate cleanup completed, starting background cleanup...')
    
    // Do additional cleanup in background
    setTimeout(() => {
      // Validate token and do additional cookie removal if needed
      const isTokenValid = validateAndClearExpiredToken()
      console.log('Background token validation result:', isTokenValid ? 'VALID' : 'INVALID/EXPIRED')
      
      // Inspect cookies after background cleanup
      inspectCookies()
      
      // If cookie still exists, try aggressive approach
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
      
      if (authCookie) {
        console.warn('Cookie still exists after background cleanup. Trying aggressive approach...')
        
        // Try to remove with all possible combinations
        const hostname = window.location.hostname
        const aggressiveRemovals = [
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + hostname,
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + hostname,
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + hostname + '; secure',
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + hostname + '; samesite=strict',
          'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + hostname + '; secure; samesite=strict'
        ]
        
        aggressiveRemovals.forEach((attempt, index) => {
          document.cookie = attempt
          console.log(`Aggressive removal attempt ${index + 1}:`, attempt)
        })
        
        // Final check
        setTimeout(() => {
          console.log('=== FINAL COOKIE CHECK ===')
          inspectCookies()
          
          const finalCheck = document.cookie
          const finalAuthCookie = finalCheck.includes('auth_token=')
          
          if (finalAuthCookie) {
            console.error('Cookie removal completely failed. Using force clear as last resort.')
            forceClearAuthState()
          }
        }, 100)
      }
    }, 100)
    
    console.log('All user data cleared, immediate cleanup completed')
  }
}
  