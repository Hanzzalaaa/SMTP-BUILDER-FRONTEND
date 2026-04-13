import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/provider/redux-provider"
import { AuthInitializer } from "@/components/auth/auth-intializer"
import { AutoLogoutProvider } from "@/components/auth/auto-logout-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SMTPMAILER - Professional Email Delivery Platform",
  description: "Send bulk emails that actually deliver with our enterprise-grade SMTP infrastructure.",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.style.fontFamily};
  --font-mono: monospace;
}
        `}</style>
      </head>
      <body className={inter.className}>
              <ReduxProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange={false}
            storageKey="smtpmailer-theme"
            themes={["light", "dark", "system"]}
          >
            <AuthInitializer>
              <AutoLogoutProvider>
                {children}
              </AutoLogoutProvider>
            </AuthInitializer>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
