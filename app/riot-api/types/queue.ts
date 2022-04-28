export type QueueTypeId = 'RANKED_SOLO_5x5' | 'RANKED_TEAM_5x5'

interface QueueType {
  id: QueueTypeId
  name: string
}

export const QUEUE_TYPES: ReadonlyArray<QueueType> = [
  { id: 'RANKED_SOLO_5x5', name: 'Ranked Solo/Duo' },
  { id: 'RANKED_TEAM_5x5', name: 'Ranked Flex' },
] as const
