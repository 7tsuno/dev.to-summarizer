import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import { app } from 'electron'
import { getOpenAIKey } from './keyStore'
import { saveBlog } from './blog'

export async function createBatchRequest(
  requests: Array<{
    custom_id: string | number
    method: string
    url: string
    body: object
  }>,
  endpoint: '/v1/chat/completions' | '/v1/embeddings' | '/v1/completions' = '/v1/chat/completions'
): Promise<string> {
  // OpenAIクライアントの初期化
  const openai = new OpenAI({
    apiKey: getOpenAIKey()
  })

  // バッチ入力ファイルのパスを設定
  const batchInputFilePath = path.join(app.getPath('userData'), 'batchinput.jsonl')

  // バッチ入力ファイルを作成
  const batchInputStream = fs.createWriteStream(batchInputFilePath, { flags: 'w' })

  try {
    for (const request of requests) {
      // リクエストをバッチ入力ファイルに書き込む
      batchInputStream.write(JSON.stringify(request) + '\n')
    }

    // ストリームを閉じる
    batchInputStream.end()

    // 書き込み完了を待つ
    await new Promise<void>((resolve, reject) => {
      batchInputStream.on('finish', resolve)
      batchInputStream.on('error', reject)
    })

    // バッチ入力ファイルをOpenAIにアップロード
    const inputFile = await openai.files.create({
      file: fs.createReadStream(batchInputFilePath),
      purpose: 'batch'
    })

    // バッチジョブを作成
    const batch = await openai.batches.create({
      input_file_id: inputFile.id,
      endpoint: endpoint,
      completion_window: '24h'
    })

    console.log(`バッチジョブが作成されました。バッチID: ${batch.id}`)

    return batch.id
  } finally {
    fs.unlinkSync(batchInputFilePath)
  }
}

export async function getBatchStatus(batchId: string): Promise<string> {
  const openAI = new OpenAI({ apiKey: getOpenAIKey() })
  const batch = await openAI.batches.retrieve(batchId)
  if (batch.status === 'completed' && batch.output_file_id) {
    const fileId = batch.output_file_id
    const fileResponse = await openAI.files.content(fileId)
    const fileContents = await fileResponse.text()
    const contents = parse(fileContents)
    for (const content of contents) {
      saveBlog(content.id, content.title, content.summary)
    }
  }
  return batch.status
}

export function createRequests(
  blogs: Array<{ id: number; title: string; body: string }>,
  model: string
): Array<{
  custom_id: string
  method: string
  url: string
  body: object
}> {
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

export function summarizePrompt(blog: { id: number; title: string; body: string }): string {
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

function parse(input: string): { title: string; summary: string; id: string }[] {
  const result: { title: string; summary: string; id: string }[] = []

  // Split the input into individual lines (JSON objects)
  const lines = input.split('\n').filter((line) => line.trim() !== '')

  for (const line of lines) {
    try {
      // Parse each line as JSON
      const parsedLine = JSON.parse(line)

      // Navigate to the content field
      const content = parsedLine.response.body.choices[0].message.content as string

      console.log(parsedLine.response.body.choices[0])
      // Extract the JSON inside the code block
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
