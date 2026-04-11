"use client"

import type React from "react"
import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useInquiries } from "@/hooks/useInquiries"
import { useAuth } from "@/src/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, Loader2, Eye } from "lucide-react"
import { format } from "date-fns"
import type { InquiryStatus } from "@/types/database"
import { INQUIRY_STATUS_LABELS, INQUIRY_CATEGORY_LABELS } from "@/types/database"

const Inquiries: React.FC = () => {
  const { inquiries, isLoading, updateInquiryStatus, respondToInquiry } = useInquiries()
  const { user } = useAuth()
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const handleRespond = async () => {
    if (!selectedInquiry || !user || !responseText.trim()) return

    setIsSubmitting(true)
    await respondToInquiry(selectedInquiry, responseText, user.id)
    setResponseText("")
    setSelectedInquiry(null)
    setIsSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    const matchesCategory = categoryFilter === "all" || inquiry.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const currentInquiry = inquiries.find((i) => i.id === selectedInquiry)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Manage user inquiries with complex status tracking and detailed responses
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="support">Support</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Inquiries Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{inquiry.sender_name}</p>
                          <p className="text-xs text-muted-foreground">{inquiry.sender_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium max-w-xs truncate">{inquiry.subject}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{INQUIRY_CATEGORY_LABELS[inquiry.category]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(inquiry.priority)} variant="outline">
                        {inquiry.priority.charAt(0).toUpperCase() + inquiry.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(inquiry.status)} variant="outline">
                        {INQUIRY_STATUS_LABELS[inquiry.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(inquiry.created_at), "PP")}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setSelectedInquiry(inquiry.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No inquiries found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {currentInquiry && (
            <>
              <DialogHeader>
                <DialogTitle>Inquiry Details</DialogTitle>
                <DialogDescription>Manage and respond to this inquiry</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Inquiry Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">From</p>
                    <p className="font-medium">{currentInquiry.sender_name}</p>
                    <p className="text-sm text-muted-foreground">{currentInquiry.sender_email}</p>
                    <p className="text-sm text-muted-foreground">{currentInquiry.sender_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
                    <select
                      value={currentInquiry.status}
                      onChange={(e) => updateInquiryStatus(currentInquiry.id, e.target.value as InquiryStatus)}
                      className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Subject</p>
                  <p className="text-lg font-semibold">{currentInquiry.subject}</p>
                </div>

                {/* Original Message */}
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Original Message</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{currentInquiry.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Received on {format(new Date(currentInquiry.created_at), "PPpp")}
                  </p>
                </div>

                {/* Previous Response */}
                {currentInquiry.admin_response && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
                    <p className="text-sm font-medium text-green-800">Your Previous Response</p>
                    <p className="text-sm text-green-700 whitespace-pre-wrap">{currentInquiry.admin_response}</p>
                    <p className="text-xs text-green-600 mt-2">
                      Responded on {format(new Date(currentInquiry.responded_at!), "PPpp")}
                    </p>
                  </div>
                )}

                {/* New Response */}
                <div className="space-y-3">
                  <Label htmlFor="response">
                    {currentInquiry.admin_response ? "Add Additional Response" : "Your Response"}
                  </Label>
                  <Textarea
                    id="response"
                    placeholder="Type your response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={6}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedInquiry(null)} disabled={isSubmitting}>
                    Close
                  </Button>
                  <Button onClick={handleRespond} disabled={isSubmitting || !responseText.trim()}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Response"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default Inquiries
