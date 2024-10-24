import { contextBridge, ipcRenderer } from 'electron'

// 安全なIPC通信を提供
contextBridge.exposeInMainWorld('electron', {
  invoke: ipcRenderer.invoke
})
