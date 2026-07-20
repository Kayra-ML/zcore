export {};

declare global {
  interface Window {
    electronAPI: {
      // Genel
      ping: () => Promise<string>;
      windowControl: (action: 'minimize' | 'maximize' | 'close') => void;
      openExternal: (url: string) => void;

      // Auth olayları
      onAuthToken: (callback: (token: string) => void) => void;
      onStoreAdded: (callback: () => void) => void;
      onSyncProgress: (callback: (data: {
        message: string;
        percentage: number;
        isComplete: boolean;
        isError?: boolean;
      }) => void) => void;

      // Siparişler (SQLite)
      getOrders: (token: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      addOrder: (order: any, token: string) => Promise<{ success: boolean; error?: string }>;

      // Mağaza yönetimi
      saveStore: (args: {
        platform: string;
        name: string;
        supplierId: string;
        apiKey: string;
        apiSecret: string;
        token: string;
      }) => Promise<{ success: boolean; storeId?: string; error?: string }>;

      getStores: () => Promise<{
        success: boolean;
        data?: Array<{
          id: string;
          platform: string;
          name: string;
          supplierId: string;
          addedAt: number;
        }>;
        error?: string;
      }>;

      deleteStore: (storeId: string) => Promise<{ success: boolean; error?: string }>;

      syncStore: (storeId: string, token: string) => Promise<{
        success: boolean;
        count?: number;
        error?: string;
      }>;

      syncAllStores: (token: string) => Promise<{ success: boolean; error?: string }>;

      // Trendyol credential doğrulama
      validateTrendyolCreds: (args: {
        supplierId: string;
        apiKey: string;
        apiSecret: string;
        isStage?: boolean;
      }) => Promise<{ ok: boolean; error?: string }>;

      // Temizlik
      clearStores: () => void;
    };
  }
}
