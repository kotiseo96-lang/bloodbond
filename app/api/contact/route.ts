import { NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/integrations/supabase/client"

// Where every contact-form submission gets emailed to
const CONTACT_RECEIVER_EMAIL = "info@bloodbond.net"

// "From" address must be on a domain you've verified in Resend.
// Until you verify bloodbond.net, Resend's shared "onboarding@resend.dev"
// works fine for testing.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "BloodBond Contact <onboarding@resend.dev>"

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = String(body?.name || "").trim()
    const email = String(body?.email || "").trim()
    const phone = String(body?.phone || "").trim()
    const subject = String(body?.subject || "").trim() || "New contact form message"
    const message = String(body?.message || "").trim()

    // ---- basic validation ----
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 })
    }

    // ---- save to Supabase (inquiries table) ----
    const { error: dbError } = await supabase.from("inquiries").insert({
      sender_name: name,
      sender_email: email,
      sender_phone: phone || null,
      subject,
      message,
      category: "contact",
    })

    if (dbError) {
      console.error("Failed to save inquiry:", dbError)
      // Don't block the email just because the DB write failed --
      // but do report failure if BOTH fail below.
    }

    // ---- send email notification ----
    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #111;">
          <h2 style="margin-bottom: 16px;">New contact form submission</h2>
          <table cellpadding="6" style="border-collapse: collapse;">
            <tr><td style="font-weight: bold;">Name</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="font-weight: bold;">Email</td><td>${escapeHtml(email)}</td></tr>
            <tr><td style="font-weight: bold;">Phone</td><td>${escapeHtml(phone || "-")}</td></tr>
            <tr><td style="font-weight: bold;">Subject</td><td>${escapeHtml(subject)}</td></tr>
          </table>
          <p style="font-weight: bold; margin-top: 20px;">Message</p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    })

    if (emailError && dbError) {
      console.error("Failed to send email:", emailError)
      return NextResponse.json(
        { error: "Could not send your message right now. Please try again shortly." },
        { status: 500 }
      )
    }

    if (emailError) {
      // DB save succeeded but email failed -- log for follow-up, still tell user it worked
      console.error("Inquiry saved but email failed to send:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact form error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}