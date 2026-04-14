import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/20 via-primary/20 to-primary/30">
      <div className="container mx-auto text-center">

        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
          Ready to Save Lives?
        </h2>

        <p className="text-xl text-muted-foreground mx-auto mb-10">
        Join a growing network of hospitals, blood banks, and donors working together to save lives across India.
        </p>

        <Link href="/search">
          <Button size="lg" variant="secondary" className="text-lg text-primary px-8 gap-2">
            Guest Order
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

      </div>
    </section>
  )
}