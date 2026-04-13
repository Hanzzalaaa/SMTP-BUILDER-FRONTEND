"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [emailCount, setEmailCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [deliveryRate, setDeliveryRate] = useState(0)
  const router = useRouter()

  // Animated counters
  useEffect(() => {
    const emailTimer = setInterval(() => {
      setEmailCount((prev) => (prev < 1000000 ? prev + 50000 : 1000000))
    }, 100)

    const userTimer = setInterval(() => {
      setUserCount((prev) => (prev < 50000 ? prev + 2500 : 50000))
    }, 100)

    const deliveryTimer = setInterval(() => {
      setDeliveryRate((prev) => (prev < 99.9 ? prev + 0.1 : 99.9))
    }, 50)

    return () => {
      clearInterval(emailTimer)
      clearInterval(userTimer)
      clearInterval(deliveryTimer)
    }
  }, [])

  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <Badge className="mb-3 sm:mb-4 md:mb-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 animate-bounce-subtle text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
            🚀 Trusted by 50,000+ businesses worldwide
          </Badge>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 animate-fade-in-up leading-tight px-2">
            Send Bulk Emails
            <span className="block bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              That Actually Deliver
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delay px-3 sm:px-4">
            SmtpMailer is a reliable bulk email sender software which comes with an inbuilt SMTP server and IP addresses. You only need to create an account, login, compose your mail, add recipients and send. We take care of all the technical work, while you monitor delivery.
          </p>

          <div className="flex justify-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up-delay-2 px-3 sm:px-4">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-orange-400 cursor-pointer to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 transform hover:scale-105 transition-all duration-200 rounded-xl sm:rounded-2xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl sm:max-w-4xl mx-auto px-3 sm:px-4">
            <div className="text-center animate-slide-up">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">{emailCount.toLocaleString()}+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Emails Delivered Daily</div>
            </div>
            <div className="text-center animate-slide-up-delay">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-500 mb-1 sm:mb-2">{userCount.toLocaleString()}+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center animate-slide-up-delay-2">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-500 mb-1 sm:mb-2">{deliveryRate.toFixed(1)}%</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Delivery Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
