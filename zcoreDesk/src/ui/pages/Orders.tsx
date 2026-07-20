import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle2, Clock, Truck, ChevronDown, ChevronRight, Phone, MapPin, Database, Lock } from 'lucide-react';
import { useAuth } from '../../core/AuthContext';
import { useSubscription } from '../../core/auth/useSubscription';
import { DEMO_ORDERS } from '../../core/demo/mockData';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isDemoOnly } = useSubscription();
  const isDemo = isDemoOnly();

  const [orders, setOrders] = useState<any[]>(isDemo ? DEMO_ORDERS : []);
  const [loading, setLoading] = useState(!isDemo); // demo modda hemen hazır
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStore, setActiveStore] = useState('Tümü');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const metrics = React.useMemo(() => {
    let pending = 0;
    let shipped = 0;
    let delivered = 0;
    
    if (isDemo) {
      return { pending: 45, shipped: 89, delivered: 145 };
    }

    orders.forEach(o => {
      const s = o.status?.toLowerCase();
      // "created" or "processing" counts as pending
      if (s === 'processing' || s === 'created' || s === 'bekliyor') pending++;
      else if (s === 'shipped' || s === 'kargolandı') shipped++;
      else if (s === 'delivered' || s === 'teslim edildi') delivered++;
    });

    return { pending, shipped, delivered };
  }, [orders, isDemo]);

  useEffect(() => {
    if (!isDemo) fetchOrders();
  }, [token, isDemo]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      if (window.electronAPI && window.electronAPI.getOrders) {
        const response = await window.electronAPI.getOrders(token);
        if (response.success && response.data) {
          const formattedData = response.data.map((o: any) => ({
            ...o,
            date: new Date(o.orderDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
          }));
          setOrders(formattedData);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test siparişi sadece gerçek planlarda
  const handleAddMockOrder = async () => {
    if (!token || !window.electronAPI || isDemo) return;
    const mockOrder = {
      id: `ORD-TEST-${Math.floor(Math.random() * 10000)}`,
      storeId: ['Trendyol', 'Hepsiburada', 'Amazon'][Math.floor(Math.random() * 3)],
      orderDate: Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000), // Random last 10 days
      customer: `Müşteri ${Math.floor(Math.random() * 1000)}`,
      phone: '+90 5XX XXX XX XX',
      address: 'Gizli Şifreli Adres - Veritabanında Şifrelendi',
      product: 'Test Ürünü ' + Math.floor(Math.random() * 100),
      quantity: Math.floor(Math.random() * 5) + 1,
      amount: `₺${Math.floor(Math.random() * 500) + 50}.00`,
      status: ['processing', 'shipped', 'delivered'][Math.floor(Math.random() * 3)]
    };

    await window.electronAPI.addOrder(mockOrder, token);
    fetchOrders();
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    
    if (s === 'delivered' || s === 'teslim edildi') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Teslim Edildi
        </span>
      );
    } else if (s === 'processing' || s === 'created' || s === 'bekliyor') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#ffd166]/10 text-[#ffd166] border border-[#ffd166]/20">
          <Clock className="w-3.5 h-3.5" /> Hazırlanıyor
        </span>
      );
    } else if (s === 'shipped' || s === 'kargolandı') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#a078ff]/10 text-[#a078ff] border border-[#a078ff]/20">
          <Truck className="w-3.5 h-3.5" /> Kargolandı
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || (o.customer && o.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStore = activeStore === 'Tümü' || o.storeId === activeStore;
    return matchesSearch && matchesStore;
  });

  return (
    <div className="flex flex-col h-full space-y-6">

      {/* Demo Plan Uyarı Bandı */}
      {isDemo && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Demo Modu</span> — Gösterilen siparışler örnek içeriktir. Gerçek siparışlerinizi görmek için{' '}
            <button
              onClick={() => navigate('/plans')}
              className="underline underline-offset-2 hover:text-amber-200 transition-colors font-medium"
            >
              bir plan seçin
            </button>
            .
          </p>
        </div>
      )}

      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#e2e2e9] tracking-tight">Siparişler</h1>
          <p className="text-sm text-[#958ea0] mt-1">Tüm mağazalarınızdan gelen siparişleri yönetin.</p>
        </div>
        <div className="flex gap-3">
          {/* Test siparişi butonu sadece gerçek planlarda görünür */}
          {!isDemo && (
            <button 
              onClick={handleAddMockOrder}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm text-emerald-400 transition-colors"
            >
              <Database className="w-4 h-4" /> Test Siparişi Ekle
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-[#e2e2e9] transition-colors">
            <Download className="w-4 h-4 text-[#958ea0]" /> Dışa Aktar
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bekleyen Siparişler */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffd166]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          <div>
            <p className="text-sm font-medium text-[#958ea0] mb-1">Bekleyen Siparişler</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[#e2e2e9]">{metrics.pending}</h2>
              <span className="text-xs text-[#958ea0]">adet</span>
            </div>
          </div>
          <div className="p-3 bg-[#ffd166]/10 rounded-xl">
            <Clock className="w-6 h-6 text-[#ffd166]" />
          </div>
        </div>

        {/* Teslim Aşamasındakiler */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#a078ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          <div>
            <p className="text-sm font-medium text-[#958ea0] mb-1">Teslim Aşamasındakiler</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[#e2e2e9]">{metrics.shipped}</h2>
              <span className="text-xs text-[#958ea0]">adet</span>
            </div>
          </div>
          <div className="p-3 bg-[#a078ff]/10 rounded-xl">
            <Truck className="w-6 h-6 text-[#a078ff]" />
          </div>
        </div>

        {/* Teslim Edilenler */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4edea3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          <div>
            <p className="text-sm font-medium text-[#958ea0] mb-1">Teslim Edilenler</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-[#e2e2e9]">{metrics.delivered}</h2>
              <span className="text-xs text-[#958ea0]">adet</span>
            </div>
          </div>
          <div className="p-3 bg-[#4edea3]/10 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-[#4edea3]" />
          </div>
        </div>
      </div>

      {/* Tabs and Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-4">
        
        <div className="flex gap-2">
          {['Tümü', 'Trendyol', 'Hepsiburada', 'Amazon', 'N11'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveStore(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                activeStore === tab 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-[#958ea0] hover:text-[#e2e2e9] hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#958ea0] w-4 h-4" />
            <input
              type="text"
              placeholder="Sipariş no veya müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-[#e2e2e9] focus:outline-none focus:border-[#a078ff]/50 transition-colors placeholder:text-[#958ea0]"
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[400px]">

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#1a1b21]/90 backdrop-blur-xl border-b border-white/5 z-10">
              <tr>
                <th className="py-4 px-4 w-10"></th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Mağaza</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Sipariş No</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Müşteri Adı</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Ürün Adı</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Adet</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Tarih</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Tutar</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#958ea0]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#a078ff] border-t-transparent rounded-full animate-spin"></div>
                      <p>Siparişler yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#958ea0]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Database className="w-12 h-12 text-white/10" />
                      <p className="text-lg text-[#e2e2e9]">Henüz sipariş bulunmuyor</p>
                      <p className="text-sm">Bağlı mağazalarınızdan henüz sipariş çekilmedi veya bulunamadı.</p>
                      {!isDemo && (
                        <button 
                          onClick={fetchOrders}
                          className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-[#e2e2e9] transition-colors"
                        >
                          Yenile
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedRows.has(order.id);
                return (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.02]' : ''}`}
                      onClick={() => toggleRow(order.id)}
                    >
                      <td className="py-4 px-4">
                        <button className="p-1 text-[#958ea0] hover:text-[#e2e2e9] rounded-md transition-colors">
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-[#cbc3d7] border border-white/10">
                          {order.storeId}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-[#e2e2e9]">{order.id}</td>
                      <td className="py-4 px-6 text-sm text-[#cbc3d7]">{order.customer}</td>
                      <td className="py-4 px-6 text-sm text-[#e2e2e9]">{order.product}</td>
                      <td className="py-4 px-6 text-sm text-[#cbc3d7]">{order.quantity}</td>
                      <td className="py-4 px-6 text-sm text-[#958ea0]">{order.date}</td>
                      <td className="py-4 px-6 text-sm font-medium text-[#e2e2e9]">{order.amount}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-black/20">
                        <td colSpan={9} className="p-0 border-t border-white/5">
                          <div className="px-14 py-4 flex flex-col gap-3 md:flex-row md:gap-8 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-[#a078ff]/10 rounded-lg shrink-0">
                                <Phone className="w-4 h-4 text-[#a078ff]" />
                              </div>
                              <div>
                                <p className="text-xs text-[#958ea0] mb-0.5 uppercase tracking-wide font-medium">Telefon Numarası</p>
                                <p className="text-sm text-[#e2e2e9]">{order.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 bg-[#4edea3]/10 rounded-lg shrink-0">
                                <MapPin className="w-4 h-4 text-[#4edea3]" />
                              </div>
                              <div>
                                <p className="text-xs text-[#958ea0] mb-0.5 uppercase tracking-wide font-medium">Teslimat Adresi</p>
                                <p className="text-sm text-[#e2e2e9] max-w-lg">{order.address}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-sm text-[#958ea0]">
          <span>Toplam {filteredOrders.length} sipariş gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[#cbc3d7] transition-colors disabled:opacity-50" disabled>Önceki</button>
            <button className="px-3 py-1 bg-[#a078ff]/20 border border-[#a078ff]/30 rounded text-[#e2e2e9]">1</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[#cbc3d7] transition-colors disabled:opacity-50" disabled>Sonraki</button>
          </div>
        </div>

      </div>
    </div>
  );
}
