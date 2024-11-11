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
): Promise<Array<{ id: number; title: string; published_timestamp: Date; url: string }> | null> => {
  return invoke('histories.load', timestamp)
}

const deleteHistory = async (executedAt: string): Promise<void> => {
  invoke('histories.delete', executedAt)
}

export const histories = {
  list,
  load,
  delete: deleteHistory
}
