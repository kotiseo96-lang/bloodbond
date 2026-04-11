import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Hospital } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/src/contexts/AuthContext';
import type { Database } from "@/integrations/supabase/types";

type HospitalUpdate = Database["public"]["Tables"]["hospitals"]["Update"];

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [myHospital, setMyHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setHospitals(data as unknown as Hospital[]);

      if (user) {
        const userHospital = (data as unknown as Hospital[]).find(h => h.user_id === user.id);
        setMyHospital(userHospital || null);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      const msg = error instanceof Error ? error.message : JSON.stringify(error);
      toast({
        title: 'Error',
        description: `Failed to fetch hospitals: ${msg}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createHospital = async (hospitalData: Partial<Hospital>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const insertData = {
        name: hospitalData.name!,
        address: hospitalData.address!,
        city: hospitalData.city!,
        phone: hospitalData.phone!,
        email: hospitalData.email!,
        state: hospitalData.state,
        zip_code: hospitalData.zip_code,
        latitude: hospitalData.latitude,
        longitude: hospitalData.longitude,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('hospitals')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hospital profile created successfully',
      });

      await fetchHospitals();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating hospital:', error);
      const msg = error instanceof Error ? error.message : JSON.stringify(error);
      toast({
        title: 'Error',
        description: `Failed to create hospital profile: ${msg}`,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };
  

  const updateHospital = async (id: string, hospitalData: HospitalUpdate) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(hospitalData).filter(
          ([key, v]) => v !== undefined && key !== "operating_hours"
        )
      ) as HospitalUpdate;
  
      const { data, error } = await supabase
        .from("hospitals")
        .update(cleanedData)
        .eq("id", id)
        .select()
        .single();
  
      if (error) throw error;
  
      toast({
        title: "Success",
        description: "Hospital profile updated successfully",
      });
  
      await fetchHospitals();
      return data;
  
    } catch (error: any) {
      console.error("Error updating hospital:", error);
  
      toast({
        title: "Error",
        description: error?.message || "Update failed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [user]);

  return { hospitals, myHospital, isLoading, createHospital, updateHospital, refetch: fetchHospitals };
};
