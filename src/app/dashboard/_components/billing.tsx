"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Crown, Zap, Check, RefreshCw, Download, Infinity } from "lucide-react"
import { useBillingInfo } from "@/hooks/user-apis"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

// Plan interface matching your API response
interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  planCode: string
  emailLimit: number
  features: string[]
}

// Interface for billing data
interface BillingData {
  availablePlans?: Plan[]
  quotaUsed?: number
  [key: string]: unknown
}

// Interface for current plan
interface CurrentPlan {
  id: string
  quota: number
  email: string
  plan: string
  subscriptionStart: string | null
  subscriptionEnd: string | null
  premiumActivatedAt: string | null
  isActive: boolean
  daysLeft: number
  status: string
  [key: string]: unknown
}

// Interface for the upgrade response
interface UpgradeResponse {
  success: boolean
  message: string
  data: {
    link: string
    authorization_url: string
    access_code: string
    reference: string
  }
}

export function Billing() {
  const { data: rawBillingData, currentPlan: rawCurrentPlan, loading, error, refetch } = useBillingInfo()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Type guards and data parsing
  const billingData: BillingData | Plan[] = Array.isArray(rawBillingData) 
    ? rawBillingData as Plan[]
    : (rawBillingData as BillingData) || {}
  
  const currentPlan: CurrentPlan | null = rawCurrentPlan && typeof rawCurrentPlan === 'object' 
    ? rawCurrentPlan as CurrentPlan 
    : null

  // Check if user is on premium plan
  const isPremiumUser = currentPlan?.plan === "Premium" || currentPlan?.status === "premium"

  const handleUpgrade = async (planCode: string) => {
    // Validate planCode
    if (!planCode || typeof planCode !== 'string') {
      toast.error("Invalid plan selection")
      return
    }

    console.log(planCode)

    setIsUpgrading(true)
    setSelectedPlan(planCode)

    try {
      const response = await apiClient.upgradeSubscription(planCode) as UpgradeResponse

      // Check if we got a Paystack payment link
      if (response.success && response.data?.authorization_url) {
        toast.success("Redirecting to payment page...")

        // Store the plan upgrade intent in sessionStorage for when user returns
        sessionStorage.setItem('pendingUpgrade', JSON.stringify({
          planCode,
          reference: response.data.reference,
          timestamp: Date.now()
        }))
        // Redirect to Paystack checkout
        window.location.href = response.data.authorization_url
      } else {
        // Handle case where no redirect is needed (maybe free plan or already active)
        toast.success("Subscription updated successfully!")
        refetch()
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to upgrade subscription")
    } finally {
      setIsUpgrading(false)
      setSelectedPlan(null)
    }
  }


  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return "Free"
    
    // For NGN amounts (price is in kobo, so divide by 100)
    if (currency === "NGN") {
      return `200$`
    }
    
    // For USD amounts
    if (currency === "USD") {
      const amount = price
      return `$${amount}`
    }
    
    // For other currencies, use original format
    const amount = price / 100
    return `${currency} ${amount.toLocaleString()}`
  }

  const formatEmailLimit = (limit: number) => {
    if (limit === -1) return "Unlimited"
    return limit.toLocaleString()
  }

  // Fixed function to get current plan details
  const getCurrentPlanDetails = () => {
    // Check if billingData is an array (your available plans)
    const availablePlans = Array.isArray(billingData) ? billingData : billingData.availablePlans || []
    
    
    if (!currentPlan) {
      // Return Basic plan as default
      return availablePlans.find((plan: Plan) => plan.name === "Basic") || {
        id: "Basic",
        name: "Basic",
        price: 0,
        currency: "USD",
        interval: "monthly",
        planCode: "",
        emailLimit: 100,
        features: ["Send up to 100 emails per month", "Basic email groups", "Standard support", "Basic templates"],
      }
    }

    // If this is the Premium plan, show ₦5
    if (currentPlan.plan === "Premium") {
      const planDetails = availablePlans.find((plan: Plan) => 
        plan.name === currentPlan.plan || plan.id === currentPlan.plan
      )
      
      if (planDetails) {
        return {
          ...planDetails,
          price: 5,
          currency: "NGN"
        }
      }
    }

    // For Basic plan, ensure emailLimit is 100
    const foundPlan = availablePlans.find((plan: Plan) => 
      plan.name === currentPlan.plan || plan.id === currentPlan.plan
    )
    
    if (foundPlan && foundPlan.name === "Basic") {
      return {
        ...foundPlan,
        emailLimit: 100
      }
    }

    return foundPlan || {
      id: "Basic",
      name: "Basic", 
      price: 0,
      currency: "USD",
      interval: "monthly",
      planCode: "",
      emailLimit: 100,
      features: ["Send up to 100 emails per month", "Basic email groups", "Standard support", "Basic templates"],
    }
  }

  // Calculate quota used for display
  const getQuotaUsed = () => {
    const quotaUsed = Array.isArray(currentPlan) ? 0 : currentPlan?.quota || 0
    return 100 - quotaUsed
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to Load Billing Info</h2>
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

  const currentPlanDetails = getCurrentPlanDetails()
  const availablePlans = Array.isArray(billingData) ? billingData.map((plan: Plan) => {
    // Override Premium plan price to show ₦5
    if (plan.name === "Premium") {
      return { ...plan, price: 5, currency: "NGN" }
    }
    return plan
  }) : billingData.availablePlans?.map((plan: Plan) => {
    // Override Premium plan price to show ₦5
    if (plan.name === "Premium") {
      return { ...plan, price: 5, currency: "NGN" }
    }
    return plan
  }) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-4 sm:p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl sm:rounded-2xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce" />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Billing & Subscription
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">Manage your subscription and billing details 💳</p>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            👑 Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{currentPlanDetails.name} Plan</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`border-0 px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm ${
                    currentPlan?.status === "free" 
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                      : currentPlan?.isActive
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                  }`}>
                    ✅ {currentPlan?.status === "free" ? "Free" : currentPlan?.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {isPremiumUser && (
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                      ⭐ Premium
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                Billing: {currentPlanDetails.interval}
                {currentPlan?.subscriptionEnd && (
                  <> • Next billing: {new Date(currentPlan.subscriptionEnd).toLocaleDateString()}</>
                )}
                {currentPlan?.daysLeft && currentPlan.daysLeft > 0 && (
                  <> • {currentPlan.daysLeft} days left</>
                )}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                {formatPrice(currentPlanDetails.price, currentPlanDetails.currency)}
                {currentPlanDetails.price > 0 && (
                  <span className="text-sm sm:text-lg font-normal text-gray-600 dark:text-gray-400">
                    /{currentPlanDetails.interval === "monthly" ? "mo" : "yr"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">📧 Email Usage</span>
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {getQuotaUsed()} / {formatEmailLimit(currentPlanDetails.emailLimit)}
              </span>
            </div>

            {currentPlanDetails.emailLimit !== -1 && (
              <>
                <Progress value={getQuotaUsed()} className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700" />
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {currentPlanDetails.emailLimit - getQuotaUsed() > 0 
                    ? `${currentPlanDetails.emailLimit - getQuotaUsed()} emails remaining this month`
                    : "No emails remaining this month"
                  }
                </div>
              </>
            )}

            {currentPlanDetails.emailLimit === -1 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Infinity className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">Unlimited emails</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-2 border-orange-200 hover:border-orange-400 text-gray-700 dark:text-gray-300 rounded-xl sm:rounded-2xl py-2 sm:py-3 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 bg-transparent text-sm sm:text-base"
            >
              <Download className="w-4 h-4 mr-2" />
              📄 Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      {availablePlans.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">🚀 Choose Your Plan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {availablePlans.map((plan: Plan, index: number) => {
              const isCurrentPlan = currentPlanDetails.id === plan.id || currentPlan?.plan === plan.name
              const isPremium = plan.name === "Premium"

              return (
                <Card
                  key={plan.id}
                  className={`group hover:scale-105 transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl overflow-hidden ${
                    isPremium ? "ring-4 ring-orange-400 ring-opacity-50" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isPremium && (
                    <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-center py-2 font-semibold text-sm sm:text-base">
                      🌟 Most Popular
                    </div>
                  )}
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <div className="space-y-2">
                        <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(plan.price, plan.currency)}
                          {plan.price > 0 && (
                            <span className="text-base sm:text-lg font-normal text-gray-600 dark:text-gray-400">
                              /{plan.interval === "monthly" ? "mo" : "yr"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                          {formatEmailLimit(plan.emailLimit)} emails/{plan.interval === "monthly" ? "month" : "year"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      {plan.features.map((feature: string, featureIndex: number) => (
                        <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleUpgrade(plan.planCode)}
                      disabled={isUpgrading || isCurrentPlan || !plan.planCode}
                      className={`w-full py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                        isCurrentPlan
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : isPremium
                          ? "bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                          : "bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      }`}
                    >
                      {isUpgrading && selectedPlan === plan.planCode ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        "✅ Current Plan"
                      ) : (
                        <>
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          {plan.price === 0 ? "Get Started" : "Upgrade Now"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* WhatsApp Cryptocurrency Payments */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs sm:text-sm font-bold">W</span>
            </div>
            💰 Pay with Cryptocurrency
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Contact us on WhatsApp to pay for your premium plan using cryptocurrency
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button
              onClick={() => {
                const message = encodeURIComponent("Hi, I want to pay for SmtpMailer using BTC")
                window.open(`https://wa.me/message/W4KK22YWFYV4I1?text=${message}`, '_blank')
              }}
              className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="hidden sm:inline">🟠 Pay for Premium Plan with BTC</span>
              <span className="sm:hidden">🟠 Pay with BTC</span>
            </Button>
            
            <Button
              onClick={() => {
                const message = encodeURIComponent("Hi, I want to pay for SmtpMailer using USDT")
                window.open(`https://wa.me/message/W4KK22YWFYV4I1?text=${message}`, '_blank')
              }}
              className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="hidden sm:inline">💙 Pay for Premium Plan with USDT</span>
              <span className="sm:hidden">💙 Pay with USDT</span>
            </Button>
            
            <Button
              onClick={() => {
                const message = encodeURIComponent("Hi, I want to pay for SmtpMailer using ETH")
                window.open(`https://wa.me/message/W4KK22YWFYV4I1?text=${message}`, '_blank')
              }}
              className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 sm:col-span-2 lg:col-span-1"
            >
              <span className="hidden sm:inline">🟣 Pay for Premium Plan with ETH</span>
              <span className="sm:hidden">🟣 Pay with ETH</span>
            </Button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
              💡 Click any button above to open WhatsApp with a pre-filled message
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}