import { useMemo } from 'react'
import type { CompanyProfile } from '@/types/company'
import type { SynergyAssumptions, SynergyResult } from '@/types/dcf'
import { calculateSynergy } from '@/lib/synergy'

export function useSynergyScore(
  companyA: CompanyProfile | undefined,
  companyB: CompanyProfile | undefined,
  assumptions: SynergyAssumptions,
): SynergyResult | null {
  return useMemo(() => {
    if (!companyA || !companyB) return null
    try {
      return calculateSynergy(companyA, companyB, assumptions)
    } catch {
      return null
    }
  }, [companyA, companyB, assumptions])
}
