
"use client"
import { useAutoLogout } from '@/lib/hooks/useAutoLogout'
import { type ReactNode } from 'react'

interface AutoLogoutProviderProps {
  children: ReactNode
}

export function AutoLogoutProvider({ children }: AutoLogoutProviderProps) {
  // Auto-logout hook handles SSR safety internally
  useAutoLogout()
  
  return <>{children}</>
}
