// hooks/useSummaryManagement.ts
import { useState } from 'react'
import { Blog } from './useBlogList'
import { useNavigate } from 'react-router-dom'
import { store } from '@renderer/api/store'
import { summarize } from '@renderer/api/summarize'
import { summarizedArticles } from '@renderer/api/summarizedArticles'

export const useSummaryManagement = (
  blogList: Blog[],
  setBlogList: React.Dispatch<React.SetStateAction<Blog[]>>
): {
  expandedSummaries: number[]
  toggleSummary: (id: number) => void
  checkSummarized: (batchId: string) => Promise<void>
  translateAndSummarize: (selectedArticles: number[]) => Promise<void>
} => {
  const [expandedSummaries, setExpandedSummaries] = useState<number[]>([])
  const navigate = useNavigate()

  const toggleSummary = (id: number): void => {
    setExpandedSummaries((prev) =>
      prev.includes(id) ? prev.filter((summaryId) => summaryId !== id) : [...prev, id]
    )
  }

  const checkSummarized = async (batchId: string): Promise<void> => {
    const updatedBlogList = await Promise.all(
      blogList.map(async (blog) => {
        if (blog.batchId === batchId) {
          return { ...blog, status: '要約状況確認中...' }
        }
        return blog
      })
    )
    setBlogList(updatedBlogList)
    const status = await summarize.getStatus(batchId)
    if (status === 'completed') {
      const updatedBlogList = await Promise.all(
        blogList.map(async (blog) => {
          if (blog.batchId === batchId) {
            const blogData = await summarizedArticles.load(blog.id.toString())
            return { ...blog, blogData }
          }
          return blog
        })
      )
      setBlogList(updatedBlogList)
    } else {
      const updatedBlogList = await Promise.all(
        blogList.map(async (blog) => {
          if (blog.batchId === batchId) {
            return { ...blog, status }
          }
          return blog
        })
      )
      setBlogList(updatedBlogList)
    }
  }

  const translateAndSummarize = async (selectedArticles: number[]): Promise<void> => {
    const batchId = await summarize.request(selectedArticles)
    store.saveBatchId(batchId, selectedArticles)

    setBlogList(
      blogList.map((blog) => {
        if (selectedArticles.includes(blog.id)) {
          return { ...blog, batchId }
        }
        return blog
      })
    )

    navigate('/')
  }

  return { expandedSummaries, toggleSummary, checkSummarized, translateAndSummarize }
}
