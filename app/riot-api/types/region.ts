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
}

export const REGIONS: ReadonlyArray<Region> = [
  { id: 'BR1', name: 'Brazil (BR)' },
  { id: 'EUN1', name: 'Europe Nordic & East (EUNE)' },
  { id: 'EUW1', name: 'Europe West (EUW)' },
  { id: 'JP1', name: 'Japan (JP)' },
  { id: 'KR', name: 'Korea (KR)' },
  { id: 'LA1', name: 'Latin America North (LAN)' },
  { id: 'LA2', name: 'Latin America South (LAS)' },
  { id: 'NA1', name: 'North America (NA)' },
  { id: 'OC1', name: 'Oceania (OCE)' },
  { id: 'RU1', name: 'Russia (RU)' },
  { id: 'TR1', name: 'Turkey (TR)' },
] as const

export function getRegionURL(region: RegionId) {
  return `https://${region}.api.riotgames.com/`
}
