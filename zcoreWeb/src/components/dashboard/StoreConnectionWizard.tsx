"use client";

import React, { useState } from 'react';
import { Store, ShoppingCart, Key, CheckCircle, ClipboardPaste, X } from 'lucide-react';

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

  const normalizedText = text.replace(/\s+/g, ' ');

  if (normalizedText.toLowerCase().includes('satıcı id') || normalizedText.toLowerCase().includes('api anahtarı')) {
    result.platform = 'Trendyol';
    
    const supplierIdMatch = text.match(/(?:Satıcı ID|Satıcı Id|Supplier ID)[^0-9]*(\d+)/i);
    if (supplierIdMatch && supplierIdMatch[1]) result.supplierId = supplierIdMatch[1].trim();

    const apiKeyMatch = text.match(/(?:API Anahtarı|Api Key)[^\w]*([A-Za-z0-9_-]+)/i);
    if (apiKeyMatch && apiKeyMatch[1]) result.apiKey = apiKeyMatch[1].trim();

    const apiSecretMatch = text.match(/(?:API Şifresi|Api Secret|Şifre)[^\w]*([A-Za-z0-9_-]+)/i);
    if (apiSecretMatch && apiSecretMatch[1]) result.apiSecret = apiSecretMatch[1].trim();
  } 

  return result;
}

type Step = 'select' | 'info' | 'connect' | 'success';

interface StoreConnectionWizardProps {
  onClose: () => void;
}

export default function StoreConnectionWizard({ onClose }: StoreConnectionWizardProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<ParsedApiCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const marketplaces = [
    { id: 'trendyol', name: 'Trendyol', color: 'bg-[#FF6000]' },
    { id: 'hepsiburada', name: 'Hepsiburada', color: 'bg-[#FF6600]' },
    { id: 'n11', name: 'N11', color: 'bg-[#5B3E96]' },
    { id: 'amazon', name: 'Amazon', color: 'bg-[#FF9900]' },
    { id: 'excel', name: 'Excel / Manuel', color: 'bg-emerald-600' }
  ];

  const handleSelect = (id: string) => {
    setSelectedMarket(id);
    if (id === 'excel') {
      // Future
    } else {
      setStep('info');
    }
  };

  const handleClipboardRead = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseMarketplaceClipboard(text);
      
      if (parsed.apiKey && parsed.apiSecret) {
        setCredentials(parsed);
        setError(null);
        
        setIsConnecting(true);
        setTimeout(() => {
          setIsConnecting(false);
          setStep('success');
        }, 1500);
        
      } else {
        setError('Panoda geçerli bir entegrasyon bilgisi bulunamadı. Lütfen panelden tüm metni kopyaladığınızdan emin olun.');
      }
    } catch (err) {
      setError('Panoya erişilemedi. Lütfen tarayıcıdan izin verin veya kopyalama işlemini tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            Yeni Mağaza Ekle
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          
          {step === 'select' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-zinc-300 mb-6 text-center">Bağlamak istediğiniz platformu seçin</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {marketplaces.map(market => (
                  <button
                    key={market.id}
                    onClick={() => handleSelect(market.id)}
                    className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-full ${market.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {market.id === 'excel' ? <Key className="w-6 h-6 text-white" /> : <ShoppingCart className="w-6 h-6 text-white" />}
                    </div>
                    <span className="text-zinc-200 font-medium">{market.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'info' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-lg mx-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8 text-center">
                <Key className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Güvenli Bağlantı</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  ZCore, pazaryeri kullanıcı adınızı veya şifrenizi <strong>asla</strong> istemez. <br/><br/>
                  Mağazanız yalnızca resmi bağlantı bilgileriyle güvenli şekilde bağlanır. Bu bilgiler sadece sipariş, ürün, stok ve kargo bilgilerinizi yönetmek için kullanılır.
                </p>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep('select')} className="px-6 py-2.5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  Geri Dön
                </button>
                <button onClick={() => setStep('connect')} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                  Bağlantıya Geç
                </button>
              </div>
            </div>
          )}

          {step === 'connect' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Adım Adım Bağlantı</h3>
              
              <ol className="space-y-4 mb-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-white/10">
                {[
                  `${selectedMarket === 'trendyol' ? 'Trendyol' : 'Pazaryeri'} Satıcı Paneli'ni açın.`,
                  'Entegrasyon Bilgileri sayfasına gidin.',
                  'Ekranda yazan tüm metni (Satıcı ID, API Key vb.) farenizle seçip Kopyalayın (Ctrl+C).',
                  'ZCore\'a dönüp aşağıdaki butona basın.'
                ].map((text, i) => (
                  <li key={i} className="relative pl-10">
                    <span className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-[#111111] border border-white/20 text-zinc-400 text-sm flex items-center justify-center font-bold z-10">
                      {i + 1}
                    </span>
                    <p className="text-zinc-300 mt-1">{text}</p>
                  </li>
                ))}
              </ol>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleClipboardRead}
                disabled={isConnecting}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                {isConnecting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ClipboardPaste className="w-6 h-6" />
                    Panodan Al ve Bağlan
                  </>
                )}
              </button>
              
              <button onClick={() => setStep('info')} className="w-full mt-4 py-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                Geri Dön
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-in zoom-in-95 duration-500 max-w-sm mx-auto text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Başarıyla Bağlandı!</h3>
              <p className="text-zinc-400 mb-8">
                {selectedMarket === 'trendyol' ? 'Trendyol' : 'Pazaryeri'} mağazanız sisteme eklendi. Siparişleriniz senkronize edilmeye başlanacak.
              </p>
              
              {credentials && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 text-left space-y-2">
                  <p className="text-sm text-zinc-500">Çekilen Bilgiler:</p>
                  <p className="text-xs font-mono text-zinc-300">Satıcı ID: {credentials.supplierId}</p>
                  <p className="text-xs font-mono text-zinc-300">API Anahtarı: {credentials.apiKey?.substring(0,6)}...</p>
                </div>
              )}

              <button onClick={() => {
                // Masaüstü uygulamasını tetikle
                window.location.href = 'zcore://store-added';
                // Sihirbazı kapat
                setTimeout(() => {
                  onClose();
                }, 500);
              }} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500/30 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20">
                Masaüstü Uygulamasına Dön
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
