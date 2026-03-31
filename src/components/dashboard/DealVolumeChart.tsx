import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useMemo } from 'react'
import { useDeals } from '@/hooks/useDeals'
import { formatCurrency } from '@/lib/formatters'

export function DealVolumeChart() {
  const deals = useDeals()

  const data = useMemo(() => {
    // Group by year-month
    const map: Record<string, number> = {}
    for (const d of deals) {
      const ym = d.date.slice(0, 7) // "YYYY-MM"
      map[ym] = (map[ym] ?? 0) + d.dealValue
    }
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([ym, volume]) => ({
        month: new Date(ym + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        volume,
      }))
  }, [deals])

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-300">Deal Volume Over Time</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${v}B`}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 12,
            }}
            formatter={(v: number) => [formatCurrency(v), 'Volume']}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#volGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
