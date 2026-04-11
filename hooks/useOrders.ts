import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, BloodGroup, UrgencyLevel } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface CreateOrderData {
  hospital_id: string;
  blood_bank_id: string;
  blood_group: BloodGroup;
  units_requested: number;
  urgency: UrgencyLevel;
  notes?: string;
}

export const useOrders = (filter?: { hospitalId?: string; bloodBankId?: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from("orders")
        .select(`
  id,
  blood_group,
  units_requested,
  urgency,
  status,
  created_at,

  patient_name,
  patient_age,
  patient_gender,

  doctor_name,
  doctor_registration_number,
  prescription_image_url,

  blood_banks:blood_bank_id (
  id,
    name
  ),

  hospital:hospital_id (
  id,
    name
  ),

  guest:guest_id (
  id,
    name,
    phone
  )
`)



      if (filter?.hospitalId) {
        query = query.eq('hospital_id', filter.hospitalId);
      }

      if (filter?.bloodBankId) {
        query = query.eq('blood_bank_id', filter.bloodBankId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: CreateOrderData) => {
    try {
      const { error } = await supabase.from('orders').insert(orderData);

      if (error) throw error;

      toast({
        title: 'Order Placed',
        description: 'Your blood order has been placed successfully',
      });

      await fetchOrders();
      return { success: true };
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, status_updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Order status changed to ${status}`,
      });

      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Order Cancelled',
        description: 'The order has been cancelled successfully',
      });

      await fetchOrders();
    } catch (error) {
      console.error('Cancel order error:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel order',
        variant: 'destructive',
      });
    }
  };


  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter?.hospitalId, filter?.bloodBankId]);

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    refetch: fetchOrders,
  };


};
