/**
 * sync.ts
 * Gerçek Trendyol API senkronizasyon motoru
 */
import { fetchAllOrdersLastDays } from './trendyol.js';
import { addOrder } from './db.js';
import { getStoreCredentials, listStores } from './stores.js';
function sendProgress(window, message, percentage, isComplete = false, isError = false) {
    if (!window.isDestroyed()) {
        window.webContents.send('sync-progress', { message, percentage, isComplete, isError });
    }
}
/**
 * Belirli bir mağazayı senkronize et
 */
export async function syncStore(storeId, token, window) {
    sendProgress(window, 'Mağaza bilgileri okunuyor...', 5);
    const cred = getStoreCredentials(storeId);
    if (!cred) {
        sendProgress(window, 'Mağaza bulunamadı.', 0, true, true);
        return { success: false, count: 0, error: 'Mağaza bulunamadı' };
    }
    const tyCreds = {
        supplierId: cred.supplierId,
        apiKey: cred.apiKey,
        apiSecret: cred.apiSecret,
    };
    try {
        sendProgress(window, 'Trendyol API\'ye bağlanılıyor...', 15);
        let fetchedCount = 0;
        let totalCount = 0;
        const orders = await fetchAllOrdersLastDays(tyCreds, 30, (fetched, total) => {
            fetchedCount = fetched;
            totalCount = total;
            const pct = Math.min(15 + Math.round((fetched / Math.max(total, 1)) * 60), 75);
            sendProgress(window, `Siparişler çekiliyor... (${fetched}/${total})`, pct);
        });
        sendProgress(window, `${orders.length} sipariş alındı, şifrelenerek kaydediliyor...`, 80);
        // SQLite'a kaydet
        let saved = 0;
        for (const order of orders) {
            const normalized = normalizeOrder(order, cred.supplierId);
            await addOrder(normalized, token);
            saved++;
        }
        sendProgress(window, `Senkronizasyon tamamlandı! ${saved} sipariş güncellendi.`, 100, true);
        return { success: true, count: saved };
    }
    catch (err) {
        const msg = err.message || 'Bilinmeyen hata';
        console.error('[Sync] Error:', msg);
        sendProgress(window, `Hata: ${msg}`, 0, true, true);
        return { success: false, count: 0, error: msg };
    }
}
/**
 * Tüm kayıtlı mağazaları senkronize et
 */
export async function syncAllStores(token, window) {
    const stores = listStores();
    if (stores.length === 0) {
        sendProgress(window, 'Kayıtlı mağaza bulunamadı.', 100, true);
        return;
    }
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        sendProgress(window, `${store.name} senkronize ediliyor... (${i + 1}/${stores.length})`, Math.round((i / stores.length) * 100));
        await syncStore(store.id, token, window);
    }
    sendProgress(window, 'Tüm mağazalar senkronize edildi!', 100, true);
}
/**
 * Trendyol sipariş verisini iç formata dönüştür
 */
function normalizeOrder(order, supplierId) {
    const firstLine = order.lines?.[0];
    return {
        id: `TY-${order.orderNumber}`,
        storeId: `TRENDYOL-${supplierId}`,
        orderDate: order.orderDate,
        // Hassas veriler (şifrelenecek):
        customer: order.shipmentAddress
            ? `${order.shipmentAddress.firstName || ''} ${order.shipmentAddress.lastName || ''}`.trim()
            : 'Trendyol Müşterisi',
        phone: '—', // Trendyol telefon vermez
        address: order.shipmentAddress
            ? [
                order.shipmentAddress.address1,
                order.shipmentAddress.district,
                order.shipmentAddress.city,
            ].filter(Boolean).join(', ')
            : '—',
        product: firstLine?.productName || 'Çoklu Ürün',
        quantity: firstLine?.quantity || 1,
        amount: `₺${(order.totalPrice || 0).toFixed(2)}`,
        status: mapStatus(order.status),
        // Ekstra Trendyol bilgileri
        cargoTrackingNumber: order.cargoTrackingNumber,
        cargoProvider: order.cargoProviderName,
        lineCount: order.lines?.length || 0,
        grossAmount: order.grossAmount,
    };
}
/**
 * Trendyol sipariş durumunu iç formata çevir
 */
function mapStatus(status) {
    const map = {
        'Created': 'processing',
        'Picking': 'processing',
        'Invoiced': 'processing',
        'Shipped': 'shipped',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled',
        'UnDelivered': 'failed',
        'Returned': 'returned',
        'AtCollectionPoint': 'shipped',
        'Awaiting': 'processing',
        'UnSupplied': 'processing',
    };
    return map[status] || 'processing';
}
/**
 * startStoreSync — eski imza ile geriye dönük uyumluluk
 * (main.ts'de deep link'ten çağrılıyor)
 */
export function startStoreSync(token, window) {
    syncAllStores(token, window);
}
