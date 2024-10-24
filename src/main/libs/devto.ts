const API_BASE = 'https://dev.to/api'
const ARTICLES = '/articles'
import axios from 'axios'
import { saveHistory } from './history'

export async function searchDevTo(
  key: string,
  searchObject: { tag: string; count: number; range: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const response = await axios.get(`${API_BASE}${ARTICLES}`, {
    headers: {
      accept: 'application/vnd.forem.api-v1+json',
      'api-key': key
    },
    params: {
      tag: searchObject.tag,
      per_page: searchObject.count,
      top: searchObject.range
    }
  })
  saveHistory(new Date().toISOString(), response.data)
  return response.data
}
