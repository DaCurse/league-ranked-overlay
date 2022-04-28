export type QueueTypeId = 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR'

interface QueueType {
  id: QueueTypeId
  name: string
}

export const QUEUE_TYPES: ReadonlyArray<QueueType> = [
  { id: 'RANKED_SOLO_5x5', name: 'Ranked Solo/Duo' },
  { id: 'RANKED_FLEX_SR', name: 'Ranked Flex' },
] as const
