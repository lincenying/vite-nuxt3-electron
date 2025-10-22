import { fork } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { app, BrowserWindow } from 'electron'

// const isApp = process.env.NODE_ENV !== 'development'
const isDev = process.env.npm_lifecycle_event === 'app:dev'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

console.log(isDev)

const preload = path.join(__dirname, 'preload.js')

let childprocess: any

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1480,
        height: 950,
        webPreferences: {
            preload,
            nodeIntegration: true,
        },
    })

    if (!isDev) {
        childprocess = fork(path.join(__dirname, '../.output/server/index.mjs'))
        childprocess.on('error', (err: any) => {
            console.log(err)
        })
    }
    mainWindow.loadURL('http://localhost:7123')
    if (isDev) {
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (childprocess)
        process.kill(childprocess.pid)
    if (process.platform !== 'darwin')
        app.quit()
})
