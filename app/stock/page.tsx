"use client"

import PageComponent from "@/src/pages/Stock"
import ProtectedRoute from "@/components/protected-route"

export default function Page() {
  return <ProtectedRoute allowedRoles={["admin", "blood_bank"]}><PageComponent /></ProtectedRoute>
}
