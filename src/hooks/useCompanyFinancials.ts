import { useQuery } from '@tanstack/react-query'
import {
  fetchProfile,
  fetchIncomeStatements,
  fetchCashFlowStatements,
  fetchBalanceSheet,
  hasApiKey,
} from '@/lib/api'
import { mockFinancials } from '@/data/mockFinancials'
import type { CompanyProfile } from '@/types/company'

async function loadCompanyProfile(ticker: string): Promise<CompanyProfile> {
  if (!hasApiKey()) {
    const mock = mockFinancials[ticker.toUpperCase()]
    if (mock) return mock
    throw new Error(`No mock data for ${ticker}. Add a VITE_FMP_API_KEY to .env to fetch live data.`)
  }

  const [profile, incomeStmts, cashFlows, balance] = await Promise.all([
    fetchProfile(ticker),
    fetchIncomeStatements(ticker, 3),
    fetchCashFlowStatements(ticker, 3),
    fetchBalanceSheet(ticker),
  ])

  const latest = incomeStmts[0] ?? {}
  const latestCF = cashFlows[0] ?? {}

  // 3-year revenue CAGR
  let revenueGrowth3yr = 0.07
  if (incomeStmts.length >= 3) {
    const r0 = incomeStmts[0].revenue
    const r2 = incomeStmts[2].revenue
    if (r2 > 0 && r0 > 0) {
      revenueGrowth3yr = Math.pow(r0 / r2, 1 / 2) - 1
    }
  }

  const revenue = (latest.revenue ?? 0) / 1e9
  const ebitda = (latest.ebitda ?? 0) / 1e9
  const netIncome = (latest.netIncome ?? 0) / 1e9
  const fcf = (latestCF.freeCashFlow ?? 0) / 1e9
  const opCF = (latestCF.operatingCashFlow ?? 0) / 1e9
  const capEx = Math.abs((latestCF.capitalExpenditure ?? 0) / 1e9)
  const totalDebt = (balance.totalDebt ?? 0) / 1e9
  const cash = (balance.cashAndCashEquivalents ?? 0) / 1e9

  const ebitdaMargin = revenue > 0 ? ebitda / revenue : 0
  const taxRate =
    latest.ebitda && latest.netIncome
      ? 1 - (latest.netIncome / (latest.ebitda - (latest.ebitda * 0.15)))
      : 0.21
  const clampedTax = Math.max(0.05, Math.min(taxRate, 0.35))

  return {
    ticker: profile.symbol,
    name: profile.companyName,
    sector: profile.sector ?? 'Unknown',
    industry: profile.industry ?? 'Unknown',
    marketCap: (profile.mktCap ?? 0) / 1e9,
    revenue,
    ebitda,
    ebitdaMargin,
    netIncome,
    freeCashFlow: fcf > 0 ? fcf : opCF - capEx,
    totalDebt,
    cash,
    netDebt: totalDebt - cash,
    sharesOutstanding: (profile.sharesOutstanding ?? 0) / 1e6,
    peRatio: profile.pe ?? 0,
    beta: profile.beta ?? 1.0,
    revenueGrowth3yr,
    opEx: revenue - ebitda,
    capEx,
    taxRate: clampedTax,
    isUsingMockData: false,
  }
}

export function useCompanyFinancials(ticker: string | null) {
  return useQuery<CompanyProfile, Error>({
    queryKey: ['company', ticker],
    queryFn: async () => {
      if (!ticker) throw new Error('No ticker provided')
      try {
        return await loadCompanyProfile(ticker)
      } catch {
        // Fallback to mock data on any error
        const mock = mockFinancials[ticker.toUpperCase()]
        if (mock) return mock
        throw new Error(`Could not load data for ${ticker}`)
      }
    },
    enabled: Boolean(ticker),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}
