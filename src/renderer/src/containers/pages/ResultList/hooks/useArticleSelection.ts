// hooks/useArticleSelection.ts
import { useState } from 'react'
import { Blog } from './useBlogList'

export const useArticleSelection = (
  initialList: number[] = []
): {
  selectedArticles: number[]
  toggleArticleSelection: (id: number) => void
  toggleSelectAll: (articleIds: Blog[]) => void
  setSelectedArticles: React.Dispatch<React.SetStateAction<number[]>>
} => {
  const [selectedArticles, setSelectedArticles] = useState<number[]>(initialList)

  const toggleArticleSelection = (id: number): void => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((articleId) => articleId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = (articleIds: Blog[]): void => {
    const allIds = articleIds.filter((blog) => blog.batchId === undefined).map((blog) => blog.id)
    setSelectedArticles(selectedArticles.length === allIds.length ? [] : allIds)
  }

  return {
    selectedArticles,
    toggleArticleSelection,
    toggleSelectAll,
    setSelectedArticles
  }
}
