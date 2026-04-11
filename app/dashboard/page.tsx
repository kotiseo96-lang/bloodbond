"use client"

import PageComponent from "@/src/pages/Dashboard"
import ProtectedRoute from "@/components/protected-route"

export default function Page() {
  return <ProtectedRoute><PageComponent /></ProtectedRoute>
}
