import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BloodStock, BloodGroup } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useBloodStock = (bloodBankId?: string) => {
  const [stock, setStock] = useState<BloodStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStock = async () => {
    try {
      let query = supabase
        .from('blood_stock')
        .select('*, blood_banks(*)');

      if (bloodBankId) {
        query = query.eq('blood_bank_id', bloodBankId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStock(data as BloodStock[]);
    } catch (error) {
      console.error('Error fetching blood stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch blood stock',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async (bloodBankId: string, bloodGroup: BloodGroup, units: number) => {
    try {
      const { data: existing } = await supabase
        .from('blood_stock')
        .select('id')
        .eq('blood_bank_id', bloodBankId)
        .eq('blood_group', bloodGroup)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('blood_stock')
          .update({ units_available: units })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blood_stock')
          .insert({
            blood_bank_id: bloodBankId,
            blood_group: bloodGroup,
            units_available: units,
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Blood stock updated successfully',
      });

      await fetchStock();
    } catch (error) {
      console.error('Error updating blood stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blood stock',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchStock();

    const channel = supabase
      .channel('blood-stock-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blood_stock',
        },
        () => {
          fetchStock();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bloodBankId]);

  return { stock, isLoading, updateStock, refetch: fetchStock };
};
