"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, getSession } from "next-auth/react";
import CTAButton from "@/components/shared/CTAButton";

const navItems = [
  { label: "Ana Sayfa", href: "#top" },
  { label: "Nasıl Çalışır", href: "#nasıl-çalışır" },
  { label: "Özellikler", href: "#özellikler" },
  { label: "Mevcut Planlar", href: "#mevcut-planlar" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("#top");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [user, setUser] = useState<{name?: string | null, email?: string | null, plan?: string} | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("#top");
        return;
      }

      const sections = navItems.map((item) => item.href.substring(1)).filter(s => s !== "top");
      
      const activeOffsets = sections
        .map(id => {
          const el = document.getElementById(id);
          return { id, top: el ? el.getBoundingClientRect().top : 9999 };
        })
        .filter(s => s.top <= 200)
        .sort((a, b) => b.top - a.top);

      if (activeOffsets.length > 0) {
        setActiveSection(`#${activeOffsets[0].id}`);
      } else {
        setActiveSection("#top");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") {
      return; // Let the native <a> or <Link> handle navigation to /#something
    }

    e.preventDefault();
    if (href === "#top" || href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(href.substring(1));
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080808]/90 backdrop-blur-md py-4">
      <div className="w-full px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" onClick={(e) => handleScrollTo(e as any, "/")} className="flex items-center gap-2.5">
          <Image src="/zcore-logo-v8.png" alt="Zcore Logo" width={400} height={112} className="h-32 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.label}
                href={pathname === "/" ? item.href : `/${item.href}`}
                onClick={(e) => handleScrollTo(e as any, item.href)}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all ${
                  isActive && pathname === "/" ? "text-white" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {item.label}
                {isActive && pathname === "/" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-white rounded-t-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all flex items-center gap-2"
                aria-label="Kullanıcı Menüsü"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-white/[0.08] bg-[#111111] shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 mb-2 border-b border-white/[0.08]">
                    <p className="text-sm font-medium text-white truncate">{user?.name || "Kullanıcı"}</p>
                    <p className="text-xs text-zinc-500 truncate">{user?.email || "Hesap Detayları"}</p>
                  </div>
                  
                  {/* Abonelik Detayları */}
                  <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.08] mb-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Abonelik Durumu</p>
                    {(!user?.plan || user.plan === "FREE" || user.plan === "DEMO") ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-md border border-zinc-700">
                            {user?.plan === "DEMO" ? "Demo Mod" : "Başlangıç (FREE)"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-tight">
                          ZCore'un tüm özelliklerini limitsiz kullanmak için paketinizi yükseltin.
                        </p>
                        <a 
                          href="/#mevcut-planlar" 
                          onClick={(e) => {
                            setIsDropdownOpen(false);
                            if (pathname === "/") handleScrollTo(e as any, "#mevcut-planlar");
                          }}
                          className="block w-full py-1.5 mt-2 text-center text-xs font-bold text-black bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 rounded-md shadow-lg shadow-yellow-500/20 transition-all"
                        >
                          PRO'ya Yükselt
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/20">
                            {user.plan} Paket
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 space-y-1 mt-1.5">
                          <div className="flex justify-between">
                            <span>Yenileme:</span>
                            <span className="text-zinc-200">15 Ağu 2026</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tutar:</span>
                            <span className="text-zinc-200">₺499 / Ay</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href="/stores" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Mağazalarım
                  </Link>
                  
                  <div className="h-px bg-white/[0.08] my-2" />
                  
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.04] hover:text-red-300 transition-colors text-left"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
              <CTAButton as="a" href="/login" size="sm">
                Giriş Yap
              </CTAButton>
          )}
        </div>
      </div>
    </header>
  );
}
