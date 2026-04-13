"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    ChevronUp,
    FileText,
    CheckCircle,
    Users,
    Mail,
    Shield,
    CreditCard,
    Server,
    Copyright,
    Ban,
    AlertTriangle,
    HandHeart,
    Scale,
    Edit,
    ArrowLeft,
    Sparkles,
    UserCheck,
    Lock,
    X,
    Clock
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

interface TermsSection {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    content: React.ReactNode
    emoji: string
}

export default function TermsPage() {
    const [expandedSections, setExpandedSections] = useState<string[]>([])

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const expandAll = () => {
        setExpandedSections(termsSections.map(section => section.id))
    }

    const collapseAll = () => {
        setExpandedSections([])
    }

    const termsSections: TermsSection[] = [
        {
            id: "acceptance",
            title: "Acceptance of Terms",
            icon: CheckCircle,
            emoji: "✅",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        By creating an account, using, or accessing Smtpmailer, you agree to comply with these Terms and our Privacy Policy.
                    </p>
                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-red-200/50 dark:border-red-800/50">
                        <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            <strong>Important:</strong> If you do not agree with these terms, please do not use our Services.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "eligibility",
            title: "Eligibility",
            icon: UserCheck,
            emoji: "👤",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Age Requirement</h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            You must be at least <strong>18 years old</strong> and legally able to enter into binding agreements to use Smtpmailer.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "use-of-services",
            title: "Use of Services",
            icon: Mail,
            emoji: "📧",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
                            You may use Smtpmailer solely for <strong>lawful purposes</strong> and are responsible for the content of emails you send.
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">🚫 You agree NOT to send:</h4>
                        {[
                            { text: "Spam, phishing, or fraudulent content", icon: "🎣" },
                            { text: "Unsolicited bulk emails that violate CAN-SPAM, GDPR, or other applicable laws", icon: "⚖️" },
                            { text: "Offensive, abusive, or illegal material", icon: "🚫" }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl">
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">
                            ⚠️ <strong>Violation may result in suspension or termination of your account without refund.</strong>
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "accounts-security",
            title: "Accounts & Security",
            icon: Lock,
            emoji: "🔒",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-500" />
                                Your Responsibility
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                You are responsible for maintaining the confidentiality of your login credentials.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl sm:rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Notify Us
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                You agree to notify us immediately of any unauthorized access.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-red-200/50 dark:border-red-800/50">
                        <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">
                            <Shield className="w-4 h-4 inline mr-2" />
                            Smtpmailer is not liable for losses caused by your failure to secure your account.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "payment-billing",
            title: "Payment & Billing",
            icon: CreditCard,
            emoji: "💳",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                Billing Cycle
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Monthly or annual subscription basis
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-red-200/50 dark:border-red-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <X className="w-5 h-5 text-red-500" />
                                No Refunds
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                All fees are non-refundable unless required by law
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Ban className="w-5 h-5 text-yellow-500" />
                                Late Payments
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                May result in suspension or termination
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "service-availability",
            title: "Service Availability",
            icon: Server,
            emoji: "🖥️",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Server className="w-5 h-5 text-green-500" />
                                Our Goal
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                We strive for <strong>99.9% uptime</strong> to ensure reliable service delivery.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl sm:rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Edit className="w-5 h-5 text-orange-500" />
                                Platform Updates
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                We may update, modify, or discontinue features at any time.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            <strong>Note:</strong> We do not guarantee uninterrupted service due to factors beyond our control.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "intellectual-property",
            title: "Intellectual Property",
            icon: Copyright,
            emoji: "©️",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Copyright className="w-5 h-5 text-purple-500" />
                                Our Property
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                All trademarks, content, software, and branding belong to Smtpmailer.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-red-200/50 dark:border-red-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Ban className="w-5 h-5 text-red-500" />
                                Restrictions
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                You may not copy, distribute, or modify our materials without prior consent.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "termination",
            title: "Termination",
            icon: Ban,
            emoji: "🚫",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        We reserve the right to suspend or terminate your account if you:
                    </p>
                    <div className="space-y-3">
                        {[
                            "Breach these Terms",
                            "Misuse our platform (spam, illegal activities, fraud)"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl">
                                <Ban className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Upon termination, your right to use our Services ends immediately.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "limitation-liability",
            title: "Limitation of Liability",
            icon: Shield,
            emoji: "🛡️",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        To the fullest extent permitted by law, Smtpmailer is not liable for:
                    </p>
                    <div className="space-y-3">
                        {[
                            "Indirect, incidental, or consequential damages",
                            "Loss of profits, data, or goodwill arising from use of the Services"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl">
                                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                            <Scale className="w-4 h-4 inline mr-2" />
                            This limitation applies to the fullest extent permitted by applicable law.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "indemnification",
            title: "Indemnification",
            icon: HandHeart,
            emoji: "🤝",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl sm:rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <HandHeart className="w-5 h-5 text-orange-500" />
                            Your Agreement
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            You agree to indemnify and hold harmless Smtpmailer, its officers, employees, and partners from any claims, damages, or expenses resulting from your misuse of the Services.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "governing-law",
            title: "Governing Law",
            icon: Scale,
            emoji: "⚖️",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-blue-500" />
                            Jurisdiction
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            These Terms are governed by the laws of <strong>[Insert Jurisdiction]</strong>, without regard to conflicts of law.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "changes-terms",
            title: "Changes to Terms",
            icon: Edit,
            emoji: "📝",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Edit className="w-5 h-5 text-yellow-500" />
                                Updates
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                We may update these Terms from time to time.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-800/50">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Transparency
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                Latest version always posted with updated Effective Date.
                            </p>
                        </div>
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
                                        <FileText className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white animate-bounce" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in px-2">
                                    Terms of Use
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
                                    Legal terms and conditions governing your use of Smtpmailer services.
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

                    {/* Terms Sections */}
                    <div className="space-y-4 sm:space-y-6">
                        {termsSections.map((section, index) => {
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
