import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Droplet } from "lucide-react"

export default function Benefits() {
  const benefits = [
    "Real-time blood availability across all registered banks",
    "Instant order placement with urgency prioritization",
    "Interactive maps to locate nearest blood banks",
    "Comprehensive admin dashboard for oversight",
    "Secure, role-based access control",
    "Live order status tracking",
  ]

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
              Why Choose Blood Bond?
            </h2>

            <div className="space-y-4">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/auth" className="inline-block mt-8">
              <Button size="lg" className="gap-2">
                Join Blood Bond Today
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8">

              <div className="grid grid-cols-2 gap-4">
                {bloodGroups.map((group, index) => (
                  <div
                    key={group}
                    className="bg-card rounded-xl p-4 text-center shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Droplet className="h-5 w-5 text-primary" />
                      <span className="font-heading text-2xl font-bold text-foreground">
                        {group}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Available
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}