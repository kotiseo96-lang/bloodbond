"use client"

import React from 'react';
import { useNavigate } from '@/lib/next-router-compat';
import { StatCard } from '@/src/components/ui/stat-card';
import { useOrders } from '@/hooks/useOrders';
import { useHospitals } from '@/hooks/useHospitals';
import { OrderCard } from '@/components/orders/OrderCard';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, CheckCircle, Truck, AlertTriangle, Building2 } from 'lucide-react';

const HospitalDashboard: React.FC = () => {
  const { myHospital } = useHospitals();
  const { orders } = useOrders({ hospitalId: myHospital?.id });
  const navigate = useNavigate();

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const inProgressOrders = orders.filter((o) => 
    ['approved', 'ready', 'dispatched'].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const emergencyOrders = orders.filter(
    (o) => o.urgency === 'emergency' && o.status !== 'delivered'
  ).length;

  if (!myHospital) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Complete Your Profile
        </h2>
        <p className="text-muted-foreground mb-4">
          Please complete your hospital profile in Settings to start ordering blood.
        </p>
        <Button onClick={() => navigate('/settings')}>
          Go to Settings
        </Button>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {myHospital.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {myHospital.city} • Hospital Dashboard
          </p>
        </div>
        <Button 
          onClick={() => navigate('/search')}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Order Blood
        </Button>
      </div>

      {/* Emergency Button */}
      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center pulse-emergency">
              <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                Emergency Blood Request
              </h3>
              <p className="text-sm text-muted-foreground">
                For critical situations requiring immediate blood supply
              </p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            size="lg"
            onClick={() => navigate('/search?urgency=emergency')}
          >
            Emergency Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Awaiting approval"
          icon={Clock}
          variant={pendingOrders > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="In Progress"
          value={inProgressOrders}
          subtitle="Being processed"
          icon={Truck}
          variant="primary"
        />
        <StatCard
          title="Completed"
          value={completedOrders}
          subtitle="Delivered orders"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Emergency"
          value={emergencyOrders}
          subtitle="Active emergencies"
          icon={AlertTriangle}
          variant={emergencyOrders > 0 ? 'critical' : 'default'}
        />
      </div>

      {/* Active Orders */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Active Orders
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                perspective="hospital"
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-card rounded-xl border border-border">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active orders</p>
              <Button onClick={() => navigate('/search')}>
                Search Blood Availability
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
