// presenters/HomePresenter.tsx
import React from 'react'
import { SearchIcon } from 'lucide-react'
import SummaryList from './SummaryList'
import MainTemplate from '@renderer/components/template/MainTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'

type HomePresenterProps = {
  formState: { tag: string; count: string; range: string }
  formErrors: { tag: string; count: string; range: string }
  isFormValid: boolean
  apiKeyError: string
  summariseHistory: Array<{ executedAt: string; tag: string; count: number; range: number }>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  navigate: (path: string, state?: object) => void
  handleHistoryClick: (item: HistoryItem) => void
}

type HistoryItem = {
  executedAt: string
  tag: string
  count: number
  range: number
}

const HomeComponent: React.FC<HomePresenterProps> = ({
  formState,
  formErrors,
  isFormValid,
  apiKeyError,
  summariseHistory,
  handleInputChange,
  handleSubmit,
  navigate,
  handleHistoryClick
}) => {
  return (
    <MainTemplate>
      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">
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
                  />
                  {formErrors.tag && <p className="text-sm text-red-500 mt-1">{formErrors.tag}</p>}
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
              <SummaryList
                summaries={summariseHistory}
                onSummaryClick={handleHistoryClick}
                limit={10}
                onViewMore={() => navigate('/history')}
              />
            </CardContent>
          </Card>
        </aside>
      </main>
    </MainTemplate>
  )
}

export default HomeComponent
