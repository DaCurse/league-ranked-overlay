import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { HeadersFunction, LoaderFunction } from 'remix'
import { json, useLoaderData } from 'remix'
import { capitalize, getRankImage } from '~/common'
import {
  getLeagueEntry,
  getSummonerByName,
  RiotAPIError,
  SummonerNotFoundError,
} from '~/riot-api'
import { QUEUE_TYPES, REGIONS } from '~/riot-api/types'

const MILLISECONDS_PER_SECOND = 1000
const RESET_INTERVAL = 60 * 20 // 20 Minutes

interface LoaderData {
  style: 'full' | 'compact'
  summonerName: string
  regionAbbr: string
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

  const style = String(searchParams.get('style'))
  if (style !== 'full' && style !== 'compact') {
    throw new Response('Invalid style specified', { status: 400 })
  }

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
      const tier = 'Unranked'
      const rank = ''
      return json<LoaderData>({
        summonerName: name,
        regionAbbr: region.abbr,
        image: getRankImage(style, tier, rank),
        style,
        tier,
        rank,
        wins: 0,
        losses: 0,
        leaguePoints: 0,
        textColor,
      })
    }

    const { tier, rank, leaguePoints, wins, losses } = entry

    return json<LoaderData>({
      summonerName: name,
      regionAbbr: region.abbr,
      image: getRankImage(style, tier, rank),
      style,
      tier,
      rank,
      wins,
      losses,
      leaguePoints,
      textColor,
    })
  } catch (error) {
    if (error instanceof SummonerNotFoundError)
      throw new Response('Summoner not found', { status: 404 })
    if (error instanceof RiotAPIError)
      throw new Response('Riot API error', { status: 500 })
  }
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-gray-700 bg-opacity-40 px-1.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  )
}

interface FullOverlayProps {
  summonerName: string
  regionAbbr: string
  tier: string
  rank: string
  wins: number
  losses: number
  leaguePoints: number
  image: string
}
function FullOverlay({
  image,
  summonerName,
  regionAbbr,
  tier,
  rank,
  wins,
  losses,
  leaguePoints,
}: FullOverlayProps) {
  const winRatio = wins + losses === 0 ? 0 : wins / (wins + losses)
  const winPrecentage = (100 * winRatio).toFixed(1)

  return (
    <>
      <div>
        <img
          className="h-100[px] w-[100px]"
          src={image}
          alt={`${tier} ${rank}`}
        />
      </div>
      <div>
        <div className="font-beaufort text-lg font-bold">
          {summonerName} <sup className="text-xs">{regionAbbr}</sup>
        </div>
        <div>
          {capitalize(tier)} {rank} <Badge>{leaguePoints} LP</Badge>
        </div>
        <p className="text-sm">
          <span className="text-green-500">{wins}W</span>{' '}
          <span className="text-red-500">{losses}L</span>{' '}
          <span>({winPrecentage}%)</span>
        </p>
      </div>
    </>
  )
}

interface ComapctLayoutProps {
  image: string
  tier: string
  rank: string
  leaguePoints: number
}
function ComapctLayout({
  tier,
  rank,
  leaguePoints,
  image,
}: ComapctLayoutProps) {
  return (
    <>
      <img className="mr-1 h-8 w-8" src={image} alt={`${tier} ${rank}`} />
      <div className="text-sm">
        {capitalize(tier)} {rank} <Badge>{leaguePoints} LP</Badge>
      </div>
    </>
  )
}

export default function Overlay() {
  const {
    style,
    summonerName,
    regionAbbr,
    tier,
    rank,
    wins,
    losses,
    leaguePoints,
    image,
    textColor,
  } = useLoaderData<LoaderData>()

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.reload()
    }, RESET_INTERVAL * MILLISECONDS_PER_SECOND)

    return () => clearTimeout(timeout)
  })

  return (
    <div
      className="flex items-center justify-start"
      style={{ color: textColor }}
    >
      {style === 'full' ? (
        <FullOverlay
          image={image}
          summonerName={summonerName}
          regionAbbr={regionAbbr}
          tier={tier}
          rank={rank}
          wins={wins}
          losses={losses}
          leaguePoints={leaguePoints}
        />
      ) : (
        <ComapctLayout
          image={image}
          tier={tier}
          rank={rank}
          leaguePoints={leaguePoints}
        />
      )}
    </div>
  )
}
