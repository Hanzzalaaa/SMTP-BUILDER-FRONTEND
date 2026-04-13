"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"

export function CTASection() {
  const router = useRouter()
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800 animate-fade-in">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
              Ready to send bulk emails without stress?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2">
              Join thousands of users already using SmtpMailer for guaranteed inbox delivery email campaigns.
            </p>
            <div className="flex justify-center mb-4 sm:mb-6">
              <Button
                size="lg"
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-orange-400 cursor-pointer to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white transform hover:scale-105 transition-all duration-200 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl"
              >
                Start Free Trial
                <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
