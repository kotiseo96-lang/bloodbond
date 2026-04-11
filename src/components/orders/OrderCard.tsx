"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { Order, ORDER_STATUS_LABELS, URGENCY_LABELS } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Droplet, AlertTriangle, FileImage } from 'lucide-react';
import { format } from 'date-fns';
import { OrderStatusTimeline } from './OrderStatusTimeline';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  onStatusChange?: (orderId: string, status: Order['status']) => void;
  perspective: 'hospital' | 'blood_bank' | 'admin';
  onCancel?: (id: string) => void;
}

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-info/10 text-info border-info/20',
  ready: 'bg-success/10 text-success border-success/20',
  dispatched: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const urgencyStyles: Record<Order['urgency'], string> = {
  routine: 'bg-muted text-muted-foreground',
  urgent: 'bg-warning text-warning-foreground',
  emergency: 'bg-destructive text-destructive-foreground animate-pulse',
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showActions = false,
  onStatusChange,
  onCancel,
  perspective,
}) => {
  const getNextStatus = (): Order['status'] | null => {
    switch (order.status) {
      case 'pending':
        return 'approved';
      case 'approved':
        return 'ready';
      case 'ready':
        return 'dispatched';
      case 'dispatched':
        return 'delivered';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Droplet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              {order.blood_group} Blood
            </h3>
            <p className="text-sm text-muted-foreground">
              {order.units_requested} Units
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge className={cn('border', urgencyStyles[order.urgency])}>
            {order.urgency === 'emergency' && (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {URGENCY_LABELS[order.urgency]}
          </Badge>

          <Badge variant="outline" className={cn('border', statusStyles[order.status])}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </div>

      {/* Hospital / Guest */}
      {(perspective === 'admin' || perspective === 'blood_bank') && (
        <div className="space-y-1 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>
              {order.hospital?.name
                ? `Hospital - ${order.hospital.name}`
                : `Guest - ${order.guest?.name}`}
            </span>
          </div>

          {order.guest && (
            <span className="text-xs ml-6">
              Phone: {order.guest.phone}
            </span>
          )}
        </div>
      )}

      {/* ✅ Patient Details */}
      {(order as any).patient_name && (
        <div className="mb-4 rounded-lg border p-3 text-sm">
          <p className="font-medium mb-1">Patient Details</p>
          <p>Name: {(order as any).patient_name}</p>
          {(order as any).patient_age && <p>Age: {(order as any).patient_age}</p>}
          {(order as any).patient_gender && <p>Gender: {(order as any).patient_gender}</p>}
        </div>
      )}

      {/* ✅ Prescription Image */}
      {(order as any).prescription_image_url && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Doctor Prescription
          </p>
          <a
            href={(order as any).prescription_image_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={(order as any).prescription_image_url}
              alt="Prescription"
              className="max-h-48 rounded-lg border object-contain hover:opacity-90 transition"
            />
          </a>
        </div>
      )}

      {/* Timeline for Hospital */}
      {perspective === 'hospital' && (
        <OrderStatusTimeline
          currentStatus={order.status}
          timestamps={{
            pending: order.created_at,
            approved: order.approved_at ?? undefined,
            ready: order.ready_at ?? undefined,
            dispatched: order.dispatched_at ?? undefined,
            delivered: order.delivered_at ?? undefined,
          }}
        />
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
        <Clock className="h-4 w-4" />
        <span>Ordered: {format(new Date(order.created_at), 'PPp')}</span>
      </div>

      {order.notes && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mt-4">
          {order.notes}
        </p>
      )}

      {/* Actions */}
      {showActions && (
        <div className="mt-4">
          {nextStatus && onStatusChange && (
            <button
              onClick={() => onStatusChange(order.id, nextStatus)}
              className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Mark as {ORDER_STATUS_LABELS[nextStatus]}
            </button>
          )}

          {order.status === 'pending' && onCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="mt-3 w-full py-2 px-4 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};
