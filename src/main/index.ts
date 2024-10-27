import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getArticleByIds, searchDevTo } from './libs/devto'
import { listHistories, loadHistory } from './libs/history'
import { loadBlog, summarizeBlogs } from './libs/blog'
import Store from 'electron-store'
import { getBatchStatus } from './libs/gpt'
const store = new Store({ encryptionKey: 'your-encryption-key' })

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    // ウィンドウを最大化
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 検索処理
  ipcMain.handle(
    'search',
    async (
      _event,
      object: {
        tag: string
        count: number
        range: number
      }
    ) => {
      return await searchDevTo({
        tag: object.tag,
        count: object.count,
        range: object.range
      })
    }
  )

  ipcMain.handle('get-history', () => {
    return listHistories()
  })

  ipcMain.handle('load-history', (_event, timestamp: string) => {
    return loadHistory(timestamp)
  })

  ipcMain.handle('summarize', async (_event, ids: Array<number>) => {
    const articles = await getArticleByIds(ids)
    return await summarizeBlogs(articles)
  })

  ipcMain.handle('getKey', (_event, key: string) => {
    return store.get(key)
  })

  ipcMain.handle('saveKey', (_event, key: string, value: string) => {
    store.set(key, value)
  })

  ipcMain.handle('getBatchStatus', async (_event, batchId: string) => {
    return await getBatchStatus(batchId)
  })

  ipcMain.handle('loadBlog', async (_event, id: string) => {
    return loadBlog(id)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.