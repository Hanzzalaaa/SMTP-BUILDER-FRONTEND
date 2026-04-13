"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ArrowRight, Loader2 } from 'lucide-react'

interface NameFormProps {
  email: string
  onComplete: (name: string, email: string) => void
}

export function NameForm({ email, onComplete }: NameFormProps) {
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError("Full name is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      onComplete(fullName.trim(), email)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update profile. Please try again.")
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            We need your name to complete your SMTPMAILER account setup
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name *
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              if (error) setError(null)
            }}
            className="h-12 sm:h-14 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base sm:text-lg px-4"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm sm:text-base text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={!fullName.trim() || isLoading}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium text-base sm:text-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              <span className="truncate">Saving...</span>
            </>
          ) : (
            <>
              <span className="truncate">Complete Setup</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </>
          )}
        </Button>

        <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
          <p>
            Signed in as:{" "}
            <span className="font-medium break-all">{email}</span>
          </p>
        </div>
      </form>
    </div>
  )
}
