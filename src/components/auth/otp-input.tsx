"use client"

import type React from "react"

import { useRef } from "react"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
  length: number
  onComplete: (otp: string) => void
  value: string
  onChange: (value: string) => void
}

export function OTPInput({ length, onComplete, value, onChange }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return

    const newValue = value.split("")
    newValue[index] = digit
    const newOTP = newValue.join("")

    onChange(newOTP)

    // Move to next input if digit is entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete
    if (newOTP.length === length && !newOTP.includes("")) {
      onComplete(newOTP)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    onChange(pastedData)

    if (pastedData.length === length) {
      onComplete(pastedData)
    }
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {(inputRefs.current[index] = el)}}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900/20"
        />
      ))}
    </div>
  )
}
