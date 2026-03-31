export type DealStatus = 'Completed' | 'Pending' | 'Rumored' | 'Terminated'
export type DealNiche = 'AI Startups' | 'Green Tech' | 'All'

export interface Deal {
  id: string
  acquirer: string
  acquirerTicker?: string
  target: string
  targetTicker?: string
  sector: string
  niche: Exclude<DealNiche, 'All'>
  dealValue: number        // in billions USD
  premium: number          // acquisition premium as decimal (e.g. 0.25 = 25%)
  status: DealStatus
  date: string             // ISO date string
  rationale: string
  tags: string[]
}
