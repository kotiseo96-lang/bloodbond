export type UserRole = "admin" | "hospital" | "blood_bank" | "donor"

export interface DashboardMenuItem {
  title: string
  href: string
  icon?: string
}

export interface DashboardConfig {
  role: UserRole
  title: string
  menus: DashboardMenuItem[]
}

export const dashboardConfig: Record<UserRole, DashboardConfig> = {
  admin: {
    role: "admin",
    title: "Admin Dashboard",
    menus: [
      { title: "Overview", href: "/dashboard" },
      { title: "Users", href: "/dashboard/users" },
      { title: "Blood Banks", href: "/dashboard/blood-banks" },
      { title: "Hospitals", href: "/dashboard/hospitals" },
      { title: "Donations", href: "/dashboard/donations" },
    ],
  },

  hospital: {
    role: "hospital",
    title: "Hospital Dashboard",
    menus: [
      { title: "Overview", href: "/dashboard" },
      { title: "Request Blood", href: "/dashboard/request" },
      { title: "My Orders", href: "/dashboard/orders" },
    ],
  },

  blood_bank: {
    role: "blood_bank",
    title: "Blood Bank Dashboard",
    menus: [
      { title: "Overview", href: "/dashboard" },
      { title: "Stock", href: "/dashboard/stock" },
      { title: "Donations", href: "/dashboard/donations" },
      { title: "Orders", href: "/dashboard/orders" },
    ],
  },

  donor: {
    role: "donor",
    title: "Donor Dashboard",
    menus: [
      { title: "Overview", href: "/dashboard" },
      { title: "My Donations", href: "/dashboard/donations" },
      { title: "Rewards", href: "/dashboard/rewards" },
      { title: "Wallet", href: "/dashboard/wallet" },
    ],
  },
}