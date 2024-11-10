import { ensureDirectoryExists } from '../libs/file'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import dayjs from 'dayjs'

const historyFilePath = path.join(app.getPath('userData'), 'history')
const FORMAT = 'YYYYMMDDTHH_mm_ss'

const save = (
  timestamp: string,
  data: object,
  params: { tag: string; count: number; range: number }
): void => {
  ensureDirectoryExists(historyFilePath)
  fs.writeFileSync(
    path.join(historyFilePath, `${dayjs(timestamp).format(FORMAT)}.json`),
    JSON.stringify({
      data,
      params,
      executedAt: timestamp
    })
  )
}

const list = (): Array<{
  executedAt: string
  tag: string
  count: number
  range: number
}> => {
  ensureDirectoryExists(historyFilePath)
  if (fs.existsSync(historyFilePath)) {
    return fs
      .readdirSync(historyFilePath)
      .map((fileName) => {
        const data = JSON.parse(fs.readFileSync(path.join(historyFilePath, fileName), 'utf-8'))
        return {
          executedAt: data.executedAt,
          tag: data.params.tag,
          count: data.params.count,
          range: data.params.range
        }
      })
      .sort((a, b) => {
        return dayjs(b.executedAt).diff(dayjs(a.executedAt))
      })
  }
  return []
}

const load = (timestamp: string): object | null => {
  ensureDirectoryExists(historyFilePath)
  if (fs.existsSync(historyFilePath)) {
    const fileData = JSON.parse(
      fs.readFileSync(
        path.join(historyFilePath, `${dayjs(timestamp).format(FORMAT)}.json`),
        'utf-8'
      )
    )
    return fileData.data
  }
  return null
}

export const histories = {
  save,
  list,
  load
}