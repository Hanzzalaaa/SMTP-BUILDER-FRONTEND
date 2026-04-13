"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SettingsIcon, User, Save, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { useUserSettings } from "@/hooks/user-apis"
import { useAppDispatch } from "@/lib/store/hook"
import { updateUserProfile } from "@/lib/store/slice/authSlice"

export function Settings() {
  const { data, error, loading, refetch } = useUserSettings()
  const [isSaving, setIsSaving] = useState(false)

  interface SettingsState {
    name: string
    email: string
  }

  const [settings, setSettings] = useState<SettingsState>({
    name: "",
    email: "",
  })

  const dispatch = useAppDispatch()

  // Fix: useEffect instead of useState for side effect
  // Also, update settings when data changes, not when settings changes
  useEffect(() => {
    if (data && typeof data === "object") {
      setSettings({
        name: (data as { name?: string }).name || "",
        email: (data as { email?: string }).email || "",
      })
    }
  }, [data])

  const handleSaveSettings = async () => {
    // Basic validation
    if (!settings.name.trim()) {
      toast.error("Name is required")
      return
    }

    if (!settings.email.trim()) {
      toast.error("Email is required")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(settings.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSaving(true)
    try {
      await apiClient.updateUserSettings(settings)
      toast.success("Profile updated successfully!")

      dispatch(updateUserProfile({ email: settings.email, name: settings.name }))
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl p-8">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to Load Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button
              onClick={refetch}
              className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl px-8 py-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-2xl">
                <SettingsIcon className="w-8 h-8 text-white animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Update your name and email address</p>
            </div>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <User className="w-6 h-6 text-orange-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input
                type="text"
                placeholder="Enter your full name..."
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="h-14 bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl text-lg"
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="h-14 bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl text-lg"
                required
              />
            </div>
            <div className="pt-4">
              <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> Your email address is used for account notifications and password recovery.
                  Make sure it&apos;s an email you can access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
