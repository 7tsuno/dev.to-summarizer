import { invoke } from '@renderer/utils/IPC'

const search = async (tag: string, count: number, range: number): Promise<string> => {
  return invoke('articles.search', { tag, count, range })
}

export const articles = {
  search
}
