import { rest } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
  rest.get(
    'https://:region.api.riotgames.com/lol/summoner/v4/summoners/by-name/:summonerName',
    (req, res, ctx) => {
      res()
    }
  ),

  rest.get(
    'https://:region.api.riotgames.com/lol/league/v4/entries/by-summoner/:summonerId',
    (req, res, ctx) => {
      res()
    }
  ),
]

const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'warn' })
console.info('🔶 Mock server running')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
