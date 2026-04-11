"use client"

import { useState, useEffect } from "react"
import { supabase } from "../integrations/supabase/client"

export interface Donor {
  id: string
  name: string
  email: string
  phone: string
  city: string
  area: string
  blood_group: string
  last_donation_date: string
  created_at: string
}

export const useDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all donors
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true)
        const { data, error: fetchError } = await supabase
          .from("donors")
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError
        setDonors(data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching donors:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch donors")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonors()
  }, [])

  // Add new donor
  const addDonor = async (donorData: Omit<Donor, "id" | "created_at">) => {
    try {
      const { data, error: insertError } = await supabase
        .from("donors")
        .insert([donorData])
        .select("*")
        .single()

      if (insertError) throw insertError

      setDonors([data as Donor, ...donors])
      return { success: true, donor: data }
    } catch (err) {
      console.error("Error adding donor:", err)
      return { success: false, error: err instanceof Error ? err.message : "Failed to add donor" }
    }
  }

  // Record donor inquiry
  const recordDonorInquiry = async (
    donorId: string,
    inquirerData: {
      name: string
      email: string
      phone: string
      message: string
    },
  ) => {
    try {
      const { error: insertError } = await supabase.from("inquiries").insert([
        {
          donor_id: donorId,
    sender_name: inquirerData.name,
    sender_email: inquirerData.email,
    sender_phone: inquirerData.phone,
    subject: "Donor Inquiry",
    message: inquirerData.message,
    category: "donor",
        },
      ])

      if (insertError) throw insertError
      return { success: true }
    } catch (err) {
      console.error("Error recording inquiry:", err)
      return { success: false, error: err instanceof Error ? err.message : "Failed to record inquiry" }
    }
  }

  return {
    donors,
    isLoading,
    error,
    addDonor,
    recordDonorInquiry,
  }
}
