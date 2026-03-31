import { clsx } from 'clsx'
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { FinancialTooltip } from '@/components/ui/Tooltip'
import type { SynergyResult } from '@/types/dcf'

interface SynergyResultCardProps {
  result: SynergyResult
}

const colorMap = {
  green: {
    banner: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle2,
  },
  amber: {
    banner: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: AlertTriangle,
  },
  red: {
    banner: 'bg-red-500/10 border-red-500/30',
    text: 'text-red-400',
    icon: XCircle,
  },
}

function Metric({
  label,
  value,
  tooltip,
  positive,
}: {
  label: string
  value: string
  tooltip?: string
  positive?: boolean
}) {
  return (
    <div className="rounded-lg bg-slate-800/60 px-3 py-2.5">
      <p className="mb-0.5 text-xs text-slate-400">
        {tooltip ? (
          <FinancialTooltip term={tooltip}>{label}</FinancialTooltip>
        ) : (
          label
        )}
      </p>
      <p
        className={clsx(
          'tabular-nums text-base font-semibold',
          positive === true ? 'text-emerald-400' : positive === false ? 'text-red-400' : 'text-slate-100',
        )}
      >
        {value}
      </p>
    </div>
  )
}

export function SynergyResultCard({ result }: SynergyResultCardProps) {
  const style = colorMap[result.verdictColor]
  const Icon = style.icon

  const accPos = result.accretionDilution >= 0

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 overflow-hidden">
      {/* Verdict banner */}
      <div className={clsx('border-b px-5 py-4', style.banner)}>
        <div className="flex items-center gap-3">
          <Icon className={clsx('h-6 w-6 shrink-0', style.text)} />
          <div>
            <p className={clsx('text-lg font-bold tracking-tight', style.text)}>
              {result.verdict}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on DCF synergy model · adjust assumptions to re-run
            </p>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric
          label="Combined EV"
          value={formatCurrency(result.combinedEV)}
          tooltip="EV"
        />
        <Metric
          label="NPV of Synergies"
          value={formatCurrency(result.npvSynergies)}
          tooltip="DCF"
          positive={result.npvSynergies >= 0}
        />
        <Metric
          label="Implied Premium"
          value={formatPercent(result.impliedPremiumJustified)}
          tooltip="Implied Premium"
          positive={result.impliedPremiumJustified >= 0}
        />
        <Metric
          label="Revenue Synergies"
          value={`${formatCurrency(result.annualRevenueSynergy)}/yr`}
          tooltip="Revenue Synergy"
          positive
        />
        <Metric
          label="Cost Synergies"
          value={`${formatCurrency(result.annualCostSynergy)}/yr`}
          tooltip="Cost Synergy"
          positive
        />
        <div className="rounded-lg bg-slate-800/60 px-3 py-2.5">
          <p className="mb-0.5 text-xs text-slate-400">
            <FinancialTooltip term="Accretion / Dilution">Accretion / Dilution</FinancialTooltip>
          </p>
          <p className={clsx('tabular-nums text-base font-semibold flex items-center gap-1', accPos ? 'text-emerald-400' : 'text-red-400')}>
            {accPos ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {accPos ? '+' : ''}{(result.accretionDilution * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}
