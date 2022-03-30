import { useEffect } from 'react'
import { HeadersFunction, json, LoaderFunction, useLoaderData } from 'remix'
import {
  getLeagueEntry,
  getSummonerByName,
  isValidRegion,
  QueueEntryNotFoundError,
  RiotAPIError,
  SummonerNotFoundError,
} from '~/riot-api'
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
  if (typeof summonerName !== 'string')
    throw new Response('No summoner name provided', { status: 400 })

  const region = String(searchParams.get('region')).toUpperCase()
  if (!isValidRegion(region))
    throw new Response('Invalid region provided', { status: 400 })

  try {
    const { id, name } = await getSummonerByName(summonerName, region)
    const { tier, rank, wins, losses, leaguePoints } = await getLeagueEntry(
      id,
      region
    )
    const rankNumber = romanToNumber(rank)
    const rankImage = `/ranks/${tier.toLowerCase()}_${rankNumber}.webp`

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
  } catch (error) {
    if (error instanceof SummonerNotFoundError)
      throw new Response('Summoner not found', { status: 404 })
    if (error instanceof QueueEntryNotFoundError)
      throw new Response('No solo queue data found', { status: 404 })
    if (error instanceof RiotAPIError)
      throw new Response('Riot API error', { status: 500 })
  }
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
