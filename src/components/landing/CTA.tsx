import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 bg-primary">
      <div className="container mx-auto text-center">

        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Ready to Save Lives?
        </h2>

        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Join thousands of hospitals and blood banks already using Blood Bond to streamline their operations.
        </p>

        <Link href="/search">
          <Button size="lg" variant="secondary" className="text-lg px-8 gap-2">
            Guest Order
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

      </div>
    </section>
  )
}