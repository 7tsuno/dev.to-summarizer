import { invoke } from '@renderer/utils/IPC'

const request = async (ids: Array<number>): Promise<string> => {
  return invoke('summarize.request', ids)
}

const getStatus = async (batchId: string): Promise<string> => {
  return invoke('summarize.getStatus', batchId)
}

export const summarize = {
  request,
  getStatus
}
