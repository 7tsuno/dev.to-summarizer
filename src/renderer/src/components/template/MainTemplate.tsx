// templates/PageTemplate.tsx
import React from 'react'
import Header from '../ui/Header'

type PageTemplateProps = {
  children: React.ReactNode
}

const MainTemplate: React.FC<PageTemplateProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">{children}</main>
  </div>
)

export default MainTemplate
