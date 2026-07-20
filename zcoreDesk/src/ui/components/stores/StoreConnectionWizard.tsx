import { useState } from 'react';
import { Store, ShoppingCart, Key, CheckCircle, ClipboardPaste, X, Loader2, AlertCircle, Wifi } from 'lucide-react';
import { parseMarketplaceClipboard } from '../../../core/utils/clipboardParser';
import type { ParsedApiCredentials } from '../../../core/utils/clipboardParser';
import { useAuth } from '../../../core/AuthContext';

type Step = 'select' | 'info' | 'connect' | 'validating' | 'success' | 'error';

interface StoreConnectionWizardProps {
  onClose: () => void;
  onStoreAdded?: () => void; // Dashboard'u yenilemek için callback
}

export default function StoreConnectionWizard({ onClose, onStoreAdded }: StoreConnectionWizardProps) {
  const { token } = useAuth();
  const [step, setStep] = useState<Step>('select');
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<ParsedApiCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [savedStoreId, setSavedStoreId] = useState<string | null>(null);

  const marketplaces = [
    { id: 'trendyol', name: 'Trendyol', color: 'bg-[#FF6000]', supported: true },
    { id: 'hepsiburada', name: 'Hepsiburada', color: 'bg-[#FF6600]', supported: false },
    { id: 'n11', name: 'N11', color: 'bg-[#5B3E96]', supported: false },
    { id: 'amazon', name: 'Amazon', color: 'bg-[#FF9900]', supported: false },
    { id: 'excel', name: 'Excel / Manuel', color: 'bg-emerald-600', supported: false },
  ];

  const handleSelect = (id: string) => {
    const market = marketplaces.find(m => m.id === id);
    if (!market?.supported) {
      setError('Bu platform henüz desteklenmiyor. Yakında eklenecek!');
      return;
    }
    setError(null);
    setSelectedMarket(id);
    setStep('info');
  };

  const handleClipboardRead = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseMarketplaceClipboard(text);

      if (parsed.supplierId && parsed.apiKey && parsed.apiSecret) {
        setCredentials(parsed);
        setError(null);
        await handleValidateAndConnect(parsed);
      } else {
        // Eksik alanları göster
        const missing = [];
        if (!parsed.supplierId) missing.push('Satıcı ID');
        if (!parsed.apiKey) missing.push('API Anahtarı');
        if (!parsed.apiSecret) missing.push('API Şifresi');
        setError(
          `Panoda şu bilgiler bulunamadı: ${missing.join(', ')}. ` +
          `Lütfen Trendyol Satıcı Paneli → Hesap Bilgilerim → Entegrasyon Bilgileri sayfasındaki tüm metni kopyaladığınızdan emin olun.`
        );
      }
    } catch {
      setError('Panoya erişilemedi. Tarayıcı izni gerekli olabilir.');
    }
  };

  const handleValidateAndConnect = async (creds: ParsedApiCredentials) => {
    if (!creds.supplierId || !creds.apiKey || !creds.apiSecret) return;

    setIsConnecting(true);
    setStep('validating');
    setValidationMessage('Trendyol API\'ye bağlanılıyor...');

    try {
      // 1. API bağlantısını doğrula
      if (window.electronAPI?.validateTrendyolCreds) {
        setValidationMessage('API anahtarları doğrulanıyor...');
        const validation = await window.electronAPI.validateTrendyolCreds({
          supplierId: creds.supplierId,
          apiKey: creds.apiKey,
          apiSecret: creds.apiSecret,
        });

        if (!validation.ok) {
          setError(
            validation.error?.includes('401')
              ? 'API anahtarları geçersiz. Lütfen bilgileri kontrol edin.'
              : validation.error?.includes('503')
              ? 'Trendyol API şu an erişilemiyor. Lütfen daha sonra deneyin.'
              : `Bağlantı hatası: ${validation.error}`
          );
          setStep('error');
          setIsConnecting(false);
          return;
        }

        // 2. Credential'ları kaydet ve sync başlat
        setValidationMessage('Mağaza kaydediliyor ve veriler çekiliyor...');
        if (window.electronAPI?.saveStore && token) {
          const saveResult = await window.electronAPI.saveStore({
            platform: 'TRENDYOL',
            name: `Trendyol #${creds.supplierId}`,
            supplierId: creds.supplierId,
            apiKey: creds.apiKey,
            apiSecret: creds.apiSecret,
            token,
          });

          if (saveResult.success && saveResult.storeId) {
            setSavedStoreId(saveResult.storeId);
          }
        }

        setStep('success');
        if (onStoreAdded) onStoreAdded();
      } else {
        // Electron API yoksa (web preview) — sadece başarı göster
        setStep('success');
      }
    } catch (err: any) {
      setError(`Beklenmeyen hata: ${err.message}`);
      setStep('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualSync = async () => {
    if (!savedStoreId || !token || !window.electronAPI?.syncStore) return;
    await window.electronAPI.syncStore(savedStoreId, token);
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

        {/* Progress Bar */}
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width:
                step === 'select' ? '0%' :
                step === 'info' ? '33%' :
                step === 'connect' ? '55%' :
                step === 'validating' ? '80%' :
                '100%'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">

          {/* ADIM: Platform Seç */}
          {step === 'select' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-zinc-300 mb-6 text-center">Bağlamak istediğiniz platformu seçin</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {marketplaces.map(market => (
                  <button
                    key={market.id}
                    onClick={() => handleSelect(market.id)}
                    className={`p-6 rounded-xl border transition-all flex flex-col items-center gap-4 group relative ${
                      market.supported
                        ? 'border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/20 cursor-pointer'
                        : 'border-white/5 bg-white/[0.01] cursor-not-allowed opacity-50'
                    }`}
                  >
                    {!market.supported && (
                      <span className="absolute top-2 right-2 text-[9px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded-full">
                        Yakında
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-full ${market.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {market.id === 'excel' ? <Key className="w-6 h-6 text-white" /> : <ShoppingCart className="w-6 h-6 text-white" />}
                    </div>
                    <span className="text-zinc-200 font-medium">{market.name}</span>
                  </button>
                ))}
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* ADIM: Güvenlik Bilgisi */}
          {step === 'info' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-lg mx-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8 text-center">
                <Key className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Güvenli Bağlantı</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  ZCore, pazaryeri kullanıcı adınızı veya şifrenizi <strong>asla</strong> istemez.<br /><br />
                  API bilgileriniz yalnızca bilgisayarınızda, işletim sistemi şifrelemesiyle (Windows DPAPI) korunarak saklanır.
                  Hiçbir sunucuya gönderilmez.
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

          {/* ADIM: Bağlan */}
          {step === 'connect' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Adım Adım Bağlantı</h3>

              <ol className="space-y-4 mb-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-white/10">
                {[
                  'Trendyol Satıcı Paneli\'ni açın (partner.trendyol.com)',
                  'Sol menüden Hesap Bilgilerim → Entegrasyon Bilgileri sayfasına gidin.',
                  'Ekranda görünen Satıcı ID, API Anahtarı ve API Şifresi bilgilerini içeren tüm metni seçip Kopyalayın (Ctrl+A → Ctrl+C).',
                  'ZCore\'a dönüp aşağıdaki butona basın.',
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
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  {error}
                </div>
              )}

              <button
                onClick={handleClipboardRead}
                disabled={isConnecting}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                {isConnecting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
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

          {/* ADIM: Doğrulanıyor */}
          {step === 'validating' && (
            <div className="animate-in fade-in duration-300 max-w-sm mx-auto text-center py-8">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Wifi className="w-10 h-10 text-blue-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bağlantı Kuruluyor</h3>
              <p className="text-zinc-400 text-sm">{validationMessage}</p>
            </div>
          )}

          {/* ADIM: Hata */}
          {step === 'error' && (
            <div className="animate-in fade-in duration-300 max-w-sm mx-auto text-center py-8">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bağlantı Başarısız</h3>
              <p className="text-red-400 text-sm mb-8">{error}</p>
              <div className="flex gap-3">
                <button onClick={() => { setStep('connect'); setError(null); }} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
                  Tekrar Dene
                </button>
                <button onClick={onClose} className="flex-1 py-3 bg-white/5 text-zinc-400 rounded-lg hover:bg-white/10 transition-colors">
                  Kapat
                </button>
              </div>
            </div>
          )}

          {/* ADIM: Başarı */}
          {step === 'success' && (
            <div className="animate-in zoom-in-95 duration-500 max-w-sm mx-auto text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Başarıyla Bağlandı!</h3>
              <p className="text-zinc-400 mb-2 text-sm">
                Trendyol mağazanız sisteme eklendi.
              </p>
              <p className="text-zinc-500 text-xs mb-8">
                Arka planda siparişleriniz çekilmeye devam ediyor. Birkaç dakika içinde Siparişler sayfasında görünecek.
              </p>

              {credentials && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 text-left space-y-2">
                  <p className="text-xs text-zinc-500 mb-2">Bağlanan mağaza:</p>
                  <p className="text-xs font-mono text-zinc-300">Platform: Trendyol</p>
                  <p className="text-xs font-mono text-zinc-300">Satıcı ID: {credentials.supplierId}</p>
                  <p className="text-xs font-mono text-zinc-300">API Anahtarı: {credentials.apiKey?.substring(0, 8)}••••</p>
                </div>
              )}

              <button onClick={onClose} className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-lg font-medium transition-colors">
                Tamam, Kapat
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
