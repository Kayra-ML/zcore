/**
 * stores.ts
 * Mağaza credential'larını Electron safeStorage ile güvenli şekilde saklar.
 * Windows: DPAPI (işletim sistemi şifrelemesi)
 * macOS: Keychain
 * Linux: libsecret
 */

import { safeStorage, app } from 'electron';
import path from 'path';
import fs from 'fs';

export type StorePlatform = 'TRENDYOL' | 'HEPSIBURADA' | 'N11' | 'AMAZON';

export interface StoreCredential {
  id: string;          // uuid
  platform: StorePlatform;
  name: string;        // kullanıcı tarafından verilen isim
  supplierId: string;
  addedAt: number;     // timestamp
}

export interface StoreCredentialWithSecrets extends StoreCredential {
  apiKey: string;
  apiSecret: string;
}

// Şifreli credential'ların disk dosyası
const STORES_FILE = path.join(app.getPath('userData'), 'zcore-stores.enc');

/**
 * Tüm kayıtlı mağazaları oku (şifreli)
 */
function readEncryptedStores(): StoreCredentialWithSecrets[] {
  try {
    if (!fs.existsSync(STORES_FILE)) return [];
    const encBuf = fs.readFileSync(STORES_FILE);
    if (safeStorage.isEncryptionAvailable()) {
      const decrypted = safeStorage.decryptString(encBuf);
      return JSON.parse(decrypted);
    } else {
      // safeStorage yoksa base64 fallback (geliştirme ortamı)
      const decoded = Buffer.from(encBuf.toString(), 'base64').toString('utf8');
      return JSON.parse(decoded);
    }
  } catch (err) {
    console.error('[Stores] Read error:', err);
    return [];
  }
}

/**
 * Tüm mağaza listesini diske şifreli yaz
 */
function writeEncryptedStores(stores: StoreCredentialWithSecrets[]): void {
  const json = JSON.stringify(stores);
  if (safeStorage.isEncryptionAvailable()) {
    const encBuf = safeStorage.encryptString(json);
    fs.writeFileSync(STORES_FILE, encBuf);
  } else {
    // Geliştirme fallback
    fs.writeFileSync(STORES_FILE, Buffer.from(json).toString('base64'));
  }
}

/**
 * Yeni mağaza ekle veya güncelle
 */
export function saveStore(cred: StoreCredentialWithSecrets): void {
  const stores = readEncryptedStores();
  const existingIdx = stores.findIndex(s => s.id === cred.id);
  if (existingIdx >= 0) {
    stores[existingIdx] = cred;
  } else {
    stores.push(cred);
  }
  writeEncryptedStores(stores);
  console.log(`[Stores] Saved: ${cred.platform} – ${cred.supplierId}`);
}

/**
 * Kayıtlı mağazaları listele (secret'lar gizlenmiş)
 */
export function listStores(): StoreCredential[] {
  return readEncryptedStores().map(({ apiKey: _k, apiSecret: _s, ...pub }) => pub);
}

/**
 * Belirli bir mağazanın tam credential'larını getir (API çağrısı için)
 */
export function getStoreCredentials(storeId: string): StoreCredentialWithSecrets | null {
  const stores = readEncryptedStores();
  return stores.find(s => s.id === storeId) ?? null;
}

/**
 * Mağaza sil
 */
export function deleteStore(storeId: string): void {
  const stores = readEncryptedStores().filter(s => s.id !== storeId);
  writeEncryptedStores(stores);
}

/**
 * Tüm mağazaları sil (hesap çıkışı)
 */
export function clearAllStores(): void {
  if (fs.existsSync(STORES_FILE)) {
    fs.unlinkSync(STORES_FILE);
  }
}
