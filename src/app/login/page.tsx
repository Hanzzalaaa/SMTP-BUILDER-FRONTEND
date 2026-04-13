"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { OTPInput } from "@/components/auth/otp-input"
import { NameForm } from "@/components/auth/name-form"
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { setLoading, setError, loginSuccess, updateUserProfile } from "@/lib/store/slice/authSlice"
import { apiClient } from "@/lib/api"

type LoginStep = "email" | "otp" | "name" | "success" | "password"

interface AuthResponse {
  access_token?: string
  user?: {
    id: string
    email: string
    name: string | null
    plan?: string
    quota?: number
    quotaUsed?: number
  }
  message?: string
}

// Helper to get error message from unknown error
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unknown error occurred."
}

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOTP] = useState("")
  const [countdown, setCountdown] = useState(0)

  // Use refs to store timer id and avoid stale closure
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const dispatch = useAppDispatch()
  const { loading, error, user } = useAppSelector((state) => state.auth)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Check for hardcoded admin credentials FIRST
    if (email === "hassank1751@gmail.com") {
      setStep("password")
      return
    }
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/request-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error("Failed to send OTP")
      }

      setStep("otp")
      startCountdown()
    } catch (err) {
      dispatch(setError(getErrorMessage(err) || "Failed to send OTP. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      // Check hardcoded admin credentials
      if (email === "hassank1751@gmail.com" && password === "oyehoye213") {
        // Create admin user data
        const adminUserData = {
          id: "admin-user",
          email: "hassank1751@gmail.com",
          name: "Admin User",
          plan: 'Admin',
          quota: 999999,
          quotaUsed: 0,
        }

        // Store admin session
        if (typeof window !== "undefined") {
          localStorage.setItem('auth_token', 'admin-token')
          localStorage.setItem('user_data', JSON.stringify(adminUserData))
        }

        dispatch(loginSuccess({
          token: 'admin-token',
          user: adminUserData
        }))

        // Redirect to server-control page
        window.location.href = "/server-control"
        return
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err) {
      dispatch(setError(getErrorMessage(err) || "Invalid credentials. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleOTPComplete = async (otpValue: string) => {
    setOTP(otpValue)
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpValue }),
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Invalid OTP")
      }

      const data: AuthResponse = await res.json()

      if (data.access_token && data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          plan: data.user.plan || 'Basic',
          quota: data.user.quota,
          quotaUsed: data.user.quotaUsed,
        }

        // Store token and user data separately and consistently
        if (typeof window !== "undefined") {
          localStorage.setItem('auth_token', data.access_token)
          localStorage.setItem('user_data', JSON.stringify(userData))
        }

        dispatch(loginSuccess({
          token: data.access_token,
          user: userData
        }))

        if (!data.user.name || data.user.name.trim() === '') {
          setStep("name")
        } else {
          setStep("success")
        }
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      dispatch(setError(getErrorMessage(err) || "Invalid OTP. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleNameComplete = async (name: string, email: string) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
  
    try {
      // Get token from localStorage
      let token: string | null = null
      if (typeof window !== "undefined") {
        token = localStorage.getItem('auth_token')
      }
      if (!token) throw new Error("No authentication token found")
  
      const data = {
        name,
        email
      }
  
      // apiClient.enterUserName returns parsed JSON data, not Response object
      const res = await apiClient.enterUserName(data)
      
      // Since your userRequest method already handles error checking and throws on !response.ok,
      // if we reach here, the request was successful
      console.log("Name update successful:", res) // Optional: for debugging
  
      // Update Redux store
      dispatch(updateUserProfile({ name: name.trim() }))
  
      // Update localStorage user_data
      if (typeof window !== "undefined") {
        const currentUserData = localStorage.getItem('user_data')
        if (currentUserData) {
          const userData = JSON.parse(currentUserData)
          userData.name = name.trim()
          localStorage.setItem('user_data', JSON.stringify(userData))
        }
      }
  
      setStep("success") // This should now work!
    } catch (err) {
      console.error("Name update error:", err) // Add this for debugging
      dispatch(setError(getErrorMessage(err) || "Failed to update profile. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error("Failed to resend OTP")
      }

      startCountdown()
    } catch (err) {
      dispatch(setError(getErrorMessage(err) || "Failed to resend OTP. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const startCountdown = () => {
    setCountdown(60)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6 lg:space-y-8">
      <div className="space-y-2 lg:space-y-3">
        <Label htmlFor="email" className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 lg:h-14 text-base lg:text-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm lg:text-base text-center bg-red-50 dark:bg-red-900/20 p-3 lg:p-4 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!email || loading}
        className="w-full cursor-pointer h-12 lg:h-14 text-base lg:text-lg bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
            Sending OTP...
          </>
        ) : (
          <>
            Continue with Email
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="text-center space-y-4">
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6 lg:space-y-8">
      <div className="space-y-2 lg:space-y-3">
        <Label htmlFor="password" className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 lg:h-14 text-base lg:text-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm lg:text-base text-center bg-red-50 dark:bg-red-900/20 p-3 lg:p-4 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!password || loading}
        className="w-full cursor-pointer h-12 lg:h-14 text-base lg:text-lg bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => {
            setStep("email")
            dispatch(setError(null))
            setPassword("")
          }}
          className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
          Back to email
        </Button>
      </div>
    </form>
  )

  const renderOTPStep = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center space-y-3 lg:space-y-4">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
          <Mail className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="font-medium text-base lg:text-lg text-gray-900 dark:text-white break-all">
          {email}
        </p>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOTP}
              onComplete={(val: string) => {
                if (val.length === 6) handleOTPComplete(val)
              }}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm lg:text-base text-center bg-red-50 dark:bg-red-900/20 p-3 lg:p-4 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Button
          onClick={() => handleOTPComplete(otp)}
          disabled={otp.length !== 6 || loading}
          className="w-full h-12 lg:h-14 cursor-pointer text-base lg:text-lg bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </div>

      <div className="text-center space-y-4 lg:space-y-6">
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendOTP}
            disabled={countdown > 0 || loading}
            className="text-orange-500 cursor-pointer hover:text-orange-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </p>

        <Button
          variant="ghost"
          onClick={() => {
            setStep("email")
            dispatch(setError(null))
            setOTP("")
          }}
          className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
          Back to email
        </Button>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6 lg:space-y-8">
      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-green-500" />
      </div>

      <div className="space-y-3 lg:space-y-4">
        <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 dark:text-white">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h3>
        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          You have successfully logged in to your SMTPMAILER account.
        </p>
        {user?.plan && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            {user.plan} Plan
          </div>
        )}
      </div>

      <div className="space-y-3 lg:space-y-4">
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full h-12 lg:h-14 text-base cursor-pointer lg:text-lg bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="w-full h-12 lg:h-14 text-base cursor-pointer lg:text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )

  const getTitle = () => {
    switch (step) {
      case "email":
        return "Sign In to Your Account"
      case "password":
        return "Enter Your Password"
      case "otp":
        return "Verify Your Email"
      case "name":
        return "Complete Your Profile"
      case "success":
        return "Login Successful!"
      default:
        return "Sign In"
    }
  }

  const getSubtitle = () => {
    switch (step) {
      case "email":
        return "Access your SMTPMAILER account"
      case "password":
        return "Enter your password to continue"
      case "otp":
        return "Enter the verification code we sent to your email"
      case "name":
        return "Tell us your name to personalize your experience"
      case "success":
        return "You're all set to continue"
      default:
        return ""
    }
  }

  return (
    <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
      {step === "email" && renderEmailStep()}
      {step === "password" && renderPasswordStep()}
      {step === "otp" && renderOTPStep()}
      {step === "name" && <NameForm email={email} onComplete={handleNameComplete} />}
      {step === "success" && renderSuccessStep()}
    </AuthLayout>
  )
}
