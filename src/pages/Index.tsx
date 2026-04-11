"use client"

import React from "react"
import { Link, useNavigate } from "@/lib/next-router-compat"
import { useAuth } from "@/src/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Droplet, Building2, Hospital, Shield, Clock, MapPin, ArrowRight, CheckCircle2, Zap, Users } from "lucide-react"

const Index: React.FC = () => {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  // Redirect logged-in users to dashboard
  React.useEffect(() => {
    if (user && role) {
      navigate("/dashboard")
    }
  }, [user, role, navigate])

  const features = [
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live blood stock updates across all registered blood banks",
    },
    {
      icon: MapPin,
      title: "Location-Based Search",
      description: "Find nearby blood banks with interactive maps",
    },
    {
      icon: Zap,
      title: "Emergency Orders",
      description: "Quick order placement for urgent blood requirements",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for all transactions",
    },
  ]

  const userTypes = [
    {
      icon: Building2,
      title: "Blood Banks",
      description: "Manage inventory, track stock levels, and fulfill orders from hospitals",
      color: "bg-primary",
    },
    {
      icon: Hospital,
      title: "Hospitals",
      description: "Search availability, place orders, and track deliveries in real-time",
      color: "bg-info",
    },
    {
      icon: Users,
      title: "Administrators",
      description: "Oversee operations, manage users, and ensure smooth coordination",
      color: "bg-success",
    },
  ]

  const stats = [
    { value: "100+", label: "Blood Banks" },
    { value: "500+", label: "Hospitals" },
    { value: "10K+", label: "Lives Saved" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
          <img src="./Blood-Bond-Logo.png" width="150"/>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/donors">
              <Button variant="outline">Donors</Button>
            </Link>
            <Link to="/search">
              <Button>Guest Order</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Droplet className="h-4 w-4" />
            Saving Lives, One Unit at a Time
          </div>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight mb-6 animate-fade-in">
            Connect Hospitals with <span className="text-primary">Blood Banks</span> Instantly
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            A modern platform for managing blood inventory, placing orders, and tracking deliveries in real-time.
            Designed for emergencies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/auth">
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

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">Built for Speed & Reliability</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature designed with emergency situations in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">Designed for Everyone</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Role-based dashboards tailored to your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-16 w-16 rounded-2xl ${type.color} flex items-center justify-center mx-auto mb-6`}>
                  <type.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{type.title}</h3>
                <p className="text-muted-foreground">{type.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold text-foreground mb-6">Why Choose Blood Bond?</h2>
              <div className="space-y-4">
                {[
                  "Real-time blood availability across all registered banks",
                  "Instant order placement with urgency prioritization",
                  "Interactive maps to locate nearest blood banks",
                  "Comprehensive admin dashboard for oversight",
                  "Secure, role-based access control",
                  "Live order status tracking",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/auth" className="inline-block mt-8">
                <Button size="lg" className="gap-2">
                  Join Blood Bond Today
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group, index) => (
                    <div
                      key={group}
                      className="bg-card rounded-xl p-4 text-center shadow-sm animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Droplet className="h-5 w-5 text-primary" />
                        <span className="font-heading text-2xl font-bold text-foreground">{group}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join thousands of hospitals and blood banks already using Blood Bond to streamline their operations.
          </p>
          <Link to="/search">
            <Button size="lg" variant="secondary" className="text-lg px-8 gap-2">
              Guest Order
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Droplet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">Blood Bond</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Blood Bond. Saving lives through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
