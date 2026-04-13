"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogoutConfirmDialog } from "./logout-confirm-dialog"
import { LogOut, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { logoutUser } from "@/lib/thunks/authThunks"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline" | "destructive"
  size?: "default" | "sm" | "lg"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  className = "",
  showIcon = true,
  children,
}: LogoutButtonProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, loading } = useAppSelector((state) => state.auth)

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowLogoutDialog(true)
  }

  const handleLogout = async () => {
    try {
      // Dispatch the logout thunk
      await dispatch(logoutUser()).unwrap()
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/logout`, {
        credentials: "include",
      })
      // Close dialog first
      setShowLogoutDialog(false)

      // Then redirect to home page
      setTimeout(() => {
        router.push("/")
      }, 100)
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect even if there was an error
      setShowLogoutDialog(false)
      setTimeout(() => {
        router.push("/")
      }, 100)
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!loading) {
      setShowLogoutDialog(open)
    }
  }

  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name
    }
    return user?.email?.split("@")[0] || "User"
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleButtonClick}
        disabled={loading}
        className={`${variant === "destructive" ? "" : "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"} ${className}`}
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : showIcon && <LogOut className="w-4 h-4 mr-2" />}
        {children || "Sign Out"}
      </Button>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={handleDialogClose}
        onConfirm={handleLogout}
        userName={getUserDisplayName()}
      />
    </>
  )
}
