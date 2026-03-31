import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { clsx } from 'clsx'
import { useDeals } from '@/hooks/useDeals'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatPercent, formatDate } from '@/lib/formatters'
import type { Deal } from '@/types/deal'

type SortKey = keyof Pick<Deal, 'dealValue' | 'premium' | 'date' | 'acquirer' | 'target' | 'sector'>
type SortDir = 'asc' | 'desc'

function SortIcon({ col, activeCol, dir }: { col: string; activeCol: string; dir: SortDir }) {
  if (col !== activeCol) return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-600" />
  return dir === 'asc'
    ? <ChevronUp className="h-3.5 w-3.5 text-emerald-400" />
    : <ChevronDown className="h-3.5 w-3.5 text-emerald-400" />
}

const columns: { key: SortKey; label: string; align?: 'right' }[] = [
  { key: 'acquirer', label: 'Acquirer' },
  { key: 'target', label: 'Target' },
  { key: 'sector', label: 'Sector' },
  { key: 'dealValue', label: 'Deal Value', align: 'right' },
  { key: 'premium', label: 'Premium', align: 'right' },
  { key: 'date', label: 'Date', align: 'right' },
]

export function DealTable() {
  const deals = useDeals()
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = useMemo(() => {
    return [...deals].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [deals, sortKey, sortDir])

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 font-medium text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors',
                    col.align === 'right' ? 'text-right' : 'text-left',
                  )}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.align === 'right' && (
                      <SortIcon col={col.key} activeCol={sortKey} dir={sortDir} />
                    )}
                    {col.label}
                    {col.align !== 'right' && (
                      <SortIcon col={col.key} activeCol={sortKey} dir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.map(deal => (
              <tr
                key={deal.id}
                className="cursor-pointer hover:bg-slate-800/50 transition-colors group"
                onClick={() => navigate(`/deal/${deal.id}`)}
              >
                <td className="px-4 py-3 font-medium text-slate-200 group-hover:text-white">
                  {deal.acquirer}
                  {deal.acquirerTicker && (
                    <span className="ml-1.5 text-xs text-slate-500">{deal.acquirerTicker}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {deal.target}
                  {deal.targetTicker && (
                    <span className="ml-1.5 text-xs text-slate-500">{deal.targetTicker}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    {deal.sector}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-200">
                  {formatCurrency(deal.dealValue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {deal.premium > 0 ? (
                    <span className="text-emerald-400">{formatPercent(deal.premium, 0)}</span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">{formatDate(deal.date)}</td>
                <td className="px-4 py-3"><Badge status={deal.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
