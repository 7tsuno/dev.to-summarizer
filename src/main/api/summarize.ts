import { createBatchRequest } from '../libs/gpt'

const request = async (
  articles: Array<{
    id: number
    title: string
    body: string
  }>
): Promise<string> => {
  const model = 'gpt-4o'
  const requests = createRequests(articles, model)
  const batchId = await createBatchRequest(requests)
  return batchId
}

const parseGPTResult = (input: string): { title: string; summary: string; id: string }[] => {
  const result: { title: string; summary: string; id: string }[] = []

  const lines = input.split('\n').filter((line) => line.trim() !== '')

  for (const line of lines) {
    try {
      const parsedLine = JSON.parse(line)
      const content = parsedLine.response.body.choices[0].message.content as string
      console.log(parsedLine.response.body.choices[0])
      const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1]
        const jsonData = JSON.parse(jsonString)
        result.push({ title: jsonData.title, summary: jsonData.summary, id: parsedLine.custom_id })
      }
    } catch (error) {
      console.error('Error parsing line:', error)
    }
  }

  return result
}

const createRequests = (
  blogs: Array<{ id: number; title: string; body: string }>,
  model: string
): Array<{
  custom_id: string
  method: string
  url: string
  body: object
}> => {
  return blogs.map((blog) => {
    return {
      custom_id: blog.id.toString(),
      method: 'POST',
      url: '/v1/chat/completions',
      body: {
        model,
        messages: [
          { role: 'system', content: 'You are an excellent engineer and translator' },
          {
            role: 'user',
            content: summarizePrompt(blog)
          }
        ],
        max_tokens: 10000
      }
    }
  })
}

const summarizePrompt = (blog: { id: number; title: string; body: string }): string => {
  return `# Request  
  You are a skilled engineer and translator. Please read the following blog and summarize its main points in Japanese.
  
  # Purpose  
  I plan to use the summarized blog content to efficiently gather information.
  
  # Information  
  - Blog Title: ${blog.title}  
  - Blog Content: ${blog.body}
  
  # Rules  
  1. Summarize all headings of the blog and the key points of each section in natural and accurate Japanese.  
  2. The summary should be in Japanese, targeting engineers.  
  3. The translation should reflect high quality with natural readability and accuracy.  
  4. If there are technical terms or cultural differences, include a brief explanation if necessary in the summary.  
  5. The summary should be in markdown format.  
  6. Output the summary in the following JSON format:
  
  # Output Format
  {
    "title": {translated_title},
    "summary": {summary}
  }`
}

export const summarize = {
  request,
  parseGPTResult
}
