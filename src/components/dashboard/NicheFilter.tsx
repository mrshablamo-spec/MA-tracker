import { clsx } from 'clsx'
import { useFilterStore } from '@/store/filterStore'
import type { DealNiche } from '@/types/deal'
import { NICHE_OPTIONS } from '@/lib/constants'

export function NicheFilter() {
  const { niche, setNiche } = useFilterStore()

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-700/50">
      {NICHE_OPTIONS.map(option => (
        <button
          key={option}
          onClick={() => setNiche(option as DealNiche)}
          className={clsx(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            niche === option
              ? 'bg-slate-700 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
