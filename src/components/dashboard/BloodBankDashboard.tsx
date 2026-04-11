"use client"

import React, { useState } from 'react';
import { StatCard } from '@/src/components/ui/stat-card';
import { useBloodStock } from '@/hooks/useBloodStock';
import { useOrders } from '@/hooks/useOrders';
import { useBloodBanks } from '@/hooks/useBloodBanks';
import { OrderCard } from '@/components/orders/OrderCard';
import { BloodGroupCard } from '@/components/blood/BloodGroupCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplet, ShoppingCart, AlertTriangle, Package } from 'lucide-react';
import { BLOOD_GROUPS, BloodGroup } from '@/types/database';

const BloodBankDashboard: React.FC = () => {
  const { myBloodBank } = useBloodBanks();
  const { stock, updateStock } = useBloodStock(myBloodBank?.id);
  const { orders, updateOrderStatus } = useOrders({ bloodBankId: myBloodBank?.id });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | null>(null);
  const [newUnits, setNewUnits] = useState('');

  const totalUnits = stock.reduce((sum, s) => sum + s.units_available, 0);
  const lowStock = stock.filter((s) => s.units_available > 0 && s.units_available <= 5).length;
  const outOfStock = stock.filter((s) => s.units_available === 0).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'approved').length;

  const getStockForGroup = (group: BloodGroup) => {
    const found = stock.find((s) => s.blood_group === group);
    return found?.units_available || 0;
  };

  const handleEditStock = (group: BloodGroup) => {
    setSelectedBloodGroup(group);
    setNewUnits(getStockForGroup(group).toString());
    setEditDialogOpen(true);
  };

  const handleSaveStock = async () => {
    if (!myBloodBank || !selectedBloodGroup) return;

    const units = parseInt(newUnits, 10);
    if (isNaN(units) || units < 0) return;

    await updateStock(myBloodBank.id, selectedBloodGroup, units);
    setEditDialogOpen(false);
  };

  if (!myBloodBank) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Complete Your Profile
        </h2>
        <p className="text-muted-foreground mb-4">
          Please complete your blood bank profile in Settings to start managing your inventory.
        </p>
        <Button onClick={() => window.location.href = '/settings'}>
          Go to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {myBloodBank.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {myBloodBank.city} • Blood Bank Dashboard
        </p>
      </div>

      {/* Low Stock Alert */}
      {(outOfStock > 0 || lowStock > 0) && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <div>
            <p className="font-semibold text-warning">Stock Alert</p>
            <p className="text-sm text-warning/80">
              {outOfStock > 0 && `${outOfStock} blood group(s) out of stock. `}
              {lowStock > 0 && `${lowStock} blood group(s) running low.`}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Units"
          value={totalUnits}
          subtitle="Available stock"
          icon={Droplet}
          variant="primary"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Orders to process"
          icon={ShoppingCart}
          variant={pendingOrders > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Low Stock"
          value={lowStock}
          subtitle="Blood groups"
          icon={AlertTriangle}
          variant={lowStock > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          subtitle="Blood groups"
          icon={Package}
          variant={outOfStock > 0 ? 'critical' : 'default'}
        />
      </div>

      {/* Blood Stock Grid */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Blood Inventory
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BLOOD_GROUPS.map((group) => (
            <BloodGroupCard
              key={group}
              bloodGroup={group}
              units={getStockForGroup(group)}
              onEdit={() => handleEditStock(group)}
              showEdit
            />
          ))}
        </div>
      </div>

      {/* Incoming Orders */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Incoming Orders
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length > 0 ? (
            orders
              .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  perspective="blood_bank"
                  showActions
                  onStatusChange={updateOrderStatus}
                />
              ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-card rounded-xl border border-border">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Stock Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              Update {selectedBloodGroup} Blood Stock
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="units">Available Units</Label>
              <Input
                id="units"
                type="number"
                min="0"
                value={newUnits}
                onChange={(e) => setNewUnits(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStock}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add missing import
import { Building2 } from 'lucide-react';

export default BloodBankDashboard;
