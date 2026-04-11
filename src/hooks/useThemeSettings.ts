"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { ThemeSettings } from "@/types/database"
import { useToast } from "@/hooks/use-toast"

const DEFAULT_THEME: Omit<ThemeSettings, "id" | "created_at" | "updated_at"> = {
  primary_color: "#dc2626",
  secondary_color: "#f97316",
  accent_color: "#06b6d4",
  background_color: "#ffffff",
  text_color: "#000000",
  card_background: "#f9fafb",
  border_color: "#e5e7eb",
}

export const useThemeSettings = () => {
  const [theme, setTheme] = useState<ThemeSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchTheme = async () => {
    try {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setTheme(data as ThemeSettings)
      } else {
        // Create default theme if none exists
        const { data: newTheme, error: createError } = await supabase
          .from("theme_settings")
          .insert(DEFAULT_THEME)
          .select()
          .single()

        if (createError) throw createError
        setTheme(newTheme as ThemeSettings)
      }
    } catch (error) {
      console.error("Error fetching theme:", error)
      // Set local default if fetch fails
      setTheme({
        id: "default",
        ...DEFAULT_THEME,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateTheme = async (updates: Partial<Omit<ThemeSettings, "id" | "created_at" | "updated_at">>) => {
    try {
      if (!theme) return { success: false }

      const { error } = await supabase
        .from("theme_settings")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", theme.id)

      if (error) throw error

      setTheme({
        ...theme,
        ...updates,
        updated_at: new Date().toISOString(),
      })

      toast({
        title: "Theme Updated",
        description: "Your theme settings have been saved",
      })

      return { success: true }
    } catch (error) {
      console.error("Error updating theme:", error)
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive",
      })
      return { success: false }
    }
  }

  useEffect(() => {
    fetchTheme()
  }, [])

  return {
    theme,
    isLoading,
    updateTheme,
    refetch: fetchTheme,
  }
}
