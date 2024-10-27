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
  }>
): Promise<string> {
  const model = 'gpt-4o'

  const requests = createRequests(blogs, model)
  // バッチリクエストを作成してバッチIDを取得
  const batchId = await createBatchRequest(requests)

  return batchId
}

export function saveBlog(id: string, title: string, summary: string): void {
  // ディレクトリが存在するか確認し、なければ作成
  ensureDirectoryExists(blogFilePath)

  const writeDate = {
    title,
    summary
  }

  fs.writeFileSync(path.join(blogFilePath, `${id}.json`), JSON.stringify({ data: writeDate }))
}

export function loadBlog(id: string): object | null {
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
