import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeftIcon, Settings as SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getKey, saveKey } from '@renderer/utils/store'

export function Settings(): JSX.Element {
  const navigate = useNavigate()

  const [apiKeys, setApiKeys] = useState({
    devTo: '',
    openAI: ''
  })

  useEffect(() => {
    ;(async (): Promise<void> => {
      setApiKeys({ devTo: await getKey('devTo'), openAI: await getKey('openAI') })
    })()
  }, [])

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setApiKeys((prev) => ({ ...prev, [name]: value }))
  }

  const handleApiKeySave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    saveKey('devTo', apiKeys.devTo)
    saveKey('openAI', apiKeys.openAI)
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">dev.to trend summarizer</h1>
          <Button variant="ghost" onClick={() => navigate('/settings')}>
            <SettingsIcon className="h-5 w-5 mr-2" />
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
                    value={apiKeys.openAI}
                    onChange={handleApiKeyChange}
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
