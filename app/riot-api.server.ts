import LRU from 'lru-cache'

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

type Region = keyof typeof regions

export function isValidRegion(regionName: string): regionName is Region {
  return regions.hasOwnProperty(regionName)
}

interface SummonerDTO {
  accountId: string
  profileIconId: number
  revisionDate: number
  name: string
  id: string
  puuid: string
  summonerLevel: number
}

interface LeagueEntryDTO {
  leagueId: string
  summonerId: string
  summonerName: string
  queueType: string
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
  hotStreak: boolean
  veteran: boolean
  freshBlood: boolean
  inactive: boolean
  miniSeries: MiniSeriesDTO
}

interface MiniSeriesDTO {
  losses: number
  progress: string
  target: number
  wins: number
}

function getRegionURL(region: Region) {
  return `https://${regions[region]}.api.riotgames.com/`
}

function fetchLeagueAPI(
  region: Region,
  endpoint: string,
  options: RequestInit = {}
) {
  return fetch(`${getRegionURL(region)}${endpoint}`, {
    headers: {
      'X-Riot-Token': String(process.env.RIOT_TOKEN),
    },
    ...options,
  })
}

const MAX_CACHE_ENTRIES = 100
const MAX_TTL = 1000 * 60 * 30 // 30 Minutes
const summonerCache = new LRU({ max: MAX_CACHE_ENTRIES, ttl: MAX_TTL })
const leagueEntryCache = new LRU({ max: MAX_CACHE_ENTRIES, ttl: MAX_TTL })

export async function getSummonerByName(
  name: string,
  region: Region
): Promise<SummonerDTO> {
  const cacheKey = `${region}-${name}`
  if (summonerCache.has(cacheKey)) {
    return summonerCache.get(cacheKey)!
  }

  const response = await fetchLeagueAPI(
    region,
    `lol/summoner/v4/summoners/by-name/${name}`
  )

  if (response.status !== 200) {
    if (response.status === 404) {
      throw new Error('Summoner not found')
    }
    throw new Error('Invalid response from Riot API')
  }

  const summonerDTO = await response.json()
  summonerCache.set(cacheKey, summonerDTO)

  return summonerDTO
}

export async function getLeagueEntries(
  summonerId: string,
  region: Region
): Promise<LeagueEntryDTO[]> {
  const cacheKey = `${region}-${summonerId}`
  if (leagueEntryCache.has(cacheKey)) return leagueEntryCache.get(cacheKey)!

  const response = await fetchLeagueAPI(
    region,
    `lol/league/v4/entries/by-summoner/${summonerId}`
  )

  if (response.status !== 200) {
    throw new Error('Invalid response from Riot API')
  }

  const entries = await response.json()
  leagueEntryCache.set(cacheKey, entries)

  return entries
}
