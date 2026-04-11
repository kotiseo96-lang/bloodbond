"use client"

import React from "react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/src/contexts/AuthContext"
import DashboardLayout from "@/components/layout/DashboardLayout"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import BloodBankDashboard from "@/components/dashboard/BloodBankDashboard"
import HospitalDashboard from "@/components/dashboard/HospitalDashboard"
import DonorDashboard from "../../components/dashboard/DonorDashboard"
import { Loader2 } from "lucide-react"

function DashboardContent() {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return <AdminDashboard />

      case "blood_bank":
        return <BloodBankDashboard />

      case "hospital":
        return <HospitalDashboard />

        case "donor":
  return <DonorDashboard />

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Welcome to Blood Bond
            </h2>
            <p className="text-muted-foreground">
              Your role is being configured. Please wait or contact support.
            </p>
          </div>
        )
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}