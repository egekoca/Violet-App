# 🔗 VIOLET - Sui Blockchain LinkTree

**Tamamen merkeziyetsiz LinkTree uygulaması!** 

Tüm profilleriniz ve linkleriniz **Sui Blockchain** üzerinde saklanıyor. Web3 ile tanışın! 🚀

## 📁 Proje Yapısı

```
Violent-App/
├── backend/          # Mock data ve API
│   ├── mockData.ts   # Mock veriler ve API fonksiyonları
│   └── package.json
├── frontend/         # TypeScript tipleri ve API client
│   ├── types.ts      # TypeScript interface'leri
│   ├── api.ts        # API client
│   └── package.json
└── ui/              # React + Vite uygulaması
    ├── src/
    │   ├── pages/        # Sayfa bileşenleri
    │   │   ├── UserPage.tsx    # Kullanıcı profil sayfası
    │   │   ├── UserPage.css
    │   │   ├── AdminPage.tsx   # Admin yönetim paneli
    │   │   └── AdminPage.css
    │   ├── types.ts      # TypeScript tipleri
    │   ├── api.ts        # API fonksiyonları
    │   ├── App.tsx       # Ana uygulama
    │   ├── App.css
    │   ├── main.tsx      # Giriş noktası
    │   └── index.css     # Global stiller
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## 🚀 Özellikler

### Kullanıcı Sayfası
- ✨ Modern ve şık tasarım
- 📱 Tam responsive (mobil uyumlu)
- 🎨 Gradient arka plan
- 👤 Profil bilgileri (avatar, isim, bio)
- 🔗 Tıklanabilir link kartları
- 🎭 Hover animasyonları
- ⚙️ Admin paneline hızlı erişim

### Admin Paneli
- ➕ Yeni link ekleme
- ✏️ Link düzenleme
- 🗑️ Link silme
- 👁️ Link aktif/pasif durumu değiştirme
- 📋 Tüm linkleri görüntüleme
- 🎯 Kullanıcı dostu form arayüzü

## 🛠️ Teknolojiler

- **UI Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router v6
- **Styling:** Pure CSS (CSS Variables + Animations)
- **Backend:** Mock Data (Gerçek API'ye kolayca entegre edilebilir)

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd ui
npm install
```

### 2. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### 3. Production Build

```bash
npm run build
```

Build dosyaları `ui/dist` klasöründe oluşturulacaktır.

## 🎯 Kullanım

### Kullanıcı Sayfası
- Ana sayfa: `http://localhost:5173/benimhesabim`
- Herhangi bir kullanıcı: `http://localhost:5173/:username`

### Admin Paneli
- Admin sayfası: `http://localhost:5173/admin/benimhesabim`
- Sağ üst köşedeki ⚙️ ikonuna tıklayarak da erişebilirsiniz

## 🎨 Özelleştirme

### Renkleri Değiştirme
`ui/src/index.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
  /* ... diğer renkler */
}
```

### Gradient Arka Plan
`ui/src/pages/UserPage.css` dosyasında:

```css
.user-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🔌 Gerçek API'ye Bağlama

`ui/src/api.ts` dosyasındaki mock fonksiyonları gerçek API çağrıları ile değiştirin:

```typescript
export const api = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/profile');
    return response.json();
  },
  // ... diğer fonksiyonlar
};
```

## 📱 Responsive Tasarım

Uygulama tüm ekran boyutlarında mükemmel çalışır:
- 📱 Mobil (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🎭 Animasyonlar

- Fade in animasyonları
- Hover efektleri
- Smooth geçişler
- Loading spinners

## 🚧 Geliştirme Planları

- [ ] Drag & drop ile link sıralaması
- [ ] Tema seçenekleri (dark mode)
- [ ] Profil düzenleme
- [ ] Link istatistikleri
- [ ] Özel domain bağlama
- [ ] QR kod oluşturma

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

Violent App ile geliştirildi ❤️

