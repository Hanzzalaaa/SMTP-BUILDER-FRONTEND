"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Basic",
    price: "$0",
    period: "/month",
    description: "Perfect for small businesses",
    features: ["100 emails/month", "Basic analytics", "Email support", "Bulk Email Support"],
    popular: false,
  },
  {
    name: "Premium",
    price: "$200",
    period: "/month",
    description: "For growing companies",
    features: ["1,000,000 emails /month", "Unlimited IPs & Server", "Reputation Defender", "24/7 Priority Support", "Zero Blocking"],
    popular: true,
  },
  // {
  //   name: "Enterprise",
  //   price: "Custom",
  //   period: "",
  //   description: "For large organizations",
  //   features: ["Unlimited emails", "Dedicated IP", "24/7 phone support", "Custom integrations", "SLA guarantee"],
  //   popular: false,
  // },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 animate-fade-in px-2">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delay px-3 sm:px-4">
            Choose the plan that fits your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl lg:max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-orange-400 dark:border-orange-500 shadow-lg scale-105"
                  : "border-gray-200 dark:border-gray-700"
              } animate-fade-in-up hover:shadow-lg transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                <div className="mt-3 sm:mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Link href="/login" className="w-full h-full flex items-center justify-center">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}