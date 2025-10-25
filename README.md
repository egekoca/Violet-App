# VIOLET - Sui Blockchain LinkTree

Violet is a decentralized Linktree-style app built on the Sui blockchain. User profiles and links are stored on-chain.

## Project structure

```
Violet-App/
├── backend/          # Mock data and API
│   ├── mockData.ts
│   └── package.json
├── frontend/         # Types and API client
│   ├── types.ts
│   ├── api.ts
│   └── package.json
└── ui/               # React + Vite app
    ├── src/
    │   ├── pages/
    │   │   ├── UserPage.tsx
    │   │   ├── UserPage.css
    │   │   ├── AdminPage.tsx
    │   │   └── AdminPage.css
    │   ├── types.ts
    │   ├── api.ts
    │   ├── App.tsx
    │   ├── App.css
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## Features

* Decentralized profiles and links stored on Sui
* Responsive, mobile-first user page
* Clickable link cards
* Admin panel to add, edit, delete, and toggle links
* Simple forms for managing links

## Tech stack

* React 18
* Vite
* TypeScript
* React Router v6
* Plain CSS (variables and animations)
* Backend: mock data (easy to replace with a real API)

## Setup

Install dependencies and run the UI:

```bash
cd ui
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

To build for production:

```bash
npm run build
```

Build output is in `ui/dist`.

## Usage

* User page example: `http://localhost:5173/:username`
* Admin page example: `http://localhost:5173/admin/:username`

## Customization

Change colors in `ui/src/index.css` by editing CSS variables:

```css
:root {
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
  /* other colors */
}
```

Change the gradient background in `ui/src/pages/UserPage.css`:

```css
.user-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Connecting a real API

Replace the mock functions in `ui/src/api.ts` with real API calls. Example:

```typescript
export const api = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/profile');
    return response.json();
  },
  // ...
};
```

## Responsive design

The app targets:

* Mobile (< 768px)
* Tablet (768–1024px)
* Desktop (> 1024px)

## Roadmap

* Drag & drop link ordering
* Theme options (dark mode)
* Profile editing
* Link analytics
* Custom domain support
* QR code generation

## License

MIT

## Authors

egekoca, yzeybek, yedemirkiran

---