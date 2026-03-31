import { SECTOR_COLORS } from '@/lib/constants'

export interface SectorInfo {
  name: string
  niche: 'AI Startups' | 'Green Tech'
  color: string
}

export const sectors: SectorInfo[] = [
  { name: 'Software',            niche: 'AI Startups', color: SECTOR_COLORS['Software'] },
  { name: 'Semiconductors',      niche: 'AI Startups', color: SECTOR_COLORS['Semiconductors'] },
  { name: 'Cloud Infrastructure',niche: 'AI Startups', color: SECTOR_COLORS['Cloud Infrastructure'] },
  { name: 'Cybersecurity',       niche: 'AI Startups', color: SECTOR_COLORS['Cybersecurity'] },
  { name: 'AI / ML',             niche: 'AI Startups', color: SECTOR_COLORS['AI / ML'] },
  { name: 'Health Tech',         niche: 'AI Startups', color: SECTOR_COLORS['Health Tech'] },
  { name: 'Solar Energy',        niche: 'Green Tech',  color: SECTOR_COLORS['Solar Energy'] },
  { name: 'Wind Energy',         niche: 'Green Tech',  color: SECTOR_COLORS['Wind Energy'] },
  { name: 'Energy Storage',      niche: 'Green Tech',  color: SECTOR_COLORS['Energy Storage'] },
  { name: 'Electric Vehicles',   niche: 'Green Tech',  color: SECTOR_COLORS['Electric Vehicles'] },
  { name: 'Clean Infrastructure',niche: 'Green Tech',  color: SECTOR_COLORS['Clean Infrastructure'] },
]
