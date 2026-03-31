export interface DCFAssumptions {
  wacc: number               // decimal, e.g. 0.09
  terminalGrowthRate: number // decimal, e.g. 0.025
  projectionYears: number    // integer, typically 5
}

export interface SynergyAssumptions extends DCFAssumptions {
  revenueSynergyPct: number  // decimal, e.g. 0.05
  costSynergyPct: number     // decimal, e.g. 0.08
  integrationCost: number    // in billions USD
}

export interface DCFYearOutput {
  year: number
  revenue: number
  ebitda: number
  fcf: number
  discountFactor: number
  pvFCF: number
}

export interface DCFOutput {
  years: DCFYearOutput[]
  terminalValue: number
  pvTerminalValue: number
  enterpriseValue: number
  equityValue: number
  impliedSharePrice: number
}

export type SynergyVerdict =
  | 'MERGER MAKES FINANCIAL SENSE'
  | 'MARGINALLY ACCRETIVE — PROCEED WITH CAUTION'
  | 'NOT RECOMMENDED'

export interface SynergyResult {
  verdict: SynergyVerdict
  verdictColor: 'green' | 'amber' | 'red'
  combinedEV: number
  sumOfPartsEV: number
  npvSynergies: number
  impliedPremiumJustified: number  // decimal
  accretionDilution: number        // decimal, positive = accretive
  annualRevenueSynergy: number
  annualCostSynergy: number
  integrationCost: number
  combinedFCFByYear: number[]
  companyAFCFByYear: number[]
  companyBFCFByYear: number[]
  dcfBreakdown: DCFYearOutput[]
}
