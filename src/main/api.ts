import { ipcMain } from 'electron'
import { listHistories, loadHistory, saveHistory } from './libs/history'
import { getBatchStatus, getContents } from './libs/gpt'
import Store from 'electron-store'
import { devTo } from './api/devTo'
import { summarizedArticles } from './api/summarizedArticles'
import { summarize } from './api/summarize'
import { parseGPTResult } from './libs/file'
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
      const articles = await devTo.searchArticles({
        tag: object.tag,
        count: object.count,
        range: object.range
      })

      return saveHistory(articles.executedAt, articles.data, {
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
    const articles = await devTo.getArticleByIds(ids)
    return await summarize.request(articles)
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
      const fileContents = await getContents(result.outputId)
      const contents = parseGPTResult(fileContents)
      contents.forEach((content) => {
        summarizedArticles.save(content.id, content.title, content.summary)
      })
    }
    return result.status
  })

  ipcMain.handle('loadBlog', async (_event, id: string) => {
    return summarizedArticles.load(id)
  })
}
