import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Droplet, ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-4 pb-20 px-4">
      <div className="container mx-auto text-center">

        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Droplet className="h-4 w-4" />
          Saving Lives, One Unit at a Time
        </div>

        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight mb-6">
          Connect Hospitals with{" "}
          <span className="text-primary">Blood Banks</span> Instantly
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          A modern platform for managing blood inventory, placing orders, and tracking deliveries in real-time.
          Designed for emergencies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <Link href="/auth">
            <Button size="lg" className="gap-2 text-lg px-8">
              Start Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
            Learn More
          </Button>

        </div>

      </div>
    </section>
  )
}