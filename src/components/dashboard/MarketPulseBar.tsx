import { MetricCard } from '@/components/ui/MetricCard'
import { useDealStats } from '@/hooks/useDeals'
import { formatCurrency, formatPercent } from '@/lib/formatters'

export function MarketPulseBar() {
  const { totalVolume, avgPremium, largest, completed, total } = useDealStats()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricCard
        label="Total Deal Volume"
        value={formatCurrency(totalVolume)}
        sublabel="across tracked deals"
      />
      <MetricCard
        label="Avg Acquisition Premium"
        value={formatPercent(avgPremium)}
        sublabel="of deals with premium data"
      />
      <MetricCard
        label="Largest Deal"
        value={largest?.acquirer ?? '—'}
        sublabel={largest ? `↔ ${largest.target} · ${formatCurrency(largest.dealValue)}` : undefined}
      />
      <MetricCard
        label="Completed Deals"
        value={`${completed} / ${total}`}
        sublabel="successfully closed"
      />
    </div>
  )
}
