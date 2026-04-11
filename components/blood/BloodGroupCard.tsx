"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { BloodGroup } from '@/types/database';
import { Droplet } from 'lucide-react';

interface BloodGroupCardProps {
  bloodGroup: BloodGroup;
  units: number;
  onEdit?: () => void;
  showEdit?: boolean;
  className?: string;
}

const getStockLevel = (units: number): 'critical' | 'low' | 'adequate' | 'abundant' => {
  if (units === 0) return 'critical';
  if (units <= 5) return 'low';
  if (units <= 20) return 'adequate';
  return 'abundant';
};

const stockLevelStyles = {
  critical: 'border-destructive bg-destructive/10',
  low: 'border-warning bg-warning/10',
  adequate: 'border-success bg-success/10',
  abundant: 'border-info bg-info/10',
};

const stockLevelBadge = {
  critical: 'bg-destructive text-destructive-foreground',
  low: 'bg-warning text-warning-foreground',
  adequate: 'bg-success text-success-foreground',
  abundant: 'bg-info text-info-foreground',
};

const stockLevelLabels = {
  critical: 'Critical',
  low: 'Low',
  adequate: 'Adequate',
  abundant: 'Abundant',
};

export const BloodGroupCard: React.FC<BloodGroupCardProps> = ({
  bloodGroup,
  units,
  onEdit,
  showEdit = false,
  className,
}) => {
  const level = getStockLevel(units);

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in',
        stockLevelStyles[level],
        className
      )}
      onClick={onEdit}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <span className="font-heading text-2xl font-bold text-foreground">
            {bloodGroup}
          </span>
        </div>
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            stockLevelBadge[level]
          )}
        >
          {stockLevelLabels[level]}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-4xl font-heading font-bold text-foreground">
          {units}
        </p>
        <p className="text-sm text-muted-foreground">Units Available</p>
      </div>

      {showEdit && (
        <button className="mt-4 w-full py-2 px-4 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
          Update Stock
        </button>
      )}
    </div>
  );
};
