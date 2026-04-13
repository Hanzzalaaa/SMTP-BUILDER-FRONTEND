"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Sparkles,
    Heart,
    Target,
    Shield,
    TrendingUp,
    Users,
    CheckCircle,
    Zap,
    Globe,
    Award,
    Clock,
    Rocket,
    Star,
    BarChart3
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <Navigation />
                
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-orange-200/50 dark:border-gray-700/50 pt-16 sm:pt-20 lg:pt-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
                    <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-75 animate-pulse"></div>
                                    <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl">
                                        <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white animate-bounce" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in px-2">
                                    About Us – Smtpmailer
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
                                    We believe email should be simple, powerful, and limitless.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                                    <span className="text-center">Democratizing bulk email marketing for everyone</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-8 sm:space-y-12">
                    {/* Back Button */}
                    <div className="flex items-center mb-6 sm:mb-8">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto rounded-xl sm:rounded-2xl border-orange-200 hover:border-orange-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                            >
                                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Mission Statement */}
                    <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-8 md:p-10">
                            <div className="text-center space-y-4 sm:space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Target className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                        Our Mission
                                    </h2>
                                    <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                        We started Smtpmailer with a clear mission: to help businesses, entrepreneurs, and creators send unlimited bulk emails without breaking the bank. Traditional email providers impose strict limits, hidden fees, and complicated pricing. We set out to change that.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What We Do */}
                    <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-8 md:p-10">
                            <div className="space-y-6 sm:space-y-8">
                                <div className="text-center space-y-3 sm:space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                        What We Do
                                    </h2>
                                    <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                        Smtpmailer provides a scalable SMTP platform that allows you to send newsletters, transactional messages, and marketing campaigns to thousands—or even millions—of subscribers every month.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl border border-green-200/50 dark:border-green-800/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 flex-shrink-0" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Enterprise-grade Deliverability</h3>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Optimized infrastructure ensures your emails reach the inbox</p>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Star className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 flex-shrink-0" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Advanced Analytics</h3>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Detailed insights into your email campaign performance</p>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500 flex-shrink-0" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">API Integration</h3>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Seamlessly integrate with your existing systems</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Why Choose Us */}
                    <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-8 md:p-10">
                            <div className="space-y-6 sm:space-y-8">
                                <div className="text-center space-y-3 sm:space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                        Why Choose Us
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    Unlimited Bulk Sending
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    No caps, no throttling, just pure scalability for your growing business needs.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    High Deliverability
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Optimized infrastructure ensures your emails land in the inbox, not spam.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    Simple & Transparent Pricing
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    One flat monthly fee, no surprises or hidden costs.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    Customer-Centric Support
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Our team is available 24/7 to keep your campaigns running smoothly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Our Vision */}
                    <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 backdrop-blur-xl border-2 border-orange-200/50 dark:border-orange-800/50 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-8 md:p-10">
                            <div className="text-center space-y-4 sm:space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Globe className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                        Our Vision
                                    </h2>
                                    <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                        We&apos;re building more than just an SMTP service. Our vision is to democratize bulk email marketing, making it accessible to every business—whether you&apos;re a solo founder, a growing startup, or a global enterprise.
                                    </p>
                                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mt-4">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Your growth is our priority</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 px-4 leading-relaxed">
                            <span className="block sm:inline">© 2025 Redrock Technologies Ltd. All rights reserved.</span>
                            <span className="hidden sm:inline"> | </span>
                            <span className="block sm:inline">Empowering businesses through unlimited email marketing</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
