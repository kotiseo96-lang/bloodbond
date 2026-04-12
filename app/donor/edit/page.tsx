"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"

const DonorEditPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [userId, setUserId] = useState<string>("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [form, setForm] = useState({
        name: "",
        phone: "",
        city: "",
        area: "",
        blood_group: "",
        last_donation_date: "",
    })

    const router = useRouter()

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        const loadData = async () => {
            setFetching(true)
    
            try {
                const { data: { user } } = await supabase.auth.getUser()
    
                if (!user) return
    
                setUserId(user.id)
    
                // 1. PROFILE (safe)
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("id, full_name, phone")
                    .eq("id", user.id)
                    .maybeSingle()
    
                // 2. DONOR (IMPORTANT FIX)
                const { data: donor, error: donorError } = await supabase
                    .from("donors")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle()
    
                if (donorError) {
                    console.log("Donor error:", donorError)
                }
    
                // 3. SAFE FORM SET
                setForm({
                    name: profile?.full_name ?? donor?.name ?? "",
                    phone: profile?.phone ?? donor?.phone ?? "",
                    city: donor?.city ?? "",
                    area: donor?.area ?? "",
                    blood_group: donor?.blood_group ?? "",
                    last_donation_date: donor?.last_donation_date ?? "",
                })
    
            } catch (err) {
                console.error("Fetch error:", err)
            } finally {
                setFetching(false)
            }
        }
    
        loadData()
    }, [])

    /* ---------------- UPDATE ---------------- */

    const handleUpdate = async () => {
        setLoading(true)

        try {
            // PROFILE UPDATE
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    full_name: form.name,
                    phone: form.phone,
                })
                .eq("id", userId)

            if (profileError) throw profileError

            // DONOR UPDATE
            const { error: donorError } = await supabase
                .from("donors")
                .update({
                    city: form.city,
                    area: form.area,
                    blood_group: form.blood_group,
                    last_donation_date: form.last_donation_date,
                })
                .eq("user_id", userId)

            if (donorError) throw donorError

            // PASSWORD UPDATE (OPTIONAL)
            if (currentPassword && newPassword) {
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                if (!user?.email) throw new Error("User not found")

                const { error: loginError } =
                    await supabase.auth.signInWithPassword({
                        email: user.email,
                        password: currentPassword,
                    })

                if (loginError)
                    throw new Error("Current password is incorrect")

                const { error: passError } =
                    await supabase.auth.updateUser({
                        password: newPassword,
                    })

                if (passError) throw passError
            }

            alert("Profile updated successfully")

            setCurrentPassword("")
            setNewPassword("")
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    /* ---------------- UI ---------------- */

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-2xl space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle>Edit Donor Profile</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">

                    <Input
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />

                    <Input
                        placeholder="City"
                        value={form.city}
                        onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Area"
                        value={form.area}
                        onChange={(e) =>
                            setForm({ ...form, area: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Blood Group"
                        value={form.blood_group}
                        onChange={(e) =>
                            setForm({ ...form, blood_group: e.target.value })
                        }
                    />

                    <Input
                        type="date"
                        value={form.last_donation_date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                last_donation_date: e.target.value,
                            })
                        }
                    />

                    {/* PASSWORD SECTION (OPTIONAL) */}
                    <div className="pt-4 border-t space-y-3">

                        <Input
                            type="password"
                            placeholder="Current Password (optional)"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                        />

                        <Input
                            type="password"
                            placeholder="New Password (optional)"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />

                        <p className="text-xs text-muted-foreground">
                            Leave empty if you don’t want to change password
                        </p>

                    </div>

                    <div className="flex gap-10">

                        <Button
                            className="w-full"
                            disabled={loading}
                            onClick={handleUpdate}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Update Profile"
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push("/dashboard")}
                        >
                            Go to Dashboard
                        </Button>

                    </div>

                </CardContent>
                
            </Card>



        </div>
    )
}

export default DonorEditPage