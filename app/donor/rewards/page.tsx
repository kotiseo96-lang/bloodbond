"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

import RewardList from "./_components/RewardList"
import RewardRequests from "./_components/RewardRequests"

export default function DonorRewardsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser()
    const uid = data.user?.id || null
    setUserId(uid)

    if (!uid) return

    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_id", uid)
      .maybeSingle()

    setBalance(wallet?.balance || 0)
    setLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const LOW_BALANCE = balance <= 1200

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Rewards Center
        </h1>

        {/* BALANCE */}
        <div
          className={`px-4 py-2 rounded-lg border ${
            LOW_BALANCE ? "bg-red-50 border-red-400" : "bg-gray-50"
          }`}
        >
          <p className="text-sm text-gray-500">Wallet Balance</p>

          <p
            className={`text-xl font-bold ${
              LOW_BALANCE ? "text-red-600" : "text-green-600"
            }`}
          >
            {loading ? "..." : balance} coins
          </p>

          {LOW_BALANCE && (
            <p className="text-xs text-red-500 font-medium">
              ⚠ Low Balance
            </p>
          )}
        </div>
      </div>

      {/* REWARDS */}
      <RewardList userId={userId} />

      {/* REQUESTS */}
      <RewardRequests userId={userId} />
    </div>
  )
}