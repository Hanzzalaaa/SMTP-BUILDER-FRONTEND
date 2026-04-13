"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, ArrowLeft, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
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
                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent animate-fade-in px-2">
                  Get in Touch
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
                  Have questions about our SMTP services? We&apos;re here to help. Reach out to us through any of the channels below.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                  <span className="text-center">We typically respond within 24 hours during business days</span>
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

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Address */}
            <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      Our Address
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      Road 1 house 18b FHE,<br />
                      Owerri, Imo, Nigeria.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      Email Us
                    </h2>
                    <a 
                      href="mailto:Hello@smtpmailer.pro" 
                      className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-lg sm:text-xl md:text-2xl transition-colors hover:underline"
                    >
                      Hello@smtpmailer.pro
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      Call Us
                    </h2>
                    <a 
                      href="tel:+2348068621706" 
                      className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-medium text-lg sm:text-xl md:text-2xl transition-colors hover:underline"
                    >
                      +234 806 862 1706
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="group hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 backdrop-blur-xl border-2 border-orange-200/50 dark:border-orange-800/50 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Response Time
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    We typically respond within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mt-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Business Hours: Monday - Friday, 9 AM - 6 PM WAT</span>
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
