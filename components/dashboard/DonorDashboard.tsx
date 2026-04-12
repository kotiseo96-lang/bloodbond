"use client"

import React from "react"
import { supabase } from "@/src/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Gift, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

const DonorDashboard: React.FC = () => {
  const router = useRouter()

  const [coins, setCoins] = React.useState<number>(0)
  const [pending, setPending] = React.useState<number>(0)
  const [redeemed, setRedeemed] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)

  const fetchData = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    // 1. Wallet coins
    const { data: wallet, error: walletError } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!walletError && wallet) {
      setCoins(wallet.balance || 0)
    }

    // 2. Pending rewards
    const { data: pendingData } = await supabase
      .from("reward_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")

    setPending(pendingData?.length || 0)

    // 3. Redeemed (IMPORTANT FIX: use approved OR completed safely)
    const { data: redeemedData } = await supabase
      .from("reward_requests")
      .select("id")
      .eq("user_id", user.id)
      .in("status", ["approved", "completed"])

    setRedeemed(redeemedData?.length || 0)

    setLoading(false)
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center">
          <Droplet className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Donor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track donations, rewards & coins
          </p>
        </div>
      </div>

      {/* COINS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Total Coins
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {loading ? "..." : coins}
            </p>
            <p className="text-sm text-muted-foreground">
              Earned from donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Rewards</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {loading ? "..." : pending}
            </p>
            <p className="text-sm text-muted-foreground">
              Waiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redeemed</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {loading ? "..." : redeemed}
            </p>
            <p className="text-sm text-muted-foreground">
              Gift cards received
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ACTION SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Donor Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Manage your profile and redeem rewards
          </p>

          <div className="flex gap-3 flex-wrap">

            <Button
              variant="outline"
              onClick={() => router.push("/donor/rewards")}
            >
              Request Rewards
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/donor/history")}
            >
              View History
            </Button>

          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default DonorDashboard