import axios, { AxiosError } from 'axios'

const FMP_BASE = 'https://financialmodelingprep.com/api/v3'
const API_KEY = import.meta.env.VITE_FMP_API_KEY

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly isRateLimit?: boolean,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const client = axios.create({ baseURL: FMP_BASE, timeout: 10000 })

client.interceptors.response.use(
  res => res,
  (err: AxiosError) => {
    const status = err.response?.status
    const isRateLimit = status === 429 || status === 403
    throw new ApiError(
      err.message ?? 'API request failed',
      status,
      isRateLimit,
    )
  },
)

function withKey(params: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...params, apikey: API_KEY ?? '' }
}

export function hasApiKey(): boolean {
  return Boolean(API_KEY && API_KEY !== 'your_key_here' && API_KEY.length > 5)
}

export interface FMPProfile {
  symbol: string
  companyName: string
  sector: string
  industry: string
  mktCap: number
  price: number
  beta: number
  volAvg: number
  sharesOutstanding: number
  pe: number | null
}

export interface FMPIncomeStatement {
  revenue: number
  ebitda: number
  netIncome: number
  operatingExpenses: number
  incomeTaxExpense: number
  date: string
}

export interface FMPCashFlow {
  operatingCashFlow: number
  capitalExpenditure: number
  freeCashFlow: number
  date: string
}

export interface FMPBalanceSheet {
  totalDebt: number
  cashAndCashEquivalents: number
  date: string
}

export interface FMPSearchResult {
  symbol: string
  name: string
  stockExchange?: string
}

export async function fetchProfile(ticker: string): Promise<FMPProfile> {
  const { data } = await client.get<FMPProfile[]>(`/profile/${ticker}`, {
    params: withKey(),
  })
  if (!data || data.length === 0) throw new ApiError(`No profile found for ${ticker}`)
  return data[0]
}

export async function fetchIncomeStatements(ticker: string, limit = 3): Promise<FMPIncomeStatement[]> {
  const { data } = await client.get<FMPIncomeStatement[]>(
    `/income-statement/${ticker}`,
    { params: withKey({ limit }) },
  )
  return data ?? []
}

export async function fetchCashFlowStatements(ticker: string, limit = 3): Promise<FMPCashFlow[]> {
  const { data } = await client.get<FMPCashFlow[]>(
    `/cash-flow-statement/${ticker}`,
    { params: withKey({ limit }) },
  )
  return data ?? []
}

export async function fetchBalanceSheet(ticker: string): Promise<FMPBalanceSheet> {
  const { data } = await client.get<FMPBalanceSheet[]>(
    `/balance-sheet-statement/${ticker}`,
    { params: withKey({ limit: 1 }) },
  )
  if (!data || data.length === 0) throw new ApiError(`No balance sheet found for ${ticker}`)
  return data[0]
}

export async function searchTickers(query: string): Promise<FMPSearchResult[]> {
  const { data } = await client.get<FMPSearchResult[]>('/search', {
    params: withKey({ query, limit: 10 }),
  })
  return data ?? []
}
