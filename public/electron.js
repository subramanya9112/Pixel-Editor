const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const globalShortcut = electron.globalShortcut;

const path = require('path');
const isDev = require('electron-is-dev');
const reader = require('./reader');
const writer = require('./writer');

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 680,
        minWidth: 940,
        minHeight: 560,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            enableRemoteModule: true,
            webSecurity: false
        }
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.maximize();

    ipc.on('minimizeApp', () => {
        mainWindow.minimize();
    });
    ipc.on('maximizeApp', () => {
        if (mainWindow.isMaximized())
            mainWindow.restore();
        else
            mainWindow.maximize();
    });
    ipc.on('closeApp', () => {
        mainWindow.close();
    });

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('maximized');
    })
    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('unmaximized');
    })

    const newFile = () => {
        mainWindow.webContents.send('clearAll');
    }
    const openFile = () => {
        dialog.showOpenDialog({
            title: "Open Pixel editor",
            properties: ['openFile', 'showHiddenFiles'],
            filters: [
                { name: 'Pixel Editor files', extensions: ['pe'] },
            ]
        }).then(result => {
            if (!result.canceled) {
                let data = reader(result.filePaths[0]);
                mainWindow.webContents.send('openData', data);
            }
        }).catch(e => {
        })
    }
    const saveFile = () => {
        dialog.showSaveDialog({
            title: "Save Pixel editor",
            properties: ['showHiddenFiles', 'createDirectory'],
            filters: [
                { name: 'Pixel Editor files', extensions: ['pe'] },
            ]
        }).then(result => {
            if (!result.canceled) {
                mainWindow.webContents.send('saveData');
                ipc.once('saveDataReply', (e, data) => {
                    writer(result.filePath, data);
                });
            }
        }).catch(e => {
        })
    }

    ipc.on('newFile', newFile);
    ipc.on('openFile', openFile);
    ipc.on('saveFile', saveFile);

    const registerShortcuts = () => {
        globalShortcut.register('CommandOrControl+N', newFile);
        globalShortcut.register('CommandOrControl+O', openFile);
        globalShortcut.register('CommandOrControl+S', saveFile);
    };

    const unregisterShortcuts = () => {
        globalShortcut.unregister('CommandOrControl+N');
        globalShortcut.unregister('CommandOrControl+O');
        globalShortcut.unregister('CommandOrControl+S');
    };

    registerShortcuts();
    mainWindow.on('focus', registerShortcuts);
    mainWindow.on('blur', unregisterShortcuts);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
