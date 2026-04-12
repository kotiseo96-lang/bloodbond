"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UsersIcon, Mail, Shield, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import type { Profile, UserRole } from "@/types/database"

interface UserWithRole extends Profile {
  role?: UserRole["role"]
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })

        if (profilesError) throw profilesError

        const { data: roles, error: rolesError } = await supabase.from("user_roles").select("*")

        if (rolesError) throw rolesError

        // ✅ FIXED MATCHING KEY
        const usersWithRoles = profiles?.map((profile) => {
          const userRole = roles?.find((r) => r.user_id === profile.id)
          return {
            ...profile,
            role: userRole?.role,
          }
        })

        setUsers(usersWithRoles || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/10 text-primary border-primary/20"
      case "blood_bank":
        return "bg-warning/10 text-warning border-warning/20"
      case "hospital":
        return "bg-info/10 text-info border-info/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "blood_bank":
        return "Blood Bank"
      case "hospital":
        return "Hospital"
      default:
        return "No Role"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage all registered users and view their assigned roles</p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Users</label>
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="blood_bank">Blood Bank</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            {user.full_name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.full_name || "No Name"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.phone || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(user.created_at), "PP")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Users</p>
            <p className="text-2xl font-bold mt-2">{users.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">Admins</p>
            <p className="text-2xl font-bold mt-2">{users.filter((u) => u.role === "admin").length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">Blood Banks</p>
            <p className="text-2xl font-bold mt-2">{users.filter((u) => u.role === "blood_bank").length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">Hospitals</p>
            <p className="text-2xl font-bold mt-2">{users.filter((u) => u.role === "hospital").length}</p>
          </Card>
        </div>
      </div>
  )
}

export default Users
