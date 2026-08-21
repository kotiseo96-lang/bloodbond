"use client"

import React, { useState } from "react"
import { useOrders } from "@/hooks/useOrders"
import { useBloodBanks } from "@/hooks/useBloodBanks"
import { useBloodStock } from "@/hooks/useBloodStock"
import { OrderCard } from "@/components/orders/OrderCard"
import { ORDER_STATUS_LABELS } from "@/types/database"
import type { Order, OrderStatus } from "@/types/database"

const nextStatus = (status: OrderStatus): OrderStatus | null => {
  switch (status) {
    case "pending":
      return "approved"
    case "approved":
      return "ready"
    case "ready":
      return "dispatched"
    case "dispatched":
      return "delivered"
    default:
      return null
  }
}

export default function AdminOrdersPage() {
  const { orders, isLoading, updateOrderStatus, allocateOrder } = useOrders()
  const { bloodBanks } = useBloodBanks()
  const { stock } = useBloodStock()

  const [selectedBank, setSelectedBank] = useState<Record<string, string>>({})

  // Banks that currently hold enough stock of the requested group.
  const eligibleBanks = (order: Order) =>
    bloodBanks.filter((b) =>
      stock.some(
        (s) =>
          s.blood_bank_id === b.id &&
          s.blood_group === order.blood_group &&
          s.units_available >= order.units_requested,
      ),
    )

  // Unallocated orders first, then newest.
  const sorted = [...orders].sort((a, b) => {
    const aAllocated = a.blood_bank_id ? 1 : 0
    const bAllocated = b.blood_bank_id ? 1 : 0
    if (aAllocated !== bAllocated) return aAllocated - bAllocated
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading orders…</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Allocate Orders</h1>
        <p className="text-muted-foreground mt-1">
          Assign a blood bank to each request, then drive it through delivery.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((order) => {
            const allocated = Boolean(order.blood_bank_id)
            const banks = eligibleBanks(order)
            const advance = nextStatus(order.status)

            return (
              <div key={order.id} className="space-y-3">
                <OrderCard order={order} perspective="admin" />

                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  {!allocated ? (
                    <>
                      <p className="text-sm font-medium">Allocate a blood bank</p>
                      <select
                        value={selectedBank[order.id] ?? ""}
                        onChange={(e) =>
                          setSelectedBank((prev) => ({ ...prev, [order.id]: e.target.value }))
                        }
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">
                          {banks.length
                            ? "Select a blood bank with stock"
                            : "No blood bank has matching stock"}
                        </option>
                        {banks.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} — {b.city}
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={!selectedBank[order.id]}
                        onClick={() => allocateOrder(order.id, selectedBank[order.id])}
                        className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                      >
                        Allocate
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Allocated to{" "}
                        <span className="font-medium text-foreground">
                          {order.blood_banks?.name ?? "a blood bank"}
                        </span>
                      </p>
                      {order.status !== "delivered" &&
                        order.status !== "cancelled" &&
                        advance && (
                          <button
                            onClick={() => updateOrderStatus(order.id, advance)}
                            className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            Mark as {ORDER_STATUS_LABELS[advance]}
                          </button>
                        )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}