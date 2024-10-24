import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const historyFilePath = path.join(app.getPath('userData'), 'history')

// ディレクトリが存在しない場合は作成する関数
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }) // ディレクトリが存在しない場合は作成
  }
}

// APIキーを設定ファイルに保存
export function saveHistory(timestamp: string, data: object): void {
  // ディレクトリが存在するか確認し、なければ作成
  ensureDirectoryExists(historyFilePath)
  fs.writeFileSync(path.join(historyFilePath, `${timestamp}.json`), JSON.stringify(data))
}

// APIキーを読み込む
export function loadApiKey(timestamp: string): object | null {
  // ディレクトリが存在するか確認し、なければ作成
  ensureDirectoryExists(historyFilePath)
  if (fs.existsSync(historyFilePath)) {
    const data = JSON.parse(
      fs.readFileSync(path.join(historyFilePath, `${timestamp}.json`), 'utf-8')
    )
    return data
  }
  return null
}
