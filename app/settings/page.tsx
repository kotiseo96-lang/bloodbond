"use client"

import PageComponent from "@/src/pages/Settings"
import ProtectedRoute from "@/components/protected-route"

export default function Page() {
  return <ProtectedRoute><PageComponent /></ProtectedRoute>
}
