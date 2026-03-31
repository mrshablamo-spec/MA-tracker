import { FinancialTooltip } from '@/components/ui/Tooltip'
import type { SynergyAssumptions } from '@/types/dcf'
import { DEFAULT_ASSUMPTIONS } from '@/lib/constants'

interface AssumptionsPanelProps {
  assumptions: SynergyAssumptions
  onChange: (next: SynergyAssumptions) => void
}

interface FieldConfig {
  key: keyof SynergyAssumptions
  label: string
  tooltip: string
  min: number
  max: number
  step: number
  display: (v: number) => string
  parse: (s: string) => number
}

const fields: FieldConfig[] = [
  {
    key: 'wacc',
    label: 'WACC',
    tooltip: 'WACC',
    min: 0.04, max: 0.20, step: 0.005,
    display: v => `${(v * 100).toFixed(1)}%`,
    parse: s => parseFloat(s) / 100,
  },
  {
    key: 'revenueSynergyPct',
    label: 'Revenue Synergy',
    tooltip: 'Revenue Synergy',
    min: 0, max: 0.25, step: 0.005,
    display: v => `${(v * 100).toFixed(1)}%`,
    parse: s => parseFloat(s) / 100,
  },
  {
    key: 'costSynergyPct',
    label: 'Cost Synergy',
    tooltip: 'Cost Synergy',
    min: 0, max: 0.30, step: 0.005,
    display: v => `${(v * 100).toFixed(1)}%`,
    parse: s => parseFloat(s) / 100,
  },
  {
    key: 'integrationCost',
    label: 'Integration Cost ($B)',
    tooltip: 'Integration Cost',
    min: 0, max: 10, step: 0.1,
    display: v => `$${v.toFixed(1)}B`,
    parse: s => parseFloat(s),
  },
  {
    key: 'terminalGrowthRate',
    label: 'Terminal Growth',
    tooltip: 'Terminal Value',
    min: 0.01, max: 0.05, step: 0.005,
    display: v => `${(v * 100).toFixed(1)}%`,
    parse: s => parseFloat(s) / 100,
  },
  {
    key: 'projectionYears',
    label: 'Projection Years',
    tooltip: 'DCF',
    min: 3, max: 10, step: 1,
    display: v => `${v} yrs`,
    parse: s => parseInt(s, 10),
  },
]

function toInputValue(field: FieldConfig, value: number): string {
  if (field.key === 'integrationCost') return String(value)
  if (field.key === 'projectionYears') return String(value)
  return String((value * 100).toFixed(1))
}

export function AssumptionsPanel({ assumptions, onChange }: AssumptionsPanelProps) {
  const reset = () => onChange(DEFAULT_ASSUMPTIONS)

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Model Assumptions</h3>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-300"
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-3">
        {fields.map(field => {
          const value = assumptions[field.key] as number
          return (
            <div key={field.key}>
              <div className="mb-1 flex items-center justify-between">
                <FinancialTooltip term={field.tooltip}>
                  <span className="text-xs text-slate-400">{field.label}</span>
                </FinancialTooltip>
                <span className="tabular-nums text-xs font-semibold text-emerald-400">
                  {field.display(value)}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={toInputValue(field, value)}
                onChange={e => {
                  const parsed = field.parse(e.target.value)
                  onChange({ ...assumptions, [field.key]: parsed })
                }}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-400"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
