import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
    return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/">
            <img src="./Blood-Bond-Logo.png" width="150" alt="Blood Bond" />
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost">Login</Button>
            </Link>

            <Link href="/donors">
              <Button variant="outline">Donors</Button>
            </Link>

            <Link href="/search">
              <Button>Guest Order</Button>
            </Link>
          </div>

        </div>
      </nav>
      )
}