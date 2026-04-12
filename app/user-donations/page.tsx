"use client"

import React, { useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

const BLOOD_BANK_ID = "9cb27456-fbb4-43b4-b006-2faddb7e460c"

export default function UserDonationsPage() {
  const [email, setEmail] = useState("")
  const [donor, setDonor] = useState<any>(null)
  const [units, setUnits] = useState(1)
  const [loading, setLoading] = useState(false)

  // STEP 1: SEARCH DONOR
  const searchDonor = async () => {
    setLoading(true)
  
    const cleanEmail = email.trim().toLowerCase()
  
    const { data: userData, error } = await supabase
      .rpc("search_user_by_email", {
        p_email: cleanEmail,
      })
      .maybeSingle()
  
    if (error || !userData) {
      alert("User not found")
      setDonor(null)
      setLoading(false)
      return
    }
  
    const { data: donorData } = await supabase
      .from("donors")
      .select("*")
      .eq("user_id", userData.id)
      .maybeSingle()
  
    if (!donorData) {
      alert("Donor profile not found")
      setDonor(null)
    } else {
      setDonor(donorData)
    }
  
    setLoading(false)
  }

  // STEP 2: ADD DONATION + COINS
  const addDonation = async () => {
    if (!donor) {
      alert("Select donor first")
      return
    }
  
    setLoading(true)
  
    const { error } = await supabase.rpc("add_donation_with_wallet", {
      p_donor_id: donor.id,
      p_blood_bank_id: BLOOD_BANK_ID,
      p_units: units || 1
    })
  
    setLoading(false)
  
    if (error) {
      console.error(error)
      alert(error.message)
      return
    }
  
    alert("Donation added successfully")
    setUnits(1)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin - Add Donation</h1>

      {/* SEARCH INPUT */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter donor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={searchDonor}
          disabled={loading}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* DONOR INFO */}
      {donor && (
        <div className="p-4 border rounded bg-gray-50">
          <p><b>Name:</b> {donor.name}</p>
          <p><b>Email:</b> {donor.email}</p>
          <p><b>Blood Group:</b> {donor.blood_group}</p>
        </div>
      )}

      {/* DONATION ACTION */}
      {donor && (
        <div className="space-y-2">
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Units"
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
          />

          <button
            onClick={addDonation}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Add Donation (+1000 coins)
          </button>
        </div>
      )}
    </div>
  )
}