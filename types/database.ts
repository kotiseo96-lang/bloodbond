export type AppRole = "admin" | "blood_bank" | "hospital"

export type OrderStatus = "pending" | "approved" | "ready" | "dispatched" | "delivered" | "cancelled"

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-"

export type UrgencyLevel = "routine" | "urgent" | "emergency"

export type InquiryStatus = "open" | "in_progress" | "resolved" | "closed"
export type InquiryCategory = "general" | "technical" | "support" | "feedback"
export type ContentSection = "home" | "hospitals" | "blood_banks"

/* =======================
   USER / PROFILE
======================= */

export interface Profile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: AppRole
  created_at: string
}

/* =======================
   BLOOD BANK & HOSPITAL
======================= */

export interface BloodBank {
  id: string
  user_id: string
  name: string
  address: string
  city: string
  state: string | null
  zip_code: string | null
  phone: string
  email: string
  latitude: number | null
  longitude: number | null
  operating_hours: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Hospital {
  id: string
  user_id: string
  name: string
  address: string
  city: string
  state: string | null
  zip_code: string | null
  phone: string
  email: string
  latitude: number | null
  longitude: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/* =======================
   BLOOD STOCK
======================= */

export interface BloodStock {
  id: string
  blood_bank_id: string
  blood_group: BloodGroup
  units_available: number
  last_updated_at: string
  created_at: string

  // relation
  blood_banks?: BloodBank
}

/* =======================
   GUEST
======================= */

export interface Guest {
  name: string
  phone: string
}

/* =======================
   ORDER (FINAL & FIXED)
======================= */

export interface Order {
  id: string

  hospital_id: string | null
  blood_bank_id: string

  blood_group: BloodGroup
  units_requested: number
  urgency: UrgencyLevel
  status: OrderStatus

  notes: string | null

  /* ✅ Patient details */
  patient_name?: string | null
  patient_age?: number | null
  patient_gender?: string | null

  /* ✅ Doctor details */
  doctor_name?: string | null
  doctor_registration_number?: string | null

  /* ✅ Prescription (Cloudinary URL) */
  prescription_image_url?: string | null

  /* timestamps */
  approved_at?: string | null
  ready_at?: string | null
  dispatched_at?: string | null
  delivered_at?: string | null

  status_updated_at: string
  created_at: string
  updated_at: string

  /* relations */
  hospitals?: Hospital
  hospital?: Hospital
  blood_banks?: BloodBank
  guest?: Guest
}

export interface Inquiry {
  id: string
  sender_name: string
  sender_email: string
  sender_phone: string
  category: InquiryCategory
  subject: string
  message: string
  status: InquiryStatus
  priority: "low" | "medium" | "high"
  admin_response?: string | null
  responded_by?: string | null
  responded_at?: string | null
  created_at: string
  updated_at: string
}

export interface CmsContent {
  id: string
  section: ContentSection
  title: string
  subtitle?: string | null
  content: string // TipTap JSON content
  description?: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ThemeSettings {
  id: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  card_background: string
  border_color: string
  created_at: string
  updated_at: string
}

/* =======================
   CONSTANTS
======================= */

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  ready: "Ready for Dispatch",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  routine: "Routine",
  urgent: "Urgent",
  emergency: "Emergency",
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
}

export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
  general: "General",
  technical: "Technical",
  support: "Support",
  feedback: "Feedback",
}

export const CONTENT_SECTIONS: ContentSection[] = ["home", "hospitals", "blood_banks"]
