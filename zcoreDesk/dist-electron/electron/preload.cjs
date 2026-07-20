// src/electron/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Genel
  ping: () => import_electron.ipcRenderer.invoke("ping"),
  windowControl: (action) => import_electron.ipcRenderer.send("window-control", action),
  openExternal: (url) => import_electron.ipcRenderer.send("open-external", url),
  // Auth olayları
  onAuthToken: (callback) => {
    import_electron.ipcRenderer.on("auth-token", (_event, token) => callback(token));
  },
  onStoreAdded: (callback) => {
    import_electron.ipcRenderer.on("store-added", () => callback());
  },
  onSyncProgress: (callback) => {
    import_electron.ipcRenderer.on("sync-progress", (_event, data) => callback(data));
  },
  // Siparişler (SQLite)
  getOrders: (token) => import_electron.ipcRenderer.invoke("get-orders", { token }),
  addOrder: (order, token) => import_electron.ipcRenderer.invoke("add-order", { order, token }),
  // Mağaza credential yönetimi
  saveStore: (args) => import_electron.ipcRenderer.invoke("save-store", args),
  getStores: () => import_electron.ipcRenderer.invoke("get-stores"),
  deleteStore: (storeId) => import_electron.ipcRenderer.invoke("delete-store", { storeId }),
  syncStore: (storeId, token) => import_electron.ipcRenderer.invoke("sync-store", { storeId, token }),
  syncAllStores: (token) => import_electron.ipcRenderer.invoke("sync-all-stores", { token }),
  // Trendyol credential doğrulama
  validateTrendyolCreds: (args) => import_electron.ipcRenderer.invoke("validate-trendyol-creds", args),
  // Çıkış temizliği
  clearStores: () => import_electron.ipcRenderer.send("clear-stores")
});
