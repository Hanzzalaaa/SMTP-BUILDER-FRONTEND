"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    ChevronUp,
    Shield,
    Lock,
    Eye,
    Database,
    Globe,
    Users,
    Mail,
    CreditCard,
    Cookie,
    FileText,
    ArrowLeft,
    Sparkles
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

export default function PrivacyPolicyPage() {
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
            id: "information-collection",
            title: "Information We Collect",
            icon: Database,
            emoji: "📊",
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        We may collect the following types of information to provide you with the best possible service:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Account Information</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Name, email address, company details, billing information</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Usage Data</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">IP addresses, browser type, device information, activity logs</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl sm:rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Email Data</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Email lists, message content, recipient activity (opens, clicks, bounces)</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Payment Information</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Processed securely by third-party providers (we don&apos;t store card details)</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "information-usage",
            title: "How We Use Your Information",
            icon: Shield,
            emoji: "🛡️",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We use your information to provide and improve our services:
                    </p>
                    <div className="space-y-3">
                        {[
                            "Provide and improve our Services",
                            "Authenticate users and secure accounts",
                            "Process payments and manage subscriptions",
                            "Monitor deliverability, detect abuse, and prevent spam",
                            "Send important service updates and customer support communications"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                        <p className="text-red-700 dark:text-red-300 font-semibold">
                            ⚠️ Important: We do not sell your data to third parties.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "email-compliance",
            title: "Email Data & Compliance",
            icon: Mail,
            emoji: "📧",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-yellow-500" />
                            Your Responsibility
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                            You are solely responsible for ensuring that your email lists are collected and used in compliance with applicable laws (e.g., GDPR, CAN-SPAM, CASL).
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What We Do</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                We process email data only to provide the Services and generate analytics (open rates, bounce reports, etc.).
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What We Don&apos;t Do</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                We do not access or use your subscriber lists for any other purpose.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "cookies-tracking",
            title: "Cookies & Tracking",
            icon: Cookie,
            emoji: "🍪",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We use cookies and similar technologies to enhance your experience:
                    </p>
                    <div className="space-y-3">
                        {[
                            { title: "Improve website functionality", desc: "Essential cookies for core features" },
                            { title: "Analyze traffic and usage patterns", desc: "Help us understand how you use our service" },
                            { title: "Remember user preferences", desc: "Save your settings and preferences" }
                        ].map((item, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                            💡 You can disable cookies in your browser settings, but some features may not work properly.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "data-security",
            title: "Data Storage & Security",
            icon: Lock,
            emoji: "🔒",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50 text-center">
                            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Servers</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Data stored with encryption and access controls</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 text-center">
                            <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Industry Standards</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">We implement industry-standard security measures</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50 text-center">
                            <Eye className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Transparency</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">No system is 100% secure - we&apos;re honest about this</p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                        <p className="text-red-700 dark:text-red-300 text-sm">
                            ⚠️ However, no system is 100% secure, and we cannot guarantee absolute protection.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "data-sharing",
            title: "Data Sharing",
            icon: Users,
            emoji: "👥",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We may share your information only in these specific circumstances:
                    </p>
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                Service Providers
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                For hosting, analytics, payments, and customer support - only what&apos;s necessary to provide our services.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-500" />
                                Legal Authorities
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                If required by law, regulation, or to protect rights and safety.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <p className="text-green-700 dark:text-green-300 font-semibold">
                            ✅ We do not sell or rent personal data to marketers.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "data-retention",
            title: "Data Retention",
            icon: Database,
            emoji: "🗄️",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Data</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                We retain personal data only as long as necessary to provide the Services.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Email Logs & Analytics</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                May be retained for reporting and compliance purposes.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <p className="text-green-700 dark:text-green-300">
                            💡 You may request deletion of your data by contacting us (see Contact section below).
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "international-transfers",
            title: "International Transfers",
            icon: Globe,
            emoji: "🌍",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-gray-700 dark:text-gray-300">
                            If you use our Services from outside our primary jurisdiction, your data may be transferred to and processed in other countries where we operate or host servers.
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                            🌐 We ensure appropriate safeguards are in place for international data transfers.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "your-rights",
            title: "Your Rights",
            icon: Shield,
            emoji: "⚖️",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Depending on your location, you may have the right to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Access & Correct", desc: "Access or correct your personal data", icon: "👁️" },
                            { title: "Delete Data", desc: "Request deletion of your personal data", icon: "🗑️" },
                            { title: "Data Portability", desc: "Request a copy of your data", icon: "📦" },
                            { title: "Opt-Out", desc: "Opt-out of certain data processing", icon: "🚫" },
                            { title: "Withdraw Consent", desc: "Withdraw consent at any time", icon: "✋" },
                            { title: "Contact Us", desc: "Exercise rights via privacy@smtpmailer.com", icon: "📧" }
                        ].map((right, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <span>{right.icon}</span>
                                    {right.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{right.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "children-privacy",
            title: "Children's Privacy",
            icon: Users,
            emoji: "👶",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" />
                            Age Restriction
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                            Our Services are not directed to individuals under 18 years old. We do not knowingly collect data from children.
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                            📞 If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "policy-changes",
            title: "Changes to This Policy",
            icon: FileText,
            emoji: "📝",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <p className="text-gray-700 dark:text-gray-300">
                            We may update this Privacy Policy from time to time. The latest version will always be available on our website with the updated Effective Date.
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <p className="text-green-700 dark:text-green-300 text-sm">
                            🔔 We&apos;ll notify you of significant changes via email or through our platform.
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
                                        <Shield className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white animate-bounce" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in px-2">
                                    Privacy Policy
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
                                    Your privacy matters to us. Learn how we protect and handle your data with complete transparency.
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
                    {/* Back Button */}
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

                    {/* Privacy Policy Sections */}
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