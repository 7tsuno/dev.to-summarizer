import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import { app } from 'electron'
import { getOpenAIKey } from './keyStore'

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

export async function getBatchStatus(
  batchId: string
): Promise<{ status: string; outputId: string | undefined }> {
  const openAI = new OpenAI({ apiKey: getOpenAIKey() })
  const batch = await openAI.batches.retrieve(batchId)
  return {
    status: batch.status,
    outputId: batch.output_file_id
  }
}

export async function getContents(batchOutputId: string): Promise<string> {
  const openAI = new OpenAI({ apiKey: getOpenAIKey() })
  const fileId = batchOutputId
  const fileResponse = await openAI.files.content(fileId)
  const fileContents = await fileResponse.text()
  return fileContents
}
