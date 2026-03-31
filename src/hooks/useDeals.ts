import { useMemo } from 'react'
import { deals } from '@/data/deals'
import { useFilterStore } from '@/store/filterStore'
import type { Deal } from '@/types/deal'

export function useDeals(): Deal[] {
  const niche = useFilterStore(s => s.niche)

  return useMemo(() => {
    if (niche === 'All') return deals
    return deals.filter(d => d.niche === niche)
  }, [niche])
}

export function useDealStats() {
  const filtered = useDeals()
  return useMemo(() => {
    const totalVolume = filtered.reduce((s, d) => s + d.dealValue, 0)
    const premiums = filtered.filter(d => d.premium > 0).map(d => d.premium)
    const avgPremium = premiums.length > 0 ? premiums.reduce((s, p) => s + p, 0) / premiums.length : 0
    const largest = filtered.reduce(
      (max, d) => (d.dealValue > max.dealValue ? d : max),
      filtered[0] ?? { dealValue: 0, acquirer: '—', target: '—' },
    )
    const completed = filtered.filter(d => d.status === 'Completed').length
    return { totalVolume, avgPremium, largest, completed, total: filtered.length }
  }, [filtered])
}
