"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { logout } from '@/lib/store/slice/authSlice'
import { useRouter } from 'next/navigation'

const INACTIVITY_TIMEOUT = 60 * 60 * 1000 // 1 hour in milliseconds

export function useAutoLogout() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  const handleLogout = useCallback(() => {
    dispatch(logout())
    router.push('/')
  }, [dispatch, router])

  const resetTimeout = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only set timeout if user is authenticated
    if (isAuthenticated) {
      lastActivityRef.current = Date.now()
      timeoutRef.current = setTimeout(() => {
        handleLogout()
      }, INACTIVITY_TIMEOUT)
    }
  }, [isAuthenticated, handleLogout])

  const handleActivity = useCallback(() => {
    // Only reset if user is authenticated and it's been more than 1 minute since last activity
    if (isAuthenticated && Date.now() - lastActivityRef.current > 60000) {
      resetTimeout()
    }
  }, [isAuthenticated, resetTimeout])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    if (!isAuthenticated) {
      // Clear timeout if user is not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // Set initial timeout
    resetTimeout()

    // Activity events to listen for
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [isAuthenticated, handleActivity, resetTimeout])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}
