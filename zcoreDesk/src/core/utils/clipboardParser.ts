/**
 * Parses raw text copied from marketplace integration pages (like Trendyol)
 * and extracts Supplier ID, API Key, and API Secret using regex.
 */

export interface ParsedApiCredentials {
  supplierId: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  platform: 'Trendyol' | 'Hepsiburada' | 'Unknown';
}

export function parseMarketplaceClipboard(text: string): ParsedApiCredentials {
  const result: ParsedApiCredentials = {
    supplierId: null,
    apiKey: null,
    apiSecret: null,
    platform: 'Unknown',
  };

  if (!text || typeof text !== 'string') return result;

  // Normalize text (remove extra spaces, tabs, etc. to make it easier to parse)
  const normalizedText = text.replace(/\s+/g, ' ');

  // Trendyol Keywords: "Satıcı ID", "API Anahtarı", "API Şifresi"
  if (normalizedText.toLowerCase().includes('satıcı id') || normalizedText.toLowerCase().includes('api anahtarı')) {
    result.platform = 'Trendyol';
    
    // We look for patterns like:
    // "Satıcı ID: 123456" or "Satıcı ID 123456"
    // "API Anahtarı: abcd123" or "API Key: abcd123"
    // "API Şifresi: xyz987" or "API Secret: xyz987"

    const supplierIdMatch = text.match(/(?:Satıcı ID|Satıcı Id|Supplier ID)[^0-9]*(\d+)/i);
    if (supplierIdMatch && supplierIdMatch[1]) {
      result.supplierId = supplierIdMatch[1].trim();
    }

    const apiKeyMatch = text.match(/(?:API Anahtarı|Api Key)[^\w]*([A-Za-z0-9_-]+)/i);
    if (apiKeyMatch && apiKeyMatch[1]) {
      result.apiKey = apiKeyMatch[1].trim();
    }

    const apiSecretMatch = text.match(/(?:API Şifresi|Api Secret|Şifre)[^\w]*([A-Za-z0-9_-]+)/i);
    if (apiSecretMatch && apiSecretMatch[1]) {
      result.apiSecret = apiSecretMatch[1].trim();
    }
  } 
  // Future: Hepsiburada etc. can be added here
  else if (normalizedText.toLowerCase().includes('hepsiburada')) {
    result.platform = 'Hepsiburada';
    // Hepsiburada parsing logic...
  }

  // Fallback: If no keywords but 3 separate blocks of text are found, we might guess
  if (!result.supplierId && !result.apiKey && !result.apiSecret) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    // If they literally just copied 3 lines (ID, Key, Secret)
    if (lines.length >= 3) {
      // Basic heuristic
      const possibleId = lines.find(l => /^\d+$/.test(l));
      if (possibleId) result.supplierId = possibleId;
    }
  }

  return result;
}
