"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

type State = { id: string; name: string }
type City = { id: string; name: string; state_id: string }
type Area = { id: string; name: string; city_id: string }

export default function AdminLocations() {
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const [stateName, setStateName] = useState("")
  const [cityName, setCityName] = useState("")
  const [areaName, setAreaName] = useState("")

  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const [loading, setLoading] = useState(false)

  /* ---------------- LOAD DATA ---------------- */

  const loadStates = async () => {
    const { data } = await supabase.from("states").select("*").order("name")
    setStates(data || [])
  }

  const loadCities = async (stateId: string) => {
    setSelectedCity("")
    setAreas([])
    const { data } = await supabase
      .from("cities")
      .select("*")
      .eq("state_id", stateId)
      .order("name")
    setCities(data || [])
  }

  const loadAreas = async (cityId: string) => {
    const { data } = await supabase
      .from("areas")
      .select("*")
      .eq("city_id", cityId)
      .order("name")
    setAreas(data || [])
  }

  useEffect(() => {
    loadStates()
  }, [])

  /* ---------------- CREATE ---------------- */

  const createState = async () => {
    if (!stateName) return
    setLoading(true)
    await supabase.from("states").insert({ name: stateName })
    setStateName("")
    await loadStates()
    setLoading(false)
  }

  const createCity = async () => {
    if (!cityName || !selectedState) return
    setLoading(true)
    await supabase.from("cities").insert({
      name: cityName,
      state_id: selectedState,
    })
    setCityName("")
    await loadCities(selectedState)
    setLoading(false)
  }

  const createArea = async () => {
    if (!areaName || !selectedCity) return
    setLoading(true)
    await supabase.from("areas").insert({
      name: areaName,
      city_id: selectedCity,
    })
    setAreaName("")
    await loadAreas(selectedCity)
    setLoading(false)
  }

  /* ---------------- UI ---------------- */

  return (
    <DashboardLayout>
      <div className="grid gap-6 max-w-4xl">

        {/* STATE */}
        <Card>
          <CardHeader>
            <CardTitle>States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="State name"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              />
              <Button onClick={createState} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Add State"}
              </Button>
            </div>

            <ul className="border rounded divide-y">
              {states.map((s) => (
                <li
                  key={s.id}
                  className={`p-3 cursor-pointer ${
                    selectedState === s.id ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedState(s.id)
                    loadCities(s.id)
                  }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CITY */}
        {selectedState && (
          <Card>
            <CardHeader>
              <CardTitle>Cities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="City name"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
                <Button onClick={createCity} disabled={loading}>
                  Add City
                </Button>
              </div>

              <ul className="border rounded divide-y">
                {cities.map((c) => (
                  <li
                    key={c.id}
                    className={`p-3 cursor-pointer ${
                      selectedCity === c.id ? "bg-muted" : ""
                    }`}
                    onClick={() => {
                      setSelectedCity(c.id)
                      loadAreas(c.id)
                    }}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* AREA */}
        {selectedCity && (
          <Card>
            <CardHeader>
              <CardTitle>Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Area name"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                />
                <Button onClick={createArea} disabled={loading}>
                  Add Area
                </Button>
              </div>

              <ul className="border rounded divide-y">
                {areas.map((a) => (
                  <li key={a.id} className="p-3">
                    {a.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

      </div>
    </DashboardLayout>
  )
}
