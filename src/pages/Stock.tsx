"use client"

import type React from "react"
import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/src/contexts/AuthContext"
import { useBloodStock } from "@/hooks/useBloodStock"
import { useBloodBanks } from "@/hooks/useBloodBanks"
import { BloodGroupCard } from "@/components/blood/BloodGroupCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BLOOD_GROUPS, type BloodGroup } from "@/types/database"
import { Filter } from "lucide-react"

const Stock: React.FC = () => {
  const { role } = useAuth()
  const { myBloodBank, bloodBanks } = useBloodBanks()
  const { stock, updateStock } = useBloodStock(role === "blood_bank" ? myBloodBank?.id : undefined)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | null>(null)
  const [newUnits, setNewUnits] = useState("")
  const [filterCity, setFilterCity] = useState("all")
  const [filterBloodGroup, setFilterBloodGroup] = useState("all")

  if (role === "hospital") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Hospitals cannot view blood bank inventory</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!role || role === "guest") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to view blood stock</p>
        </div>
      </DashboardLayout>
    )
  }

  const cities = [...new Set(bloodBanks.map((b) => b.city))]

  /** ADMIN: group stock by blood bank */
  const stockByBank = bloodBanks.map((bank) => {
    const bankStock = stock.filter((s) => s.blood_bank_id === bank.id)

    return {
      bank,
      stock: BLOOD_GROUPS.map((group) => {
        const found = bankStock.find((s) => s.blood_group === group)
        return {
          bloodGroup: group,
          units: found?.units_available || 0,
        }
      }),
    }
  })

  const filteredStockByBank = stockByBank.filter(({ bank }) => filterCity === "all" || bank.city === filterCity)

  /** BLOOD BANK view */
  const getStockForGroup = (group: BloodGroup) => {
    const found = stock.find((s) => s.blood_group === group)
    return found?.units_available || 0
  }

  const handleEditStock = (group: BloodGroup) => {
    setSelectedBloodGroup(group)
    setNewUnits(getStockForGroup(group).toString())
    setEditDialogOpen(true)
  }

  const handleSaveStock = async () => {
    if (!myBloodBank || !selectedBloodGroup) return
    const units = Number.parseInt(newUnits, 10)
    if (isNaN(units) || units < 0) return

    await updateStock(myBloodBank.id, selectedBloodGroup, units)
    setEditDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold">Blood Stock</h1>
          <p className="text-muted-foreground mt-1">
            {role === "admin" ? "View blood stock across all blood banks" : "Manage your blood bank inventory"}
          </p>
        </div>

        {/* ================= ADMIN VIEW ================= */}
        {role === "admin" && (
          <>
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex gap-4">
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-64">Blood Bank</TableHead>
                    {BLOOD_GROUPS.map((group) => (
                      <TableHead key={group} className="text-center">
                        {group}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStockByBank.length > 0 ? (
                    filteredStockByBank.map(({ bank, stock }) => (
                      <TableRow key={bank.id}>
                        <TableCell>
                          <p className="font-medium">{bank.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {bank.city} • {bank.phone}
                          </p>
                        </TableCell>

                        {stock
                          .filter((s) => filterBloodGroup === "all" || s.bloodGroup === filterBloodGroup)
                          .map(({ bloodGroup, units }) => (
                            <TableCell key={bloodGroup} className="text-center font-medium">
                              {units}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={BLOOD_GROUPS.length + 1} className="text-center py-10 text-muted-foreground">
                        No blood banks found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </>
        )}

        {/* ================= BLOOD BANK VIEW ================= */}
        {role === "blood_bank" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BLOOD_GROUPS.map((group) => (
              <BloodGroupCard
                key={group}
                bloodGroup={group}
                units={getStockForGroup(group)}
                showEdit
                onEdit={() => handleEditStock(group)}
              />
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update {selectedBloodGroup} Stock</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Available Units</Label>
                <Input type="number" min="0" value={newUnits} onChange={(e) => setNewUnits(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStock}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default Stock
