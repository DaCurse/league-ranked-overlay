export type RegionId =
  | 'BR1'
  | 'EUN1'
  | 'EUW1'
  | 'JP1'
  | 'KR'
  | 'LA1'
  | 'LA2'
  | 'NA1'
  | 'OC1'
  | 'RU1'
  | 'TR1'

interface Region {
  id: RegionId
  name: string
  abbr: string
}

export const REGIONS: ReadonlyArray<Region> = [
  { id: 'BR1', name: 'Brazil', abbr: 'BR' },
  { id: 'EUN1', name: 'Europe Nordic & East', abbr: 'EUNE' },
  { id: 'EUW1', name: 'Europe West', abbr: 'EUW' },
  { id: 'JP1', name: 'Japan', abbr: 'JP' },
  { id: 'KR', name: 'Korea', abbr: 'KR' },
  { id: 'LA1', name: 'Latin America North', abbr: 'LAN' },
  { id: 'LA2', name: 'Latin America South', abbr: 'LAS' },
  { id: 'NA1', name: 'North America', abbr: 'NA' },
  { id: 'OC1', name: 'Oceania', abbr: 'OCE' },
  { id: 'RU1', name: 'Russia', abbr: 'RU' },
  { id: 'TR1', name: 'Turkey', abbr: 'TR' },
] as const

export function getRegionURL(region: RegionId) {
  return `https://${region}.api.riotgames.com/`
}
