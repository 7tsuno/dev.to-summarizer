// components/Header.tsx
import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleSettingsClick = useCallback(() => {
    navigate('settings')
  }, [])

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">dev.to trend summarizer</h1>
        <Button variant="ghost" onClick={handleSettingsClick}>
          <Settings className="h-5 w-5 mr-2" />
          設定
        </Button>
      </div>
    </header>
  )
}

export default Header
