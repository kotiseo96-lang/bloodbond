"use client"

import type React from "react"
import { Link } from "@/lib/next-router-compat"
import { useState } from "react"
import { useNavigate, useLocation } from "@/lib/next-router-compat"
import { useAuth } from "@/src/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Droplet,
  LayoutDashboard,
  ShoppingCart,
  MapPin,
  Settings,
  LogOut,
  Building2,
  Activity,
  Users,
  Menu,
  MessageCircle,
  Gift,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
  roles: ("admin" | "blood_bank" | "hospital" | "donor")[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "blood_bank", "hospital", "donor"] },
  { label: "Blood Stock", icon: Droplet, path: "/stock", roles: ["admin", "blood_bank"] },
  { label: "Orders", icon: ShoppingCart, path: "/orders", roles: ["admin", "blood_bank", "hospital"] },
  { label: "Search Blood", icon: MapPin, path: "/search", roles: ["hospital"] },
  { label: "Blood Banks", icon: Building2, path: "/admin/blood-banks", roles: ["admin"] },
  { label: "Hospitals", icon: Activity, path: "/admin/hospitals", roles: ["admin"] },
  { label: "Users", icon: Users, path: "/admin/users", roles: ["admin"] },
  { label: "Inquiries", icon: MessageCircle, path: "/admin/inquiries", roles: ["admin"] },
  { label: "Locations", icon: MapPin, path: "/admin/locations", roles: ["admin"] },
  { label: "Settings", icon: Settings, path: "/admin/settings", roles: ["admin", "blood_bank", "hospital"] },
  { label: "Donations", icon: Droplet, path: "/admin/user-donations", roles: ["admin"] },
  { label: "Reward Requests", icon: Droplet, path: "/admin/reward-requests", roles: ["admin"] },
  { label: "History", icon: History, path: "/donor/history", roles: ["donor"] },
  { label: "Rewards", icon: Gift, path: "/donor/rewards", roles: ["donor"] },
  { label: "Edit Profile", icon: Settings, path: "/donor/edit", roles: ["donor"] },
  { label: "Rewards", icon: Gift, path: "/admin/rewards", roles: ["admin"] },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  hideNavigation?: boolean
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, hideNavigation = false }) => {
  const { user, role, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredNavItems = navItems.filter((item) => role && item.roles.includes(role))

  const handleSignOut = async () => {
    await signOut()
    navigate("/auth")
  }

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "blood_bank":
        return "Blood Bank"
      case "hospital":
        return "Hospital"
      default:
        return "User"
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setSidebarOpen(false)
  }

  // ✅ GROUPING (derived only, no data change)
  const groupedNavItems = {
    main: filteredNavItems.filter((i) =>
      ["/dashboard", "/stock", "/orders", "/search"].includes(i.path)
    ),

    management: filteredNavItems.filter(
      (i) =>
        i.path.startsWith("/admin") &&
        !["/admin/settings", "/admin/rewards", "/admin/reward-requests"].includes(i.path)
    ),

    adminTools: filteredNavItems.filter((i) =>
      ["/admin/settings", "/admin/rewards", "/admin/reward-requests"].includes(i.path)
    ),

    donor: filteredNavItems.filter((i) => i.path.startsWith("/donor")),
  }

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path

    return (
      <button
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent"
        )}
      >
        <Icon className="h-5 w-5" />
        {item.label}
      </button>
    )
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Droplet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold">Blood Bond</h1>
            <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">

        {/* MAIN */}
        {groupedNavItems.main.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
              MAIN
            </p>
            <div className="space-y-1">{groupedNavItems.main.map(renderItem)}</div>
          </div>
        )}

        {/* MANAGEMENT */}
        {groupedNavItems.management.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
              MANAGEMENT
            </p>
            <div className="space-y-1">{groupedNavItems.management.map(renderItem)}</div>
          </div>
        )}

        {/* ADMIN TOOLS */}
        {groupedNavItems.adminTools.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
              ADMIN TOOLS
            </p>
            <div className="space-y-1">{groupedNavItems.adminTools.map(renderItem)}</div>
          </div>
        )}

        {/* DONOR */}
        {groupedNavItems.donor.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
              DONOR
            </p>
            <div className="space-y-1">{groupedNavItems.donor.map(renderItem)}</div>
          </div>
        )}
      </nav>

      {/* USER */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-sm truncate">{user?.email}</p>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  // ===== GUEST MODE =====
  if (hideNavigation) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <Droplet className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Blood Bond</span>
              </div>
            </Link>

            <div className="flex gap-2">
              <Link to="/auth"><Button variant="ghost">Login</Button></Link>
              <Link to="/donors"><Button variant="outline">Donors</Button></Link>
              <Link to="/search"><Button>Guest Order</Button></Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </div>
    )
  }

  // ===== DASHBOARD =====
  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-64 h-screen bg-card border-r overflow-hidden">
        <SidebarContent />
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-primary" />
            <span className="font-bold">Blood Bond</span>
          </div>

          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout