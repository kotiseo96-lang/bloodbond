
"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext"

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: string[]
}) {
  const router = useRouter()
  const { user, role, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace('/auth')
      return
    }
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.replace('/dashboard')
    }
  }, [isLoading, user, role, allowedRoles, router])

  if (isLoading || !user || (allowedRoles && role && !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
