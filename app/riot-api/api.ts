import { withCache } from './cache'
import {
  QueueEntryNotFoundError,
  RiotAPIError,
  SummonerNotFoundError,
} from './errors'
import type {
  LeagueEntryDTO,
  QueueTypeId,
  RegionId,
  SummonerDTO,
} from './types'
import { getRegionURL } from './types'

function fetchLeagueAPI(
  region: RegionId,
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

export function getSummonerByName(name: string, regionId: RegionId) {
  return withCache<SummonerDTO>(`${name}-${regionId}`, async () => {
    const response = await fetchLeagueAPI(
      regionId,
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

export function getLeagueEntry(
  summonerId: string,
  regionId: RegionId,
  queueTypeId: QueueTypeId
) {
  return withCache<LeagueEntryDTO>(
    `${summonerId}-${regionId}-${queueTypeId}`,
    async () => {
      const response = await fetchLeagueAPI(
        regionId,
        `lol/league/v4/entries/by-summoner/${summonerId}`
      )

      if (response.status !== 200) {
        console.error(await response.json())
        throw new RiotAPIError()
      }

      const entries = await response.json()
      const queueEntry = entries.find(
        (entry: LeagueEntryDTO) => entry.queueType === queueTypeId
      )
      if (!queueEntry) throw new QueueEntryNotFoundError()

      return queueEntry
    }
  )
}
