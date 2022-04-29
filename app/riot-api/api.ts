import { withCache } from './cache'
import { RiotAPIError, SummonerNotFoundError } from './errors'
import type {
  LeagueEntryDTO,
  QueueTypeId,
  RegionId,
  SummonerDTO,
} from './types'
import { getRegionURL } from './types'

function fetchLeagueAPI(
  regionId: RegionId,
  endpoint: string,
  options: RequestInit = {}
) {
  const url = new URL(endpoint, getRegionURL(regionId))
  return fetch(url.toString(), {
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
      `/lol/summoner/v4/summoners/by-name/${name}`
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
  return withCache<LeagueEntryDTO | null>(
    `${summonerId}-${regionId}-${queueTypeId}`,
    async () => {
      const response = await fetchLeagueAPI(
        regionId,
        `/lol/league/v4/entries/by-summoner/${summonerId}`
      )

      if (response.status !== 200) {
        console.error(await response.json())
        throw new RiotAPIError()
      }

      const entries: LeagueEntryDTO[] = await response.json()
      const entry = entries.find(
        (entry: LeagueEntryDTO) => entry.queueType === queueTypeId
      )

      return entry ?? null
    }
  )
}
