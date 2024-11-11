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
        response_format: { type: 'json_object' },
        max_tokens: 15000
      }
    }
  })
}

const summarizePrompt = (blog: { id: number; title: string; body: string }): string => {
  return `# お願い
あなたは優秀なエンジニアであり、翻訳者です。
以下のブログを読み、日本語に翻訳してください。

# 目的
情報を効率的に収集するため、ブログの内容を活用する予定です。

# 情報
・ブログタイトル: ${blog.title}
・ブログ内容: ${blog.body}

# ルール
1. まずはブログの全体の内容を500文字程度でまとめるセクション「記事のまとめ」を作ってください
2. ブログの各セクションについて、ブログ内の見出しに基づいた同じ見出しを作成し（例：「はじめに」「結論」など）、セクションの内容についてすべて省略せず詳しく翻訳して書いてください。
3. 文章は日本語で、エンジニアを対象にしてください。
4. 翻訳は高品質で、自然な読みやすさと正確さを反映した日本語にしてください。
6. 出力文はmarkdown形式にしてください。具体的には、見出し、コードブロックなどを使用して、読みやすく構造化してください。
7. 以下のJSON形式で出力してください。

# 出力形式
{
  title: { 翻訳されたタイトル },
  summary: { 出力文 }
}

# 出力例

{
  "title": "ブログのタイトル",
  "summary": "## 記事のまとめ\n\nこの記事では、xxxxxxxxxxxxxxxxxxxxxxx\n\n## はじめに\n\nxxxxxxxxxxxxxxxxxxxxxxxx\n\n## つぎに\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ..."
}

`
}

export const summarize = {
  request,
  parseGPTResult
}
