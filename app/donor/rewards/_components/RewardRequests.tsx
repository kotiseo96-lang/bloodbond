"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

export default function RewardRequests({ userId }: { userId: string | null }) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    if (!userId) return

    setLoading(true)

    const { data, error } = await supabase
      .from("reward_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return

    fetchRequests()

    const channel = supabase
      .channel("reward-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reward_requests",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchRequests()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const getStatusStyle = (status: string) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700"
    if (status === "approved") return "bg-green-100 text-green-700"
    if (status === "rejected") return "bg-red-100 text-red-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">
        My Reward Requests
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        <div className="border rounded overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Reward</th>
                <th className="p-2 text-left">Coins</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Provider</th>
                <th className="p-2 text-left">Gift Code</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t">

                  {/* Reward */}
                  <td className="p-2 font-medium">
                    {r.reward_id?.slice(0, 6)}
                  </td>

                  {/* Coins */}
                  <td className="p-2">{r.coins_spent}</td>

                  

                  {/* Status */}
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </td>

                  {/* Provider (NEW) */}
                  <td className="p-2 font-semibold text-blue-600">
                    {r.provider || "—"}
                  </td>

                  {/* Gift Code */}
                  <td className="p-2 font-mono">
                    {r.status === "approved" ? r.gift_code : "—"}
                  </td>

                  {/* Date */}
                  <td className="p-2">
                    {new Date(r.created_at).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  )
}