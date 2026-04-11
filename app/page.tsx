import Hero from "@/src/components/landing/Hero"
import Features from "@/src/components/landing/Features"
import UserTypes from "@/src/components/landing/UserTypes"
import Benefits from "@/src/components/landing/Benefits"
import CTA from "@/src/components/landing/CTA"
import Footer from "@/src/components/site/Footer"
import Header from "@/src/components/site/Header"
import Stats from "@/src/components/landing/Stats"

export const metadata = {
  title: "Blood Bond - Connect Hospitals & Blood Banks",
  description:
    "Real-time blood inventory management system for hospitals, blood banks, and emergency orders.",
  keywords: [
    "blood bank",
    "hospital system",
    "blood donation",
    "emergency blood",
    "blood inventory",
  ],
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <UserTypes />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  )
}