import type { SynergyAssumptions } from '@/types/dcf'

export const DEFAULT_ASSUMPTIONS: SynergyAssumptions = {
  wacc: 0.09,
  terminalGrowthRate: 0.025,
  projectionYears: 5,
  revenueSynergyPct: 0.05,
  costSynergyPct: 0.08,
  integrationCost: 0.5,  // $500M default
}

export const SYNERGY_RAMP = [0.25, 0.65, 0.85, 1.0, 1.0]

export const US_CORPORATE_TAX_RATE = 0.21

export const SECTOR_COLORS: Record<string, string> = {
  'Software': '#6366f1',
  'Semiconductors': '#8b5cf6',
  'Cloud Infrastructure': '#3b82f6',
  'Cybersecurity': '#06b6d4',
  'AI / ML': '#10b981',
  'Solar Energy': '#f59e0b',
  'Wind Energy': '#84cc16',
  'Energy Storage': '#22d3ee',
  'Electric Vehicles': '#34d399',
  'Clean Infrastructure': '#a3e635',
  'FinTech': '#f472b6',
  'Health Tech': '#fb7185',
  'Other': '#94a3b8',
}

export const NICHE_OPTIONS = ['All', 'AI Startups', 'Green Tech'] as const
