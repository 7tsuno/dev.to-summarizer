import HistoryComponent from '@renderer/components/pages/History/HistoryComponent'
import { useSummariseHistory } from '@renderer/hooks/useSummariseHistory'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const HistoryContainer: React.FC = () => {
  const { summariseHistory, handleHistoryClick, handleDeleteHistory } = useSummariseHistory()
  const navigate = useNavigate()

  return (
    <HistoryComponent
      history={summariseHistory}
      onHistoryClick={handleHistoryClick}
      navigate={navigate}
      onDeleteHistory={handleDeleteHistory}
    />
  )
}

export default HistoryContainer
