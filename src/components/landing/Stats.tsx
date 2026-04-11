export default function Stats() {
    const stats = [
      { value: "100+", label: "Blood Banks" },
      { value: "500+", label: "Hospitals" },
      { value: "10K+", label: "Lives Saved" },
      { value: "24/7", label: "Support" },
    ]
  
    return (
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }