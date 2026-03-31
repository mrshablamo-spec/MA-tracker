import type { CompanyProfile } from '@/types/company'
import type { SynergyAssumptions, SynergyResult, DCFYearOutput } from '@/types/dcf'
import { SYNERGY_RAMP } from '@/lib/constants'
import { calculateDCF, discountFactor, projectFCF, deriveBaseFCF, terminalValue } from '@/lib/dcf'

export function calculateSynergy(
  companyA: CompanyProfile,
  companyB: CompanyProfile,
  assumptions: SynergyAssumptions,
): SynergyResult {
  const {
    wacc,
    terminalGrowthRate,
    projectionYears,
    revenueSynergyPct,
    costSynergyPct,
    integrationCost,
  } = assumptions

  // Standalone DCFs
  const dcfA = calculateDCF(companyA, assumptions)
  const dcfB = calculateDCF(companyB, assumptions)

  const evA = dcfA.enterpriseValue
  const evB = dcfB.enterpriseValue

  // Annual synergy values (fully ramped)
  const annualRevenueSynergy = (companyA.revenue + companyB.revenue) * revenueSynergyPct
  const annualCostSynergy = (companyA.opEx + companyB.opEx) * costSynergyPct
  const annualTotalSynergy = annualRevenueSynergy + annualCostSynergy

  // Base FCFs for standalone projections
  const baseFCF_A = deriveBaseFCF(companyA)
  const baseFCF_B = deriveBaseFCF(companyB)

  const projFCF_A = projectFCF(baseFCF_A, companyA.revenueGrowth3yr, terminalGrowthRate, projectionYears)
  const projFCF_B = projectFCF(baseFCF_B, companyB.revenueGrowth3yr, terminalGrowthRate, projectionYears)

  // Combined FCF by year with synergy ramp and integration costs
  const ramp = SYNERGY_RAMP.slice(0, projectionYears)
  const combinedFCFByYear: number[] = []
  const companyAFCFByYear = projFCF_A
  const companyBFCFByYear = projFCF_B

  let npvSynergies = 0
  const dcfBreakdown: DCFYearOutput[] = []

  for (let t = 0; t < projectionYears; t++) {
    const synergyThisYear = annualTotalSynergy * (ramp[t] ?? 1.0)
    const integCost = t === 0 ? integrationCost : 0
    const netSynergy = synergyThisYear - integCost
    const df = discountFactor(wacc, t + 1)

    npvSynergies += netSynergy * df

    const combinedFCF = projFCF_A[t] + projFCF_B[t] + netSynergy
    combinedFCFByYear.push(combinedFCF)

    // Revenue & EBITDA for breakdown table (proportional scale)
    const combinedRevenue = (companyA.revenue + companyB.revenue) * (combinedFCF / (baseFCF_A + baseFCF_B))
    const combinedEBITDA = combinedRevenue * ((companyA.ebitdaMargin + companyB.ebitdaMargin) / 2)

    dcfBreakdown.push({
      year: new Date().getFullYear() + t + 1,
      revenue: combinedRevenue,
      ebitda: combinedEBITDA,
      fcf: combinedFCF,
      discountFactor: df,
      pvFCF: combinedFCF * df,
    })
  }

  // Terminal value for combined entity
  const combinedFinalFCF = combinedFCFByYear[projectionYears - 1]
  const tv = terminalValue(combinedFinalFCF, wacc, terminalGrowthRate)
  const pvTV = tv * discountFactor(wacc, projectionYears)

  const sumPVCombined = dcfBreakdown.reduce((s, y) => s + y.pvFCF, 0)
  const combinedEV = sumPVCombined + pvTV
  const sumOfPartsEV = evA + evB

  const impliedPremiumJustified = sumOfPartsEV > 0
    ? (combinedEV - sumOfPartsEV) / sumOfPartsEV
    : 0

  // Accretion / Dilution (simplified stock deal)
  const taxRate = (companyA.taxRate + companyB.taxRate) / 2
  const synergyAfterTax = annualTotalSynergy * (1 - taxRate)
  const combinedNetIncome = companyA.netIncome + companyB.netIncome + synergyAfterTax
  // Assume deal is fully priced at sum-of-parts; no dilution adjustment for simplicity
  const combinedShares = companyA.sharesOutstanding + companyB.sharesOutstanding
  const proFormaEPS = combinedShares > 0 ? combinedNetIncome / (combinedShares / 1000) : 0
  const acquirerEPS = companyA.sharesOutstanding > 0
    ? companyA.netIncome / (companyA.sharesOutstanding / 1000)
    : 0
  const accretionDilution = acquirerEPS > 0 ? (proFormaEPS - acquirerEPS) / Math.abs(acquirerEPS) : 0

  // Verdict
  let verdict: SynergyResult['verdict']
  let verdictColor: SynergyResult['verdictColor']

  if (npvSynergies > 0 && impliedPremiumJustified > 0.05) {
    verdict = 'MERGER MAKES FINANCIAL SENSE'
    verdictColor = 'green'
  } else if (npvSynergies > 0 && impliedPremiumJustified >= 0) {
    verdict = 'MARGINALLY ACCRETIVE — PROCEED WITH CAUTION'
    verdictColor = 'amber'
  } else {
    verdict = 'NOT RECOMMENDED'
    verdictColor = 'red'
  }

  return {
    verdict,
    verdictColor,
    combinedEV,
    sumOfPartsEV,
    npvSynergies,
    impliedPremiumJustified,
    accretionDilution,
    annualRevenueSynergy,
    annualCostSynergy,
    integrationCost,
    combinedFCFByYear,
    companyAFCFByYear,
    companyBFCFByYear,
    dcfBreakdown,
  }
}
