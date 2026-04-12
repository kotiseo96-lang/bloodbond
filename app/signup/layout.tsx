import Header from "@/src/components/site/Header"
import Footer from "@/src/components/site/Footer"

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />

      {/* 👇 IMPORTANT: offset fixed header height */}
      <main className="pt-16">
        {children}
      </main>

      <Footer />
    </>
  )
}