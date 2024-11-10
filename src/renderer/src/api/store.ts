import { invoke } from '@renderer/utils/IPC'

const saveKey = (key: string, value: string): void => {
  invoke('key.save', { key, value })
}

const getKey = async (key: string): Promise<string> => {
  return invoke('key.get', key)
}

const saveBatchId = (batchId: string, articleIds: number[]): void => {
  console.log('saveBatchId', batchId, articleIds)

  articleIds.forEach((articleId) => {
    invoke('key.save', { key: `batch_${articleId}`, value: batchId })
  })
}

const getBatchId = async (articleId: number): Promise<string> => {
  const result = await invoke('key.get', `batch_${articleId}`)
  console.log('getBatchId', articleId, result)
  return result as string
}

export const store = {
  saveKey,
  getKey,
  saveBatchId,
  getBatchId
}
