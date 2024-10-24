import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { SearchIcon, ArrowLeftIcon, Settings, ChevronRight } from 'lucide-react'

export function AiTrendTranslator(): JSX.Element {
  const [formState, setFormState] = useState({
    tags: 'generativeai',
    count: '10',
    range: '10'
  })

  const [formErrors, setFormErrors] = useState({
    tags: '',
    count: '',
    range: ''
  })

  const [isFormValid, setIsFormValid] = useState(false)
  const [currentView, setCurrentView] = useState('main') // 'main', 'history', 'settings', or 'full-history'

  const [apiKeys, setApiKeys] = useState({
    devTo: '',
    openAI: ''
  })

  const [apiKeyError, setApiKeyError] = useState('')

  const validateField = (name: string, value: string): void => {
    if (name === 'tags') {
      if (value.trim() === '') {
        setFormErrors((prev) => ({ ...prev, tags: 'タグを1つ以上入力してください' }))
      } else {
        setFormErrors((prev) => ({ ...prev, tags: '' }))
      }
    } else if (name === 'count') {
      const count = parseInt(value)
      if (isNaN(count) || count < 1 || count > 30) {
        setFormErrors((prev) => ({ ...prev, count: '1から30の間で入力してください' }))
      } else {
        setFormErrors((prev) => ({ ...prev, count: '' }))
      }
    } else if (name === 'range') {
      const range = parseInt(value)
      if (isNaN(range) || range < 1) {
        setFormErrors((prev) => ({ ...prev, range: '1以上の値を入力してください' }))
      } else {
        setFormErrors((prev) => ({ ...prev, range: '' }))
      }
    }
  }

  const checkFormValidity = (): void => {
    const tagsValid = formState.tags.trim() !== ''
    const countValid = parseInt(formState.count) >= 1 && parseInt(formState.count) <= 30
    const rangeValid = parseInt(formState.range) >= 1
    setIsFormValid(tagsValid && countValid && rangeValid)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
    checkFormValidity()
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    validateField(name, value)
    checkFormValidity()
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setApiKeys((prev) => ({ ...prev, [name]: value }))
  }

  const handleApiKeySave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // ここでAPI Keyを保存する処理を実装します
    console.log('API Keys saved:', apiKeys)
    // 保存後にメインビューに戻ります
    setCurrentView('main')
  }

  const checkApiKeys = (): boolean => {
    if (!apiKeys.devTo || !apiKeys.openAI) {
      setApiKeyError('必要なAPI Keyが設定されていません。右上の設定画面から入力してください。')
      return false
    }
    setApiKeyError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (checkApiKeys()) {
      // ここに記事検索と要約のロジックを実装します
      console.log('記事を検索して要約します', formState)
    }
  }

  const saveAPIKey = async (): Promise<void> => {
    console.log('2', window.electron)

    window.electron.invoke('save-api-key', {
      devTo: apiKeys.devTo,
      openAI: apiKeys.openAI
    })
  }

  // この部分は実際のアプリケーションでは動的に生成されるデータです
  const summaries = [
    { id: 1, title: '生成AIの最新トレンド', executedAt: '2023-10-24T14:30:00Z' },
    { id: 2, title: 'AIと倫理：今後の課題', executedAt: '2023-10-23T09:15:00Z' },
    { id: 3, title: '自然言語処理の進化', executedAt: '2023-10-22T18:45:00Z' }
  ]

  const summariseHistory = [
    { id: 1, executedAt: '2023-10-24T14:30:00Z', tags: 'generativeai, ai', count: 10, range: 7 },
    { id: 2, executedAt: '2023-10-23T09:15:00Z', tags: 'machinelearning', count: 5, range: 14 },
    { id: 3, executedAt: '2023-10-22T18:45:00Z', tags: 'nlp, transformers', count: 15, range: 30 },
    { id: 4, executedAt: '2023-10-21T11:30:00Z', tags: 'deeplearning', count: 8, range: 10 },
    { id: 5, executedAt: '2023-10-20T16:00:00Z', tags: 'computervision', count: 12, range: 20 },
    {
      id: 6,
      executedAt: '2023-10-19T10:45:00Z',
      tags: 'reinforcementlearning',
      count: 6,
      range: 15
    }
  ]

  const renderSummaryList = (summaries: typeof summariseHistory, limit?: number): JSX.Element => {
    const summariesToShow = limit ? summaries.slice(0, limit) : summaries
    return (
      <ul className="space-y-3">
        {summariesToShow.map((summary) => (
          <li key={summary.id} className="border-b last:border-b-0 pb-3 last:pb-0">
            <a
              href="#"
              className="block hover:bg-muted p-2 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setCurrentView('history')
              }}
            >
              <p className="font-medium text-sm">要約結果</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(summary.executedAt).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <div className="mt-2 text-xs">
                <p>
                  <span className="font-semibold">タグ:</span> {summary.tags}
                </p>
                <p>
                  <span className="font-semibold">件数:</span> {summary.count}
                </p>
                <p>
                  <span className="font-semibold">期間:</span> {summary.range}日間
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">dev.to trend summarizer</h1>
          <Button variant="ghost" onClick={() => setCurrentView('settings')}>
            <Settings className="h-5 w-5 mr-2" />
            設定
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">
        {currentView === 'main' && (
          <>
            <div className="md:w-3/4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>記事検索</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium mb-1">
                        タグで記事を検索
                      </label>
                      <Input
                        id="tags"
                        name="tags"
                        placeholder="generativeai, ai"
                        className={`w-full ${formErrors.tags ? 'border-red-500' : ''}`}
                        value={formState.tags}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                      {formErrors.tags && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.tags}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        カンマ区切りでタグを指定してください。
                      </p>
                    </div>
                    <div>
                      <label htmlFor="count" className="block text-sm font-medium mb-1">
                        取得件数
                      </label>
                      <Input
                        id="count"
                        name="count"
                        type="number"
                        value={formState.count}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className={`w-full ${formErrors.count ? 'border-red-500' : ''}`}
                      />
                      {formErrors.count && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.count}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        取得する記事の件数を入力してください。（1-30件）
                      </p>
                    </div>
                    <div>
                      <label htmlFor="range" className="block text-sm font-medium mb-1">
                        トレンド記事の期間
                      </label>
                      <Input
                        id="range"
                        name="range"
                        type="number"
                        value={formState.range}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className={`w-full ${formErrors.range ? 'border-red-500' : ''}`}
                      />
                      {formErrors.range && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.range}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        過去何日間の記事を対象にしますか？（デフォルト: 10日間）
                      </p>
                    </div>
                    <Button className="w-full" disabled={!isFormValid} type="submit">
                      <SearchIcon className="mr-2 h-4 w-4" /> 記事を検索して要約する
                    </Button>
                    {apiKeyError && <p className="text-sm text-red-500 mt-2">{apiKeyError}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>

            <aside className="md:w-1/4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>要約履歴</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSummaryList(summariseHistory, 5)}
                  {summariseHistory.length > 5 && (
                    <Button
                      variant="link"
                      className="mt-2 w-full"
                      onClick={() => setCurrentView('full-history')}
                    >
                      もっと見る
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </aside>
          </>
        )}

        {currentView === 'history' && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => setCurrentView('main')}>
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
                  <li>タグ: {formState.tags || 'なし'}</li>
                  <li>取得件数: {formState.count}件</li>
                  <li>トレンド記事の期間: 過去{formState.range}日間</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>要約結果記事一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {summaries.map((summary) => (
                    <li key={summary.id} className="border-b pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold mb-2">
                        <a href="#" className="hover:underline">
                          {summary.title}
                        </a>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        要約実行日時:{' '}
                        {new Date(summary.executedAt).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <Button variant="outline" size="sm">
                        要約を表示
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API設定</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApiKeySave} className="space-y-4">
                  <div>
                    <label htmlFor="devTo" className="block text-sm font-medium mb-1">
                      dev.to API Key
                    </label>
                    <Input
                      id="devTo"
                      name="devTo"
                      type="password"
                      value={apiKeys.devTo}
                      onChange={handleApiKeyChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="openAI" className="block text-sm font-medium mb-1">
                      OpenAI API Key
                    </label>
                    <Input
                      id="openAI"
                      name="openAI"
                      type="password"
                      value={apiKeys.openAI}
                      onChange={handleApiKeyChange}
                      className="w-full"
                    />
                  </div>
                  <Button type="button" className="w-full" onClick={saveAPIKey}>
                    保存
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'full-history' && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => setCurrentView('main')}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">{renderSummaryList(summariseHistory)}</CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-muted mt-8 py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <a href="#" className="hover:underline">
            利用規約
          </a>{' '}
          |{' '}
          <a href="#" className="hover:underline">
            プライバシーポリシー
          </a>{' '}
          |{' '}
          <a href="#" className="hover:underline">
            お問い合わせ
          </a>
        </div>
      </footer>
    </div>
  )
}
