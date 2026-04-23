const { app, BrowserWindow } = require('electron');
const path = require('path');
const { start: startRelay } = require('./src/p2p-messenger/server');

const RELAY_PORT = 8765;

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 680,
    minWidth: 600,
    minHeight: 480,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'p2p-messenger', 'index.html'), {
    query: { relay: `ws://localhost:${RELAY_PORT}` }
  });
}

app.whenReady().then(() => {
  startRelay(RELAY_PORT);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
