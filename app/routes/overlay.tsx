import { useEffect } from 'react'
import type { HeadersFunction, LoaderFunction } from 'remix'
import { json, useLoaderData } from 'remix'
import { capitalize, romanToNumber } from '~/common'
import {
  getLeagueEntry,
  getSummonerByName,
  RiotAPIError,
  SummonerNotFoundError,
} from '~/riot-api'
import { QUEUE_TYPES, REGIONS } from '~/riot-api/types'

const MILLISECONDS_PER_SECOND = 1000
const RESET_INTERVAL = 60 * 20 // 20 Minutes

type LoaderData = {
  summonerName: string
  regionName: string
  tier: string
  rank: string
  wins: number
  losses: number
  leaguePoints: number
  image: string
  textColor: string
}

export const headers: HeadersFunction = () => ({
  'Cache-Control': `max-age=${RESET_INTERVAL}`,
})

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)

  const summonerName = searchParams.get('summonerName')
  if (typeof summonerName !== 'string')
    throw new Response('No summoner name provided', { status: 400 })

  const regionIndex = Number(searchParams.get('region'))
  if (REGIONS[regionIndex] === undefined)
    throw new Response('Invalid region provided', { status: 400 })
  const region = REGIONS[regionIndex]

  const queueTypeIndex = Number(searchParams.get('queueType'))
  if (QUEUE_TYPES[queueTypeIndex] === undefined)
    throw new Response('Invalid queue type provided', { status: 400 })
  const queueType = QUEUE_TYPES[queueTypeIndex]

  const textColor = String(searchParams.get('textColor'))

  try {
    const { id, name } = await getSummonerByName(summonerName, region.id)
    const entry = await getLeagueEntry(id, region.id, queueType.id)
    if (!entry) {
      // TODO: Return data for an unranked summoner
      return
    }
    const { tier, rank, leaguePoints, wins, losses } = entry
    const rankNumber = romanToNumber(rank)
    const image = `/assets/ranks/full/${tier.toLowerCase()}_${rankNumber}.webp`

    return json<LoaderData>({
      summonerName: name,
      regionName: region.name,
      tier,
      rank,
      wins,
      losses,
      leaguePoints,
      image,
      textColor,
    })
  } catch (error) {
    if (error instanceof SummonerNotFoundError)
      throw new Response('Summoner not found', { status: 404 })
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
    textColor,
  } = useLoaderData()
  const winRatio = wins / (wins + losses)
  const winPrecentage = (100 * winRatio).toFixed(1)

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, MILLISECONDS_PER_SECOND * RESET_INTERVAL)

    return () => clearInterval(interval)
  })

  return (
    <div
      className="flex items-center justify-start "
      style={{ color: textColor }}
    >
      <div>
        <img
          className="h-100[px] w-[100px]"
          src={image}
          alt={`${tier} ${rank}`}
        />
      </div>
      <div>
        <div className="font-beaufort text-lg font-bold">
          {summonerName} <sup>{region}</sup>
        </div>
        <div>
          {capitalize(tier)} {rank} {leaguePoints}LP
        </div>
        <p className="text-sm">
          <span className="text-green-500">{wins}W</span>{' '}
          <span className="text-red-500">{losses}L</span>{' '}
          <span>({winPrecentage}%)</span>
        </p>
      </div>
    </div>
  )
}
