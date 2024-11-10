// hooks/useBlogList.ts
import { useState, useEffect } from 'react'
import { store } from '@renderer/api/store'
import { histories } from '@renderer/api/histories'
import { summarizedArticles } from '@renderer/api/summarizedArticles'

export type Blog = {
  id: number
  title: string
  batchId?: string
  blogData?: { title: string; summary: string }
  published_timestamp: Date
  status?: string
}

type UseBlogListProps = {
  executedAt: Date
}

export const useBlogList = ({
  executedAt
}: UseBlogListProps): {
  blogList: Blog[]
  setBlogList: React.Dispatch<React.SetStateAction<Blog[]>>
} => {
  const [blogList, setBlogList] = useState<Blog[]>([])

  useEffect(() => {
    const loadBlogList = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await histories.load(executedAt.toISOString())
      if (!result) return
      const convertedResult = await Promise.all(
        result.map(async (blog) => ({
          ...blog,
          batchId: await store.getBatchId(blog.id),
          blogData: await summarizedArticles.load(blog.id.toString())
        }))
      )
      console.log('convertedResult', convertedResult)

      setBlogList(convertedResult)
    }
    loadBlogList()
  }, [executedAt])

  return { blogList, setBlogList }
}
