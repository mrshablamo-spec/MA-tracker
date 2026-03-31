import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/formatters'

interface CashFlowProjectionChartProps {
  combinedFCF: number[]
  companyAFCF: number[]
  companyBFCF: number[]
  companyAName: string
  companyBName: string
}

export function CashFlowProjectionChart({
  combinedFCF,
  companyAFCF,
  companyBFCF,
  companyAName,
  companyBName,
}: CashFlowProjectionChartProps) {
  const currentYear = new Date().getFullYear()
  const data = combinedFCF.map((combined, i) => ({
    year: `${currentYear + i + 1}`,
    Combined: combined,
    [companyAName]: companyAFCF[i],
    [companyBName]: companyBFCF[i],
  }))

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-300">
        Free Cash Flow Projection
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${v.toFixed(0)}B`}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 12,
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Combined"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: '#10b981', r: 3 }}
          />
          <Line
            type="monotone"
            dataKey={companyAName}
            stroke="#6366f1"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={companyBName}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
