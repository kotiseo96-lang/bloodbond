import { Suspense } from "react"
import type { Metadata } from "next"
import Providers from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Blood Bond",
  description: "Blood Bond application",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <Providers>
  <Suspense fallback={null}>
    {children}
  </Suspense>
</Providers>
      </body>
    </html>
  )
}
