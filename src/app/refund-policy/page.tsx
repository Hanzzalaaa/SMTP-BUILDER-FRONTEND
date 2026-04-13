"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    ChevronUp,
    CreditCard,
    RefreshCw,
    X,
    Calendar,
    Gift,
    Settings,
    Mail,
    ArrowLeft,
    Sparkles,
    Shield,
    Clock,
    Ban,
    CheckCircle,
    AlertTriangle,
    DollarSign
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

interface PolicySection {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    content: React.ReactNode
    emoji: string
}

export default function RefundPolicyPage() {
    const [expandedSections, setExpandedSections] = useState<string[]>([])

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const expandAll = () => {
        setExpandedSections(policySections.map(section => section.id))
    }

    const collapseAll = () => {
        setExpandedSections([])
    }

    const policySections: PolicySection[] = [
        {
            id: "subscription-billing",
            title: "Subscription Billing",
            icon: CreditCard,
            emoji: "💳",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        Our Services are designed to provide consistent value through flexible billing options:
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Recurring Billing</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Services are billed on a recurring subscription basis (monthly or annual) for uninterrupted access.</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Secure Processing</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">All payments are processed securely by trusted third-party payment providers.</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl sm:rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Authorization</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">By subscribing, you authorize us to charge your payment method on a recurring basis until canceled.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "refunds",
            title: "Refunds",
            icon: DollarSign,
            emoji: "💰",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            General Policy
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            Since Smtpmailer provides digital services that are accessible immediately after purchase, <strong>all payments are generally non-refundable.</strong>
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">We do not issue refunds for:</h4>
                        {[
                            "Unused time on a subscription",
                            "Failure to use the Service",
                            "Account suspension or termination due to violation of our Terms of Use"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl">
                                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Exceptions
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">If you were mistakenly charged multiple times</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">If our Service was unavailable due to extended downtime (over 72 hours) directly caused by us</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Any approved refunds will be processed to your original payment method within 7–14 business days.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "cancellations",
            title: "Cancellations",
            icon: Ban,
            emoji: "❌",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        You have full control over your subscription and can cancel at any time:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-500" />
                                How to Cancel
                            </h4>
                            <div className="space-y-2 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300">From your account dashboard</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300">Contact support at billing@smtpmailer.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-500" />
                                What Happens
                            </h4>
                            <div className="space-y-2 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300">Stops the next billing cycle</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300">Account remains active until paid period ends</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            <strong>Important:</strong> No partial refunds for unused time after cancellation.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "free-trials",
            title: "Free Trials & Promotional Offers",
            icon: Gift,
            emoji: "🎁",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-purple-500" />
                                Trial Terms
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                Free trials or promotional discounts are valid only for the specified period when offered.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-orange-500" />
                                After Trial
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                Regular subscription charges apply unless canceled before the renewal date.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                            💡 <strong>Pro Tip:</strong> Set a reminder to cancel before your trial ends if you don&apos;t wish to continue with a paid subscription.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "service-changes",
            title: "Service Changes",
            icon: Settings,
            emoji: "⚙️",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-yellow-500" />
                            Our Rights
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            We reserve the right to modify or discontinue features, pricing, or plans as we continue to improve our services.
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-green-500" />
                            Your Protection
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            If we make significant changes to your plan, we will notify you in advance to ensure transparency.
                        </p>
                    </div>
                </div>
            )
        }
    ]

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <Navigation />
                
                {/* Animated Header */}
                <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-orange-200/50 dark:border-gray-700/50 pt-16 sm:pt-20 lg:pt-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
                    <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-75 animate-pulse"></div>
                                    <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl">
                                        <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white animate-bounce" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in px-2">
                                    Refund & Cancellation Policy
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
                                    Clear and transparent policies for subscriptions, billing, cancellations, and refunds.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                                    <span className="text-center">Effective Date: August 17, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8">
                    {/* Back Button and Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto rounded-xl sm:rounded-2xl border-orange-200 hover:border-orange-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                            >
                                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>

                        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                            <Button
                                onClick={expandAll}
                                variant="outline"
                                className="flex-1 xs:flex-none rounded-xl sm:rounded-2xl border-green-200 hover:border-green-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                            >
                                <span className="hidden sm:inline">Expand All</span>
                                <span className="sm:hidden">Expand</span>
                            </Button>
                            <Button
                                onClick={collapseAll}
                                variant="outline"
                                className="flex-1 xs:flex-none rounded-xl sm:rounded-2xl border-red-200 hover:border-red-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                            >
                                <span className="hidden sm:inline">Collapse All</span>
                                <span className="sm:hidden">Collapse</span>
                            </Button>
                        </div>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-4 sm:space-y-6">
                        {policySections.map((section, index) => {
                            const isExpanded = expandedSections.includes(section.id)
                            const Icon = section.icon

                            return (
                                <Card
                                    key={section.id}
                                    className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-yellow-50/30 dark:hover:from-orange-900/10 dark:hover:to-yellow-900/10 transition-all duration-300">
                                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors duration-300 truncate sm:whitespace-normal">
                                                        <span className="hidden sm:inline">{section.emoji} </span>{section.title}
                                                    </h2>
                                                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden sm:block">
                                                        Click to {isExpanded ? 'collapse' : 'expand'} this section
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                                            <div className="border-t border-orange-200/50 dark:border-gray-700/50 pt-4 sm:pt-6">
                                                {section.content}
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>


                    {/* Footer */}
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 px-4 leading-relaxed">
                            <span className="block sm:inline">© 2025 Redrock Technologies Ltd. All rights reserved.</span>
                            <span className="hidden sm:inline"> | </span>
                            <span className="block sm:inline">Last updated: August 17, 2025</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
