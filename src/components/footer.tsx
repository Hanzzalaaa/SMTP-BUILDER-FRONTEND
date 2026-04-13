import { Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "API Docs", href: "#" },
    { name: "Integrations", href: "#" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Status", href: "#" },
    { name: "Privacy", href: "/privacy-policy" },
    { name: "Terms", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 sm:py-8 md:py-12 px-3 sm:px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">SMTPMAILER</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
              The most reliable email delivery platform for businesses of all sizes.
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-600 dark:text-gray-400">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-orange-500 transition-colors text-xs sm:text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-600 dark:text-gray-400">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-orange-500 transition-colors text-xs sm:text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-600 dark:text-gray-400">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-orange-500 transition-colors text-xs sm:text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2025 Redrock Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
