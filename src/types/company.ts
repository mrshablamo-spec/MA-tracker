export interface CompanyProfile {
  ticker: string
  name: string
  sector: string
  industry: string
  marketCap: number          // in billions USD
  revenue: number            // LTM, in billions USD
  ebitda: number             // LTM, in billions USD
  ebitdaMargin: number       // decimal
  netIncome: number          // LTM, in billions USD
  freeCashFlow: number       // LTM, in billions USD
  totalDebt: number          // in billions USD
  cash: number               // in billions USD
  netDebt: number            // totalDebt - cash, in billions USD
  sharesOutstanding: number  // in millions
  peRatio: number
  beta: number
  revenueGrowth3yr: number   // 3-year CAGR, decimal
  opEx: number               // total operating expenses, in billions
  capEx: number              // in billions
  taxRate: number            // effective tax rate, decimal
  isUsingMockData?: boolean
}

export interface AnnualFinancials {
  year: number
  revenue: number
  ebitda: number
  netIncome: number
  freeCashFlow: number
  operatingCashFlow: number
  capEx: number
}
