// containers/SettingsContainer.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getKey, saveKey } from '@renderer/utils/store'
import SettingsComponent from '@renderer/components/pages/Settings/SettingsComponent'

const SettingsContainer: React.FC = () => {
  const navigate = useNavigate()

  const [apiKeys, setApiKeys] = useState({
    devTo: '',
    openAI: ''
  })

  useEffect(() => {
    const loadApiKeys = async (): Promise<void> => {
      setApiKeys({
        devTo: await getKey('devTo'),
        openAI: await getKey('openAI')
      })
    }
    loadApiKeys()
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

  const handleBackClick = (): void => {
    navigate('/')
  }

  return (
    <SettingsComponent
      apiKeys={apiKeys}
      onApiKeyChange={handleApiKeyChange}
      onApiKeySave={handleApiKeySave}
      onBackClick={handleBackClick}
    />
  )
}

export default SettingsContainer
