"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/src/integrations/supabase/client"

const BLOOD_BANK_ID = "9cb27456-fbb4-43b4-b006-2faddb7e460c"

export default function DonationForm({
  onDonationAdded,
}: {
  onDonationAdded: () => void
}) {
  const [email, setEmail] = useState("")
  const [donor, setDonor] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 🔍 Auto search with debounce
  useEffect(() => {
    if (!email) {
      setDonor(null)
      return
    }

    const timer = setTimeout(() => {
      searchDonor()
    }, 500) // debounce

    return () => clearTimeout(timer)
  }, [email])

  const searchDonor = async () => {
    setLoading(true)

    const cleanEmail = email.trim().toLowerCase()

    const { data: userData } = await supabase
      .rpc("search_user_by_email", {
        p_email: cleanEmail,
      })
      .maybeSingle()

    if (!userData) {
      setDonor(null)
      setLoading(false)
      return
    }

    const { data: donorData } = await supabase
      .from("donors")
      .select("*")
      .eq("user_id", userData.id)
      .maybeSingle()

    setDonor(donorData || null)
    setLoading(false)
  }

  const addDonation = async () => {
    if (!donor) return
  
    setLoading(true)
  
    const { error } = await supabase.rpc("add_donation_with_wallet", {
      p_donor_id: donor.id,
      p_blood_bank_id: BLOOD_BANK_ID,
      p_units: 1, // ✅ hardcoded
    })
  
    setLoading(false)
  
    if (error) {
      alert(error.message)
      return
    }
  
    alert("Donation added")
    setDonor(null)
    setEmail("")
  
    onDonationAdded()
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        className="border p-2 rounded w-full"
        placeholder="Enter donor email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Donor Info */}
      {donor && (
        <div className="p-4 border rounded bg-gray-50">
          <p><b>Name:</b> {donor.name}</p>
          <p><b>Blood Group:</b> {donor.blood_group}</p>
        </div>
      )}

      {/* Add Donation */}
      {donor && (
        <>

          <button
            onClick={addDonation}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Add Donation
          </button>
        </>
      )}
    </div>
  )
}