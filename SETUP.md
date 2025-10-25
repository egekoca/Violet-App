# 🚀 VIOLET LINKTREE - KURULUM VE KULLANIM

## ✅ TAMAMLANAN ÖZELLIKLER

### 🔗 Smart Contract (Sui Move)
- ✅ UserProfile ve Link struct'ları
- ✅ create_profile() - Profil oluşturma
- ✅ add_link() - Link ekleme
- ✅ update_profile() - Profil güncelleme
- ✅ Testnet'e deploy edildi


### 🔷 Frontend SDK (TypeScript)
- ✅ Network yapılandırması (testnet/mainnet)
- ✅ SuiClient setup
- ✅ Transaction builder fonksiyonları
- ✅ Profile okuma fonksiyonları
- ✅ Build edildi ve hazır

### 🎨 UI (React + Vite)
- ✅ Wallet bağlantısı (@mysten/dapp-kit)
- ✅ UserPage - Blockchain'den profil okuma
- ✅ AdminPage - Profil oluşturma ve link ekleme
- ✅ Dark theme (Turkuaz + Mor)
- ✅ Responsive tasarım

---

## 🛠️ KURULUM

### 1. Paketleri Yükle

```bash
# UI paketlerini yükle
cd ui
npm install

# Frontend SDK paketlerini yükle (isteğe bağlı)
cd ../frontend
npm install
```

### 2. Dev Server'ı Başlat

```bash
cd ui
npm run dev
```

Tarayıcıda açılacak: `http://localhost:5173`

---

## 📖 KULLANIM KILAVUZU

### 1️⃣ Cüzdan Bağla

1. Sui Wallet Extension'ı yükle (Chrome/Firefox)
2. Testnet'e geç
3. Faucet'ten test SUI al: https://faucet.testnet.sui.io
4. Uygulamada "Connect Wallet" butonuna tıkla

### 2️⃣ Profil Oluştur

1. Cüzdan bağlandıktan sonra otomatik olarak Admin sayfasına yönlendirileceksin
2. "Yeni Profil Oluştur" formunu doldur:
   - **Kullanıcı Adı:** 3-20 karakter (örn: ahmet123)
   - **Görünen İsim:** İsim ve soyisim (örn: Ahmet Yılmaz)
   - **Bio:** Kısa açıklama (örn: Tüm linklerim burada 🚀)
3. "Profil Oluştur" butonuna tıkla
4. Cüzdanında transaction'ı onayla
5. 3-5 saniye sonra profil oluşacak!

### 3️⃣ Link Ekle

1. Admin sayfasında "+ Yeni Link Ekle" butonuna tıkla
2. Formu doldur:
   - **Başlık:** Link adı (örn: Instagram)
   - **URL:** Tam link (örn: https://instagram.com/...)
   - **İkon:** Emoji (örn: 📸)
3. "Ekle" butonuna tıkla
4. Transaction'ı onayla
5. Link eklenecek!

### 4️⃣ Profili Görüntüle

1. "← Profili Gör" butonuna tıkla veya
2. Ana sayfaya git
3. Profilin ve linklerin görüntülenecek
4. Linklere tıklayınca yeni sekmede açılır

---

## 🔧 YAPILANDIRMA

### Network Değiştirme

`ui/src/lib/blockchain.ts` dosyasında:

```typescript
export const NETWORK = 'testnet'; // veya 'mainnet'
export const RPC_URL = 'https://fullnode.testnet.sui.io:443';
```

### Contract Adresi

`ui/src/lib/blockchain.ts` dosyasında:

```typescript
export const PACKAGE_ID = '0x9969f9126a31085599b3f7f147b6361d82559a1de1b8709be00377fdea4f050c';
```

---

## 📁 PROJE YAPISI

```
Violent-App-Repo/
├── backend/
│   ├── linktree/              # Move smart contract
│   │   ├── sources/
│   │   │   └── linktree.move
│   │   └── Move.toml
│   └── deployed/
│       └── contract-info.json
│
├── frontend/                   # TypeScript SDK
│   ├── src/
│   │   ├── networkConfig.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── client.ts
│   │   ├── contract.ts
│   │   └── index.ts
│   └── dist/                   # Compiled JS
│
└── ui/                         # React Web App
    ├── src/
    │   ├── App.tsx            # Wallet providers
    │   ├── lib/
    │   │   └── blockchain.ts  # Blockchain fonksiyonları
    │   ├── components/
    │   │   └── WalletConnect.tsx
    │   └── pages/
    │       ├── UserPage.tsx   # Profil görüntüleme
    │       └── AdminPage.tsx  # Admin paneli
    └── package.json
```

---

## 🎯 ÖZELLİKLER

### Mevcut Özellikler ✅
- ✅ Cüzdan bağlantısı (Sui Wallet)
- ✅ Profil oluşturma (on-chain)
- ✅ Link ekleme (on-chain)
- ✅ Profil görüntüleme
- ✅ Link listeleme
- ✅ Dark theme (Turkuaz + Mor)
- ✅ Responsive tasarım
- ✅ Transaction onaylama

### Gelecek Özellikler 🔜
- ⏳ Link silme
- ⏳ Link düzenleme
- ⏳ Link aktif/pasif yapma
- ⏳ Link sıralama (drag & drop)
- ⏳ Avatar yükleme (Walrus)
- ⏳ Profil güncelleme
- ⏳ Username ile profil arama
- ⏳ SuiNS domain entegrasyonu
- ⏳ Link analytics
- ⏳ Tema renk özelleştirme

---

## 🐛 SORUN GİDERME

### "Cüzdanınızı bağlayın" hatası
- Sui Wallet extension'ı yüklü mü kontrol et
- Testnet'e geçtiğinden emin ol
- Sayfayı yenile ve tekrar bağlan

### "Henüz profil oluşturmadınız" hatası
- Normal! İlk kez kullanıyorsan profil oluşturman gerekiyor
- Admin paneline git ve profil oluştur

### Transaction onaylanamıyor
- Cüzdanda yeterli SUI var mı kontrol et
- Faucet'ten test SUI al: https://faucet.testnet.sui.io
- Gas fee için minimum 0.01 SUI gerekli

### Profil görünmüyor
- Transaction blockchain'de onaylandı mı?
- Explorer'da kontrol et: https://suiscan.xyz/testnet
- 5-10 saniye bekle ve sayfayı yenile

---

## 🔗 LINKLER

- **Sui Docs:** https://docs.sui.io
- **Sui Wallet:** https://chrome.google.com/webstore/detail/sui-wallet
- **Testnet Faucet:** https://faucet.testnet.sui.io
- **Testnet Explorer:** https://suiscan.xyz/testnet
- **dApp Kit Docs:** https://sdk.mystenlabs.com/dapp-kit

---

## 📝 NOTLAR

- Bu testnet versiyonu! Mainnet'e geçmeden önce kapsamlı test yap
- Transaction'lar 3-5 saniye sürüyor
- Gas fee'ler çok düşük (0.001 SUI civarı)
- Profiller kalıcı olarak blockchain'de saklanıyor
- Her wallet adresi birden fazla profil oluşturabilir (şu an ilki gösteriliyor)

---

Herhangi bir sorun yaşarsan TODO.md dosyasına bak veya blockchain explorer'da transaction'ları kontrol et! 🚀

