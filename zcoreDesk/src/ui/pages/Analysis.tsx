import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Users, ShoppingBag, BarChart3, Lock } from 'lucide-react';
import { useAuth } from '../../core/AuthContext';
import { useSubscription } from '../../core/auth/useSubscription';
import { useNavigate } from 'react-router-dom';

export default function Analysis() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isDemoOnly } = useSubscription();
  const isDemo = isDemoOnly();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isDemo);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    if (!isDemo && token && window.electronAPI?.getOrders) {
      setLoading(true);
      window.electronAPI.getOrders(token).then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token, isDemo]);

  // Hesaplamalar
  const metrics = useMemo(() => {
    if (isDemo || (loading && orders.length === 0)) {
      return {
        dailySales: [40, 70, 45, 90, 65, 100, 80],
        maxDaily: 100,
        topProducts: [
          { name: 'Kablosuz Kulaklık Pro', sales: 124, growth: '+12%', amount: '₺4,200', down: false },
          { name: 'Mekanik Klavye v2', sales: 86, growth: '+5%', amount: '₺2,800', down: false },
          { name: 'Ergonomik Mouse', sales: 54, growth: '-2%', amount: '₺1,100', down: true },
        ],
        storeSources: [
          { source: 'Trendyol', percentage: 45, color: 'bg-[#ffb4ab]' },
          { source: 'Hepsiburada', percentage: 35, color: 'bg-[#a078ff]' },
          { source: 'Amazon', percentage: 20, color: 'bg-[#4edea3]' },
        ],
        avgCartValue: '₺84.50'
      };
    }

    if (orders.length === 0) {
      return {
        dailySales: [0, 0, 0, 0, 0, 0, 0],
        chartLabels: [],
        maxDaily: 1,
        topProducts: [],
        storeSources: [],
        avgCartValue: '₺0.00'
      };
    }

    // Seçili döneme göre siparişleri filtrele
    const now = new Date();
    let filteredOrders = orders;
    
    if (timeRange === '7d') {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      filteredOrders = orders.filter(o => new Date(o.orderDate) >= cutoff);
    } else if (timeRange === '30d') {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 30);
      filteredOrders = orders.filter(o => new Date(o.orderDate) >= cutoff);
    }

    // 1. Satış Trendi Grafiği
    let chartLabels: string[] = [];
    let chartValues: number[] = [];

    if (timeRange === '7d') {
      const last7DaysStr = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });
      chartLabels = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      });
      chartValues = Array(7).fill(0);
      
      filteredOrders.forEach(o => {
        if (!o.orderDate) return;
        const d = new Date(o.orderDate);
        const dateStr = d.toISOString().split('T')[0];
        const idx = last7DaysStr.indexOf(dateStr);
        if (idx !== -1) {
          let val = typeof o.amount === 'string' ? parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.')) : o.grossAmount || o.amount || 0;
          if (!isNaN(val)) chartValues[idx] += val;
        }
      });
    } else if (timeRange === '30d') {
      chartLabels = ["4. Hafta", "3. Hafta", "2. Hafta", "1. Hafta"];
      chartValues = [0, 0, 0, 0];
      const last30DaysStr = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
      });
      
      filteredOrders.forEach(o => {
        if (!o.orderDate) return;
        const d = new Date(o.orderDate);
        const dateStr = d.toISOString().split('T')[0];
        const idx = last30DaysStr.indexOf(dateStr);
        if (idx !== -1) {
          let val = typeof o.amount === 'string' ? parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.')) : o.grossAmount || o.amount || 0;
          if (!isNaN(val)) {
            let weekIdx = Math.floor(idx / 7.5);
            if (weekIdx > 3) weekIdx = 3;
            chartValues[weekIdx] += val;
          }
        }
      });
    } else {
      chartLabels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      chartValues = Array(12).fill(0);
      filteredOrders.forEach(o => {
        if (!o.orderDate) return;
        const month = new Date(o.orderDate).getMonth();
        let val = typeof o.amount === 'string' ? parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.')) : o.grossAmount || o.amount || 0;
        if (!isNaN(val)) chartValues[month] += val;
      });
    }

    // Kullanıcının isteği: En yeni veri (Bugün/Bu Hafta) EN SOLDA olsun.
    chartLabels.reverse();
    chartValues.reverse();
    
    // 30 günlükte soldan sağa 1. Hafta, 2. Hafta olarak gözükmesi için ezilebilir
    if (timeRange === '30d') {
      chartLabels = ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"];
    }

    const maxDaily = Math.max(...chartValues, 1);

    // 2. En Çok Satanlar
    const prodMap = new Map();
    filteredOrders.forEach(o => {
      const name = o.product || 'Bilinmeyen Ürün';
      const qty = o.quantity || 1;
      let val = typeof o.amount === 'string' ? parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.')) : o.grossAmount || o.amount || 0;
      
      const cur = prodMap.get(name) || { name, sales: 0, totalAmount: 0 };
      cur.sales += qty;
      if (!isNaN(val)) cur.totalAmount += val;
      prodMap.set(name, cur);
    });

    const topProducts = Array.from(prodMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        sales: p.sales,
        growth: '—',
        amount: `₺${p.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        down: false
      }));

    // 3. Mağaza Kaynağı Dağılımı
    const storeMap = new Map();
    filteredOrders.forEach(o => {
      const sName = (o.storeId || 'Bilinmeyen').split('-')[0];
      storeMap.set(sName, (storeMap.get(sName) || 0) + 1);
    });

    const colors = ['bg-[#ffb4ab]', 'bg-[#a078ff]', 'bg-[#4edea3]', 'bg-[#ffd166]'];
    const totalFiltered = Math.max(filteredOrders.length, 1);
    
    const storeSources = Array.from(storeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([source, count], i) => ({
        source,
        percentage: Math.round((count / totalFiltered) * 100),
        color: colors[i % colors.length]
      }));

    // 4. Ortalama Sepet Tutarı
    let totalRev = 0;
    filteredOrders.forEach(o => {
      let val = typeof o.amount === 'string' ? parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.')) : o.grossAmount || o.amount || 0;
      if (!isNaN(val)) totalRev += val;
    });
    const avgCart = totalRev / totalFiltered;

    return {
      dailySales: chartValues,
      chartLabels,
      maxDaily,
      topProducts,
      storeSources,
      avgCartValue: `₺${avgCart.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  }, [orders, isDemo, loading, timeRange]);
  
  return (
    <div className="flex flex-col h-full space-y-6">

      {/* Demo Plan Uyarı Bandı */}
      {isDemo && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Demo Modu</span> — Gösterilen analizler örnek içeriktir. Gerçek verilerinizi analiz etmek için{' '}
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

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#e2e2e9] tracking-tight">Analiz</h1>
          <p className="text-sm text-[#958ea0] mt-1">Mağaza performanslarınızı ve satış trendlerini inceleyin.</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
          <button 
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${timeRange === '7d' ? 'text-[#e2e2e9] bg-[#a078ff]/20' : 'text-[#958ea0] hover:text-[#e2e2e9]'}`}
          >
            7 Gün
          </button>
          <button 
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${timeRange === '30d' ? 'text-[#e2e2e9] bg-[#a078ff]/20' : 'text-[#958ea0] hover:text-[#e2e2e9]'}`}
          >
            30 Gün
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${timeRange === 'all' ? 'text-[#e2e2e9] bg-[#a078ff]/20' : 'text-[#958ea0] hover:text-[#e2e2e9]'}`}
          >
            Tüm Zamanlar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-auto pb-4">
        
        {/* Main Chart Card (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-[#e2e2e9]">Satış Trendi</h3>
              <p className="text-sm text-[#958ea0]">Son 7 günlük gelir dağılımı</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <Activity className="w-5 h-5 text-[#a078ff]" />
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 flex flex-col justify-end mt-6">
            <div className="relative flex items-end justify-between gap-2 pt-12 border-b border-white/10 flex-1 min-h-[192px]">
              {metrics.dailySales.map((val, i) => {
                const height = (val / metrics.maxDaily) * 100;
                return (
                  <div key={i} className="flex flex-col items-center justify-end flex-1 h-full">
                    {/* Bar */}
                    <div 
                      className="group/bar relative w-full max-w-[48px] bg-gradient-to-t from-white/20 to-white rounded-t-sm transition-all duration-500 ease-out hover:brightness-125 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: val > 0 ? '4px' : '0' }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-[#2a2b36] text-xs px-2 py-1 rounded text-white border border-white/10 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                        ₺{val.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Labels under the line */}
            <div className="flex justify-between items-center mt-3 h-4">
              {metrics.chartLabels && metrics.chartLabels.map((label, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-[#958ea0] truncate px-0.5">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Card */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-[#e2e2e9]">En Çok Satanlar</h3>
              <p className="text-sm text-[#958ea0]">Bu dönem öne çıkan 5 ürün</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <ShoppingBag className="w-5 h-5 text-[#4edea3]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {metrics.topProducts.length > 0 ? metrics.topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2a2b36] border border-white/10 flex items-center justify-center font-bold text-[#e2e2e9]">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#e2e2e9] truncate max-w-[150px]" title={product.name}>{product.name}</h4>
                    <span className="text-xs text-[#958ea0]">{product.sales} satış</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#e2e2e9]">{product.amount}</div>
                  <div className={`text-xs flex items-center justify-end ${product.down ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
                    {product.growth !== '—' && (product.down ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />)}
                    {product.growth}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#958ea0] text-center mt-4">Henüz satış bulunmuyor.</p>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-[#e2e2e9]">Ziyaretçi Kaynağı</h3>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <Users className="w-5 h-5 text-[#ffd166]" />
            </div>
          </div>
          <div className="space-y-4">
            {metrics.storeSources.length > 0 ? metrics.storeSources.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#e2e2e9]">{item.source}</span>
                  <span className="text-[#958ea0]">%{item.percentage}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#958ea0] text-center mt-4">Veri bulunmuyor.</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-[#a078ff]/20 to-[#1a1b21]/40 backdrop-blur-md border border-[#a078ff]/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-[#e2e2e9] mb-2">Ortalama Sepet Tutarı</h3>
            <p className="text-sm text-[#e2e2e9]/70">Geçen haftaya göre belirgin bir artış var.</p>
          </div>
          <div>
            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-bold text-white tracking-tight">{metrics.avgCartValue}</h2>
              <span className="flex items-center text-[#958ea0] font-medium bg-white/5 px-2 py-1 rounded-lg mb-1">
                Güncel Veri
              </span>
            </div>
          </div>
        </div>
        
        {/* Placeholder for future metric */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 border-dashed rounded-2xl p-6 flex items-center justify-center opacity-50">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-[#958ea0] mx-auto mb-2" />
            <p className="text-sm text-[#958ea0]">Daha fazla metrik eklenecek</p>
          </div>
        </div>

      </div>
    </div>
  );
}
