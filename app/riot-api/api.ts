import type { LeagueEntryDTO, SummonerDTO } from './api-types'
import { withCache } from './cache'
import {
  QueueEntryNotFoundError,
  RiotAPIError,
  SummonerNotFoundError,
} from './errors'
import type { Region } from './region'
import { getRegionURL } from './region'

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
      console.error(await response.json())
      if (response.status === 404) throw new SummonerNotFoundError()
      throw new RiotAPIError()
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
      console.error(await response.json())
      throw new RiotAPIError()
    }

    const entries = await response.json()
    const soloQueueEntry = entries.find(
      (entry: LeagueEntryDTO) => entry.queueType === SOLO_QUEUE
    )
    if (!soloQueueEntry) throw new QueueEntryNotFoundError()

    return soloQueueEntry
  })
}
