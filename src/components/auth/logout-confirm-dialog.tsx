"use client"

import type React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LogOut, User } from "lucide-react"

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  userName?: string
}

export function LogoutConfirmDialog({ open, onOpenChange, onConfirm, userName = "User" }: LogoutConfirmDialogProps) {
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onConfirm()
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-left">
              <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Sign Out
              </AlertDialogTitle>
            </div>
          </div>

          <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Are you sure you want to sign out of your SMTPMAILER account?
          </AlertDialogDescription>

          {userName && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current user</p>
              </div>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2 mt-6">
          <AlertDialogCancel
            onClick={handleCancel}
            className="w-full sm:w-auto bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
