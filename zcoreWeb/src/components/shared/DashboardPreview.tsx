import StatusBadge from "./StatusBadge";
import Image from "next/image";
import { TrendingUp, Package } from "lucide-react";

// Hero section'daki sahte dashboard önizlemesi
export default function DashboardPreview() {
  const stats = [
    { label: "Toplam Ürün", value: "300", sub: "+12 bu ay", color: "text-white" },
    { label: "Riskli Ürün", value: "42", sub: "Aksiyon gerekli", color: "text-amber-400" },
    { label: "Zarar Eden", value: "11", sub: "Kritik", color: "text-red-400" },
    { label: "Ort. Marj", value: "%18.4", sub: "+1.2pp", color: "text-green-400" },
    { label: "Kritik Stok", value: "12", sub: "Acil", color: "text-orange-400" },
    { label: "Güvenli Fiyat Altı", value: "27", sub: "Risk var", color: "text-red-400" },
  ];

  const previewProducts = [
    { name: "Kadın Oversize Hoodie", margin: 45.4, profit: 158.59, status: "healthy" as const, stock: 82 },
    { name: "Bluetooth Kulaklık Pro", margin: 27.2, profit: 149.12, status: "critical" as const, stock: 5 },
    { name: "Cilt Bakım Seti 5'li", margin: 11.6, profit: 33.65, status: "risk" as const, stock: 37 },
    { name: "USB-C Hub 7'li", margin: 1.6, profit: 3.12, status: "loss" as const, stock: 22 },
    { name: "Paslanmaz Termos", margin: 33.6, profit: 50.12, status: "healthy" as const, stock: 120 },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/[0.1] bg-[#0d0d0d] overflow-hidden shadow-2xl shadow-black/60">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-[#0a0a0a]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 mx-4">
          <div className="mx-auto w-48 h-5 rounded bg-white/[0.05] flex items-center justify-center">
            <span className="text-[10px] text-zinc-600">app.zcore.co · Dashboard</span>
          </div>
        </div>
      </div>

      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-14 flex-shrink-0 border-r border-white/[0.07] bg-[#080808] flex flex-col items-center py-4 gap-4">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/zcore-logo-v8.png" alt="Zcore" width={48} height={48} className="w-full h-full object-contain" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                i === 0 ? "bg-white/[0.08]" : ""
              }`}
            >
              <div className={`w-4 h-0.5 rounded ${i === 0 ? "bg-zinc-400" : "bg-zinc-700"}`} />
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/[0.06] bg-[#111111] p-2.5"
              >
                <p className="text-[9px] text-zinc-600 mb-1 truncate">{stat.label}</p>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] text-zinc-600 mt-0.5 truncate">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="rounded-lg border border-white/[0.06] bg-[#111111] p-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-500 font-medium">Aylık Kâr Trendi</span>
              <span className="text-[9px] text-green-400 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +12.4%
              </span>
            </div>
            <div className="flex items-end gap-1 h-14">
              {[35, 55, 42, 70, 58, 80, 65, 90, 75, 88, 72, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 11
                        ? "rgba(34,197,94,0.8)"
                        : i >= 9
                        ? "rgba(34,197,94,0.4)"
                        : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product table preview */}
          <div className="rounded-lg border border-white/[0.06] bg-[#111111] overflow-hidden flex-1">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 font-medium">Ürün Performansı</span>
              <span className="text-[9px] text-zinc-600">5 / 300 ürün</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {previewProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-2 px-3 py-2">
                  <Package className="w-3 h-3 text-zinc-700 flex-shrink-0" />
                  <span className="flex-1 text-[10px] text-zinc-300 truncate">{p.name}</span>
                  <span
                    className={`text-[10px] font-semibold tabular-nums ${
                      p.margin >= 15
                        ? "text-green-400"
                        : p.margin >= 0
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {p.margin}%
                  </span>
                  <StatusBadge status={p.status} className="text-[8px] px-1.5 py-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
