const API_BASE = 'https://dev.to/api'
const ARTICLES = '/articles'
import axios from 'axios'
import { saveHistory } from './history'
import { getDevToKey } from './keyStore'

export async function searchDevTo(
  searchObject: { tag: string; count: number; range: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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
  saveHistory(new Date().toISOString(), response.data, {
    tag: searchObject.tag,
    count: searchObject.count,
    range: searchObject.range
  })
  return response.data
}

export async function getArticleByIds(ids: Array<number>): Promise<
  Array<{
    id: number
    title: string
    body: string
  }>
> {
  return Promise.all(
    ids.map(async (id) => {
      const response = await axios.get(`${API_BASE}${ARTICLES}/${id}`, {
        headers: {
          accept: 'application/vnd.forem.api-v1+json',
          'api-key': getDevToKey()
        }
      })
      return {
        id,
        title: response.data.title,
        body: response.data.body_markdown
      }
    })
  )
}
