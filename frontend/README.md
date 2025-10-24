# Violet Frontend SDK

Violet LinkTree uygulaması için Sui blockchain SDK'sı.

## 📦 Kurulum

```bash
cd frontend
npm install
```

## 🛠️ Build

```bash
npm run build
```

## 📚 Kullanım

### Client Oluştur

```typescript
import { suiClient } from './client';

// Client hazır, kullanabilirsiniz!
```

### Profil Oluştur

```typescript
import { createProfileTransaction } from './contract';
import { signAndExecuteTransactionBlock } from '@mysten/wallet-standard';

const tx = createProfileTransaction({
  username: 'ahmet123',
  display_name: 'Ahmet Yılmaz',
  bio: 'Tüm linklerim burada 🚀',
});

// Wallet ile imzala ve gönder
const result = await signAndExecuteTransactionBlock({
  transactionBlock: tx,
});
```

### Profil Getir

```typescript
import { getUserProfile, suiClient } from './index';

const profile = await getUserProfile(suiClient, 'PROFILE_OBJECT_ID');
console.log(profile);
```

### Link Ekle

```typescript
import { addLinkTransaction } from './contract';

const tx = addLinkTransaction({
  profileId: 'PROFILE_OBJECT_ID',
  title: 'Instagram',
  url: 'https://instagram.com/...',
  icon: '📸',
});

// Transaction'ı gönder
```

## 📄 Dosya Yapısı

```
frontend/
├── src/
│   ├── networkConfig.ts   # Network ayarları (testnet/mainnet)
│   ├── constants.ts       # Contract sabitleri (Package ID, vb)
│   ├── types.ts          # TypeScript type definitions
│   ├── client.ts         # Sui client setup
│   ├── contract.ts       # Smart contract fonksiyonları
│   └── index.ts          # Export hepsi
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 Contract Bilgileri

- **Network:** Testnet
- **Package ID:** `0x9969f9126a31085599b3f7f147b6361d82559a1de1b8709be00377fdea4f050c`
- **Module:** `linktree`

## 📝 Fonksiyonlar

### Transaction Builders

- `createProfileTransaction()` - Yeni profil oluştur
- `addLinkTransaction()` - Link ekle
- `updateProfileTransaction()` - Profil güncelle

### Data Fetchers

- `getUserProfile(client, profileId)` - Tek profil getir
- `getUserProfiles(client, ownerAddress)` - Kullanıcının tüm profilleri

### Utilities

- `getExplorerUrl(txDigest)` - Transaction explorer linki
- `getObjectExplorerUrl(objectId)` - Object explorer linki
- `getAddressExplorerUrl(address)` - Address explorer linki

