import { clsx } from 'clsx'
import type { DealStatus } from '@/types/deal'

const statusStyles: Record<DealStatus, string> = {
  Completed: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  Pending: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  Rumored: 'bg-violet-500/15 text-violet-400 ring-violet-500/30',
  Terminated: 'bg-red-500/15 text-red-400 ring-red-500/30',
}

interface BadgeProps {
  status: DealStatus
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        statusStyles[status],
      )}
    >
      {status}
    </span>
  )
}
