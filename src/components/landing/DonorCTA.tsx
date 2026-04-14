import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight } from "lucide-react"

export default function DonorCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-destructive/10 to-primary/10">
      <div className="container mx-auto text-center">

        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <Heart className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
          Your Blood. Their Second Chance.
        </h2>

        <p className="text-lg text-muted-foreground mx-auto mb-10 leading-relaxed">
          Join the chain of life. Register as a donor today and be ready when someone needs you.
          <br /><br />
          From your vein to someone’s veins — a bridge of humanity.
        </p>

        <Link href="/auth">
          <Button size="lg" className="gap-2 text-lg px-8">
            Become a Donor
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

      </div>
    </section>
  )
}