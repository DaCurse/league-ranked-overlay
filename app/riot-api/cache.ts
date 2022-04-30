import LRUCache from 'lru-cache'

const MAX_CACHE_ENTRIES = 2000
const MAX_TTL = 1000 * 60 * 20 // 20 Minutes

let cache: LRUCache<string, any>

declare global {
  var __cache__: LRUCache<string, any>
}

function createCache() {
  return new LRUCache<string, any>({
    max: MAX_CACHE_ENTRIES,
    ttl: MAX_TTL,
  })
}

// Makes sure the cache doesn't get invalidated on hot reloads during
// developement
if (process.env.NODE_ENV === 'production') {
  cache = createCache()
} else {
  if (!global.__cache__) global.__cache__ = createCache()
  cache = global.__cache__
}

export async function withCache<TData>(
  key: string,
  callback: () => Promise<TData>
): Promise<TData> {
  const cached = cache.get(key)
  if (cached) return cached
  const result = await callback()
  cache.set(key, result)
  return result
}
