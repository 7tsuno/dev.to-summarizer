import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import dayjs from 'dayjs'

const historyFilePath = path.join(app.getPath('userData'), 'history')

const FORMAT = 'YYYYMMDDTHH_mm_ss'

// ディレクトリが存在しない場合は作成する関数
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }) // ディレクトリが存在しない場合は作成
  }
}

export function saveHistory(
  timestamp: string,
  data: object,
  params: {
    tag: string
    count: number
    range: number
  }
): void {
  // ディレクトリが存在するか確認し、なければ作成
  ensureDirectoryExists(historyFilePath)

  const writeDate = {
    data,
    params,
    executedAt: timestamp
  }

  fs.writeFileSync(
    path.join(historyFilePath, `${dayjs(timestamp).format(FORMAT)}.json`),
    JSON.stringify(writeDate)
  )
}

export function listHistories(): Array<{
  executedAt: string
  tag: string
  count: number
  range: number
}> {
  // ディレクトリが存在するか確認し、なければ作成
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

export function loadHistory(timestamp: string): object | null {
  // ディレクトリが存在するか確認し、なければ作成
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
