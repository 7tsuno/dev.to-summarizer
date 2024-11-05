// containers/HomeContainer.tsx
import HomeComponent from '@renderer/components/pages/Home/HomeComponents'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSummariseHistory } from './hooks/useSummariseHistory'
import { useSearchForm } from './hooks/useSearchForm'

const HomeContainer: React.FC = () => {
  const navigate = useNavigate()

  const { formState, formErrors, isFormValid, apiKeyError, handleInputChange, handleSubmit } =
    useSearchForm()

  const { summariseHistory, handleHistoryClick } = useSummariseHistory()

  return (
    <HomeComponent
      navigate={navigate}
      formState={formState}
      formErrors={formErrors}
      isFormValid={isFormValid}
      apiKeyError={apiKeyError}
      summariseHistory={summariseHistory}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      handleHistoryClick={handleHistoryClick}
    />
  )
}

export default HomeContainer
