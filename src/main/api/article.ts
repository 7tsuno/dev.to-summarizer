import { ensureDirectoryExists } from '../libs/file'
import { createBatchRequest, createRequests } from '../libs/gpt'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const articleFilePath = path.join(app.getPath('userData'), 'article')

export const article = {
  requestSummarize: async (
    articles: Array<{
      id: number
      title: string
      body: string
    }>
  ): Promise<string> => {
    const model = 'gpt-4o'
    const requests = createRequests(articles, model)
    const batchId = await createBatchRequest(requests)
    return batchId
  },
  save: async (id: string, title: string, summary: string): Promise<void> => {
    ensureDirectoryExists(articleFilePath)
    const writeDate = {
      title,
      summary
    }
    fs.writeFileSync(path.join(articleFilePath, `${id}.json`), JSON.stringify({ data: writeDate }))
  },
  load: async (id: string): Promise<object | null> => {
    ensureDirectoryExists(articleFilePath)
    if (!fs.existsSync(path.join(articleFilePath, `${id}.json`))) {
      return null
    }
    if (fs.existsSync(articleFilePath)) {
      const fileData = JSON.parse(
        fs.readFileSync(path.join(articleFilePath, `${id}.json`), 'utf-8')
      )
      return fileData.data
    }
    return null
  }
}
