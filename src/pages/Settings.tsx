"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useBloodBanks } from "@/hooks/useBloodBanks"
import { useHospitals } from "@/hooks/useHospitals"
import { useLocations } from "@/hooks/useLocations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Building2, Edit2, X } from "lucide-react"

const Settings: React.FC = () => {
  const { role, user } = useAuth()
  const { myBloodBank, updateBloodBank } = useBloodBanks()
  const { myHospital, updateHospital } = useHospitals()
  const { states, cities, areas, fetchCitiesByState, fetchAreasByCity } = useLocations()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    stateId: "",
    cityId: "",
    areaId: "",
    zipCode: "",
    operatingHours: "",
  })

  const [selectedCities, setSelectedCities] = useState<any[]>([])
  const [selectedAreas, setSelectedAreas] = useState<any[]>([])

  useEffect(() => {
    const org = myHospital || myBloodBank
    if (org) {
      setFormData({
        name: org.name || "",
        email: org.email || "",
        phone: org.phone || "",
        address: org.address || "",
        stateId: org.state_id || "",
        cityId: org.city_id || "",
        areaId: org.area_id || "",
        zipCode: org.zip_code || "",
        operatingHours: org.operating_hours || "",
      })
      // Fetch location data if state exists
      if (org.state_id) {
        fetchCitiesByState(org.state_id)
      }
      if (org.city_id) {
        fetchAreasByCity(org.city_id)
      }
    }
  }, [myHospital, myBloodBank])

  useEffect(() => {
    setSelectedCities(cities)
  }, [cities])

  useEffect(() => {
    setSelectedAreas(areas)
  }, [areas])

  const handleStateChange = (stateId: string) => {
    setFormData((prev) => ({
      ...prev,
      stateId,
      cityId: "",
      areaId: "",
    }))
    setSelectedCities([])
    setSelectedAreas([])
    if (stateId) {
      fetchCitiesByState(stateId)
    }
  }

  const handleCityChange = (cityId: string) => {
    setFormData((prev) => ({
      ...prev,
      cityId,
      areaId: "",
    }))
    setSelectedAreas([])
    if (cityId) {
      fetchAreasByCity(cityId)
    }
  }

  const handleAreaChange = (areaId: string) => {
    setFormData((prev) => ({
      ...prev,
      areaId,
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return false
    }
    if (!formData.stateId || !formData.cityId) {
      toast({
        title: "Validation Error",
        description: "Please select State and City",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const org = myHospital || myBloodBank
      if (!org) {
        toast({
          title: "Error",
          description: "No organization found",
          variant: "destructive",
        })
        return
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        state_id: formData.stateId,
        city_id: formData.cityId,
        area_id: formData.areaId || null,
        zip_code: formData.zipCode || null,
        operating_hours: role === "blood_bank" ? formData.operatingHours : null,
      }

      if (role === "hospital") {
        await updateHospital(org.id, updateData)
      } else if (role === "blood_bank") {
        await updateBloodBank(org.id, updateData)
      }

      setIsEditMode(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const org = myHospital || myBloodBank
  const orgType = role === "hospital" ? "Hospital" : "Blood Bank"

  return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">{orgType} Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your organization profile</p>
        </div>

        {org ? (
          <>
            {/* Display Card - Shows all details in table format when not editing */}
            {!isEditMode && (
              <Card className="border-2 border-primary/10">
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{org.name}</CardTitle>
                      <CardDescription>{orgType} Profile</CardDescription>
                    </div>
                  </div>
                  <Button onClick={() => setIsEditMode(true)} variant="outline" size="sm" className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-muted-foreground w-32">Email</td>
                          <td className="py-3 px-4">{org.email}</td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-muted-foreground">Phone</td>
                          <td className="py-3 px-4">{org.phone}</td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-muted-foreground">Address</td>
                          <td className="py-3 px-4">{org.address}</td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-muted-foreground">State</td>
                          <td className="py-3 px-4">{states.find((s) => s.id === formData.stateId)?.name || "N/A"}</td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-muted-foreground">City</td>
                          <td className="py-3 px-4">
                            {selectedCities.find((c) => c.id === org.city_id)?.name || "N/A"}
                          </td>
                        </tr>
                        {org.area_id && (
                          <tr className="hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium text-muted-foreground">Area</td>
                            <td className="py-3 px-4">
                              {selectedAreas.find((a) => a.id === org.area_id)?.name || "N/A"}
                            </td>
                          </tr>
                        )}
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium text-muted-foreground">ZIP Code</td>
                          <td className="py-3 px-4">{org.zip_code || "N/A"}</td>
                        </tr>
                        {role === "blood_bank" && org.operating_hours && (
                          <tr className="hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium text-muted-foreground">Operating Hours</td>
                            <td className="py-3 px-4">{org.operating_hours}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Form */}
            {isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit {orgType} Details</CardTitle>
                  <CardDescription>Update your organization information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="name">{orgType} Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder={`Enter ${orgType.toLowerCase()} name`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="contact@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="border-t pt-4 space-y-4">
                      <h3 className="font-medium text-sm">Address Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <select
                            id="state"
                            className="w-full border border-input rounded-md px-3 py-2 text-sm"
                            value={formData.stateId}
                            onChange={(e) => handleStateChange(e.target.value)}
                          >
                            <option value="">Select State</option>
                            {states.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <select
                            id="city"
                            className="w-full border border-input rounded-md px-3 py-2 text-sm"
                            value={formData.cityId}
                            onChange={(e) => handleCityChange(e.target.value)}
                            disabled={!formData.stateId}
                          >
                            <option value="">Select City</option>
                            {selectedCities.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="area">Area</Label>
                          <select
                            id="area"
                            className="w-full border border-input rounded-md px-3 py-2 text-sm"
                            value={formData.areaId}
                            onChange={(e) => handleAreaChange(e.target.value)}
                            disabled={!formData.cityId}
                          >
                            <option value="">Select Area (Optional)</option>
                            {selectedAreas.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            placeholder="400001"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Blood Bank Operating Hours */}
                    {role === "blood_bank" && (
                      <div className="border-t pt-4 space-y-4">
                        <h3 className="font-medium text-sm">Operating Hours</h3>
                        <div className="space-y-2">
                          <Label htmlFor="hours">Hours *</Label>
                          <Input
                            id="hours"
                            value={formData.operatingHours}
                            onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                            placeholder="9 AM - 6 PM"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t pt-6 flex gap-3">
                      <Button onClick={handleSave} disabled={isLoading} className="flex-1 gap-2">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditMode(false)}
                        variant="outline"
                        disabled={isLoading}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No organization profile found. Please complete your profile setup.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Account Information Tab */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your authentication details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={role || ""} disabled className="capitalize" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default Settings
