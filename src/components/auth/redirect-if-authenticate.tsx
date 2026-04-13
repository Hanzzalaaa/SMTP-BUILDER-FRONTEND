'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/store/hook'

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
  redirectTo?: string
}

export function RedirectIfAuthenticated({ 
  children, 
  redirectTo = '/dashboard' 
}: RedirectIfAuthenticatedProps) {
  const router = useRouter()
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isInitialized, router, redirectTo])

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show redirect message if authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
