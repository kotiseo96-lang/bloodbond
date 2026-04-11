import { Droplet } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Droplet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              Blood Bond
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blood Bond. Saving lives through technology.
          </p>

        </div>

      </div>
    </footer>
  )
}