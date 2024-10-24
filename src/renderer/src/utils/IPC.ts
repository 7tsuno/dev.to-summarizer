export const invoke = async <T, U>(channel: string, data?: T): Promise<U> => {
  return window.electron.invoke(channel, data)
}
