"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { useDonors } from "@/hooks/useDonors"
import type { Donor } from "@/hooks/useDonors"
import { useAuth } from "@/src/contexts/AuthContext"

import { Modal } from "@/src/components/ui/modal"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

import { Droplet } from "lucide-react"
import { Link } from "@/lib/next-router-compat"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"

const Page: React.FC = () => {
  const router = useRouter()
  const { user } = useAuth()

  const { donors, isLoading, recordDonorInquiry } = useDonors()

  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)

  const [modalState, setModalState] = useState<"success" | "error" | null>(null)
  const [modalMessage, setModalMessage] = useState("")

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  // ✅ ONLY LOGIC YOU NEED
  const handleBecomeDonor = () => {
    if (!user) {
      router.push("/signup/donor")
    } else {
      router.push("/dashboard")
    }
  }

  const validateInquiryForm = () => {
    if (!inquiryForm.name.trim()) return "Name is required"
    if (!inquiryForm.email.trim()) return "Email is required"
    if (!inquiryForm.phone.trim()) return "Phone is required"
    return null
  }

  const handleInquiry = async () => {
    if (!selectedDonor) return

    const error = validateInquiryForm()
    if (error) {
      setModalState("error")
      setModalMessage(error)
      return
    }

    const result = await recordDonorInquiry(selectedDonor.id, inquiryForm)

    if (result.success) {
      setModalState("success")
      setModalMessage("Sent successfully!")
      setInquiryForm({ name: "", email: "", phone: "", message: "" })
      setShowInquiryModal(false)
    } else {
      setModalState("error")
      setModalMessage(result.error || "Failed")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* NAV */}
      <nav className="bg-white py-4 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">

        <Link href="/">
            <img src="/Blood-Bond-Logo.png" width="250" alt="Blood Bond" />
          </Link>

          {/* ✅ ONLY REDIRECT BUTTON */}
          <Button onClick={handleBecomeDonor}>
            Become Donor
          </Button>

        </div>
      </nav>

      {/* CONTENT */}
      <div className="pt-10 px-4">
        <div className="container mx-auto">

          <h1 className="text-3xl font-bold text-center mb-6">
            Find Blood Donors
          </h1>

          {donors.length === 0 ? (
            <p className="text-center">No donors found</p>
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
                      <TableCell>{donor.name}</TableCell>
                      <TableCell>{donor.blood_group}</TableCell>
                      <TableCell>{donor.area}, {donor.city}</TableCell>
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

      {/* INQUIRY MODAL ONLY */}
      {showInquiryModal && selectedDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2>Contact {selectedDonor.name}</h2>

            <Input
  placeholder="Your Name"
  value={inquiryForm.name}
  onChange={(e) =>
    setInquiryForm({ ...inquiryForm, name: e.target.value })
  }
/>

<Input
  placeholder="Your Email"
  className="mt-3"
  value={inquiryForm.email}
  onChange={(e) =>
    setInquiryForm({ ...inquiryForm, email: e.target.value })
  }
/>

<Input
  placeholder="Your Phone"
  className="mt-3"
  value={inquiryForm.phone}
  onChange={(e) =>
    setInquiryForm({ ...inquiryForm, phone: e.target.value })
  }
/>

<Input
  placeholder="Message (optional)"
  className="mt-3"
  value={inquiryForm.message}
  onChange={(e) =>
    setInquiryForm({ ...inquiryForm, message: e.target.value })
  }
/>

            <Button className="w-full mt-4" onClick={handleInquiry}>
              Send
            </Button>

          </div>
        </div>
      )}

      {/* STATUS MODAL */}
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

export default Page