"use client"

import { useState, useEffect } from "react"
import { supabase } from "../integrations/supabase/client"

export interface Donor {
  id: string;

  user_id?: string | null;

  name: string;

  email?: string | null;

  phone?: string | null;

  blood_group: string;

  city?: string | null;

  area?: string | null;

  state_id?: string | null;

  city_id?: string | null;

  area_id?: string | null;

  latitude?: number | null;

  longitude?: number | null;

  is_available: boolean;

  last_donation_date?: string | null;

  created_at: string;
}

export const useDonors = (filters:any={})  => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all donors
  useEffect(() => {
    const fetchDonors = async () => {

      try {
      
      setIsLoading(true);
      
      
      let query = supabase
      .from("donors")
      .select("*")
      .order(
      "created_at",
      {
      ascending:false
      }
      );
      
      
      
      if(filters.blood_group){
      
      query=query.eq(
      "blood_group",
      filters.blood_group
      );
      
      }
      
      
      
      if(filters.city){
      
      query=query.eq(
      "city",
      filters.city
      );
      
      }
      
      
      
      if(filters.area){
      
      query=query.eq(
      "area",
      filters.area
      );
      
      }
      
      
      
      if(filters.available){
      
      query=query.eq(
      "is_available",
      true
      );
      
      }
      
      
      
      const {
      data,
      error:fetchError
      }=await query;
      
      
      if(fetchError)
      throw fetchError;
      
      
      setDonors(data || []);
      
      
      }
      
      catch(error){
      
      console.error(error);
      
      }
      
      finally{
      
      setIsLoading(false);
      
      }
      
      };

    fetchDonors()
  }, [])

  // Add new donor
  const addDonor = async (donorData: Omit<Donor, "id" | "created_at">) => {
    try {
      const { data, error: insertError } = await supabase
        .from("donors")
        .insert([donorData])
        .select("*")
        .single()

      if (insertError) throw insertError

      setDonors([data as Donor, ...donors])
      return { success: true, donor: data }
    } catch (err) {
      console.error("Error adding donor:", err)
      return { success: false, error: err instanceof Error ? err.message : "Failed to add donor" }
    }
  }

  // Record donor inquiry
  const recordDonorInquiry = async (
    donorId: string,
    inquirerData: {
      name: string
      email: string
      phone: string
      message: string
    },
  ) => {
    try {
      const { error: insertError } = await supabase.from("inquiries").insert([
        {
          donor_id: donorId,
    sender_name: inquirerData.name,
    sender_email: inquirerData.email,
    sender_phone: inquirerData.phone,
    subject: "Donor Inquiry",
    message: inquirerData.message,
    category: "donor",
        },
      ])

      if (insertError) throw insertError
      return { success: true }
    } catch (err) {
      console.error("Error recording inquiry:", err)
      return { success: false, error: err instanceof Error ? err.message : "Failed to record inquiry" }
    }
  }

  return {
    donors,
    isLoading,
    error,
    addDonor,
    recordDonorInquiry,
  }
}
