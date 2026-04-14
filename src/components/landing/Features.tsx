import { Card } from "@/components/ui/card"
import {
  Clock,
  MapPin,
  Zap,
  Shield,
} from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live blood availability updates across connected blood banks nationwide",
    },
    {
      icon: MapPin,
      title: "Location-Based Search",
      description: "Find nearby blood banks and donors across cities with smart location search",
    },
    {
      icon: Zap,
      title: "Emergency Orders",
      description: "Place emergency blood requests instantly with priority handling",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Secure, reliable, and trusted system for hospitals, blood banks, and donors",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">

        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Built for Speed & Reliability
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature designed with emergency situations in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}