import { ensureDirectoryExists } from '../libs/file'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const articleFilePath = path.join(app.getPath('userData'), 'summarizedArticles')

const save = (id: string, title: string, summary: string): void => {
  ensureDirectoryExists(articleFilePath)
  const writeDate = {
    title,
    summary
  }
  fs.writeFileSync(path.join(articleFilePath, `${id}.json`), JSON.stringify({ data: writeDate }))
}

const load = (id: string): { title: string; summary: string } | undefined => {
  ensureDirectoryExists(articleFilePath)
  if (!fs.existsSync(path.join(articleFilePath, `${id}.json`))) {
    return undefined
  }
  if (fs.existsSync(articleFilePath)) {
    const fileData = JSON.parse(fs.readFileSync(path.join(articleFilePath, `${id}.json`), 'utf-8'))
    return fileData.data
  }
  return undefined
}

export const summarizedArticles = {
  save,
  load
}
