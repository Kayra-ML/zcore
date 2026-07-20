/**
 * trendyol.ts
 * Trendyol Satıcı API client — Electron main process'te çalışır (CORS yok)
 * Docs: https://apigw.trendyol.com / https://stageapigw.trendyol.com
 */
import https from 'https';
import http from 'http';
/**
 * Trendyol API'sine Basic Auth ile HTTP isteği gönderir.
 * Electron main process'te çalışır, CORS sorunu olmaz.
 */
function trendyolRequest(creds, path, params = {}) {
    const isMock = creds.supplierId === '12345';
    const baseHost = isMock
        ? 'localhost'
        : creds.isStage
            ? 'stageapigw.trendyol.com'
            : 'apigw.trendyol.com';
    const port = isMock ? 3001 : 443;
    const protocol = isMock ? http : https;
    // Query string oluştur
    const queryParts = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : '';
    const fullPath = path + queryString;
    // Basic Auth header
    const authString = Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString('base64');
    const options = {
        hostname: baseHost,
        port: port,
        path: fullPath,
        method: 'GET',
        headers: {
            'Authorization': `Basic ${authString}`,
            'User-Agent': `${creds.supplierId} - SelfIntegration`,
            'Content-Type': 'application/json',
        },
    };
    return new Promise((resolve, reject) => {
        const req = protocol.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(data));
                    }
                    else {
                        reject(new Error(`Trendyol API Error ${res.statusCode}: ${data}`));
                    }
                }
                catch (e) {
                    reject(new Error(`JSON parse error: ${data}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.setTimeout(15000, () => {
            req.destroy();
            reject(new Error('Trendyol API zaman aşımı (15s)'));
        });
        req.end();
    });
}
/**
 * Siparişleri çek — maksimum 2 haftalık pencereler halinde
 */
export async function fetchOrders(creds, params = {}) {
    const path = `/integration/order/sellers/${creds.supplierId}/orders`;
    const queryParams = {
        page: params.page ?? 0,
        size: params.size ?? 50,
    };
    if (params.startDate)
        queryParams.startDate = params.startDate;
    if (params.endDate)
        queryParams.endDate = params.endDate;
    if (params.status)
        queryParams.status = params.status;
    return trendyolRequest(creds, path, queryParams);
}
/**
 * Son N gün içindeki tüm siparişleri çek (sayfalı, pencere bölümü ile)
 * Trendyol max 2 haftalık aralık destekler → 30 gün için 3 pencere
 */
export async function fetchAllOrdersLastDays(creds, days = 30, onProgress) {
    const now = Date.now();
    const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
    // Pencere listesi oluştur (geriden ileriye)
    const windows = [];
    let windowEnd = now;
    let windowStart = Math.max(now - days * 24 * 60 * 60 * 1000, windowEnd - TWO_WEEKS_MS);
    while (windowEnd > now - days * 24 * 60 * 60 * 1000) {
        windows.push({ startDate: windowStart, endDate: windowEnd });
        windowEnd = windowStart;
        windowStart = Math.max(now - days * 24 * 60 * 60 * 1000, windowEnd - TWO_WEEKS_MS);
        if (windowEnd <= now - days * 24 * 60 * 60 * 1000)
            break;
    }
    const allOrders = [];
    for (const window of windows) {
        let page = 0;
        let totalPages = 1;
        while (page < totalPages) {
            const response = await fetchOrders(creds, {
                startDate: window.startDate,
                endDate: window.endDate,
                page,
                size: 200,
            });
            allOrders.push(...response.content);
            totalPages = response.totalPages;
            page++;
            if (onProgress) {
                onProgress(allOrders.length, response.totalElements);
            }
            // Rate limit: 50 req / 10s → ~200ms bekle
            if (page < totalPages) {
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }
    return allOrders;
}
/**
 * API bağlantısını doğrula — hata yoksa true döner
 */
export async function validateCredentials(creds) {
    try {
        // Son 1 günlük sipariş isteği gönder (en az yük)
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        await fetchOrders(creds, {
            startDate: oneDayAgo,
            endDate: Date.now(),
            page: 0,
            size: 1,
        });
        return { ok: true };
    }
    catch (err) {
        return { ok: false, error: err.message };
    }
}
