"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogoutConfirmDialog } from "./logout-confirm-dialog"
import { LogOut } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { logoutUser } from "@/lib/thunks/authThunks"
import { clearAllUserData } from "@/lib/auth/logout"

interface LogoutMenuItemProps {
  className?: string
  onLogout?: () => void
}

export function LogoutMenuItem({ className = "", onLogout }: LogoutMenuItemProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, loading } = useAppSelector((state) => state.auth)

  const handleMenuItemClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowLogoutDialog(true)
  }

  const handleLogout = async () => {
    try {
      // Dispatch the logout thunk
      await dispatch(logoutUser()).unwrap()
      
      // Clear all user data including cookies immediately after logout
      clearAllUserData()
      
      // Call optional callback
      onLogout?.()

      // Close dialog first
      setShowLogoutDialog(false)

      // Then redirect to home page
      setTimeout(() => {
        router.push("/")
      }, 100)
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear data and redirect even if there was an error
      clearAllUserData()
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
      <DropdownMenuItem
        className={`cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10 ${className}`}
        onClick={handleMenuItemClick}
        onSelect={(e) => e.preventDefault()}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </DropdownMenuItem>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={handleDialogClose}
        onConfirm={handleLogout}
        userName={getUserDisplayName()}
      />
    </>
  )
}
