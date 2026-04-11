"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/next-router-compat"
import DashboardLayout from "@/components/layout/DashboardLayout"
import BloodBankMap from "@/components/map/BloodBankMap"
import { useBloodBanks } from "@/hooks/useBloodBanks"
import { useBloodStock } from "@/hooks/useBloodStock"
import { useHospitals } from "@/hooks/useHospitals"
import { useAuth } from "@/src/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Modal } from "@/src/components/ui/modal"
import { BLOOD_GROUPS, type BloodGroup, type BloodBank, type UrgencyLevel, URGENCY_LABELS } from "@/types/database"
import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { uploadToCloudinary } from "@/utils/cloudinary"

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const defaultUrgency = (searchParams.get("urgency") as UrgencyLevel) || "routine"

  const { bloodBanks } = useBloodBanks()
  const { stock } = useBloodStock()
  const { myHospital } = useHospitals()
  const { user, role } = useAuth()

  const isGuest = !user || role === "guest"
  const isHospital = !isGuest && role === "hospital"

  console.log("[v0] Blood banks loaded:", bloodBanks.length, "Stock items:", stock.length)
  console.log("[v0] Is guest:", isGuest, "User:", user?.id)

  const [filterCity, setFilterCity] = useState("all")
  const [filterBloodGroup, setFilterBloodGroup] = useState("all")

  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null)
  const [orderBloodGroup, setOrderBloodGroup] = useState<BloodGroup>("O+")
  const [orderUnits, setOrderUnits] = useState("1")
  const [orderUrgency, setOrderUrgency] = useState<UrgencyLevel>(defaultUrgency)
  const [orderNotes, setOrderNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [guestError, setGuestError] = useState<string | null>(null)

  const [guestId, setGuestId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")

  const [patientName, setPatientName] = useState("")
  const [patientAge, setPatientAge] = useState<number | "">("")
  const [patientGender, setPatientGender] = useState("")

  const [doctorName, setDoctorName] = useState("")
  const [doctorRegNo, setDoctorRegNo] = useState("")

  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: "success" | "error" | "warning" | "info"
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  })

  const cities = [...new Set(bloodBanks.map((b) => b.city))]

  const getStockForBank = (bankId: string, bloodGroup?: string) => {
    const bankStock = stock.filter((s) => s.blood_bank_id === bankId)
    if (bloodGroup && bloodGroup !== "all") {
      return bankStock.filter((s) => s.blood_group === bloodGroup)
    }
    return bankStock
  }

  const getTotalUnits = (bankId: string) => getStockForBank(bankId).reduce((sum, s) => sum + s.units_available, 0)

  const getAvailableUnits = (bloodGroup: BloodGroup) => {
    if (!selectedBank) return 0
    return stock.find((s) => s.blood_bank_id === selectedBank.id && s.blood_group === bloodGroup)?.units_available || 0
  }

  const filteredBanks = bloodBanks.filter((bank) => {
    if (filterCity !== "all" && bank.city !== filterCity) return false
    if (filterBloodGroup !== "all") {
      const total = getStockForBank(bank.id, filterBloodGroup).reduce((s, x) => s + x.units_available, 0)
      if (total <= 0) return false
    }
    return true
  })

  console.log("[v0] Filtered banks:", filteredBanks.length)

  const handleSelectBank = (bank: BloodBank) => {
    setSelectedBank(bank)
    setStep(isGuest ? 1 : 2)
    setOrderDialogOpen(true)
  }

  const handlePlaceOrder = async () => {
    if (!patientName || !patientAge || !patientGender || !doctorName || !doctorRegNo || !prescriptionFile) {
      setModalState({
        isOpen: true,
        title: "Missing Information",
        message: "Patient details, doctor details and prescription are required",
        type: "error",
      })
      return
    }

    if (!selectedBank) return

    if (isGuest) {
      if (!guestName.trim() || !guestPhone.trim()) {
        setGuestError("Name and phone number are required")
        return
      }
    }
    setGuestError(null)
    setIsSubmitting(true)

    try {
      let prescriptionImageUrl: string | null = null

      if (prescriptionFile) {
        prescriptionImageUrl = await uploadToCloudinary(prescriptionFile)
      }
      let currentGuestId = guestId

      if (isGuest && !currentGuestId) {
        const { data: guest, error } = await supabase
          .from("guests")
          .insert({
            name: guestName.trim(),
            phone: guestPhone.trim(),
          })
          .select()
          .single()

        if (error) throw error

        currentGuestId = guest.id
        setGuestId(guest.id)
      }

      const payload: any = {
        blood_bank_id: selectedBank.id,
        blood_group: orderBloodGroup,
        units_requested: Number.parseInt(orderUnits, 10),
        urgency: orderUrgency,
        notes: orderNotes || null,

        patient_name: patientName || null,
        patient_age: patientAge || null,
        patient_gender: patientGender || null,

        doctor_name: doctorName || null,
        doctor_registration_number: doctorRegNo || null,

        prescription_image_url: prescriptionImageUrl,
      }

      if (isGuest) {
        payload.guest_id = currentGuestId
      } else if (isHospital) {
        payload.hospital_id = myHospital!.id
      }

      const { error } = await supabase.from("orders").insert(payload)
      if (error) throw error

      setModalState({
        isOpen: true,
        title: "Success",
        message: "Order placed successfully!",
        type: "success",
        onConfirm: () => {
          setOrderDialogOpen(false)
          setOrderUnits("1")
          setOrderNotes("")
          setPatientName("")
          setPatientAge("")
          setPatientGender("")
          setDoctorName("")
          setDoctorRegNo("")
          setPrescriptionFile(null)
          setStep(1)

          if (isGuest) {
            navigate("/")
          } else if (isHospital) {
            navigate("/orders")
          }
        },
      })
    } catch (err: any) {
      console.error("ORDER ERROR:", err)
      setModalState({
        isOpen: true,
        title: "Error",
        message: err.message || "Failed to place order",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableUnits = getAvailableUnits(orderBloodGroup)
  const requestedUnits = Number(orderUnits)

  const isOrderInvalid = availableUnits === 0 || requestedUnits < 1 || requestedUnits > availableUnits

  return (
    <DashboardLayout hideNavigation={isGuest}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Search Blood Availability</h1>

        <Card className="p-4 flex gap-4">
          <Filter />
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <BloodBankMap bloodBanks={filteredBanks} bloodStock={stock} onSelectBloodBank={handleSelectBank} />
        <div>
          <h2 className="font-heading text-xl font-semibold mb-4">Available Blood Banks ({filteredBanks.length})</h2>

          {filteredBanks.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No blood banks available for selected filters. Try adjusting your search criteria.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBanks.map((bank) => (
                <Card key={bank.id} className="p-5">
                  <h3 className="font-semibold">{bank.name}</h3>
                  <p className="text-sm text-muted-foreground">{bank.city}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {getStockForBank(bank.id).map((s) => (
                      <Badge key={s.id} variant={s.units_available > 0 ? "default" : "secondary"}>
                        {s.blood_group}: {s.units_available}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm">Total: {getTotalUnits(bank.id)} units</span>
                    <Button size="sm" disabled={getTotalUnits(bank.id) === 0} onClick={() => handleSelectBank(bank)}>
                      Order
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Blood Order</DialogTitle>
            </DialogHeader>

            {/* STEP 1 – Guest */}
            {step === 1 && isGuest && (
              <div className="space-y-3">
                <Label>Name *</Label>
                <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} />

                <Label>Phone *</Label>
                <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />

                {guestError && <p className="text-sm text-red-500">{guestError}</p>}

                <Button
                  className="w-full"
                  onClick={() => {
                    if (!guestName.trim() || !guestPhone.trim()) {
                      setGuestError("Name and phone are required")
                      return
                    }
                    setGuestError(null)
                    setStep(2)
                  }}
                >
                  Next
                </Button>
              </div>
            )}

            {/* STEP 2 – Patient + Doctor */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Patient Details</h3>

                <Input
                  placeholder="Patient Name *"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />

                <Input
                  type="number"
                  placeholder="Patient Age *"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : "")}
                />

                <Select value={patientGender} onValueChange={setPatientGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <h3 className="font-semibold text-sm">Doctor Details</h3>

                <Input placeholder="Doctor Name *" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />

                <Input
                  placeholder="Doctor Registration Number *"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                />

                <div className="space-y-2">
                  <Label>Prescription Image *</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPrescriptionFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  {stepError && <p className="text-sm text-red-500">{stepError}</p>}
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (
                        !patientName.trim() ||
                        !patientAge ||
                        !patientGender ||
                        !doctorName.trim() ||
                        !doctorRegNo.trim() ||
                        !prescriptionFile
                      ) {
                        setStepError("All patient and doctor details, plus prescription are required")
                        return
                      }

                      setStepError(null)
                      setStep(3)
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 – Order */}
            {step === 3 && (
              <div className="space-y-3">
                <Label>Blood Group *</Label>
                <Select value={orderBloodGroup} onValueChange={(v) => setOrderBloodGroup(v as BloodGroup)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g} ({getAvailableUnits(g)} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Units *</Label>
                <Input
                  type="number"
                  min={1}
                  max={availableUnits}
                  disabled={availableUnits === 0}
                  value={orderUnits}
                  onChange={(e) => setOrderUnits(e.target.value)}
                />

                {availableUnits === 0 && (
                  <p className="text-sm text-red-500">No units available for this blood group</p>
                )}

                {requestedUnits > availableUnits && (
                  <p className="text-sm text-red-500">Requested units exceed available stock</p>
                )}

                <Label>Urgency *</Label>
                <Select value={orderUrgency} onValueChange={(v) => setOrderUrgency(v as UrgencyLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(URGENCY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Notes</Label>
                <Textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handlePlaceOrder} disabled={isSubmitting || isOrderInvalid}>
                    {isSubmitting ? "Placing Order…" : "Place Order"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Modal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
          onConfirm={modalState.onConfirm}
          confirmText="OK"
        />
      </div>
    </DashboardLayout>
  )
}

export default Search
