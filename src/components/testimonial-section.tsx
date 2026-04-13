import { Card, CardContent } from "@/components/ui/card"
import { Star, Users } from "lucide-react"

const testimonials = [
  {
    quote: "SMTPMAILER transformed our email marketing. 99.9% delivery rate and incredible support!",
    author: "Sarah Johnson",
    role: "Marketing Director, TechCorp",
  },
  {
    quote: "The best email service we've used. Reliable, fast, and the analytics are game-changing.",
    author: "Mike Chen",
    role: "CEO, StartupXYZ",
  },
  {
    quote: "Switched from our previous provider and saw immediate improvements in deliverability.",
    author: "Emily Rodriguez",
    role: "Growth Manager, E-commerce Plus",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 animate-fade-in px-2">
            Trusted by Industry Leaders
          </h2>
          <div className="flex items-center justify-center mb-6 sm:mb-8 animate-fade-in-delay px-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">4.9/5 from 10,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 animate-fade-in-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold truncate">{testimonial.author}</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
