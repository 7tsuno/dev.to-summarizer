import { ipcMain } from 'electron'
import { getBatchStatus, getContents } from './libs/gpt'
import Store from 'electron-store'
import { devTo } from './api/devTo'
import { summarizedArticles } from './api/summarizedArticles'
import { summarize } from './api/summarize'
import { histories } from './api/histories'
const store = new Store({ encryptionKey: 'your-encryption-key' })

export const apis = (): void => {
  ipcMain.handle(
    'articles.search',
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

      histories.save(articles.executedAt, articles.data, {
        tag: object.tag,
        count: object.count,
        range: object.range
      })

      return articles.executedAt
    }
  )

  ipcMain.handle('histories.list', () => {
    return histories.list()
  })

  ipcMain.handle('histories.load', (_event, timestamp: string) => {
    return histories.load(timestamp)
  })

  ipcMain.handle('summarize.request', async (_event, ids: Array<number>) => {
    const articles = await devTo.getArticleByIds(ids)
    return await summarize.request(articles)
  })

  ipcMain.handle('summarize.getStatus', async (_event, batchId: string) => {
    const result = await getBatchStatus(batchId)
    if (result.status === 'complete' && result.outputId) {
      const fileContents = await getContents(result.outputId)
      const contents = summarize.parseGPTResult(fileContents)
      contents.forEach((content) => {
        summarizedArticles.save(content.id, content.title, content.summary)
      })
    }
    return result.status
  })

  ipcMain.handle('summarizedArticles.load', async (_event, id: string) => {
    return summarizedArticles.load(id)
  })

  ipcMain.handle('key.get', (_event, key: string) => {
    return store.get(key)
  })

  ipcMain.handle('key.save', (_event, params: { key: string; value: string }) => {
    console.log('key.save', params.key, params.value)

    store.set(params.key, params.value)
  })
}
