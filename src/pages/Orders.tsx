"use client"

import type React from "react"
import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/src/contexts/AuthContext"
import { useOrders } from "@/hooks/useOrders"
import { useBloodBanks } from "@/hooks/useBloodBanks"
import { useHospitals } from "@/hooks/useHospitals"
import { OrderCard } from "@/components/orders/OrderCard"
import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Filter } from "lucide-react"
import { ORDER_STATUS_LABELS } from "@/types/database"

const Orders: React.FC = () => {
  const { role } = useAuth()
  const { myBloodBank } = useBloodBanks()
  const { myHospital } = useHospitals()

  const { orders, updateOrderStatus, cancelOrder } = useOrders({
    bloodBankId: role === "blood_bank" ? myBloodBank?.id : undefined,
    hospitalId: role === "hospital" ? myHospital?.id : undefined,
  })

  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("active")

  const getPerspective = () => {
    if (role === "blood_bank") return "blood_bank"
    if (role === "hospital") return "hospital"
    return "admin"
  }

  const canUpdateStatus = role === "admin"

  const visibleOrders = orders

  const activeOrders = visibleOrders.filter((o) => !["delivered", "cancelled"].includes(o.status))

  const completedOrders = visibleOrders.filter((o) => ["delivered", "cancelled"].includes(o.status))

  const filteredActiveOrders = activeOrders.filter((o) => filterStatus === "all" || o.status === filterStatus)

  const filteredCompletedOrders = completedOrders.filter((o) => filterStatus === "all" || o.status === filterStatus)

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to view orders</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">
            {role === "hospital"
              ? "Track your blood orders"
              : role === "blood_bank"
                ? "Manage orders for your blood bank"
                : "Manage all blood orders"}
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          {/* ACTIVE ORDERS (Cards) */}
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredActiveOrders.length > 0 ? (
                filteredActiveOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    perspective={getPerspective()}
                    showActions={canUpdateStatus}
                    onStatusChange={updateOrderStatus}
                    onCancel={cancelOrder}
                  />
                ))
              ) : (
                <Card className="col-span-2 p-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active orders</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* COMPLETED ORDERS (Table) */}
          <TabsContent value="completed" className="mt-6">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    {role === "admin" && <TableHead>Hospital</TableHead>}
                    {role === "admin" && <TableHead>Blood Bank</TableHead>}
                    <TableHead>Group</TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCompletedOrders.length > 0 ? (
                    filteredCompletedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(0, 6)}</TableCell>
                        {role === "admin" && (
                          <TableCell>
                            {order.hospital?.name ? order.hospital.name : `Guest - ${order.guest?.name}`}
                          </TableCell>
                        )}
                        {role === "admin" && <TableCell>{order.blood_banks?.name || "—"}</TableCell>}
                        <TableCell>{order.blood_group}</TableCell>
                        <TableCell className="text-center">{order.units_requested}</TableCell>
                        <TableCell>{ORDER_STATUS_LABELS[order.status]}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={role === "admin" ? 7 : 6} className="text-center py-10 text-muted-foreground">
                        No completed orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default Orders
