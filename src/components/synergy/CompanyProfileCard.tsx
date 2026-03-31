import { Building2, Database } from 'lucide-react'
import { Skeleton } from '@/components/ui/LoadingSpinner'
import { formatCurrency, formatPercent, formatMultiple } from '@/lib/formatters'
import type { CompanyProfile } from '@/types/company'

interface CompanyProfileCardProps {
  profile: CompanyProfile
  loading?: boolean
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-slate-800 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="tabular-nums font-medium text-slate-200">{value}</span>
    </div>
  )
}

export function CompanyProfileCard({ profile, loading }: CompanyProfileCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="font-semibold text-slate-100">{profile.name}</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-xs font-mono text-emerald-400">
              {profile.ticker}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{profile.industry}</p>
        </div>
        {profile.isUsingMockData && (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400 ring-1 ring-inset ring-amber-500/20">
            <Database className="h-3 w-3" />
            Demo
          </span>
        )}
      </div>

      <div>
        <Row label="Market Cap" value={formatCurrency(profile.marketCap)} />
        <Row label="Revenue (LTM)" value={formatCurrency(profile.revenue)} />
        <Row label="EBITDA" value={formatCurrency(profile.ebitda)} />
        <Row label="EBITDA Margin" value={formatPercent(profile.ebitdaMargin)} />
        <Row label="Free Cash Flow" value={formatCurrency(profile.freeCashFlow)} />
        <Row label="Net Debt" value={
          profile.netDebt < 0
            ? `(${formatCurrency(Math.abs(profile.netDebt))}) net cash`
            : formatCurrency(profile.netDebt)
        } />
        {profile.peRatio > 0 && <Row label="P/E Ratio" value={formatMultiple(profile.peRatio)} />}
        <Row label="3yr Rev CAGR" value={formatPercent(profile.revenueGrowth3yr)} />
      </div>
    </div>
  )
}
