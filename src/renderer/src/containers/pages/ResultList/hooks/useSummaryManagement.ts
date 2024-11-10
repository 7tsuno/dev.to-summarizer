// hooks/useSummaryManagement.ts
import { useState } from 'react'
import { invoke } from '@renderer/utils/IPC'
import { Blog } from './useBlogList'
import { useNavigate } from 'react-router-dom'
import { saveBatchId } from '@renderer/api/store'

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
    const status = await invoke<string, string>('getBatchStatus', batchId)
    if (status === 'completed') {
      const updatedBlogList = await Promise.all(
        blogList.map(async (blog) => {
          if (blog.batchId === batchId) {
            const blogData = await invoke<string, { title: string; summary: string }>(
              'loadBlog',
              String(blog.id)
            )
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
    const batchId = await invoke<unknown, string>('summarize', selectedArticles)
    saveBatchId(batchId, selectedArticles)

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
