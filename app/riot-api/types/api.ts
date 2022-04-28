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
