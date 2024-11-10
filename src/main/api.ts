import { ipcMain } from 'electron'
import { listHistories, loadHistory } from './libs/history'
import { getArticleByIds, searchDevTo } from './libs/devto'
import { getBatchStatus, getContents } from './libs/gpt'
import Store from 'electron-store'
import { blog } from './api/blog'
const store = new Store({ encryptionKey: 'your-encryption-key' })

export const apis = (): void => {
  ipcMain.handle(
    'search',
    async (
      _event,
      object: {
        tag: string
        count: number
        range: number
      }
    ) => {
      return await searchDevTo({
        tag: object.tag,
        count: object.count,
        range: object.range
      })
    }
  )

  ipcMain.handle('get-history', () => {
    return listHistories()
  })

  ipcMain.handle('load-history', (_event, timestamp: string) => {
    return loadHistory(timestamp)
  })

  ipcMain.handle('summarize', async (_event, ids: Array<number>) => {
    const articles = await getArticleByIds(ids)
    return await blog.requestSummarize(articles)
  })

  ipcMain.handle('getKey', (_event, key: string) => {
    return store.get(key)
  })

  ipcMain.handle('saveKey', (_event, key: string, value: string) => {
    store.set(key, value)
  })

  ipcMain.handle('getBatchStatus', async (_event, batchId: string) => {
    const result = await getBatchStatus(batchId)
    if (result.status === 'complete' && result.outputId) {
      const contents = await getContents(result.outputId)
      contents.forEach((content) => {
        blog.save(content.id, content.title, content.summary)
      })
    }
    return result.status
  })

  ipcMain.handle('loadBlog', async (_event, id: string) => {
    return blog.load(id)
  })
}
