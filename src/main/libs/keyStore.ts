import Store from 'electron-store'
const store = new Store({ encryptionKey: 'your-encryption-key' })
export function getOpenAIKey(): string {
  return store.get('openAI') as string
}
export function getDevToKey(): string {
  return store.get('devTo') as string
}
