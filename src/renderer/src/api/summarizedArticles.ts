import { invoke } from '@renderer/utils/IPC'

const load = async (id: string): Promise<{ title: string; summary: string } | undefined> => {
  return invoke('summarizedArticles.load', id)
}

export const summarizedArticles = {
  load
}
