// templates/PageTemplate.tsx
import React from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@renderer/hooks/useDarkMode'
import Header from '../ui/Header'

type PageTemplateProps = {
  children: React.ReactNode
}

const MainTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </Header>
      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">{children}</main>
    </div>
  )
}

export default MainTemplate
