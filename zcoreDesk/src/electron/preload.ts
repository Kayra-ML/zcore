import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Genel
  ping: () => ipcRenderer.invoke('ping'),
  windowControl: (action: 'minimize' | 'maximize' | 'close') =>
    ipcRenderer.send('window-control', action),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),

  // Auth olayları
  onAuthToken: (callback: (token: string) => void) => {
    ipcRenderer.on('auth-token', (_event, token) => callback(token));
  },
  onStoreAdded: (callback: () => void) => {
    ipcRenderer.on('store-added', () => callback());
  },
  onSyncProgress: (
    callback: (data: {
      message: string;
      percentage: number;
      isComplete: boolean;
      isError?: boolean;
    }) => void
  ) => {
    ipcRenderer.on('sync-progress', (_event, data) => callback(data));
  },

  // Siparişler (SQLite)
  getOrders: (token: string) => ipcRenderer.invoke('get-orders', { token }),
  addOrder: (order: any, token: string) =>
    ipcRenderer.invoke('add-order', { order, token }),

  // Mağaza credential yönetimi
  saveStore: (args: {
    platform: string;
    name: string;
    supplierId: string;
    apiKey: string;
    apiSecret: string;
    token: string;
  }) => ipcRenderer.invoke('save-store', args),

  getStores: () => ipcRenderer.invoke('get-stores'),

  deleteStore: (storeId: string) =>
    ipcRenderer.invoke('delete-store', { storeId }),

  syncStore: (storeId: string, token: string) =>
    ipcRenderer.invoke('sync-store', { storeId, token }),

  syncAllStores: (token: string) =>
    ipcRenderer.invoke('sync-all-stores', { token }),

  // Trendyol credential doğrulama
  validateTrendyolCreds: (args: {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
    isStage?: boolean;
  }) => ipcRenderer.invoke('validate-trendyol-creds', args),

  // Çıkış temizliği
  clearStores: () => ipcRenderer.send('clear-stores'),
});
