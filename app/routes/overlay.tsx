import { useEffect } from 'react'
import { HeadersFunction, json, LoaderFunction, useLoaderData } from 'remix'
import invariant from 'tiny-invariant'
import {
  getLeagueEntries,
  getSummonerByName,
  isValidRegion,
} from '~/riot-api.server'
import { romanToNumber } from '~/utils.server'

const MILLISECONDS_PER_SECOND = 1000
const RESET_INTERVAL = 60 * 30 // 30 Minutes

type LoaderData = {
  summonerName: string
  region: string
  tier: string
  rank: string
  wins: number
  losses: number
  leaguePoints: number
  image: string
}

export const headers: HeadersFunction = () => ({
  'Cache-Control': `max-age=${RESET_INTERVAL}`,
})

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)

  const summonerName = searchParams.get('summonerName')
  invariant(typeof summonerName === 'string', 'No summoner name provided')

  const region = String(searchParams.get('region')).toUpperCase()
  invariant(isValidRegion(region), 'Invalid region provided')

  const { id, name } = await getSummonerByName(summonerName, region)

  const entries = await getLeagueEntries(id, region)
  invariant(entries.length > 0, 'No league entries found')

  const { tier, rank, wins, losses, leaguePoints } = entries[0]
  const rankNumber = romanToNumber(rank)
  const rankImage = `/ranks/${tier.toLowerCase()}_${rankNumber}.png`

  return json<LoaderData>({
    summonerName: name,
    region,
    tier,
    rank,
    wins,
    losses,
    leaguePoints,
    image: rankImage,
  })
}

export default function Overlay() {
  const {
    summonerName,
    region,
    tier,
    rank,
    wins,
    losses,
    leaguePoints,
    image,
  } = useLoaderData()

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, MILLISECONDS_PER_SECOND * RESET_INTERVAL)

    return () => clearInterval(interval)
  })

  return (
    <>
      <img src={image} alt={`${tier} ${rank}`} />
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
