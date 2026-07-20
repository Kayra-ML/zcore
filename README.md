<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:7928CA,100:FF0080&height=200&section=header&text=Zcore&fontSize=70&fontColor=ffffff&fontAlignY=38&desc=All-in-One%20Control%20Panel%20%7C%20Desktop%20%2B%20Web%20%2B%20API&descAlignY=58&descAlign=50&animation=fadeIn" />

</div>

> **"Her şey için tek merkez."**  
> Zcore, kişisel projelerini, araçlarını ve verilerini tek bir çatı altında yönetmek için sıfırdan tasarlanmış bir kontrol paneli ekosistetidir.

---

## 💡 Fikir ve Motivasyon

Farklı araçlar, farklı sekmeler, farklı arayüzler... Hepsini bir araya getiren, kendi ihtiyaçlarıma özel bir "komuta merkezi" istiyordum. Zcore bu ihtiyaçtan doğdu.

Üç katmanlı bir mimari kurdum:
- **Web** — Next.js tabanlı modern web paneli
- **Desktop** — Electron + React ile native masaüstü uygulaması  
- **API** — Node.js/Prisma tabanlı backend

---

## 🏗️ Ekosistem Mimarisi

```
Zcore Ekosistemi
│
├── zcoreWeb/          → Next.js 14 + Prisma + SQLite
│   ├── /src           → App Router, TypeScript
│   ├── /prisma        → Veritabanı şeması
│   └── Zerax UI       → Özel tasarım sistemi
│
├── zcoreDesk/         → Electron + React 19 + Vite
│   ├── /src/electron  → Main process, IPC
│   ├── /src/core      → Auth, DB bağlantısı
│   ├── /src/ui        → React bileşenleri
│   └── SQLite (yerel) → Offline-first veri
│
└── zcoreApi/          → Node.js + Prisma
    └── mockTrendyol   → E-ticaret simülasyon API'si
```

---

## 🖥️ zcoreDesk — Masaüstü Uygulaması

Electron üzerine kurulu, tamamen TypeScript ile yazılmış masaüstü uygulaması.

### Tech Stack
- **Electron 43** — Native masaüstü
- **React 19** — UI katmanı
- **Vite 8** — Ultra-hızlı build
- **Zustand** — State yönetimi
- **TanStack Query** — Veri senkronizasyonu
- **SQLite + Prisma** — Yerel veritabanı (offline-first)
- **TailwindCSS** — Stil sistemi
- **TypeScript** — Tam tip güvenliği

### Özellikler
- ✅ Offline-first mimari (internet gerektirmez)
- ✅ Native Windows kurulucusu (NSIS)
- ✅ IPC tabanlı güvenli Electron iletişimi
- ✅ Başlat menüsü ve masaüstü kısayolu
- ✅ Auth sistemi (AuthContext)

---

## 🌐 zcoreWeb — Web Paneli

Next.js App Router üzerine kurulu modern web uygulaması.

### Tech Stack
- **Next.js 15** — App Router
- **TypeScript** — Tam tip güvenliği
- **Prisma + SQLite** — Veritabanı ORM
- **TailwindCSS** — Responsive tasarım

### Zerax UI
Web panel için **Zerax** isimli özel bir tasarım sistemi geliştirdim. Tutarlı bileşen kütüphanesi, renk paleti ve tipografi sistemi içeriyor.

---

## 🔌 zcoreApi — Backend

```javascript
// Trendyol entegrasyon simülasyonu
// E-ticaret veri akışı mock API'si
mockTrendyol → Prisma ORM → SQLite
```

---

## 📦 Kurulum

### Desktop (zcoreDesk)
```bash
cd zcoreDesk
npm install
npm run dev       # Geliştirme modu
npm run build     # Production build + NSIS kurulucusu
```

### Web (zcoreWeb)
```bash
cd zcoreWeb
npm install
npx prisma generate
npx prisma db push
npm run dev       # → http://localhost:3000
```

---

## 🗺️ Yol Haritası

- [x] Electron desktop uygulaması
- [x] Next.js web paneli (Zerax UI)
- [x] SQLite yerel veritabanı
- [ ] Desktop ↔ Web senkronizasyonu
- [ ] Plugin sistemi
- [ ] Dashboard widget'ları
- [ ] Zcore Cloud (opsiyonel senkron)

---

<div align="center">
<img src="https://img.shields.io/badge/Electron-Desktop-47848F?style=flat-square&logo=electron" />
<img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
<img src="https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square&logo=prisma" />
<img src="https://img.shields.io/badge/TypeScript-Full_Stack-3178C6?style=flat-square&logo=typescript" />

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:FF0080,50:7928CA,100:0d1117&height=100&section=footer" />
</div>
