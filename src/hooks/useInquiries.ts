"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Inquiry, InquiryStatus } from "@/types/database"
import { useToast } from "@/hooks/use-toast"

export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setInquiries(data as Inquiry[])
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateInquiryStatus = async (inquiryId: string, status: InquiryStatus) => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", inquiryId)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Inquiry status changed to ${status}`,
      })

      await fetchInquiries()
    } catch (error) {
      console.error("Error updating inquiry status:", error)
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      })
    }
  }

  const respondToInquiry = async (inquiryId: string, response: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({
          admin_response: response,
          responded_by: adminId,
          responded_at: new Date().toISOString(),
          status: "resolved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", inquiryId)

      if (error) throw error

      toast({
        title: "Response Sent",
        description: "Your response has been recorded",
      })

      await fetchInquiries()
    } catch (error) {
      console.error("Error responding to inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchInquiries()

    const channel = supabase
      .channel("inquiries-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inquiries",
        },
        () => {
          fetchInquiries()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    inquiries,
    isLoading,
    updateInquiryStatus,
    respondToInquiry,
    refetch: fetchInquiries,
  }
}
