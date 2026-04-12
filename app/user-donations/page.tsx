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

    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .ilike("email", email)
      .maybeSingle()

    if (error || !data) {
      alert("Donor not found")
      setDonor(null)
    } else {
      setDonor(data)
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

    try {
      // 1. Insert donation
      const { error: donationError } = await supabase.from("donations").insert([
        {
          donor_id: donor.id,
          blood_bank_id: BLOOD_BANK_ID,
          units: units || 1,
        },
      ])

      if (donationError) {
        console.error(donationError)
        alert("Donation insert failed")
        return
      }

      // 2. Add coins (NEW SYSTEM - donor based)
      const { error: coinError } = await supabase.from("coin_transactions").insert([
        {
          donor_id: donor.id,
          type: "credit",
          coins: 1000,
          note: "Donation reward",
        },
      ])

      if (coinError) {
        console.error(coinError)
        alert("Coins update failed (donation still saved)")
      }

      alert("Donation added successfully")
      setUnits(1)
    } catch (err) {
      console.error(err)
      alert("Unexpected error")
    }

    setLoading(false)
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