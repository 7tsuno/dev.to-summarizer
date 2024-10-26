import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { createBatchRequest, createRequests } from './gpt'

const blogFilePath = path.join(app.getPath('userData'), 'blog')

// ディレクトリが存在しない場合は作成する関数
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }) // ディレクトリが存在しない場合は作成
  }
}

export async function summarizeBlogs(
  blogs: Array<{
    id: number
    title: string
    body: string
  }>,
  key: string
): Promise<string> {
  const model = 'gpt-4o'

  const requests = createRequests(blogs, model)
  // バッチリクエストを作成してバッチIDを取得
  const batchId = await createBatchRequest(requests, key)

  return batchId
}

export function saveBlog(id: string, md: string): void {
  // ディレクトリが存在するか確認し、なければ作成
  ensureDirectoryExists(blogFilePath)

  fs.writeFileSync(path.join(blogFilePath, `${id}.json`), md)
}

export function loadBlog(id: string): object | null {
  ensureDirectoryExists(blogFilePath)
  if (fs.existsSync(blogFilePath)) {
    const fileData = JSON.parse(fs.readFileSync(path.join(blogFilePath, `${id}.json`), 'utf-8'))
    return fileData.data
  }
  return null
}
