import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BloodBank } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/src/contexts/AuthContext';

export const useBloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [myBloodBank, setMyBloodBank] = useState<BloodBank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBloodBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_banks')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBloodBanks(data as BloodBank[]);

      if (user) {
        const userBank = (data as BloodBank[]).find(b => b.user_id === user.id);
        setMyBloodBank(userBank || null);
      }
    } catch (error) {
      console.error('Error fetching blood banks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch blood banks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBloodBank = async (bloodBankData: Partial<BloodBank>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const insertData = {
        name: bloodBankData.name!,
        address: bloodBankData.address!,
        city: bloodBankData.city!,
        phone: bloodBankData.phone!,
        email: bloodBankData.email!,
        state: bloodBankData.state,
        zip_code: bloodBankData.zip_code,
        latitude: bloodBankData.latitude,
        longitude: bloodBankData.longitude,
        operating_hours: bloodBankData.operating_hours,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('blood_banks')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blood bank profile created successfully',
      });

      await fetchBloodBanks();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating blood bank:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blood bank profile',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateBloodBank = async (id: string, bloodBankData: Partial<BloodBank>) => {
    try {
      const { error } = await supabase
        .from('blood_banks')
        .update(bloodBankData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blood bank profile updated successfully',
      });

      await fetchBloodBanks();
    } catch (error) {
      console.error('Error updating blood bank:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blood bank profile',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [user]);
  return { bloodBanks, myBloodBank, isLoading, createBloodBank, updateBloodBank, refetch: fetchBloodBanks };
};
