#!/bin/bash
echo "🚀 Deploy başlıyor..."
cd /www/wwwroot/Zcore/zcoreWeb

echo "📦 Bağımlılıklar yükleniyor..."
npm install

echo "🔨 Build alınıyor..."
npm run build

echo "🔄 PM2 yeniden başlatılıyor..."
pm2 restart zcoreWeb

echo "✅ Deploy tamamlandı!"
pm2 list
