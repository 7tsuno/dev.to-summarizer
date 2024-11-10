import { invoke } from '@renderer/utils/IPC'

const list = async (): Promise<
  Array<{
    executedAt: string
    tag: string
    count: number
    range: number
  }>
> => {
  return invoke('histories.list')
}

const load = async (
  timestamp: string
): Promise<Array<{ id: number; title: string; published_timestamp: Date }> | null> => {
  return invoke('histories.load', timestamp)
}

export const histories = {
  list,
  load
}
