declare global {
  interface Window {
    store: {
      saveKey: (key: string, value: string) => void
      getKey: (key: string) => Promise<string>
    }
  }
}

export const saveKey = (key: string, value: string): void => {
  window.store.saveKey(key, value)
}

export const getKey = async (key: string): Promise<string> => {
  return window.store.getKey(key)
}
