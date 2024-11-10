// presenters/SettingsComponent.tsx
import React from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'

type SettingsComponentProps = {
  apiKeys: { devTo: string; openAI: string }
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onApiKeySave: (e: React.FormEvent<HTMLFormElement>) => void
  onBackClick: () => void
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({
  apiKeys,
  onApiKeyChange,
  onApiKeySave,
  onBackClick
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">dev.to trend summarizer</h1>
          <Button variant="ghost" onClick={onBackClick}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            戻る
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onBackClick}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API設定</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onApiKeySave} className="space-y-4">
                <div>
                  <label htmlFor="devTo" className="block text-sm font-medium mb-1">
                    dev.to API Key
                  </label>
                  <Input
                    id="devTo"
                    name="devTo"
                    value={apiKeys.devTo}
                    onChange={onApiKeyChange}
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
                    value={apiKeys.openAI}
                    onChange={onApiKeyChange}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  保存
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default SettingsComponent
