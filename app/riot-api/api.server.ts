import { withCache } from './cache.server'
import { getRegionURL, Region } from './region.server'

export interface SummonerDTO {
  accountId: string
  profileIconId: number
  revisionDate: number
  name: string
  id: string
  puuid: string
  summonerLevel: number
}

export interface LeagueEntryDTO {
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

// Making this an enum/record will allow fetching ranked data for other queue types
const SOLO_QUEUE = 'RANKED_SOLO_5x5'

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

export function getSummonerByName(name: string, region: Region) {
  return withCache<SummonerDTO>(`${region}-${name}`, async () => {
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

    return await response.json()
  })
}

export function getLeagueEntry(summonerId: string, region: Region) {
  return withCache<LeagueEntryDTO>(`${region}-${summonerId}`, async () => {
    const response = await fetchLeagueAPI(
      region,
      `lol/league/v4/entries/by-summoner/${summonerId}`
    )

    if (response.status !== 200) {
      throw new Error('Invalid response from Riot API')
    }

    const entries = await response.json()
    const soloQueueEntry = entries.find(
      (entry: LeagueEntryDTO) => entry.queueType === SOLO_QUEUE
    )
    if (!soloQueueEntry) throw new Error('No solo queue entry found')
    return soloQueueEntry
  })
}
