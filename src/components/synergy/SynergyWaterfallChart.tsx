import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/formatters'
import type { SynergyResult } from '@/types/dcf'

interface SynergyWaterfallChartProps {
  result: SynergyResult
  companyAName: string
  companyBName: string
}

export function SynergyWaterfallChart({
  result,
  companyAName,
  companyBName,
}: SynergyWaterfallChartProps) {
  const evA = result.sumOfPartsEV * (result.sumOfPartsEV > 0 ? 0.5 : 0.5) // simplified split
  const evB = result.sumOfPartsEV - evA

  const bars = [
    { name: companyAName, value: evA, color: '#6366f1' },
    { name: companyBName, value: evB, color: '#f59e0b' },
    { name: 'Rev Synergies', value: result.annualRevenueSynergy * 5, color: '#10b981' },
    { name: 'Cost Synergies', value: result.annualCostSynergy * 5, color: '#34d399' },
    { name: 'Integration Cost', value: -result.integrationCost, color: '#f87171' },
    { name: 'Combined EV', value: result.combinedEV, color: '#22d3ee' },
  ]

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-300">
        Synergy Value Bridge
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={bars} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${Math.abs(v).toFixed(0)}B`}
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
            formatter={(v: number) => [formatCurrency(Math.abs(v)), 'Value']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {bars.map(entry => (
              <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
