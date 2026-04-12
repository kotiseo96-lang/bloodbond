"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import ProtectedRoute from "@/components/protected-route"

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["donor"]}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}