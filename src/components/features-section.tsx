import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, BarChart3, Globe, Target, Clock } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast",
    description: "Send thousands of emails per minute with our optimized infrastructure",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with GDPR, CAN-SPAM, and more",
    color: "from-green-400 to-blue-500",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Guaranteed Inbox Delivery",
    description: "Get your message straight to the inbox of Yahoo, Gmail, Outlook, Webmail, Yandex, and more.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Delivery",
    description: "Worldwide infrastructure ensures optimal delivery speeds",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "99.99% Uptime",
    description: "We provide you with unlimited IPs and SMTP server, while you focus on sending mails.",
    color: "from-red-400 to-pink-500",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Round-the-clock expert support when you need it most",
    color: "from-indigo-400 to-purple-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 animate-fade-in px-2">
            Why Choose SMTPMAILER?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto animate-fade-in-delay px-3 sm:px-4">
            Built for scale, designed for success. Our platform delivers the reliability and performance your business
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 animate-fade-in-up group hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
