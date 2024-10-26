import { contextBridge, ipcRenderer } from 'electron'

const saveKey = (key: string, value: string): void => {
  ipcRenderer.invoke('saveKey', key, value)
}

const getKey = (key: string): Promise<string> => {
  return ipcRenderer.invoke('getKey', key)
}

// 安全なIPC通信を提供
contextBridge.exposeInMainWorld('electron', {
  invoke: ipcRenderer.invoke
})

contextBridge.exposeInMainWorld('store', {
  saveKey,
  getKey
})
