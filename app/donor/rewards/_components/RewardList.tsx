"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

export default function RewardList({ userId }: { userId: string | null }) {
  const [rewards, setRewards] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  // ---------------- FETCH REWARDS ----------------
  const fetchRewards = async () => {
    const { data } = await supabase
      .from("reward_catalog")
      .select("*")
      .order("created_at", { ascending: false })

    setRewards(data || [])
  }

  // ---------------- FETCH BALANCE ----------------
  const fetchBalance = async () => {
    if (!userId) return

    const { data } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle()

    setBalance(data?.balance || 0)
  }

  // ---------------- REQUEST REWARD (FIXED) ----------------
  const requestReward = async (reward: any) => {
    if (!userId) return

    setLoading(true)

    const { error } = await supabase.rpc("request_reward", {
      p_user_id: userId,
      p_reward_id: reward.id,
      p_coins: reward.coins_required,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    alert("Reward requested successfully 🎉")

    // refresh balance immediately
    await fetchBalance()

    setLoading(false)
  }

  // ---------------- INIT ----------------
  useEffect(() => {
    fetchRewards()
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [userId])

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">
        Available Rewards
      </h2>

      {/* BALANCE DISPLAY */}
      <div className="p-3 border rounded bg-gray-50">
        <p className="text-sm text-muted-foreground">
          Wallet Balance
        </p>
        <p className="text-xl font-bold text-green-600">
          {balance} coins
        </p>
      </div>

      {/* REWARDS */}
      {rewards.length === 0 ? (
        <p>No rewards available</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rewards.map((r) => {
            const disabled = balance < r.coins_required || loading

            return (
              <div key={r.id} className="border p-4 rounded space-y-2">

                <h3 className="font-semibold">{r.title}</h3>

                <p>Coins Required: {r.coins_required}</p>
                <p>Stock: {r.stock}</p>

                <button
                  onClick={() => requestReward(r)}
                  disabled={disabled}
                  className={`px-3 py-1 rounded text-white ${
                    disabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600"
                  }`}
                >
                  {disabled ? "Cannot Request" : "Request"}
                </button>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}