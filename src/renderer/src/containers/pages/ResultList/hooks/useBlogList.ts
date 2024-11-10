// hooks/useBlogList.ts
import { useState, useEffect } from 'react'
import { invoke } from '@renderer/utils/IPC'
import { getBatchId } from '@renderer/api/store'

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
      const result = await invoke<any, Blog[]>('load-history', executedAt.toISOString())
      const convertedResult = await Promise.all(
        result.map(async (blog) => ({
          ...blog,
          batchId: await getBatchId(blog.id),
          blogData: await invoke<string, { title: string; summary: string }>(
            'loadBlog',
            String(blog.id)
          )
        }))
      )
      setBlogList(convertedResult)
    }
    loadBlogList()
  }, [executedAt])

  return { blogList, setBlogList }
}
