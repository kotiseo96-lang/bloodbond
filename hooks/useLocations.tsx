"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export function useLocations() {
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchStates = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("states")
      .select("id, name")
      .order("name")

    setStates(data || [])
    setLoading(false)
  }

  const fetchCitiesByState = async (stateId: string) => {
    setCities([])
    setAreas([])

    if (!stateId) return

    const { data } = await supabase
      .from("cities")
      .select("id, name")
      .eq("state_id", stateId)
      .order("name")

    setCities(data || [])
  }

  const fetchAreasByCity = async (cityId: string) => {
    setAreas([])

    if (!cityId) return

    const { data } = await supabase
      .from("areas")
      .select("id, name")
      .eq("city_id", cityId)
      .order("name")

    setAreas(data || [])
  }

  useEffect(() => {
    fetchStates()
  }, [])

  return {
    states,
    cities,
    areas,
    fetchCitiesByState,
    fetchAreasByCity,
    loading,
  }
}
