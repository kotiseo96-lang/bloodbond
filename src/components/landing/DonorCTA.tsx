import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";

export default function DonorCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-destructive/10 to-primary/10">
      <div className="container flex flex-col md:flex-row gap-20 justify-center mx-auto text-center">
        <div className="flex justify-center mb-8 px-4">
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <img
              src="/become-a-donor.jpeg"
              alt="Become a donor"
              className="w-full h-[300px] cursor-pointer object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
          A Drop from you. A second chance for someone in need.
          </h2>

          <p className="text-lg text-muted-foreground mx-auto mb-10 leading-relaxed">
            Join the chain of life. Register as a donor today and be ready when
            someone needs you.
            <br />
            <br />
            From your vein to someone’s veins — a bridge of humanity.
          </p>

          <Link href="/signup/donor">
            <Button size="lg" className="gap-2 text-lg px-8">
              Become a Donor
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
