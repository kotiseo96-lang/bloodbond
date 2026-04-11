import { Card } from "@/components/ui/card"
import {
  Building2,
  Hospital,
  Users,
} from "lucide-react"

export default function UserTypes() {
  const userTypes = [
    {
      icon: Building2,
      title: "Blood Banks",
      description:
        "Manage inventory, track stock levels, and fulfill orders from hospitals",
      color: "bg-primary",
    },
    {
      icon: Hospital,
      title: "Hospitals",
      description:
        "Search availability, place orders, and track deliveries in real-time",
      color: "bg-info",
    },
    {
      icon: Users,
      title: "Administrators",
      description:
        "Oversee operations, manage users, and ensure smooth coordination",
      color: "bg-success",
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">

        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Designed for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Role-based dashboards tailored to your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <Card
              key={index}
              className="p-8 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-16 w-16 rounded-2xl ${type.color} flex items-center justify-center mx-auto mb-6`}>
                <type.icon className="h-8 w-8 text-primary-foreground" />
              </div>

              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                {type.title}
              </h3>

              <p className="text-muted-foreground">
                {type.description}
              </p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}