
"use client"

import { useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { TestimonialsSection } from "@/components/testimonial-section"
import { PricingSection } from "@/components/pricingsection"

export default function HomePage() {
  useEffect(() => {
    // Handle hash-based navigation
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        // Remove the # from the hash
        const sectionId = hash.substring(1)
        const element = document.getElementById(sectionId)
        if (element) {
          // Small delay to ensure the page is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
