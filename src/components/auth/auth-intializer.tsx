'use client'

import { useAppDispatch } from '@/lib/store/hook'
import { initializeAuth } from '@/lib/store/slice/authSlice'
import { useEffect } from 'react'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user_data')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        dispatch(initializeAuth({ token, user }))
      } catch {
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        dispatch(initializeAuth(null))
      }
    } else {
      // No stored auth data, initialize as unauthenticated
      dispatch(initializeAuth(null))
    }
  }, [dispatch])

  return <>{children}</>
}
