"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Users, Eye, BarChart3, Target, Zap, ArrowUp, RefreshCw, Crown, Star, Rocket } from "lucide-react"
import { useDashboardStats } from "@/hooks/user-apis"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // or your toast library

interface UserData {
  id: string
  email: string
  name: string
  plan: string
  quota: number
  quotaUsed: number
}

interface DashboardStats {
  totalEmailsSent: number
  emailQuotaLeft: number
  uniqueRecipients: number
  inboxDeliveryRate: number
}


export function StatsOverviewApi() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [_selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { data: statsData, loading, error, refetch } = useDashboardStats()
  const router = useRouter()

  // Load user data from localStorage
  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem('user_data')
      if (userDataStr) {
        const parsedUserData = JSON.parse(userDataStr)
        setUserData(parsedUserData)
      }
    } catch (err) {
      console.error('Failed to load user data from localStorage:', err)
    }
  }, [])

  const handleNavigation = (href: string) => {
    try {
      router.push(href)
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to window.location if router fails
      window.location.href = href
    }
  }

  const handleUpgrade = async (planId: string) => {
    // Validate planId
    if (!planId || typeof planId !== 'string') {
      toast.error("Invalid plan selection")
      return
    }

    console.log(planId)

    setIsUpgrading(true)
    setSelectedPlan(planId)

    try {
      // const response = await apiClient.upgradeSubscription(planId) as UpgradeResponse

      router.push("/dashboard?section=billing")
      // Check if we got a Flutterwave payment link
      // if (response.success && response.data?.link) {
      //   toast.success("Redirecting to payment page...")

      //   // Store the plan upgrade intent in sessionStorage for when user returns
      //   sessionStorage.setItem('pendingUpgrade', JSON.stringify({
      //     planId,
      //     reference: response.data.reference,
      //     timestamp: Date.now()
      //   }))

      // For Next.js, use direct redirect to hosted checkout
      // This avoids script loading issues
      // window.location.href = response.data?.link
      // } else {
      // Handle case where no redirect is needed (maybe free plan or already active)
      // refetch()
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to upgrade subscription")
    } finally {
      setIsUpgrading(false)
      setSelectedPlan(null)
    }
  }

  const formatNumber = (num: number) => {
    if (num === -1) return "∞"
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num?.toString() || "0"
  }

  // Defensive: Ensure statsData is not null/undefined before accessing properties
  const safeStatsData: Partial<DashboardStats> = statsData ?? {}

  // Extract values from API response and user data
  const totalEmailsSent = safeStatsData.totalEmailsSent ?? 0
  const uniqueRecipients = safeStatsData.uniqueRecipients ?? 0
  const inboxDeliveryRate = safeStatsData.inboxDeliveryRate ?? 0
  const isPremium = userData?.plan === "Premium"
  const isUnlimited = userData?.quota === -1

  // For premium users with unlimited quota, override API quota data
  const emailQuotaLeft = isUnlimited ? "∞" : (safeStatsData.emailQuotaLeft ?? 0)

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to Load Dashboard</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
      {/* Animated Header with Premium Badge */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-4 sm:p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl sm:rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                {isPremium && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg animate-pulse">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-bold text-xs sm:text-sm">PREMIUM</span>
                  </div>
                )}
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
                Welcome back, {userData?.name || 'User'}! ✨
                {isPremium && " Enjoy unlimited email sending!"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {["7d", "30d", "90d"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-xl text-xs sm:text-sm ${selectedPeriod === period
                    ? "bg-gradient-to-r from-orange-400 to-yellow-500 text-white cursor-pointer"
                    : "border-orange-200 hover:border-orange-400 cursor-pointer"
                  }`}
              >
                {period}
              </Button>
            ))}
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              className="rounded-xl cursor-pointer border-orange-200 hover:border-orange-400 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Banner (only show for non-premium users) */}
      {!isPremium && (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl sm:rounded-3xl shadow-2xl animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse"></div>
          <div className="relative p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-white/20 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
                    <Rocket className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Upgrade to Premium</h2>
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                  </div>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg">
                    Send up to <span className="font-bold text-yellow-300">1 Million Emails Monthly</span> with unlimited campaigns and priority support!
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => handleUpgrade("145992")}
                  disabled={isUpgrading}
                  className="bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg shadow-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isUpgrading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="hidden sm:inline">Upgrading...</span>
                      <span className="sm:hidden">Processing...</span>
                    </div>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleNavigation("/dashboard?section=billing")}
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-semibold cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                >
                  View Pricing
                </Button>
              </div>
            </div>
            {/* Floating elements for visual appeal */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white/20">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
            </div>
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white/20">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: "Total Emails Sent",
            value: formatNumber(totalEmailsSent),
            change: "+0%",
            icon: Mail,
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            darkBgGradient: "from-blue-900/20 to-cyan-900/20",
          },
          {
            title: "Unique Recipients",
            value: formatNumber(uniqueRecipients),
            change: "+0%",
            icon: Users,
            gradient: "from-green-400 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            darkBgGradient: "from-green-900/20 to-emerald-900/20",
          },
          {
            title: "Inbox Delivery Rate",
            value: `${inboxDeliveryRate?.toFixed(2) || "0.00"}%`,
            change: "+0%",
            icon: Eye,
            gradient: "from-purple-400 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            darkBgGradient: "from-purple-900/20 to-pink-900/20",
          },
          {
            title: isUnlimited ? "Unlimited Quota" : "Quota Left",
            value: isUnlimited ? "∞" : formatNumber(Number(emailQuotaLeft)),
            change: isUnlimited ? "PREMIUM" : "-",
            icon: isUnlimited ? Crown : Target,
            gradient: isUnlimited ? "from-purple-400 to-pink-500" : "from-orange-400 to-red-500",
            bgGradient: isUnlimited ? "from-purple-50 to-pink-50" : "from-orange-50 to-red-50",
            darkBgGradient: isUnlimited ? "from-purple-900/20 to-pink-900/20" : "from-orange-900/20 to-red-900/20",
          },
        ].map((metric, index) => (
          <div
            key={metric.title}
            className="group hover:scale-105 transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card
              className={`bg-gradient-to-br ${metric.bgGradient} dark:${metric.darkBgGradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ${isUnlimited && metric.title.includes('Unlimited') ? 'ring-2 ring-purple-400/50 ring-offset-2' : ''
                }`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${metric.gradient} shadow-lg`}>
                    <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 ${metric.change === "PREMIUM"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-green-600 dark:text-green-400"
                    }`}>
                    {metric.change === "PREMIUM" ? (
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold">{metric.change}</span>
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm">{metric.title}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            title: "🚀 Send Campaign",
            description: isPremium
              ? "Send unlimited emails with Premium"
              : "Create and send a new email campaign",
            icon: Zap,
            gradient: isPremium ? "from-purple-400 to-pink-500" : "from-orange-400 to-yellow-500",
            action: "Create Campaign",
            href: "/dashboard?section=bulk-email",
          },
          {
            title: "👥 Manage Contacts",
            description: "Add, edit, or organize your email lists",
            icon: Users,
            gradient: "from-blue-400 to-cyan-500",
            action: "Manage Lists",
            href: "/dashboard?section=group-manager",
          },
          {
            title: "📊 View Reports",
            description: "Detailed analytics and performance reports",
            icon: BarChart3,
            gradient: "from-purple-400 to-pink-500",
            action: "View Analytics",
            href: "/dashboard?section=groups",
          }
        ].map((action, index) => (
          <Card
            key={action.title}
            className="group hover:scale-105 transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleNavigation(action.href)}
          >
            <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
              <div
                className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <action.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{action.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </div>
              <Button
                className={`w-full bg-gradient-to-r cursor-pointer ${action.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white rounded-xl sm:rounded-2xl py-2 sm:py-3 font-semibold text-sm sm:text-base`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation(action.href);
                }}
              >
                {action.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}