// hooks/useSearchForm.ts
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '@renderer/api/store'
import { articles } from '@renderer/api/articles'

type FormState = {
  tag: string
  count: string
  range: string
}

type FormErrors = {
  tag: string
  count: string
  range: string
}

export const useSearchForm = (): {
  formState: FormState
  formErrors: FormErrors
  isFormValid: boolean
  apiKeyError: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
} => {
  const navigate = useNavigate()

  const [formState, setFormState] = useState<FormState>({
    tag: 'ai',
    count: '10',
    range: '10'
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({ tag: '', count: '', range: '' })
  const [apiKeyError, setApiKeyError] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)

  const validateField = useCallback((name: string, value: string): string => {
    if (name === 'count') {
      const count = parseInt(value, 10)
      if (isNaN(count) || count < 1 || count > 30) return '1から30の間で入力してください'
    } else if (name === 'range') {
      const range = parseInt(value, 10)
      if (isNaN(range) || range < 1) return '1以上の値を入力してください'
    }
    return ''
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormState((prev) => ({ ...prev, [name]: value }))

      const error = validateField(name, value)
      setFormErrors((prev) => ({ ...prev, [name]: error }))
      setIsFormValid(Object.values({ ...formErrors, [name]: error }).every((err) => !err))
    },
    [formErrors, validateField]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()

      const devToApiKey = await store.getKey('devTo')
      if (!devToApiKey) {
        setApiKeyError('APIキーが設定されていません')
        return
      }

      const executedAt = await articles.search(
        formState.tag,
        parseInt(formState.count),
        parseInt(formState.range)
      )

      navigate('/resultList', {
        state: {
          ...formState,
          executedAt: new Date(executedAt)
        }
      })
    },
    [formState, navigate]
  )

  return {
    formState,
    formErrors,
    isFormValid,
    apiKeyError,
    handleInputChange,
    handleSubmit
  }
}
