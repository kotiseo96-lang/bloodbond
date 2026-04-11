"use client"

import PageComponent from "@/src/pages/Orders"
import ProtectedRoute from "@/components/protected-route"

export default function Page() {
  return <ProtectedRoute><PageComponent /></ProtectedRoute>
}
