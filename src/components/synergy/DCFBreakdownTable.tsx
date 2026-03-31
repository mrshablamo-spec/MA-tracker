import { formatCurrency, formatNumber } from '@/lib/formatters'
import { FinancialTooltip } from '@/components/ui/Tooltip'
import type { DCFYearOutput } from '@/types/dcf'

interface DCFBreakdownTableProps {
  rows: DCFYearOutput[]
  terminalValue: number
  pvTerminalValue: number
  enterpriseValue: number
}

export function DCFBreakdownTable({
  rows,
  terminalValue,
  pvTerminalValue,
  enterpriseValue,
}: DCFBreakdownTableProps) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-3">
        <h3 className="text-sm font-medium text-slate-300">
          <FinancialTooltip term="DCF">DCF Model Breakdown</FinancialTooltip>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Combined entity — post-synergy</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {['Year', 'Revenue', 'EBITDA', 'FCF', 'Disc. Factor', 'PV of FCF'].map(h => (
                <th key={h} className="px-4 py-2.5 text-right first:text-left font-medium text-slate-400 first:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map(row => (
              <tr key={row.year} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-300">FY{row.year}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-300">{formatCurrency(row.revenue)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-300">{formatCurrency(row.ebitda)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-emerald-400">{formatCurrency(row.fcf)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-400">{formatNumber(row.discountFactor, 4)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-200">{formatCurrency(row.pvFCF)}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-700 bg-slate-800/30">
              <td className="px-4 py-2 font-medium text-slate-400">Terminal Value</td>
              <td colSpan={3} className="px-4 py-2 text-right text-xs text-slate-500">
                Gordon Growth Model
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-400">
                {formatCurrency(terminalValue)} TV
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-200">
                {formatCurrency(pvTerminalValue)}
              </td>
            </tr>
            <tr className="bg-slate-800/50 font-semibold">
              <td className="px-4 py-2.5 text-slate-200">Enterprise Value</td>
              <td colSpan={4} />
              <td className="px-4 py-2.5 text-right tabular-nums text-emerald-400 text-sm">
                {formatCurrency(enterpriseValue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
