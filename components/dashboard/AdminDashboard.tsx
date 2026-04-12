import React from 'react';
import { StatCard } from '@/src/components/ui/stat-card';
import { useBloodStock } from '@/hooks/useBloodStock';
import { useOrders } from '@/hooks/useOrders';
import { useBloodBanks } from '@/hooks/useBloodBanks';
import { useHospitals } from '@/hooks/useHospitals';
import { OrderCard } from '@/components/orders/OrderCard';
import { BloodGroupCard } from '@/components/blood/BloodGroupCard';
import { Droplet, ShoppingCart, Building2, Activity, AlertTriangle } from 'lucide-react';
import { BLOOD_GROUPS } from '@/types/database';
import { useState } from "react";
import { supabase } from "@/src/integrations/supabase/client";

const AdminDashboard: React.FC = () => {
  const { stock } = useBloodStock();
  const { orders, updateOrderStatus } = useOrders();
  const { bloodBanks } = useBloodBanks();
  const { hospitals } = useHospitals();

  const [donorId, setDonorId] = useState("");
  const [units, setUnits] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalUnits = stock.reduce((sum, s) => sum + s.units_available, 0);
  const criticalStock = stock.filter((s) => s.units_available === 0).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const emergencyOrders = orders.filter((o) => o.urgency === 'emergency' && o.status !== 'delivered').length;

  // Aggregate stock by blood group
  const aggregatedStock = BLOOD_GROUPS.map((group) => {
    const groupStock = stock.filter((s) => s.blood_group === group);
    const totalUnits = groupStock.reduce((sum, s) => sum + s.units_available, 0);
    return { bloodGroup: group, units: totalUnits };
  });

  const recentOrders = orders.slice(0, 5);

  const handleAddDonation = async () => {
    if (!donorId || !units) return;

    setLoading(true);

    const { error } = await supabase.rpc(
      "create_donation_and_credit",
      {
        p_donor_id: donorId,
        p_units: units,
      }
    );

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to add donation");
      return;
    }

    alert("Donation added successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System overview and management
        </p>
      </div>

      {/* Emergency Alert */}
      {emergencyOrders > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-4 animate-pulse">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Emergency Orders Pending</p>
            <p className="text-sm text-destructive/80">
              {emergencyOrders} emergency order(s) require immediate attention
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Blood Units"
          value={totalUnits}
          subtitle="Across all blood banks"
          icon={Droplet}
          variant="primary"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Awaiting approval"
          icon={ShoppingCart}
          variant={pendingOrders > 5 ? 'warning' : 'default'}
        />
        <StatCard
          title="Blood Banks"
          value={bloodBanks.length}
          subtitle="Active blood banks"
          icon={Building2}
        />
        <StatCard
          title="Hospitals"
          value={hospitals.length}
          subtitle="Registered hospitals"
          icon={Activity}
        />
      </div>

      {/* Blood Stock Overview */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          System-wide Blood Stock
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aggregatedStock.map(({ bloodGroup, units }) => (
            <BloodGroupCard
              key={bloodGroup}
              bloodGroup={bloodGroup}
              units={units}
            />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Recent Orders
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                perspective="admin"
                showActions
                onStatusChange={updateOrderStatus}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-card rounded-xl border border-border">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10 bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Donation</h2>

        {/* Donor ID */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Donor ID"
          value={donorId}
          onChange={(e) => setDonorId(e.target.value)}
        />

        {/* Units */}
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Units"
          value={units}
          onChange={(e) => setUnits(Number(e.target.value))}
        />

        <button
          onClick={handleAddDonation}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Donation"}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
