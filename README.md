# 🔗 VIOLET - Sui Blockchain LinkTree

**A fully decentralized LinkTree application!**

All your profiles and links are stored on the **Sui Blockchain**. Welcome to Web3! 🚀

## 📁 Project Structure

```
Violent-App/
├── src/                    # React + Vite application
│   ├── Components/         # React components
│   │   ├── EnokiAuth.tsx   # Enoki authentication
│   │   ├── WalletConnect.tsx # Wallet connection
│   │   └── WalletConnect.css
│   ├── Pages/             # Page components
│   │   ├── UserPage.tsx    # User profile page
│   │   ├── UserPage.css
│   │   ├── AdminPage.tsx   # Admin management panel
│   │   ├── AdminPage.css
│   │   ├── LandingPage.tsx # Landing page
│   │   ├── LandingPage.css
│   │   ├── LoginPage.tsx   # Login page
│   │   ├── LoginPage.css
│   │   ├── ProfileEditPage.tsx # Profile editing
│   │   ├── ProfileEditPage.css
│   │   ├── LeaderboardPage.tsx # Leaderboard
│   │   └── LeaderboardPage.css
│   ├── Utils/             # Utility functions
│   │   ├── EnokiSP.ts      # Enoki service provider
│   │   ├── MoveCalls.ts    # Move blockchain calls
│   │   └── Types.ts        # TypeScript types
│   ├── App.tsx            # Main application
│   ├── App.css
│   ├── main.tsx           # Entry point
│   ├── main.css           # Global styles
│   ├── constants.ts       # Application constants
│   └── networkConfig.ts   # Network configuration
├── move/                  # Sui Move smart contracts
│   ├── violet/
│   │   ├── sources/
│   │   │   └── violet.move # Main Move contract
│   │   ├── Move.toml      # Move configuration
│   │   └── Move.lock      # Move lock file
│   ├── deployed/
│   │   └── contract-info.json # Contract deployment info
│   └── server.js          # Move development server
├── public/                # Static assets
│   ├── sui-logo.jpg
│   ├── violet2.png
│   ├── violett.png
│   ├── walrus-logo.png
│   └── ws-resources.json
├── dist/                  # Build output
├── package.json
├── tsconfig.json
├── vite.config.mts
└── README.md
```

## 🚀 Features

### User Page
- ✨ Modern and elegant design
- 📱 Fully responsive (mobile-friendly)
- 🎨 Gradient background
- 👤 Profile information (avatar, name, bio)
- 🔗 Clickable link cards
- 🎭 Hover animations
- ⚙️ Quick access to admin panel

### Admin Panel
- ➕ Add new links
- ✏️ Edit existing links
- 🗑️ Delete links
- 👁️ Toggle link active/inactive status
- 📋 View all links
- 🎯 User-friendly form interface

### Blockchain Integration
- 🔗 Sui blockchain integration
- 💼 Wallet connection (Enoki)
- 🏗️ Move smart contracts
- 🔐 Decentralized data storage

## 🛠️ Technologies

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router v6
- **Styling:** Pure CSS (CSS Variables + Animations)
- **Blockchain:** Sui Network
- **Smart Contracts:** Move
- **Authentication:** Enoki
- **Wallet Integration:** WalletConnect

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will run at `http://localhost:5173` by default.

### 3. Production Build

```bash
npm run build
```

Build files will be created in the `dist` folder.

## 🎯 Usage

### User Page
- Main page: `http://localhost:5173/myaccount`
- Any user: `http://localhost:5173/:username`

### Admin Panel
- Admin page: `http://localhost:5173/admin/myaccount`
- You can also access it by clicking the ⚙️ icon in the top right corner

### Blockchain Features
- Connect your wallet to interact with the Sui blockchain
- Manage your profile and links on-chain
- View leaderboard and user statistics

## 🎨 Customization

### Changing Colors
Edit CSS variables in `src/main.css`:

```css
:root {
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
  /* ... other colors */
}
```

### Gradient Background
In `src/Pages/UserPage.css`:

```css
.user-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🔌 Blockchain Integration

The application uses Sui Move smart contracts for data storage:

- **Contract:** `move/violet/sources/violet.move`
- **Network:** Sui testnet/mainnet
- **Authentication:** Enoki service provider
- **Wallet:** WalletConnect integration

## 📱 Responsive Design

The application works perfectly on all screen sizes:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🎭 Animations

- Fade in animations
- Hover effects
- Smooth transitions
- Loading spinners

## 🚧 Development Roadmap

- [ ] Drag & drop link ordering
- [ ] Theme options (dark mode)
- [ ] Profile editing
- [ ] Link statistics
- [ ] Custom domain binding
- [ ] QR code generation
- [ ] Social media integration
- [ ] Analytics dashboard

## 📄 License

MIT

## 👨‍💻 Developers

yzeybek, egekoca, yedemirkiran

Developed with ❤️ by Violent App

