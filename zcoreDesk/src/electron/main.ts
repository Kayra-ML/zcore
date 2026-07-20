import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────
// STEP 1: Single-instance lock (must be FIRST)
// ─────────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // Another instance is already running → pass the deep link to it and quit
  app.quit();
}

// ─────────────────────────────────────────────
// STEP 2: Register custom protocol correctly
// Windows dev mode: process.execPath = electron.exe, argv[1] = compiled main.js
// ─────────────────────────────────────────────
if (process.platform === 'win32') {
  // In dev mode we must pass the script path as an extra argument
  app.setAsDefaultProtocolClient('zcore', process.execPath, [
    path.resolve(process.argv[1])
  ]);
} else {
  app.setAsDefaultProtocolClient('zcore');
}

import { startStoreSync, syncStore, syncAllStores } from './sync.js';
import { saveStore, listStores, deleteStore, clearAllStores } from './stores.js';
import { validateCredentials, type TrendyolCredentials } from './trendyol.js';
import crypto from 'crypto';

let mainWindow: BrowserWindow | null = null;

// ─────────────────────────────────────────────
// Deep-link handler (shared between all cases)
// ─────────────────────────────────────────────
function handleDeepLink(url: string) {
  console.log('[DeepLink] Received URL:', url);

  try {
    const parsedUrl = new URL(url);

    // zcore://auth?token=...
    if (parsedUrl.host === 'auth') {
      const token = parsedUrl.searchParams.get('token');
      if (token && mainWindow) {
        // Ensure the window is visible and focused
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.webContents.send('auth-token', token);
        startStoreSync(token, mainWindow);
      }
    }

    // zcore://store-added
    if (parsedUrl.host === 'store-added') {
      if (mainWindow) {
        mainWindow.webContents.send('store-added');
        startStoreSync('refresh-token-placeholder', mainWindow);
      }
    }
  } catch (err) {
    console.error('[DeepLink] Parse error:', err);
  }
}

// ─────────────────────────────────────────────
// STEP 3: Handle second-instance event (Windows deep link while app is open)
// ─────────────────────────────────────────────
app.on('second-instance', (_event, commandLine) => {
  console.log('[SecondInstance] commandLine:', commandLine);

  // Bring the existing window to focus
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }

  // Deep link URL is typically the last argument on Windows
  const url = commandLine.find(arg => arg.startsWith('zcore://'));
  if (url) {
    handleDeepLink(url);
  }
});

// ─────────────────────────────────────────────
// Create main browser window
// ─────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0A0B0E',
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0A0B0E',
      symbolColor: '#ffffff',
      height: 32
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    // DevTools otomatik açılmasını kullanıcının isteği üzerine kapattık
    // mainWindow?.webContents.openDevTools();

    // Windows launch deep link
    if (process.platform === 'win32') {
      const url = process.argv.find(arg => arg.startsWith('zcore://'));
      if (url) {
        console.log('[Launch] Deep link found in argv:', url);
        handleDeepLink(url);
      }
    }
  });
}

// ─────────────────────────────────────────────
// App ready
// ─────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOS deep link
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ─────────────────────────────────────────────
// IPC Handlers
// ─────────────────────────────────────────────
ipcMain.handle('ping', () => 'pong from electron!');

ipcMain.on('open-external', (_event, url) => {
  shell.openExternal(url);
});

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (action === 'close') win.close();
  if (action === 'minimize') win.minimize();
  if (action === 'maximize') {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  }
});

import { getOrders, addOrder } from './db.js';

ipcMain.handle('get-orders', async (_event, args) => {
  try {
    const orders = await getOrders(30, args?.token);
    return { success: true, data: orders };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('add-order', async (_event, args) => {
  try {
    const { order, token } = args;
    await addOrder(order, token);
    return { success: true };
  } catch (error: any) {
    console.error('Error adding order:', error);
    return { success: false, error: error.message };
  }
});

// ─────────────────────────────────────────────
// Mağaza Credential Yönetimi
// ─────────────────────────────────────────────

/** Yeni mağaza kaydet ve ilk sync'i başlat */
ipcMain.handle('save-store', async (_event, args) => {
  try {
    const { platform, name, supplierId, apiKey, apiSecret } = args;
    const id = crypto.randomUUID();
    saveStore({ id, platform, name, supplierId, apiKey, apiSecret, addedAt: Date.now() });
    // İlk sync'i başlat
    if (mainWindow && args.token) {
      syncStore(id, args.token, mainWindow);
    }
    return { success: true, storeId: id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/** Kayıtlı mağazaları listele */
ipcMain.handle('get-stores', async () => {
  try {
    return { success: true, data: listStores() };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
});

/** Mağaza sil */
ipcMain.handle('delete-store', async (_event, args) => {
  try {
    deleteStore(args.storeId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/** Belirli mağazayı manuel sync et */
ipcMain.handle('sync-store', async (_event, args) => {
  try {
    if (!mainWindow) return { success: false, error: 'Pencere bulunamadı' };
    const result = await syncStore(args.storeId, args.token, mainWindow);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/** Tüm mağazaları sync et */
ipcMain.handle('sync-all-stores', async (_event, args) => {
  try {
    if (!mainWindow) return { success: false, error: 'Pencere bulunamadı' };
    await syncAllStores(args.token, mainWindow);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/** Trendyol API bağlantısını doğrula */
ipcMain.handle('validate-trendyol-creds', async (_event, args) => {
  try {
    const creds: TrendyolCredentials = {
      supplierId: args.supplierId,
      apiKey: args.apiKey,
      apiSecret: args.apiSecret,
      isStage: args.isStage ?? false,
    };
    const result = await validateCredentials(creds);
    return result;
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
});

/** Çıkışta tüm credential'ları temizle */
ipcMain.on('clear-stores', () => {
  clearAllStores();
});
