import { ensureDirectoryExists } from '../libs/file'
import { createBatchRequest, createRequests } from '../libs/gpt'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const blogFilePath = path.join(app.getPath('userData'), 'blog')

export const blog = {
  requestSummarize: async (
    blogs: Array<{
      id: number
      title: string
      body: string
    }>
  ): Promise<string> => {
    const model = 'gpt-4o'
    const requests = createRequests(blogs, model)
    const batchId = await createBatchRequest(requests)
    return batchId
  },
  save: async (id: string, title: string, summary: string): Promise<void> => {
    ensureDirectoryExists(blogFilePath)
    const writeDate = {
      title,
      summary
    }
    fs.writeFileSync(path.join(blogFilePath, `${id}.json`), JSON.stringify({ data: writeDate }))
  },
  load: async (id: string): Promise<object | null> => {
    ensureDirectoryExists(blogFilePath)
    if (!fs.existsSync(path.join(blogFilePath, `${id}.json`))) {
      return null
    }
    if (fs.existsSync(blogFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(path.join(blogFilePath, `${id}.json`), 'utf-8'))
      return fileData.data
    }
    return null
  }
}
