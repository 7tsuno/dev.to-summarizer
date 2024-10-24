import React, { useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { SearchIcon, Settings, ChevronRight } from 'lucide-react'
import { invoke } from '@renderer/utils/IPC'
import { useNavigate } from 'react-router-dom'

export function Home(): JSX.Element {
  const navigate = useNavigate()

  const [formState, setFormState] = useState({
    tag: 'ai',
    count: '10',
    range: '10'
  })

  const [formErrors, setFormErrors] = useState({
    tag: '',
    count: '',
    range: ''
  })

  const [isFormValid, setIsFormValid] = useState(true)

  const [apiKeyError, setApiKeyError] = useState('')

  const apiKeys = useMemo(async () => {
    return await invoke<undefined, { devTo: string; openAI: string }>('load-api-key')
  }, [])

  const validateField = (name: string, value: string): void => {
    if (name === 'count') {
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
    const countValid = parseInt(formState.count) >= 1 && parseInt(formState.count) <= 30
    const rangeValid = parseInt(formState.range) >= 1
    setIsFormValid(countValid && rangeValid)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const devToApiKey = (await apiKeys).devTo

    if (devToApiKey === '') {
      setApiKeyError('APIキーが設定されていません')
      return
    }

    navigate('resultList', {
      state: {
        tag: formState.tag,
        count: formState.count,
        range: formState.range,
        executedAt: new Date(),
        apiKey: devToApiKey
      }
    })
  }

  const summariseHistory = [
    {
      id: 1,
      executedAt: new Date('2023-10-24T14:30:00Z'),
      tag: 'generativeai, ai',
      count: 10,
      range: 7
    },
    {
      id: 2,
      executedAt: new Date('2023-10-24T14:30:00Z'),
      tag: 'generativeai, ai',
      count: 10,
      range: 7
    },
    {
      id: 3,
      executedAt: new Date('2023-10-24T14:30:00Z'),
      tag: 'generativeai, ai',
      count: 10,
      range: 7
    },
    {
      id: 4,
      executedAt: new Date('2023-10-24T14:30:00Z'),
      tag: 'generativeai, ai',
      count: 10,
      range: 7
    },
    {
      id: 5,
      executedAt: new Date('2023-10-24T14:30:00Z'),
      tag: 'generativeai, ai',
      count: 10,
      range: 7
    },
    {
      id: 6,
      executedAt: new Date('2023-10-24T14:30:00Z'),
      tag: 'generativeai, ai',
      count: 10,
      range: 7
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
                navigate('resultList', { state: { ...summary } })
              }}
            >
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
                  <span className="font-semibold">タグ:</span> {summary.tag}
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
          <Button
            variant="ghost"
            onClick={async () => navigate('settings', { state: { apiKeys: await apiKeys } })}
          >
            <Settings className="h-5 w-5 mr-2" />
            設定
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">
        <>
          <div className="md:w-3/4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>記事検索</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="tag" className="block text-sm font-medium mb-1">
                      タグ
                    </label>
                    <Input
                      id="tag"
                      name="tag"
                      placeholder="ai"
                      className={`w-full ${formErrors.tag ? 'border-red-500' : ''}`}
                      value={formState.tag}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                    {formErrors.tag && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.tag}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">タグを指定してください。</p>
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
                    <SearchIcon className="mr-2 h-4 w-4" /> 記事を検索する
                  </Button>
                  {apiKeyError && <p className="text-sm text-red-500 mt-2">{apiKeyError}</p>}
                </form>
              </CardContent>
            </Card>
          </div>

          <aside className="md:w-1/4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>履歴</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSummaryList(summariseHistory, 5)}
                {summariseHistory.length > 5 && (
                  <Button
                    variant="link"
                    className="mt-2 w-full"
                    onClick={() => navigate('history')}
                  >
                    もっと見る
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
        </>
      </main>
    </div>
  )
}
