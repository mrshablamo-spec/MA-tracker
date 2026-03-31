import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  delta?: number
  sublabel?: string
  className?: string
}

export function MetricCard({ label, value, delta, sublabel, className }: MetricCardProps) {
  const hasDelta = delta !== undefined

  return (
    <div className={clsx('rounded-xl bg-slate-900 border border-slate-700/50 p-4', className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-100">{value}</p>
      {hasDelta && (
        <p
          className={clsx(
            'mt-1 flex items-center gap-1 text-xs font-medium',
            delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-slate-400',
          )}
        >
          {delta > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : delta < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          {delta > 0 ? '+' : ''}{(delta * 100).toFixed(1)}%
        </p>
      )}
      {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
    </div>
  )
}
