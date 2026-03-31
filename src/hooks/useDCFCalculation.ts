import { useMemo } from 'react'
import type { CompanyProfile } from '@/types/company'
import type { DCFAssumptions, DCFOutput } from '@/types/dcf'
import { calculateDCF } from '@/lib/dcf'

export function useDCFCalculation(
  profile: CompanyProfile | undefined,
  assumptions: DCFAssumptions,
): DCFOutput | null {
  return useMemo(() => {
    if (!profile) return null
    try {
      return calculateDCF(profile, assumptions)
    } catch {
      return null
    }
  }, [profile, assumptions])
}
