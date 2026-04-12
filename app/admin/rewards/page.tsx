"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

export default function AdminRewardsPage() {
  const [title, setTitle] = useState("")
  const [coins, setCoins] = useState(0)
  const [stock, setStock] = useState(0)

  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // ✅ FETCH LIST
  const fetchRewards = async () => {
    const { data, error } = await supabase
      .from("reward_catalog")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setRewards([])
    } else {
      setRewards(data || [])
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  // ✅ CREATE REWARD
  const createReward = async () => {
    if (!title || coins <= 0) {
      alert("Enter valid details")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("reward_catalog")
      .insert({
        title,
        coins_required: coins,
        stock,
      })

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Failed to create reward")
      return
    }

    alert("Reward created")

    // reset form
    setTitle("")
    setCoins(0)
    setStock(0)

    // 🔁 refresh list instantly
    fetchRewards()
  }

  return (
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ✅ CREATE SECTION */}
        <div className="space-y-4 border p-4 rounded bg-gray-50">
          <h1 className="text-xl font-bold">Create Reward</h1>

          <input
            className="border p-2 rounded w-full"
            placeholder="Reward Title (Amazon ₹200)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Coins Required"
            value={coins}
            onChange={(e) => setCoins(Number(e.target.value))}
          />

          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />

          <button
            onClick={createReward}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Creating..." : "Create Reward"}
          </button>
        </div>

        {/* ✅ LIST SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Rewards List</h2>

          {rewards.length === 0 ? (
            <p>No rewards created yet</p>
          ) : (
            <table className="w-full border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">S No</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Coins Required</th>
                  <th className="p-2 text-left">Stock</th>
                </tr>
              </thead>

              <tbody>
                {rewards.map((r, index) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.coins_required}</td>
                    <td className="p-2">{r.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
  )
}