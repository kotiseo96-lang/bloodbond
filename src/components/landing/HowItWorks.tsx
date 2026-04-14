  import { Card } from "@/components/ui/card"
  import Image from "next/image"

  export default function HowItWorks() {
    const steps = [
      {
        image: '/Hospital-Places-Order.jpg',
        title: "Hospital Places Order",
        description:
          "Hospitals can easily place a blood request by selecting the required blood type and quantity through our platform.",
      },
      {
        image: '/Order-Processing.jpg',
        title: "Order Processing",
        description:
          "Once received, the blood bank verifies availability and prepares the required units for dispatch.",
      },
      {
        image: '/Timely-Delivery.jpg',
        title: "Timely Delivery",
        description:
          "Our delivery system ensures safe and timely delivery to hospitals with transparent tracking.",
      },
    ]

    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">

          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and reliable process designed for emergencies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-all">
                
                <div className="flex items-center justify-center mx-auto mb-6">
                <Image 
    src={step.image}
    alt={step.title}
    width={200}
    height={40}
    className="object-contain rounded-lg"
  />
                </div>

                <h3 className="font-heading text-xl font-semibold mb-3">
                  {step.title}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>

              </Card>
            ))}
          </div>

        </div>
      </section>
    )
  }