import { create } from 'zustand'
import type { DealNiche } from '@/types/deal'

interface FilterState {
  niche: DealNiche
  setNiche: (niche: DealNiche) => void
}

export const useFilterStore = create<FilterState>(set => ({
  niche: 'All',
  setNiche: niche => set({ niche }),
}))
