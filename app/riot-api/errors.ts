export class RiotAPIError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'RiotAPIError'
  }
}

export class SummonerNotFoundError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'SummonerNotFoundError'
  }
}
