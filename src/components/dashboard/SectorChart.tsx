import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useMemo } from 'react'
import { useDeals } from '@/hooks/useDeals'
import { SECTOR_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'

export function SectorChart() {
  const deals = useDeals()

  const data = useMemo(() => {
    const map: Record<string, number> = {}
    for (const d of deals) {
      map[d.sector] = (map[d.sector] ?? 0) + d.dealValue
    }
    return Object.entries(map)
      .map(([sector, volume]) => ({ sector, volume }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8)
  }, [deals])

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-300">Deal Volume by Sector</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="sector"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${v}B`}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 12,
            }}
            formatter={(v: number) => [formatCurrency(v), 'Volume']}
          />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
            {data.map(entry => (
              <Cell
                key={entry.sector}
                fill={SECTOR_COLORS[entry.sector] ?? '#94a3b8'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
