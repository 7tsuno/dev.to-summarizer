import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const configFilePath = path.join(app.getPath('userData'), 'config.json')

// APIキーを設定ファイルに保存
export function saveApiKey(apiKey: { devTo: string; openAI: string }): void {
  const config = { apiKey }
  console.log(configFilePath, JSON.stringify(config))

  fs.writeFileSync(configFilePath, JSON.stringify(config))
}

// APIキーを読み込む
export function loadApiKey(): { devTo: string; openAI: string } | null {
  if (fs.existsSync(configFilePath)) {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
    return config.apiKey
  }
  return null
}
