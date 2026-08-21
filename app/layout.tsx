import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "@/components/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
    title: { default: "Blood Bond — Find Blood Availability & Donors", template: "%s | Blood Bond" },
    description: "...find real-time blood availability by location, connect with donors...",
    // keywords: [...], 
    applicationName: "Blood Bond",
    // openGraph: { type: "website", siteName: "Blood Bond", title, description },
    // twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}