import { ensureDirectoryExists } from '../libs/file'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const articleFilePath = path.join(app.getPath('userData'), 'summarizedArticles')

export const summarizedArticles = {
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
