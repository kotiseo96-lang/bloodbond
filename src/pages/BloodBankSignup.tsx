"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "@/lib/next-router-compat"
import { useAuth } from "@/src/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Loader2, MapPin, Clock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Modal } from "@/src/components/ui/modal"
import { z } from "zod"
import { useLocations } from "@/hooks/useLocations"

/* ---------------- VALIDATION ---------------- */

const bloodBankSignupSchema = z.object({
  bloodBankName: z.string().min(2, "Blood bank name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  zipCode: z.string().min(4, "ZIP code must be at least 4 characters"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  operatingHours: z.string().min(1, "Operating hours must be provided"),
  stateId: z.string().min(1, "Please select State"),
  cityId: z.string().min(1, "Please select City"),
})

/* ---------------- COMPONENT ---------------- */

const BloodBankSignup: React.FC = () => {
  const { signUp, user, role } = useAuth()
  const navigate = useNavigate()
  const { states, cities, areas, fetchCitiesByState, fetchAreasByCity } = useLocations()

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bloodBankName, setBloodBankName] = useState("")
  const [address, setAddress] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [phone, setPhone] = useState("")
  const [operatingHours, setOperatingHours] = useState("")

  const [stateId, setStateId] = useState("")
  const [cityId, setCityId] = useState("")
  const [areaId, setAreaId] = useState("")

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info",
  })

  useEffect(() => {
    if (user && role) navigate("/dashboard")
  }, [user, role, navigate])

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const validation = bloodBankSignupSchema.safeParse({
      email,
      password,
      bloodBankName,
      address,
      zipCode,
      phone,
      operatingHours,
      stateId,
      cityId,
    })

    if (!validation.success) {
      setModalState({
        isOpen: true,
        title: "Validation Error",
        message: validation.error.errors[0].message,
        type: "error",
      })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, bloodBankName, "blood_bank")
      if (error) throw error

      const {
        data: { user: newUser },
      } = await supabase.auth.getUser()

      if (!newUser) throw new Error("User not found")

      await supabase.from("user_roles").insert({
        user_id: newUser.id,
        role: "blood_bank",
      })

      await supabase.from("blood_banks").insert({
        user_id: newUser.id,
        name: bloodBankName,
        address,
        state_id: stateId,
        city_id: cityId,
        area_id: areaId || null,
        zip_code: zipCode,
        phone,
        email,
        operating_hours: operatingHours,
      })

      setModalState({
        isOpen: true,
        title: "Success",
        message: "Blood bank account created successfully",
        type: "success",
      })

      setTimeout(() => navigate("/dashboard"), 1200)
    } catch (err: any) {
      setModalState({
        isOpen: true,
        title: "Error",
        message: err.message || "Something went wrong",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* LOGO HEADER */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Droplet className="h-8 w-8 text-primary-foreground" />
          </div>
          <Link to="/">
          <div>
            <h1 className="text-3xl font-bold">Blood Bond</h1>
            <p className="text-sm text-muted-foreground">Blood Bank Registration</p>
          </div>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <Droplet className="mx-auto h-10 w-10 text-primary" />
            <CardTitle>Blood Bank Registration</CardTitle>
            <CardDescription>Create a blood bank account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label>Blood Bank Name</Label>
              <Input value={bloodBankName} onChange={(e) => setBloodBankName(e.target.value)} />

              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />

              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />

              <Label>State</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={stateId}
                onChange={(e) => {
                  setStateId(e.target.value)
                  setCityId("")
                  setAreaId("")
                  fetchCitiesByState(e.target.value)
                }}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <Label>City</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={cityId}
                disabled={!stateId}
                onChange={(e) => {
                  setCityId(e.target.value)
                  setAreaId("")
                  fetchAreasByCity(e.target.value)
                }}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <Label>Area</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={areaId}
                disabled={!cityId}
                onChange={(e) => setAreaId(e.target.value)}
              >
                <option value="">Select Area</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <Label>Zip Code</Label>
              <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />

              <Label>Operating Hours</Label>
              <Input value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => navigate("/auth")}>
                  Login here
                </Button>
              </p>
            </div>
      </div>

      <Modal {...modalState} onClose={() => setModalState({ ...modalState, isOpen: false })} />
    </div>
  )
}

export default BloodBankSignup
