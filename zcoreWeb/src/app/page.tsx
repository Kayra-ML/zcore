import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";
import CTAButton from "@/components/shared/CTAButton";
import DashboardPreview from "@/components/shared/DashboardPreview";
import FeatureCard from "@/components/shared/FeatureCard";
import PricingCard from "@/components/shared/PricingCard";
import SectionHeader from "@/components/shared/SectionHeader";
import { mockFeatures, mockPricingPlans, mockHowItWorks } from "@/lib/mock-data";
import { Shield, Lock, Eye, FileCheck, CheckCircle2 } from "lucide-react";
import Header from "@/components/shared/Header";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Zcore — Mağazanızın Gerçek Performansını Görün",
  description:
    "Excel yükle, riskli ürünlerini ve gerçek marjını gör. Zcore ile e-ticaret mağazanızın ürün bazlı kâr, stok riski ve minimum güvenli satış fiyatını analiz edin.",
};

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">
      <Header />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-emerald-500/[0.07] blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Yeni: Minimum Güvenli Fiyat Analizi
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-3xl mx-auto">
            Mağazanızın gerçek{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                performansını
              </span>
            </span>{" "}
            görün
          </h1>

          <p className="text-center text-zinc-400 text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            Pazaryeri mağazanızı bağlayın, ürünlerinizi takibe alın ve kâr, stok, satış durumunuzu tek panelden kontrol edin.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <CTAButton as="a" href="/download" size="lg">
              <Download className="w-5 h-5" />
              Uygulamayı İndir
            </CTAButton>
          </div>



          {/* Dashboard Preview */}
          <div className="mt-14 max-w-4xl mx-auto">
            <DashboardPreview />
          </div>
        </div>
      </section>



      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="nasıl-çalışır" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <SectionHeader
              eyebrow="Nasıl Çalışır"
              title="4 adımda mağazanızı analiz edin"
              description="Teknik bilgi gerektirmez. Dakikalar içinde analiziniz hazır."
              center
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockHowItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < mockHowItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-white/[0.06] z-0" />
                )}
                <div className="relative rounded-xl border border-white/[0.07] bg-[#111111] p-5 hover:border-white/[0.12] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="özellikler" className="py-20 sm:py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <SectionHeader
              eyebrow="Özellikler"
              title="Satıcıların ihtiyacı olan her şey"
              description="ZCore; sipariş, ürün, stok, kâr ve mağaza takibini tek masaüstü panelinde toplamak için tasarlanmış sade bir yönetim aracıdır."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD DETAIL ───────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Ürün Analizi"
                title="Her ürünün gerçek kârını görün"
                description="ZCore, pazaryeri komisyonunu düşerek ürün bazlı tahmini kâr ve risk durumunu gösterir."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Platform komisyonları hesaba katılır",
                  "Kargo ve ürün maliyetleri dahil edilir",
                  "Kâr marjı düşük ürünler işaretlenir",
                  "Zarar riski olan ürünler erken fark edilir",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

            </div>

            {/* Mini product table preview */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Ürün Performans Tablosu</span>
                <span className="text-xs text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Canlı Veri
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { name: "Kablosuz Mouse", margin: 38.4, profit: "₺124", status: "Sağlıklı", color: "text-green-400", statusColor: "text-green-400 bg-green-500/10" },
                  { name: "Bluetooth Kulaklık Pro", margin: 21.7, profit: "₺89", status: "Dikkat", color: "text-amber-400", statusColor: "text-orange-400 bg-orange-500/10" },
                  { name: "Telefon Kılıfı", margin: 12.3, profit: "₺18", status: "Düşük Kâr", color: "text-amber-400", statusColor: "text-amber-400 bg-amber-500/10" },
                  { name: "USB-C Hub 7'li", margin: 2.1, profit: "₺4", status: "Riskli", color: "text-red-400", statusColor: "text-red-400 bg-red-500/10" },
                  { name: "Akıllı Saat X1", margin: -3.8, profit: "-₺27", status: "Zarar", color: "text-red-500", statusColor: "text-red-500 bg-red-500/10" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-zinc-300 truncate max-w-[140px]">{row.name}</span>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`font-bold text-xs w-12 text-right ${row.color}`}>{row.margin}%</span>
                      <span className="text-zinc-400 w-10 text-right text-xs">{row.profit}</span>
                      <div className="w-20 flex justify-end">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-white/[0.07] text-center">
                <span className="text-xs text-zinc-600">Takip edilen ürünlerin tamamını panelde görüntüleyin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="mevcut-planlar" className="py-20 sm:py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionHeader
              eyebrow="Mevcut Planlar"
              title="İhtiyacınıza uygun planı seçin"
              description="Tüm planlarda mağaza bağlantısı, komisyon sonrası kâr analizi ve ürün takip sistemi bulunur."
              center
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {mockPricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative rounded-2xl border border-emerald-500/20 bg-[#0d1a12] p-10 sm:p-14 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-emerald-500/10 blur-3xl" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-5">
                10 Günlük Demo
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Mağazanızı bugün analiz edin
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Kredi kartı gerekmez. Dakikalar içinde kurulum yapın, hemen analiz edin.
              </p>
              <div className="flex justify-center">
                <CTAButton as="a" href="/download" size="lg" className="w-full sm:w-auto mt-6">
                  <Download className="w-5 h-5 mr-2" />
                  Uygulamayı İndir — 10 Günlük Demo&apos;dan Yararlanın
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <Image src="/zcore-logo-v8.png" alt="Zcore Logo" width={120} height={36} className="h-12 w-auto" />
              </Link>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-[180px]">
                E-ticaret satıcıları için modern mağaza kontrol sistemi.
              </p>
            </div>
            {[
              {
                title: "Ürün",
                links: ["Özellikler", "Fiyatlandırma", "Demo", "Güncelleme Notları"],
              },
              {
                title: "Şirket",
                links: ["Hakkımızda", "Blog", "Kariyer", "İletişim"],
              },
              {
                title: "Hukuki",
                links: ["Gizlilik Politikası", "Kullanım Koşulları", "KVKK", "Çerez Politikası"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-zinc-400 mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-700">
              © 2025 Zeraxcore. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-zinc-700">Türkiye&apos;den 🇹🇷 ile yapılmıştır</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
