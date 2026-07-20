import Link from "next/link";
import Image from "next/image";
import CTAButton from "@/components/shared/CTAButton";
import { Download, Monitor, CheckCircle2, Apple } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Top Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Image src="/zcore-logo-v8.png" alt="Zcore Logo" width={450} height={150} className="h-48 w-auto" priority />
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20">
              <Download className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Zcore Masaüstü Uygulaması
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              E-ticaret mağazanızın performansını analiz etmek için Zcore'u bilgisayarınıza indirin. Ücretsiz 10 günlük deneme ile hemen başlayın.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Windows Download */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#0078D4]/10 text-[#0078D4]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Windows</h3>
                    <p className="text-sm text-zinc-500">Windows 10 ve üzeri</p>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 64-bit İşletim Sistemi
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Otomatik güncellemeler
                </li>
              </ul>

              <CTAButton as="a" href="#" className="w-full justify-center group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow">
                <Download className="w-4 h-4 mr-2" /> Windows için İndir
              </CTAButton>
            </div>

            {/* Mac Download */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-zinc-800 text-white">
                    <Apple className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">macOS</h3>
                    <p className="text-sm text-zinc-500">macOS 11 ve üzeri</p>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Apple Silicon (M1/M2)
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Intel İşlemciler
                </li>
              </ul>

              <button className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium transition-colors cursor-not-allowed opacity-60">
                Yakında Geliyor
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
