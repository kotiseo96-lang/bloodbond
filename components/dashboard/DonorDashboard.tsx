"use client"

import React from "react"
import { supabase } from "@/src/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Gift, Coins } from "lucide-react"

const DonorDashboard: React.FC = () => {
  const [coins, setCoins] = React.useState<number>(0)
const [loading, setLoading] = React.useState(true)


const fetchWallet = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  console.log("AUTH USER:", user)

  const { data, error } = await supabase
    .from("user_wallets")
    .select("*")
    .eq("user_id", user?.id)

  console.log("WALLET DATA:", data)
  console.log("WALLET ERROR:", error)

  if (data && data.length > 0) {
    setCoins(data[0].balance ?? 0)
  } else {
    setCoins(0)
  }

  setLoading(false)
}

React.useEffect(() => {
  fetchWallet()
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
            <p className="text-3xl font-bold">0</p>
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
            <p className="text-3xl font-bold">0</p>
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

      <Button variant="outline">
        Request Redemption
      </Button>

      <Button variant="outline">
        View History
      </Button>
    </div>
  </CardContent>
</Card>

    </div>
  )
}

export default DonorDashboard