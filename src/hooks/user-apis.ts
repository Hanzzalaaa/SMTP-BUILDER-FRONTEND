"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/store/hook"
import { logout } from "@/lib/store/slice/authSlice"
import { clearAllUserData } from "@/lib/auth/logout"

// Helper function to handle API errors and auto-logout
const handleApiError = (error: unknown, router: ReturnType<typeof useRouter>, dispatch: ReturnType<typeof useAppDispatch>) => {
  if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
    console.log('401 Unauthorized error detected, starting logout process...')
    
    // Clear Redux state first
    dispatch(logout())
    
    // Clear all user data including cookies
    clearAllUserData()
    
    // Wait for cleanup to complete, then redirect
    setTimeout(() => {
      console.log('Redirecting to login after cleanup...')
      router.push('/login')
      // Force a hard redirect if the router push doesn't work
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          console.log('Router push failed, forcing hard redirect...')
          window.location.href = '/login'
        }
      }, 500)
    }, 200)
    
    return "Session expired. Please login again."
  }
  return error instanceof Error ? error.message : "An error occurred"
}

export function useEmailGroups(page = 1, limit = 20, search?: string) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getUserEmailGroups(page, limit, search)
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [page, limit, search, refetchTrigger, router, dispatch])

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1)
  }, [])

  return { data, loading, error, refetch }
}


export function useSentEmails(page = 1, limit = 10) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getSentEmails(page, limit)
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [page, limit, router, dispatch])

  return { data, loading, error, refetch: () => setData(null) }
}
export function useDashboardStats() {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getDashboardStats()
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [refetchTrigger, router, dispatch])

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1)
  }, [])

  return { data, loading, error, refetch }
}

export function useGroupMembers(groupId: number, page = 1, limit = 50, search?: string) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!groupId) return

    const fetchMembers = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getGroupMembers(groupId, page, limit, search)
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [groupId, page, limit, search, router, dispatch])

  return { data, loading, error, refetch: () => setData(null) }
}

type BulkJobStatus = {
  status?: string
  [key: string]: unknown
} | null

export function useBulkJobStatus(jobId: string | null, type: "import" | "send") {
  const [data, setData] = useState<BulkJobStatus>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!jobId) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchStatus = async () => {
      try {
        if (!isMounted) return
        setLoading(true)
        const result =
          type === "import"
            ? await apiClient.getBulkImportStatus(jobId)
            : await apiClient.getBulkSendStatus(jobId)
        if (isMounted) {
          // Ensure result is an object or null, not any/unknown
          if (result && typeof result === "object") {
            setData(result as BulkJobStatus)
          } else {
            setData(null)
          }
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(handleApiError(err, router, dispatch))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStatus()

    const interval = setInterval(() => {
      if (
        isMounted &&
        data &&
        typeof data === "object" &&
        ("status" in data) &&
        (data.status === "processing" || data.status === "queued")
      ) {
        fetchStatus()
      }
    }, 2000)

    return () => {
      isMounted = false
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [jobId, type, router, dispatch]) // Removed 'data' from dependencies to prevent infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return { data, loading, error }
}

export function useEmailTemplates(page = 1, limit = 20, category?: string) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getEmailTemplates(page, limit, category)
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [page, limit, category, router, dispatch])

  return { data, loading, error, refetch: () => setData(null) }
}

export function useUserSettings() {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getUserSettings()
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [router, dispatch])

  return { data, loading, error, refetch: () => setData(null) }
}

export function useBillingInfo() {
  const [data, setData] = useState<unknown>(null)
  const [currentPlan, setCurrentPlan] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get billing info and current plan in parallel
      const [billingResult, planResult] = await Promise.all([
        apiClient.getBillingInfo(),
        apiClient.getCurrentPlan(),
      ])

      setData(billingResult)
      setCurrentPlan(planResult)
    } catch (err) {
      console.error("Billing fetch error:", err)
      setError(handleApiError(err, router, dispatch))
    } finally {
      setLoading(false)
    }
  }, [router, dispatch])

  const refetch = useCallback(() => {
    fetchBilling()
  }, [fetchBilling])

  useEffect(() => {
    fetchBilling()
  }, [fetchBilling])

  return { data, currentPlan, loading, error, refetch }
}

export function useEmailAnalytics(emailId: number | null) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!emailId) return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const result = await apiClient.getEmailAnalytics(emailId)
        setData(result)
        setError(null)
      } catch (err) {
        setError(handleApiError(err, router, dispatch))
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [emailId, router, dispatch])

  return { data, loading, error, refetch: () => setData(null) }
}
