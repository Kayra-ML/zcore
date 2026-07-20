import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    // Genel
    ping: () => ipcRenderer.invoke('ping'),
    windowControl: (action) => ipcRenderer.send('window-control', action),
    openExternal: (url) => ipcRenderer.send('open-external', url),
    // Auth olayları
    onAuthToken: (callback) => {
        ipcRenderer.on('auth-token', (_event, token) => callback(token));
    },
    onStoreAdded: (callback) => {
        ipcRenderer.on('store-added', () => callback());
    },
    onSyncProgress: (callback) => {
        ipcRenderer.on('sync-progress', (_event, data) => callback(data));
    },
    // Siparişler (SQLite)
    getOrders: (token) => ipcRenderer.invoke('get-orders', { token }),
    addOrder: (order, token) => ipcRenderer.invoke('add-order', { order, token }),
    // Mağaza credential yönetimi
    saveStore: (args) => ipcRenderer.invoke('save-store', args),
    getStores: () => ipcRenderer.invoke('get-stores'),
    deleteStore: (storeId) => ipcRenderer.invoke('delete-store', { storeId }),
    syncStore: (storeId, token) => ipcRenderer.invoke('sync-store', { storeId, token }),
    syncAllStores: (token) => ipcRenderer.invoke('sync-all-stores', { token }),
    // Trendyol credential doğrulama
    validateTrendyolCreds: (args) => ipcRenderer.invoke('validate-trendyol-creds', args),
    // Çıkış temizliği
    clearStores: () => ipcRenderer.send('clear-stores'),
});
