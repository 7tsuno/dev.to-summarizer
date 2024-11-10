import fs from 'fs'

export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export const parseGPTResult = (input: string): { title: string; summary: string; id: string }[] => {
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
