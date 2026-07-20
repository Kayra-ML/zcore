import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zcore — Mağazanızın Gerçek Performansını Görün",
  description:
    "Zcore, e-ticaret satıcılarının ürün bazlı gerçek kârını, stok riskini ve minimum güvenli satış fiyatını tek panelden analiz etmesini sağlayan modern mağaza kontrol sistemidir.",
  keywords: ["e-ticaret", "satış analizi", "kâr analizi", "stok yönetimi", "Trendyol", "Hepsiburada"],
  openGraph: {
    title: "Zcore — Mağazanızın Gerçek Performansını Görün",
    description: "Excel yükle, riskli ürünlerini ve gerçek marjını gör.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#080808] text-zinc-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
