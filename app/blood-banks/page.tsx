"use client"

import PageComponent from "@/src/pages/BloodBanks"
import ProtectedRoute from "@/components/protected-route"

export default function Page() {
  return <ProtectedRoute allowedRoles={["admin"]}><PageComponent /></ProtectedRoute>
}
