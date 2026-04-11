import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export type HospitalOrderStatus =
  | 'pending'
  | 'approved'
  | 'ready'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'

const STATUS_FLOW: HospitalOrderStatus[] = [
  'pending',
  'approved',
  'ready',
  'dispatched',
  'delivered',
]

const STATUS_LABELS: Record<HospitalOrderStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  ready: 'Ready for Dispatch',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

interface Props {
  currentStatus: HospitalOrderStatus
  timestamps: Partial<Record<HospitalOrderStatus, string>>
}

export const OrderStatusTimeline: React.FC<Props> = ({
  currentStatus,
  timestamps,
}) => {
  if (currentStatus === 'cancelled') {
    return (
      <p className="text-sm font-medium text-destructive">
        This order was cancelled.
      </p>
    )
  }

  const currentIndex = STATUS_FLOW.indexOf(currentStatus)

  return (
    <div className="relative pl-8">
      {STATUS_FLOW.map((status, index) => {
        const isCompleted = index <= currentIndex
        const isActive = index === currentIndex
        const timestamp = timestamps[status]
        const isLast = index === STATUS_FLOW.length - 1

        return (
          <div key={status} className="relative flex gap-4 pb-8">
            {/* GRAY base line (always visible except last) */}
            {!isLast && (
              <div className="absolute left-[15px] top-7 h-full w-0.5 bg-muted" />
            )}

            {/* BLUE animated overlay (only if completed) */}
            {!isLast && index < currentIndex && (
              <div className="absolute left-[15px] top-7 h-full w-0.5 bg-primary animate-lineFill" />
            )}

            {/* Dot */}
            <div
              className={cn(
                'z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-500',
                isCompleted
                  ? 'bg-primary border-primary text-white'
                  : 'bg-background border-muted'
              )}
            >
              {isCompleted && <Check className="h-4 w-4" />}
            </div>

            {/* Label + timestamp */}
            <div>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isActive ? 'text-primary' : 'text-foreground'
                )}
              >
                {STATUS_LABELS[status]}
              </p>

              {timestamp && isCompleted && (
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
