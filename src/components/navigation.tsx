"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Mail, Menu, X, Sun, Moon, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { logoutUser } from "@/lib/thunks/authThunks"
import { clearAllUserData } from "@/lib/auth/logout"
import { LogoutMenuItem } from "./auth/logout-menu-item"
import { LogoutConfirmDialog } from "./auth/logout-confirm-dialog"
import { useTheme } from "next-themes"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [, startTransition] = useTransition()

  // Prevent hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      // Use the async logout thunk for proper state management
      await dispatch(logoutUser()).unwrap()

      // Clear all user data including cookies immediately after logout
      clearAllUserData()

      // Close dialog and mobile menu first
      setShowLogoutDialog(false)
      setMobileMenuOpen(false)

      // Small delay to ensure state updates have processed
      setTimeout(() => {
        startTransition(() => {
          router.push('/')
          router.refresh()
        })
      }, 50)
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear data and close dialogs even if there was an error
      clearAllUserData()
      setShowLogoutDialog(false)
      setMobileMenuOpen(false)

      setTimeout(() => {
        startTransition(() => {
          router.push('/')
          router.refresh()
        })
      }, 50)
    }
  }

  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name
    }
    return user?.email?.split('@')[0] || 'User'
  }

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  // Helper to handle navigation and force rerender
  const handleNav = (href: string) => {
    startTransition(() => {
      router.push(href)
      router.refresh()
    })
    setMobileMenuOpen(false)
  }



  // Helper to handle section scrolling on homepage
  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If we're not on the homepage, navigate there with hash
      if (sectionId === 'pricing') {
        return handleNav(`/#${sectionId}`)
      } else {
        return handleNav(`/${sectionId}`)
      }
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <button onClick={() => handleNav('/')} className="flex items-center space-x-2 animate-fade-in bg-transparent border-0 p-0 cursor-pointer min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">SMTPMAILER</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <button onClick={handleSectionClick('pricing')} className="text-sm xl:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors bg-transparent border-0 cursor-pointer whitespace-nowrap">
                Pricing
              </button>
              <button onClick={() => handleNav('/about')} className="text-sm xl:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors bg-transparent border-0 cursor-pointer whitespace-nowrap">
                About
              </button>
              <button onClick={() => handleNav('/contact')} className="text-sm xl:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors bg-transparent border-0 cursor-pointer whitespace-nowrap">
                Contact
              </button>

              {/* Policies Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm xl:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors bg-transparent border-0 cursor-pointer whitespace-nowrap px-2 py-1 h-auto">
                    Policies
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => handleNav('/refund-policy')}
                      className="flex items-center w-full text-left cursor-pointer bg-transparent border-0 p-0 m-0 px-2 py-1.5 text-sm"
                      type="button"
                    >
                      Refund Policy
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => handleNav('/terms')}
                      className="flex items-center w-full text-left cursor-pointer bg-transparent border-0 p-0 m-0 px-2 py-1.5 text-sm"
                      type="button"
                    >
                      Terms of Use
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => handleNav('/privacy-policy')}
                      className="flex items-center w-full text-left cursor-pointer bg-transparent border-0 p-0 m-0 px-2 py-1.5 text-sm"
                      type="button"
                    >
                      Privacy Policy
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newTheme = theme === "dark" ? "light" : "dark"
                    console.log('Desktop: Switching theme from', theme, 'to', newTheme)
                    setTheme(newTheme)
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0"
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              )}

              {/* Authentication Buttons */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                        {getUserInitials()}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium text-sm truncate hidden sm:block">
                        {getUserDisplayName()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                      {user?.plan && (
                        <span className="inline-block text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded mt-1">
                          {user.plan} Plan
                        </span>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      {/* Use button to force rerender on navigation */}
                      <button
                        onClick={() => handleNav("/dashboard")}
                        className="flex items-center w-full text-left cursor-pointer bg-transparent border-0 p-0 m-0"
                        type="button"
                      >
                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                        Dashboard
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <LogoutMenuItem onLogout={() => setMobileMenuOpen(false)} />
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" className="border-gray-300 cursor-pointer dark:border-gray-600 bg-transparent text-sm px-3 sm:px-4 py-2 flex-shrink-0" onClick={() => handleNav('/login')}>
                    Sign In
                  </Button>
                  <Button className="bg-gradient-to-r cursor-pointer from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white text-sm px-3 sm:px-4 py-2 flex-shrink-0" onClick={() => handleNav('/signup')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-600 dark:text-gray-300 p-2 flex-shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down bg-white dark:bg-gray-900">
              <div className="flex flex-col space-y-3 sm:space-y-4 px-3 sm:px-4">
                <button onClick={handleSectionClick('pricing')} className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 py-2 text-left bg-transparent border-0 cursor-pointer">
                  Pricing
                </button>
                <button onClick={() => handleNav('/about')} className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 py-2 text-left bg-transparent border-0 cursor-pointer">
                  About
                </button>
                <button onClick={() => handleNav('/contact')} className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 py-2 text-left bg-transparent border-0 cursor-pointer">
                  Contact
                </button>

                {/* Mobile Policies Section */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-1">
                    Policies
                  </div>
                  <button onClick={() => handleNav('/refund-policy')} className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 py-2 text-left bg-transparent border-0 cursor-pointer pl-6">
                    Refund Policy
                  </button>
                  <button onClick={() => handleNav('/terms')} className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 py-2 text-left bg-transparent border-0 cursor-pointer pl-6">
                    Terms of Use
                  </button>
                  <button onClick={() => handleNav('/privacy-policy')} className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 py-2 text-left bg-transparent border-0 cursor-pointer pl-6">
                    Privacy Policy
                  </button>
                </div>

                {/* Mobile Theme Toggle */}
                {mounted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newTheme = theme === "dark" ? "light" : "dark"
                      console.log('Mobile: Switching theme from', theme, 'to', newTheme)
                      setTheme(newTheme)
                    }}
                    className="text-gray-600 dark:text-gray-300 justify-start px-0 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4 mr-2 flex-shrink-0" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 mr-2 flex-shrink-0" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                )}

                {/* Mobile Authentication */}
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        {getUserInitials()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                        {user?.plan && (
                          <span className="inline-block text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded mt-1">
                            {user.plan} Plan
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Use button to force rerender on navigation */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent text-sm"
                      onClick={() => handleNav("/dashboard")}
                    >
                      <User className="w-4 h-4 mr-2 flex-shrink-0" />
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLogoutDialog(true)}
                      className="w-full justify-start bg-transparent text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                    >
                      <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent cursor-pointer text-sm" onClick={() => handleNav('/login')}>
                      Sign In
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r cursor-pointer from-orange-400 to-yellow-500 text-white w-full text-sm" onClick={() => handleNav('/signup')}>
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        userName={getUserDisplayName()}
      />
    </>
  )
}
