"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Gift, Coins } from "lucide-react"

const DonorDashboard: React.FC = () => {
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
            <p className="text-3xl font-bold">0</p>
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
            Redeem Rewards
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Convert your coins into gift coupons
          </p>

          <div className="flex gap-3">
            <Button>Request Redemption</Button>
            <Button variant="outline">View History</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default DonorDashboard