// presenters/ResultListComponent.tsx
import React from 'react'
import { ArrowLeftIcon, ChevronDown, ChevronUp } from 'lucide-react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Checkbox } from '@renderer/components/ui/checkbox'
import MainTemplate from '@renderer/components/template/MainTemplate'

type ResultListComponentProps = {
  blogList: Array<{
    id: number
    title: string
    batchId?: string
    blogData?: { title: string; summary: string }
    published_timestamp: Date
    status?: string
  }>
  selectedArticles: number[]
  expandedSummaries: number[]
  state: {
    tag: string
    count: string
    range: string
    executedAt: Date
  }
  navigate: (path: string) => void
  onArticleSelect: (id: number) => void
  onTranslateAndSummarize: () => void
  onCheckSummarized: (id: string) => void
  onToggleSummary: (id: number) => void
  onToggleSelectAll: () => void
}

const ResultListComponent: React.FC<ResultListComponentProps> = ({
  blogList,
  selectedArticles,
  expandedSummaries,
  state,
  navigate,
  onArticleSelect,
  onTranslateAndSummarize,
  onCheckSummarized,
  onToggleSummary,
  onToggleSelectAll
}) => {
  const summaryMarked = (summary: string): string => {
    return marked(DOMPurify.sanitize(summary)) as string
  }

  return (
    <MainTemplate>
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
                    onToggleSelectAll()
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
                        onCheckedChange={() => onArticleSelect(blog.id)}
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
                          {new Date(blog.published_timestamp).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {blog.batchId && !blog.blogData && (
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">要約リクエスト済み</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCheckSummarized(blog.batchId!)}
                            >
                              要約状況を確認する
                            </Button>
                            {blog.status && (
                              <p className="text-md mt-2 mb-2">Status : {blog.status}</p>
                            )}
                          </div>
                        )}
                        {blog.blogData && (
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onToggleSummary(blog.id)}
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
                                <h4 className="font-semibold mb-2 text-3xl">
                                  {blog.blogData.title}
                                </h4>
                                <div
                                  className="markdown"
                                  dangerouslySetInnerHTML={{
                                    __html: summaryMarked(blog.blogData.summary)
                                  }}
                                />
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
                  onClick={onTranslateAndSummarize}
                  disabled={selectedArticles.length === 0}
                >
                  選択した記事を翻訳して要約する
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </MainTemplate>
  )
}

export default ResultListComponent
