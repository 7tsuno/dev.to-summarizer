import axios from 'axios'
import { getDevToKey } from '../libs/keyStore'

const API_BASE = 'https://dev.to/api'
const ARTICLES = '/articles'
const DELAY = 100

const delay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, DELAY))
}

export const devTo = {
  searchArticles: async (searchObject: {
    tag: string
    count: number
    range: number
  }): Promise<{
    executedAt: string
    data: object
  }> => {
    const response = await axios.get(`${API_BASE}${ARTICLES}`, {
      headers: {
        accept: 'application/vnd.forem.api-v1+json',
        'api-key': getDevToKey()
      },
      params: {
        tag: searchObject.tag,
        per_page: searchObject.count,
        top: searchObject.range
      }
    })

    return {
      executedAt: new Date().toISOString(),
      data: response.data
    }
  },
  getArticleByIds: async (
    ids: Array<number>
  ): Promise<
    Array<{
      id: number
      title: string
      body: string
    }>
  > => {
    const results: Array<{
      id: number
      title: string
      body: string
    }> = []
    for (const id of ids) {
      const response = await axios.get(`${API_BASE}${ARTICLES}/${id}`, {
        headers: {
          accept: 'application/vnd.forem.api-v1+json',
          'api-key': getDevToKey()
        }
      })
      results.push({
        id,
        title: response.data.title,
        body: response.data.body_markdown
      })
      // 早くリクエストを送りすぎるとAPI制限に引っかかるため、適度に待機しつつリクエストを送る
      await delay()
    }
    return results
  }
}
