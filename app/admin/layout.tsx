"use client"

import ProtectedRoute from "@/components/protected-route"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}