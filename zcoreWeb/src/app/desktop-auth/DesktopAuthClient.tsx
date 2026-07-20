"use client";
import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function DesktopAuthClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthorize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/desktop-token", { method: "POST" });
      if (!res.ok) throw new Error("Yetkilendirme başarısız.");
      const data = await res.json();
      setSuccess(true);
      window.location.href = `zcore://auth?token=${data.token}`;
      setTimeout(() => window.close(), 3000);
    } catch {
      setError("Hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="desktop-auth-root">
      {/* Ambient glow */}
      <div className="desktop-auth-glow" />

      <div className="desktop-auth-card-wrap">
        {/* Logo */}
        <div className="desktop-auth-logo">
          <Image
            src="/zcore-logo-v8.png"
            alt="Zcore Logo"
            width={180}
            height={60}
            priority
            style={{ width: "auto", height: "56px" }}
          />
        </div>

        {/* Card */}
        <div className="desktop-auth-card">
          {/* Icon */}
          <div className="desktop-auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>

          <h1 className="desktop-auth-title">Uygulama Bağlantısı</h1>
          <p className="desktop-auth-desc">
            ZCore Masaüstü Uygulaması hesabınıza erişmek istiyor. Bu işleme izin veriyor musunuz?
          </p>

          {error && (
            <div className="desktop-auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {success ? (
            <div className="desktop-auth-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <p className="desktop-auth-success-title">Başarıyla Bağlandı!</p>
                <p className="desktop-auth-success-sub">Masaüstü uygulamasına yönlendiriliyorsunuz. Bu sekme birazdan kapanacaktır.</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="desktop-auth-btn-primary"
            >
              {loading ? (
                <>
                  <span className="desktop-auth-spinner" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Yetki Ver ve Uygulamayı Aç
                </>
              )}
            </button>
          )}

          <div className="desktop-auth-divider" />

          <div className="desktop-auth-footer-btns">
            <button
              onClick={async () => {
                setLoading(true);
                await signOut({ callbackUrl: "/login?callbackUrl=/desktop-auth" });
              }}
              className="desktop-auth-btn-ghost"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Farklı hesapla giriş yap
            </button>
            <button onClick={() => window.close()} className="desktop-auth-btn-cancel">
              İptal Et
            </button>
          </div>
        </div>

        <p className="desktop-auth-footnote">
          Bu işlem güvenli şifreli bağlantı üzerinden gerçekleştirilir.
        </p>
      </div>
    </div>
  );
}
