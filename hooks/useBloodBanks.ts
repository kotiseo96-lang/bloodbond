import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BloodBank } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/src/contexts/AuthContext";

// ✅ Define safe update type (ONLY DB columns)
type BloodBankUpdate = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
};

export const useBloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [myBloodBank, setMyBloodBank] = useState<BloodBank | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const { user } = useAuth();

  // ================= FETCH =================
  const fetchBloodBanks = async () => {
    try {
      const { data, error } = await supabase
        .from("blood_banks")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;

      setBloodBanks(data || []);

      if (user) {
        const userBank = data?.find((b) => b.user_id === user.id);
        setMyBloodBank(userBank || null);
      }
    } catch (error: any) {
      console.error("FETCH ERROR:", error);

      toast({
        title: "Error",
        description: error?.message || "Failed to fetch blood banks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ================= CREATE =================
  const createBloodBank = async (data: Partial<BloodBank>) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const insertData = {
        name: data.name!,
        address: data.address!,
        city: data.city!,
        phone: data.phone!,
        email: data.email!,
        state: data.state,
        zip_code: data.zip_code,
        latitude: data.latitude,
        longitude: data.longitude,
        user_id: user.id,
      };

      const { data: result, error } = await supabase
        .from("blood_banks")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blood bank created successfully",
      });

      await fetchBloodBanks();
      return result;
    } catch (error: any) {
      console.error("CREATE ERROR:", error);

      toast({
        title: "Error",
        description: error?.message || "Create failed",
        variant: "destructive",
      });
    }
  };

  // ================= UPDATE =================
  const updateBloodBank = async (id: string, data: BloodBankUpdate) => {
    try {
      if (!user) throw new Error("User not authenticated");

      console.log("USER:", user.id);
      console.log("UPDATE ID:", id);
      console.log("RAW DATA:", data);
      const safeData: any = {};

if (data.name) safeData.name = data.name;
if (data.email) safeData.email = data.email;
if (data.phone) safeData.phone = data.phone;
if (data.address) safeData.address = data.address;

// 🔥 FIX HERE
if (data.city || data.city_id) {
  safeData.city = data.city || data.city_id;
}

if (data.state || data.state_id) {
  safeData.state = data.state || data.state_id;
}

// ❌ ONLY if column exists in DB
// if (data.area || data.area_id) {
//   safeData.area = data.area || data.area_id;
// }

if (data.zip_code) safeData.zip_code = data.zip_code;
if (data.latitude) safeData.latitude = data.latitude;
if (data.longitude) safeData.longitude = data.longitude;

console.log("SAFE DATA:", safeData);

      // ✅ VERY IMPORTANT: include user_id filter (fixes RLS issues)
      const { data: result, error } = await supabase
        .from("blood_banks")
        .update(safeData)
        .eq("id", id)
        .eq("user_id", user.id) // 🔥 CRITICAL FIX
        .select()
        .maybeSingle(); // ✅ prevents crash if 0 rows

      console.log("RESULT:", result);
      console.log("ERROR:", error);

      if (error) throw error;

      if (!result) {
        throw new Error("Update blocked (RLS or no matching row)");
      }

      toast({
        title: "Success",
        description: "Blood bank updated successfully",
      });

      await fetchBloodBanks();
      return result;
    } catch (error: any) {
      console.error("FINAL UPDATE ERROR:", error);

      toast({
        title: "Error",
        description: error?.message || "Update failed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [user]);

  return {
    bloodBanks,
    myBloodBank,
    isLoading,
    createBloodBank,
    updateBloodBank,
    refetch: fetchBloodBanks,
  };
};