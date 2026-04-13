"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Toaster } from "sonner"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Billing } from "./_components/billing"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import { EmailComposer } from "./_components/email-composer"
import { GroupManager } from "./_components/group-manager"
import { SentEmailsApi } from "./_components/sent-email-api"
import { SingleEmailComposer } from "./_components/single-emal-composer"
import { StatsOverviewApi } from "./_components/stats-overview-api"
import { EmailGroupsAnalytics } from "./_components/email-group-api"
import { Settings } from "./_components/setting"
import { BulkEmailComposer } from "./_components/bulk-email-composer"
import Link from "next/link"

// Wrap the part using useSearchParams in a Suspense boundary to fix the Next.js error
function DashboardPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const isValidSection = (section: string) => {
    const validSections = [
      "dashboard",
      "send-email",
      "send-group-email",
      "bulk-email",
      "sent-emails",
      "groups",
      "group-manager",
      "templates",
      "billing",
      "settings",
    ]
    return validSections.includes(section)
  }

  useEffect(() => {
    setMounted(true)
    let section = searchParams.get("section")
    // Map "group" to "groups" for backward compatibility or old links
    if (section === "group") {
      section = "groups"
    }
    if (section && isValidSection(section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    const url = new URL(window.location.href)
    url.searchParams.set("section", section)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <StatsOverviewApi />
      case "send-email":
        return <SingleEmailComposer />
      case "send-group-email":
        return <EmailComposer />
      case "bulk-email":
        return <BulkEmailComposer />
      case "sent-emails":
        return <SentEmailsApi />
      case "groups":
        return <EmailGroupsAnalytics />
      case "group-manager":
        return <GroupManager />
      case "billing":
        return <Billing />
      case "settings":
        return <Settings />
      default:
        return <StatsOverviewApi />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Dashboard Overview"
      case "send-email":
        return "Send Email"
      case "send-group-email":
        return "Send Group Email"
      case "bulk-email":
        return "Bulk Email Campaign"
      case "sent-emails":
        return "Sent Emails"
      case "groups":
        return "Email Groups"
      case "group-manager":
        return "Group Manager"
      case "templates":
        return "Email Templates"
      case "billing":
        return "Billing & Subscription"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
        <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <DashboardSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
          <SidebarInset className="flex-1 min-w-0">
            <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 bg-white dark:bg-gray-800">
              <SidebarTrigger className="-ml-1 flex-shrink-0" />
              <Separator orientation="vertical" className="mr-2 h-4 flex-shrink-0" />
              <Breadcrumb className="flex-1 min-w-0">
                <BreadcrumbList className="flex items-center min-w-0">
                  <BreadcrumbItem className="hidden sm:block flex-shrink-0">
                    <Link
                      href="/"
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-500 cursor-pointer text-sm sm:text-base font-medium"
                    >
                      SMTPMAILER
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:block flex-shrink-0" />
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="text-gray-900 dark:text-white font-medium text-sm sm:text-base truncate">
                      {getSectionTitle()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-600 dark:text-gray-300 sm:hidden flex-shrink-0"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </header>
            <div className="flex-1 overflow-auto min-w-0">{renderContent()}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
            <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-orange-500"></div>
          </div>
        }
      >
        <DashboardPageContent />
      </Suspense>
    </ProtectedRoute>
  )
}
