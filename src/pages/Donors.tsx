"use client"

import type React from "react"
import { useState } from "react"
import { useDonors } from "@/hooks/useDonors"
import { Modal } from "@/src/components/ui/modal"
import { Button } from "@/components/ui/button"
import type { Donor } from "@/hooks/useDonors"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Droplet, User, Plus, X } from "lucide-react"
import { Link } from "@/lib/next-router-compat"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const Donors: React.FC = () => {
  const { donors, isLoading, addDonor, recordDonorInquiry } = useDonors()
  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [modalState, setModalState] = useState<"success" | "error" | null>(null)
  const [modalMessage, setModalMessage] = useState("")

  const [addDonorForm, setAddDonorForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    blood_group: "",
    last_donation_date: "",
  })

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  // Validation for add donor
  const validateAddDonorForm = () => {
    if (!addDonorForm.name.trim()) return "Name is required"
    if (!addDonorForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addDonorForm.email))
      return "Valid email is required"
    if (!addDonorForm.phone.trim() || addDonorForm.phone.length < 10) return "Valid phone number is required"
    if (!addDonorForm.city.trim()) return "City is required"
    if (!addDonorForm.area.trim()) return "Area is required"
    if (!addDonorForm.blood_group) return "Blood group is required"
    if (!addDonorForm.last_donation_date) return "Last donation date is required"
    return null
  }

  // Validation for inquiry
  const validateInquiryForm = () => {
    if (!inquiryForm.name.trim()) return "Name is required"
    if (!inquiryForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryForm.email))
      return "Valid email is required"
    if (!inquiryForm.phone.trim() || inquiryForm.phone.length < 10) return "Valid phone number is required"
    return null
  }

  // Handle add donor submission
  const handleAddDonor = async () => {
    const error = validateAddDonorForm()
    if (error) {
      setModalState("error")
      setModalMessage(error)
      return
    }

    const result = await addDonor({
      name: addDonorForm.name,
      email: addDonorForm.email,
      phone: addDonorForm.phone,
      city: addDonorForm.city,
      area: addDonorForm.area,
      blood_group: addDonorForm.blood_group,
      last_donation_date: addDonorForm.last_donation_date,
    })

    if (result.success) {
      setModalState("success")
      setModalMessage("Thank you for registering as a donor! You will be contacted soon.")
      setAddDonorForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        area: "",
        blood_group: "",
        last_donation_date: "",
      })
      setShowAddDonorModal(false)
    } else {
      console.log(result)
      setModalState("error")
      setModalMessage(result.error || "Failed to register as donor")
    }
  }

  // Handle inquiry submission
  const handleInquiry = async () => {
    const error = validateInquiryForm()
    if (error) {
      setModalState("error")
      setModalMessage(error)
      return
    }

    const result = await recordDonorInquiry(selectedDonor.id, {
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone,
      message: inquiryForm.message,
    })

    if (result.success) {
      setModalState("success")
      setModalMessage("Donor will contact you soon!")
      setInquiryForm({ name: "", email: "", phone: "", message: "" })
      setShowInquiryModal(false)
    } else {
      setModalState("error")
      setModalMessage(result.error || "Failed to submit inquiry")
    }
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Droplet className="h-5 w-5 text-primary-foreground" />
            </div>

            <span className="font-heading text-xl font-bold text-foreground">Blood Bond</span>

          </div>
          </Link>
          <Button onClick={() => setShowAddDonorModal(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Become a Donor
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Find Blood Donors</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with generous donors in your area who are willing to help save lives
            </p>
          </div>

          {/* Donors Grid */}
          {donors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No donors registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Blood Group</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Last Donation</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {donors.map((donor) => (
        <TableRow key={donor.id}>
          <TableCell className="font-medium">
            {donor.name}
          </TableCell>

          <TableCell className="font-semibold text-red-600">
            {donor.blood_group}
          </TableCell>

          <TableCell>
            {donor.area}, {donor.city}
          </TableCell>

          <TableCell>
            {donor.last_donation_date
              ? new Date(donor.last_donation_date).toLocaleDateString()
              : "—"}
          </TableCell>

          <TableCell>
            <Button
              size="sm"
              onClick={() => {
                setSelectedDonor(donor)
                setShowInquiryModal(true)
              }}
            >
              Contact
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

          )}
        </div>
      </div>

      {/* Add Donor Modal */}
      {showAddDonorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-foreground">Register as a Donor</h2>
              <button
                onClick={() => setShowAddDonorModal(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                <Input
                  placeholder="Your full name"
                  value={addDonorForm.name}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={addDonorForm.email}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                <Input
                  placeholder="10-digit phone number"
                  value={addDonorForm.phone}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                <Input
                  placeholder="Your city"
                  value={addDonorForm.city}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Area *</label>
                <Input
                  placeholder="Your area/locality"
                  value={addDonorForm.area}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, area: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Blood Group *</label>
                <select
                  value={addDonorForm.blood_group}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, blood_group: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Donation Date *</label>
                <Input
                  type="date"
                  value={addDonorForm.last_donation_date}
                  onChange={(e) => setAddDonorForm({ ...addDonorForm, last_donation_date: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowAddDonorModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddDonor} className="flex-1">
                Register
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && selectedDonor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-foreground">Contact Donor</h2>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Donor Info */}
            <div className="p-6 border-b bg-muted/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedDonor.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Droplet className="h-3 w-3" />
                    {selectedDonor.blood_group}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedDonor.area}, {selectedDonor.city}
                </p>
                <p>Last Donation: {
                  selectedDonor.last_donation_date
  ? new Date(selectedDonor.last_donation_date).toLocaleDateString()
  : "—"
                  }</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
                <Input
                  placeholder="Your name"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Email *</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Phone *</label>
                <Input
                  placeholder="10-digit phone number"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Message *</label>
                <Textarea
                  placeholder="Message"
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setShowInquiryModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleInquiry} className="flex-1">
                Submit Inquiry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {modalState && (
        <Modal
          isOpen={true}
          onClose={() => setModalState(null)}
          title={modalState === "success" ? "Success" : "Error"}
          message={modalMessage}
          type={modalState}
        />
      )}
    </div>
  )
}

export default Donors
