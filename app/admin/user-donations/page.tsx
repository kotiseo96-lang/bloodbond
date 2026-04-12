"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/src/integrations/supabase/client"
import DonationTable from "./__components/DonationTable"
import DonationForm from "./__components/DonationForm"
import DonationStats from "./__components/DonationStats"

export default function UserDonationsPage() {
  const [loading, setLoading] = useState(false)
  const [donations, setDonations] = useState<any[]>([])

  const fetchDonations = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .rpc("get_admin_donation_history")

    if (error) {
      console.error(error)
      alert("Failed to fetch donations")
      setLoading(false)
      return
    }

    setDonations(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  return (
    <>
      <h1 className="text-2xl font-bold">Admin - Add Donation</h1>
      <DonationForm onDonationAdded={fetchDonations} />
      <DonationStats donations={donations} />
      <DonationTable donations={donations} />
    </>
  )
}