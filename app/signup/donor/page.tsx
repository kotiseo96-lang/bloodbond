"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "@/lib/next-router-compat"
import { useAuth } from "@/src/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Modal } from "@/src/components/ui/modal"
import { z } from "zod"

/* ---------------- VALIDATION ---------------- */

const donorSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  city: z.string().min(1),
  area: z.string().min(1),
  blood_group: z.string().min(1),
  last_donation_date: z.string().min(1),
})

/* ---------------- COMPONENT ---------------- */

const DonorSignup: React.FC = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    area: "",
    blood_group: "",
    last_donation_date: "",
  })

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info",
  })

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validation = donorSignupSchema.safeParse(form)

      if (!validation.success) {
        throw new Error(validation.error.errors[0].message)
      }

      /* STEP 1: SIGNUP */
      const { error: signUpError } = await signUp(
        form.email,
        form.password,
        form.name,
        "donor"
      )

      if (signUpError) throw signUpError

      /* STEP 2: GET AUTH USER (FIXED) */
      const { data: authData, error: authError } =
        await supabase.auth.getUser()

      const user = authData?.user

      if (authError || !user) {
        throw new Error("User creation failed or session not ready")
      }

      /* STEP 3: ROLE */
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert(
          {
            user_id: user.id,
            role: "donor",
          },
          { onConflict: "user_id" }
        )

      if (roleError) throw roleError

      /* STEP 4: DONOR TABLE */
      const { error: donorError } = await signUp(
        form.email,
        form.password,
        form.name,
        "donor",
        {
          phone: form.phone,
          city: form.city,
          area: form.area,
          blood_group: form.blood_group,
          last_donation_date: form.last_donation_date
        }
      )

      if (donorError) throw donorError

      /* STEP 5: PROFILE */
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: form.email,
          full_name: form.name,
          phone: form.phone,
        },
        {
          onConflict: "id",
        }
      )

      if (profileError) throw profileError

      /* STEP 6: WALLET */
      const { error: walletError } = await supabase
        .from("user_wallets")
        .insert({
          user_id: user.id,
          balance: 0,
        })

      if (walletError) throw walletError

      setModal({
        isOpen: true,
        title: "Success",
        message: "Account created successfully",
        type: "success",
      })

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } catch (err: any) {
      setModal({
        isOpen: true,
        title: "Error",
        message: err.message,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">

        {/* HEADER */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
            <Droplet className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Blood Bond</h1>
            <p className="text-sm text-muted-foreground">
              Donor Registration
            </p>
          </div>
        </div>

        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Create Donor Account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">

              <Input placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Input placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Input type="password" placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <Input placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <Input placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <Input placeholder="Area"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />

              <Input placeholder="Blood Group"
                value={form.blood_group}
                onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
              />

              <Input type="date"
                value={form.last_donation_date}
                onChange={(e) =>
                  setForm({ ...form, last_donation_date: e.target.value })
                }
              />

              <Button className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Donor Account"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* MODAL */}
        <Modal
          {...modal}
          onClose={() => setModal({ ...modal, isOpen: false })}
        />

      </div>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Already a Donor?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/auth")}>
            Go to login
          </Button>
        </p>
      </div>
    </div>
  )
}

export default DonorSignup