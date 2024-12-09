declare global {
  interface Window {
    electron: {
      invoke: <T, U>(channel: string, data?: T) => Promise<U>
    }
  }
}

export const invoke = async <T, U>(channel: string, data?: T): Promise<U> => {
  return window.electron.invoke(channel, data)
}
