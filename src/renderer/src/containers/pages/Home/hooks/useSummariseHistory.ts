import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoke } from '@renderer/utils/IPC'

type HistoryItem = {
  executedAt: string
  tag: string
  count: number
  range: number
}

export const useSummariseHistory = (): {
  summariseHistory: HistoryItem[]
  handleHistoryClick: (history: HistoryItem) => void
} => {
  const navigate = useNavigate()
  const [summariseHistory, setSummariseHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    invoke<undefined, HistoryItem[]>('get-history').then((histories) =>
      setSummariseHistory(histories)
    )
  }, [])

  const handleHistoryClick = useCallback(
    (history: HistoryItem) => {
      navigate('resultList', {
        state: { ...history, executedAt: new Date(history.executedAt) }
      })
    },
    [navigate]
  )

  return { summariseHistory, handleHistoryClick }
}
