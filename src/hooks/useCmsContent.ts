"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { CmsContent, ContentSection } from "@/types/database"
import { useToast } from "@/hooks/use-toast"

export const useCmsContent = (section?: ContentSection) => {
  const [content, setContent] = useState<CmsContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchContent = async () => {
    try {
      let query = supabase.from("cms_content").select("*")

      if (section) {
        query = query.eq("section", section)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      setContent(data as CmsContent[])
    } catch (error) {
      console.error("Error fetching CMS content:", error)
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async (contentData: Omit<CmsContent, "id" | "created_at" | "updated_at">) => {
    try {
      const { data: existing } = await supabase
        .from("cms_content")
        .select("id")
        .eq("section", contentData.section)
        .eq("title", contentData.title)
        .maybeSingle()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("cms_content")
          .update({
            ...contentData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase.from("cms_content").insert(contentData)

        if (error) throw error
      }

      toast({
        title: "Success",
        description: "Content saved successfully",
      })

      await fetchContent()
      return { success: true }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      })
      return { success: false }
    }
  }

  useEffect(() => {
    fetchContent()
  }, [section])

  return {
    content,
    isLoading,
    saveContent,
    refetch: fetchContent,
  }
}
