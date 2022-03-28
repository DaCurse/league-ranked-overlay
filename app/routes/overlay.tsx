import { HeadersFunction, json, LoaderFunction, useLoaderData } from 'remix'
import invariant from 'tiny-invariant'
import {
  getLeagueEntries,
  getSummonerByName,
  isValidRegion,
} from '~/riot-api.server'

type LoaderData = {
  summonerName: string
  region: string
  tier: string
  rank: string
  wins: number
  losses: number
  leaguePoints: number
}

export const headers: HeadersFunction = () => ({
  'Cache-Control': `max-age=${60 * 30}`, // 30 Minutes
})

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)

  const summonerName = searchParams.get('summonerName')
  invariant(typeof summonerName === 'string', 'No summoner name provided')

  const region = String(searchParams.get('region'))
  invariant(isValidRegion(region), 'Invalid region provided')

  const { id, name } = await getSummonerByName(summonerName, region)

  const entries = await getLeagueEntries(id, region)
  invariant(entries.length > 0, 'No league entries found')

  const { tier, rank, wins, losses, leaguePoints } = entries[0]

  return json<LoaderData>({
    summonerName: name,
    region,
    tier,
    rank,
    wins,
    losses,
    leaguePoints,
  })
}

export default function RankOverlay() {
  const { summonerName, region, tier, rank, wins, losses, leaguePoints } =
    useLoaderData()

  return (
    <>
      <h1>
        {summonerName} <small>{region}</small>
      </h1>
      <h2>
        {tier} {rank} {leaguePoints}LP
      </h2>
      <p>
        {wins}W {losses}L
      </p>
    </>
  )
}
