import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeftIcon, Settings } from 'lucide-react'
import { Checkbox } from '../components/ui/checkbox'
import { useLocation, useNavigate } from 'react-router-dom'
import { invoke } from '@renderer/utils/IPC'
import { getKey } from '@renderer/utils/store'

export function ResultList(): JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()

  const apiKeys = useMemo(async () => {
    return { devTo: await getKey('devTo'), openAI: await getKey('openAI') }
  }, [])

  const state = location.state as {
    tag: string
    count: string
    range: string
    executedAt: Date
    isHistory?: boolean
    apiKey?: string
  }

  const [blogList, setBlogList] = useState<
    Array<{
      id: number
      title: string
      published_timestamp: Date
    }>
  >([])

  const [selectedArticles, setSelectedArticles] = useState<number[]>([])

  useEffect(() => {
    let ignore = false
    const onload = async (): Promise<void> => {
      if (state.isHistory) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await invoke<any, Array<any>>('load-history', state.executedAt.toISOString())
        setBlogList(result)
      } else if (!ignore) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await invoke<any, Array<any>>('search', {
          apiKey: state.apiKey,
          tag: state.tag,
          count: parseInt(state.count),
          range: parseInt(state.range)
        })
        setBlogList(result)
      }
    }
    onload()
    return (): void => {
      ignore = true
    }
  }, [])

  const handleArticleSelect = (id: number): void => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((articleId) => articleId !== id) : [...prev, id]
    )
  }

  const handleTranslateAndSummarize = async (): Promise<void> => {
    const { devTo, openAI } = await apiKeys

    invoke('summarize', {
      ids: selectedArticles,
      devToKey: devTo,
      openAIKey: openAI
    })
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">dev.to trend summarizer</h1>
          <Button variant="ghost" onClick={() => navigate('settings')}>
            <Settings className="h-5 w-5 mr-2" />
            設定
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>検索条件</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4">
                <li>タグ: {state.tag || 'なし'}</li>
                <li>取得件数: {state.count}件</li>
                <li>トレンド記事の期間: 過去{state.range}日間</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>記事一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm">選択中: {selectedArticles.length} 件</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allIds = blogList.map((blog) => blog.id)
                    setSelectedArticles(selectedArticles.length === allIds.length ? [] : allIds)
                  }}
                >
                  {selectedArticles.length === blogList.length ? 'すべて選択解除' : 'すべて選択'}
                </Button>
              </div>
              <ul className="space-y-4">
                {blogList.map((blog) => (
                  <li key={blog.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        id={`article-${blog.id}`}
                        checked={selectedArticles.includes(blog.id)}
                        onCheckedChange={() => handleArticleSelect(blog.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`article-${blog.id}`}
                          className="text-lg font-semibold mb-2 block hover:underline cursor-pointer"
                        >
                          {blog.title}
                        </label>
                        <p className="text-sm text-muted-foreground mb-2">
                          {' '}
                          {new Date(blog.published_timestamp).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={handleTranslateAndSummarize}
                  disabled={selectedArticles.length === 0}
                >
                  選択した記事を翻訳して要約する
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
