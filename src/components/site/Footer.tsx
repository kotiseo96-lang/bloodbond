import { Droplet } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border bg-white">
      <div className="container mx-auto">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        <Link href="/">
            <img src="/Blood-Bond-Logo.png" width="150" alt="Blood Bond" />
          </Link>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blood Bond. Saving lives through technology.
          </p>

        </div>

      </div>
    </footer>
  )
}