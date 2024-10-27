import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeftIcon, ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { Checkbox } from '../components/ui/checkbox'
import { useLocation, useNavigate } from 'react-router-dom'
import { invoke } from '@renderer/utils/IPC'
import { getBatchId, saveBatchId } from '@renderer/utils/store'
import ReactMarkdown from 'react-markdown'

export function ResultList(): JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    tag: string
    count: string
    range: string
    executedAt: Date
    isHistory?: boolean
  }

  const [blogList, setBlogList] = useState<
    Array<{
      id: number
      title: string
      batchId?: string
      blogData?: {
        title: string
        summary: string
      }
      published_timestamp: Date
    }>
  >([])

  const [selectedArticles, setSelectedArticles] = useState<number[]>([])
  const [expandedSummaries, setExpandedSummaries] = useState<number[]>([])

  useEffect(() => {
    let ignore = false
    const onload = async (): Promise<void> => {
      if (state.isHistory) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await invoke<any, Array<any>>('load-history', state.executedAt.toISOString())
        const convertedResult = await Promise.all(
          result.map(async (blog) => ({
            ...blog,
            batchId: await getBatchId(blog.id),
            blogData: await invoke<
              string,
              {
                title: string
                summary: string
              }
            >('loadBlog', String(blog.id))
          }))
        )
        setBlogList(convertedResult)
      } else if (!ignore) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await invoke<any, Array<any>>('search', {
          tag: state.tag,
          count: parseInt(state.count),
          range: parseInt(state.range)
        })
        const convertedResult = await Promise.all(
          result.map(async (blog) => ({
            ...blog,
            batchId: await getBatchId(blog.id),
            blogData: await invoke<
              string,
              {
                title: string
                summary: string
              }
            >('loadBlog', String(blog.id))
          }))
        )
        setBlogList(convertedResult)
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
    const batchId = await invoke<unknown, string>('summarize', selectedArticles)
    saveBatchId(batchId, selectedArticles)

    setBlogList(
      blogList.map((blog) => {
        if (selectedArticles.includes(blog.id)) {
          return { ...blog, batchId }
        }
        return blog
      })
    )

    navigate('/')
  }

  const checkSummarized = async (id: string): Promise<void> => {
    const status = await invoke<string, string>('getBatchStatus', id)
    if (status === 'completed') {
      const newBlogList = await Promise.all(
        blogList.map(async (blog) => {
          if (blog.batchId === id) {
            const blogData = await invoke<
              string,
              {
                title: string
                summary: string
              }
            >('loadBlog', String(blog.id))
            return { ...blog, blogData }
          }
          return blog
        })
      )

      setBlogList(newBlogList)
    }
  }

  const toggleSummary = (id: number): void => {
    setExpandedSummaries((prev) =>
      prev.includes(id) ? prev.filter((summaryId) => summaryId !== id) : [...prev, id]
    )
  }

  console.log(blogList)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">dev.to trend summarizer</h1>
          <Button variant="ghost" onClick={() => navigate('/settings')}>
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
                    const allIds = blogList
                      .filter((blog) => blog.batchId === undefined)
                      .map((blog) => blog.id)
                    setSelectedArticles(selectedArticles.length === allIds.length ? [] : allIds)
                  }}
                >
                  {selectedArticles.length ===
                  blogList.filter((s) => s.batchId === undefined).length
                    ? 'すべて選択解除'
                    : 'すべて選択'}
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
                        disabled={blog.batchId !== undefined}
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
                        {blog.batchId && blog.blogData === undefined && (
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">要約リクエスト済み</p>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => blog.batchId && checkSummarized(blog.batchId)}
                            >
                              要約状況を確認する
                            </Button>
                          </div>
                        )}
                        {blog.blogData && (
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSummary(blog.id)}
                              className="mb-2"
                            >
                              要約を{expandedSummaries.includes(blog.id) ? '非表示' : '表示'}
                              {expandedSummaries.includes(blog.id) ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                            {expandedSummaries.includes(blog.id) && (
                              <div className="bg-gray-100 p-4 rounded-md">
                                <h4 className="font-semibold mb-2">
                                  翻訳タイトル: {blog.blogData.title}
                                </h4>
                                <div className="prose prose-sm max-w-none">
                                  <ReactMarkdown>{blog.blogData.summary}</ReactMarkdown>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
