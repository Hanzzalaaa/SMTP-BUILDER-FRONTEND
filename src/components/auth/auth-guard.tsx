"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/store/hook'
import { validateAndClearExpiredToken } from '@/lib/auth/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, redirectTo = '/login' }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const authState = useAppSelector(state => state.auth)

  useEffect(() => {
    const checkAuth = () => {
      console.log('AuthGuard: Checking authentication...')
      
      // Check if user is authenticated in Redux state
      const hasReduxAuth = authState.isAuthenticated && authState.user
      
      // Check if token exists and is valid
      const hasValidToken = validateAndClearExpiredToken()
      
      // Check if we have user data in localStorage
      const hasLocalUserData = localStorage.getItem('user_data')
      
      console.log('AuthGuard: Auth checks:', {
        hasReduxAuth,
        hasValidToken,
        hasLocalUserData,
        authState: authState
      })
      
      // Determine if user is actually authenticated
      const isActuallyAuthenticated = hasReduxAuth && hasValidToken && !!hasLocalUserData
      
      setIsAuthenticated(!!isActuallyAuthenticated)
      setIsChecking(false)
      
      // Handle authentication requirements
      if (requireAuth && !isActuallyAuthenticated) {
        console.log('AuthGuard: User not authenticated, redirecting to:', redirectTo)
        // Clear any remaining data
        localStorage.clear()
        sessionStorage.clear()
        // Redirect
        router.push(redirectTo)
      } else if (!requireAuth && isActuallyAuthenticated) {
        // If user is authenticated but this route doesn't require auth (like login page)
        console.log('AuthGuard: User is authenticated, redirecting to dashboard')
        router.push('/dashboard')
      }
    }
    
    // Small delay to ensure Redux state is initialized
    const timer = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timer)
  }, [requireAuth, redirectTo, router, authState])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If we don't require auth, just show children
  if (!requireAuth) {
    return <>{children}</>
  }

  // If we require auth and user is authenticated, show children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // If we require auth but user is not authenticated, show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  )
}
