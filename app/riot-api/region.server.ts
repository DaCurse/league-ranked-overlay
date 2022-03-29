export const regions = {
  BR: 'BR1',
  EUNE: 'EUN1',
  EUW: 'EUW1',
  JP: 'JP1',
  KR: 'KR',
  LA1: 'LA1',
  LA2: 'LA2',
  NA: 'NA1',
  OCE: 'OC1',
  RU: 'RU1',
  TR: 'TR1',
}

export type Region = keyof typeof regions

export function isValidRegion(regionName: string): regionName is Region {
  return regions.hasOwnProperty(regionName)
}

export function getRegionURL(region: Region) {
  return `https://${regions[region]}.api.riotgames.com/`
}
