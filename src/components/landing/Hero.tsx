import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Droplet, ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative pt-4 pb-20 px-4 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-right bg-contain opacity-80"
        style={{
          backgroundImage: "url('/hero-background.png')",
        }}
      />

      {/* Gradient Overlay (important for text readability) */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />

      {/* Content */}
      <div className="container relative z-10">
      <div className="flex justify-center max-w-3xl">
        <div className="inline-flex gap-2 bg-primary/10 text-primary 
px-4 py-2 rounded-full text-sm font-medium mb-6 
shadow-lg shadow-black/50 border border-black/50 mx-auto">
          <Droplet className="h-4 w-4" />
          Saving Lives, One Unit at a Time
        </div>
</div>
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl 
        font-bold text-foreground max-w-4xl leading-tight mb-6">
          Connect Hospitals with{" "}
          <span className="text-primary">Blood Banks</span> Instantly
        </h1>

        <p className="text-xl text-muted-foreground 
        max-w-3xl mb-10 leading-relaxed">
          India’s platform connecting generous blood donors, hospitals, and blood banks across the nation.
          Together, we ensure every patient gets the blood they need — on time.
          <br /><br />
          Blood has no borders. Connecting every state, every city, and every heart that wants to help.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          
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