"use client"

import type React from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useBloodBanks } from "@/hooks/useBloodBanks"
import { useBloodStock } from "@/hooks/useBloodStock"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Phone, MapPin, Mail, CheckCircle, XCircle, Lock } from "lucide-react"
import { format } from "date-fns"

const BloodBanks: React.FC = () => {
  const { role } = useAuth()
  const { bloodBanks, isLoading } = useBloodBanks()
  const { stock } = useBloodStock()

  if (role === "hospital") {
    return (
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Blood Availability by Area</h1>
            <p className="text-muted-foreground mt-1">Available blood units across different regions</p>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area / City</TableHead>
                  <TableHead>Total Units Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodBanks.length > 0 ? (
                  bloodBanks.map((bank) => {
                    const totalStock = stock
                      .filter((s) => s.blood_bank_id === bank.id)
                      .reduce((sum, s) => sum + s.units_available, 0)

                    return (
                      <TableRow key={bank.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{bank.city}</p>
                            <p className="text-sm text-muted-foreground">{bank.state || "Region"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{totalStock} units</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-12">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No blood banks registered yet</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
    )
  }

  if (role !== "admin") {
    return (
        <div className="flex flex-col items-center justify-center py-12">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to view this page</p>
        </div>
    )
  }

  const getTotalStock = (bankId: string) => {
    return stock.filter((s) => s.blood_bank_id === bankId).reduce((sum, s) => sum + s.units_available, 0)
  }

  return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Blood Banks</h1>
          <p className="text-muted-foreground mt-1">Manage all registered blood banks</p>
        </div>

        {/* Blood Banks Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Bank</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bloodBanks.length > 0 ? (
                bloodBanks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{bank.name}</p>
                          <p className="text-sm text-muted-foreground">{bank.address}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {bank.city}
                        {bank.state ? `, ${bank.state}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {bank.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {bank.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getTotalStock(bank.id)} units</Badge>
                    </TableCell>
                    <TableCell>
                      {bank.is_active ? (
                        <Badge className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(bank.created_at), "PP")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No blood banks registered yet</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
  )
}

export default BloodBanks
