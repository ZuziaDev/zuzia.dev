# Next.js Kurulumu

1. Yeni Next.js projesi oluştur:
```bash
npx create-next-app@latest zuzia-dev
cd zuzia-dev
```

2. Gerekli bağımlılıkları yükle:
```bash
npm install
```

3. Geliştirme sunucusunu başlat:
```bash
npm run dev
```

4. Yapı:
- `/pages`: Sayfa bileşenleri
- `/public`: Statik dosyalar
- `/styles`: CSS dosyaları

5. İlk sayfa (`pages/index.js`):
```jsx
export default function Home() {
  return (
    <div>
      <h1>Zuzia.dev'e Hoş Geldiniz</h1>
    </div>
  )
}
```

6. Çalıştırmak için:
- Geliştirme: `npm run dev`
- Build: `npm run build`
- Production: `npm run start`
