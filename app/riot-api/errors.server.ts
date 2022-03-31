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

export class QueueEntryNotFoundError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'QueueEntryNotFoundError'
  }
}
