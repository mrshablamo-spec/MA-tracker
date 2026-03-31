import type { CompanyProfile } from '@/types/company'
import type { DCFAssumptions, DCFOutput, DCFYearOutput } from '@/types/dcf'
import { US_CORPORATE_TAX_RATE } from '@/lib/constants'

/**
 * Derive base Free Cash Flow from company profile.
 * Uses reported FCF; falls back to EBITDA-based estimate if FCF is non-positive.
 */
export function deriveBaseFCF(profile: CompanyProfile): number {
  if (profile.freeCashFlow > 0) return profile.freeCashFlow
  // FCF = EBITDA × (1 - taxRate) - CapEx
  const taxRate = profile.taxRate ?? US_CORPORATE_TAX_RATE
  return profile.ebitda * (1 - taxRate) - profile.capEx
}

/**
 * Two-stage blended growth: linearly interpolate from near-term CAGR to terminal growth.
 */
export function projectFCF(
  baseFCF: number,
  nearGrowth: number,
  terminalGrowth: number,
  years: number,
): number[] {
  // Cap near-term growth at 30% to avoid unrealistic projections
  const cappedNearGrowth = Math.min(nearGrowth, 0.30)
  const fcfs: number[] = []
  let prev = baseFCF

  for (let t = 1; t <= years; t++) {
    const blend = years === 1 ? 1 : (t - 1) / (years - 1)
    const g = cappedNearGrowth * (1 - blend) + terminalGrowth * blend
    const fcf = prev * (1 + g)
    fcfs.push(fcf)
    prev = fcf
  }
  return fcfs
}

/**
 * Compute terminal value using Gordon Growth Model.
 * TV = FCF_N × (1 + g) / (WACC - g)
 */
export function terminalValue(fcfFinal: number, wacc: number, terminalGrowth: number): number {
  const denominator = wacc - terminalGrowth
  if (denominator <= 0) throw new Error('WACC must exceed terminal growth rate')
  return (fcfFinal * (1 + terminalGrowth)) / denominator
}

/**
 * Discount a single cash flow at time t.
 */
export function discountFactor(wacc: number, t: number): number {
  return 1 / Math.pow(1 + wacc, t)
}

/**
 * Full standalone DCF calculation for a company.
 */
export function calculateDCF(profile: CompanyProfile, assumptions: DCFAssumptions): DCFOutput {
  const { wacc, terminalGrowthRate, projectionYears } = assumptions

  const baseFCF = deriveBaseFCF(profile)
  const nearGrowth = profile.revenueGrowth3yr ?? 0.05

  const projectedFCFs = projectFCF(baseFCF, nearGrowth, terminalGrowthRate, projectionYears)

  const years: DCFYearOutput[] = []
  let sumPVFCF = 0

  for (let t = 0; t < projectionYears; t++) {
    const fcf = projectedFCFs[t]
    const df = discountFactor(wacc, t + 1)
    const pvFCF = fcf * df
    sumPVFCF += pvFCF

    // Revenue and EBITDA projections (simplified: grow proportionally with FCF)
    const growthFactor = fcf / baseFCF
    years.push({
      year: new Date().getFullYear() + t + 1,
      revenue: profile.revenue * growthFactor,
      ebitda: profile.ebitda * growthFactor,
      fcf,
      discountFactor: df,
      pvFCF,
    })
  }

  const tv = terminalValue(projectedFCFs[projectionYears - 1], wacc, terminalGrowthRate)
  const pvTV = tv * discountFactor(wacc, projectionYears)

  const enterpriseValue = sumPVFCF + pvTV
  const equityValue = enterpriseValue - profile.netDebt
  const impliedSharePrice = equityValue / (profile.sharesOutstanding / 1000) // sharesOutstanding in millions → billions

  return {
    years,
    terminalValue: tv,
    pvTerminalValue: pvTV,
    enterpriseValue,
    equityValue,
    impliedSharePrice,
  }
}
