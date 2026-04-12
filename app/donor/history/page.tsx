"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

export default function DonorHistoryPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data: donor } = await supabase
      .from("donors")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!donor) {
      setDonations([])
      setLoading(false)
      return
    }

    // ✅ donations
    const { data: donationsData, error: donationsError } = await supabase
      .from("donations")
      .select("id, donated_at")
      .eq("donor_id", donor.id)
      .order("donated_at", { ascending: false })

    // ✅ coins
    const { data: coinsData, error: coinsError } = await supabase
      .from("coin_transactions")
      .select("coins, created_at")
      .eq("donor_id", donor.id)
      .order("created_at", { ascending: false })

    if (donationsError || coinsError) {
      console.error(donationsError || coinsError)
      setDonations([])
      setLoading(false)
      return
    }

    // ✅ merge (no balance now)
    const merged = (donationsData || []).map((d: any, index: number) => {
      const coin = coinsData?.[index]

      return {
        id: d.id,
        donated_at: d.donated_at,
        coins_added: coin?.coins || 0,
      }
    })

    setDonations(merged)
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
      <div className="max-w-3xl space-y-6">

        <h1 className="text-2xl font-bold">
          My Donation History
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : donations.length === 0 ? (
          <p>No donations yet</p>
        ) : (
          <table className="w-full border rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">S No</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Coins Added</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((d, index) => (
                <tr key={d.id} className="border-t">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    {new Date(d.donated_at).toLocaleString()}
                  </td>
                  <td className="p-2">{d.coins_added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
  )
}