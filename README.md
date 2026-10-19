# 🌐 Craigslist Refined — Modern Classifieds & Interactive Global Map

[![React 19](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive_Maps-199900.svg)](https://leafletjs.com/)
[![Zero Config](https://img.shields.io/badge/API_Keys-Zero_Required-success.svg)](#zero-config--zero-api-keys-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, modern reimagining of **Craigslist** featuring a responsive interactive map with **continent-to-city cinematic zoom**, draggable pin placements, client-side photo uploads with compression, real-time search, multi-language support (English, Persian, Spanish), and a self-contained offline-first data layer.

---

## ⚡ Zero-Config & Zero-API-Keys Architecture (GitHub-Ready)

You **do not need any external API keys, credit cards, or cloud databases** to clone, run, or deploy this project.

| Feature | How It Operates Without External APIs |
| :--- | :--- |
| **Interactive Map** | Powered by high-speed **Esri ArcGIS World Street CDN**. No Google Maps API key, no Mapbox token, and zero watermarks. |
| **Geocoding & Pins** | Interactive draggable pin picker with client-side coordinate computation and city presets. |
| **Database & Persistence** | Reactive browser **LocalStorage** engine with pre-seeded classified listings. Instant CRUD operations. |
| **Photo Uploads** | Browser-native HTML5 Canvas compression (`JPEG 0.82`) to Base64 data URLs. No AWS S3, Cloudinary, or backend server needed. |
| **Data Management** | Built-in JSON export, import, and one-click reset to seed data. |

---

## ✨ Features

- **🗺️ Interactive Map Explorer:**
  - Starts with an interactive global view of continents with active ad count badges.
  - Smooth cinematic `flyTo` animation down to local neighborhood pins.
  - Dynamic price tags directly on the map.
  - Switching between Street, Satellite, Topographic, and Clean layers.
- **📍 Interactive Pin Placement (`/post`):**
  - Live draggable pin picker with accuracy radius and GPS "Use My Location" support.
  - Quick location presets (SF Downtown, Mission, Berkeley, Oakland, San Jose, Palo Alto).
- **📸 Real Photo Uploads:**
  - Drag-and-drop file upload with multi-photo gallery management.
  - Automatic client-side canvas compression to keep storage lightweight.
  - Set cover photo or delete individual photos.
- **🔍 Fast Search & Filter:**
  - Real-time search across titles, descriptions, categories, and price ranges.
  - Category views (Vehicles, Real Estate, For Sale, Jobs, Community, Gigs).
- **💾 Data Manager Modal:**
  - Export all listings to a portable `.json` file.
  - Import external classified data.
  - 1-click restore to fresh Craigslist seed data.
- **🌙 Dark Mode & Multi-Language:**
  - Seamless light/dark theme switcher with system preference detection.
  - English (`en`), Persian (`fa`), and Spanish (`es`) localization.

---

## 🚀 Quickstart

Clone the repository and start the development server in seconds:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/craigslist-refined.git

# 2. Enter directory
cd craigslist-refined

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Project Structure

```text
├── components/             # Reusable UI & Map components
│   ├── ResultsMap.tsx      # Global continent & local classifieds map
│   ├── LocationPickerMap.tsx # Draggable pin placement for new ads
│   ├── MiniMap.tsx         # Static/preview location map for listing details
│   ├── DataManagementModal.tsx # Zero-config JSON backup & seed reset
│   ├── Header.tsx          # Navigation, search bar, language & theme toggles
│   └── Footer.tsx          # Community links and copyright
├── context/
│   ├── ListingsContext.tsx # Reactive storage, add/delete/export/import listings
│   ├── AuthContext.tsx     # Session & user profile management
│   ├── LanguageContext.tsx # Internationalization (EN, FA, ES)
│   └── ToastContext.tsx    # Feedback toasts
├── pages/
│   ├── Home.tsx            # Craigslist frontpage & hero map explorer
│   ├── SearchResults.tsx   # Filterable listings & split map view
│   ├── ListingDetail.tsx   # Full ad details, photo gallery & contact seller
│   ├── PostAd.tsx          # Drag-and-drop ad creation & map pin dropper
│   └── GlobalSites.tsx     # Directory of worldwide Craigslist cities
├── constants.ts            # Seed listings data & taxonomy categories
└── types.ts                # TypeScript interfaces
```

---

## 🌐 Deploy to Production

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop the generated /dist folder into Netlify Drop
```

---

## 📄 License

Distributed under the MIT License. Open source and free for commercial or educational use.
