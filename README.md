# Crypto Tracker

A live cryptocurrency price tracker built with React and TypeScript, 
using the CoinGecko public API.

**Live demo:** https://kay-d-2025.github.io/crypto-tracker/

---

## Features

- **Dashboard** — top 10 cryptocurrencies by market cap, with 24h price change
- **Coin Detail page** — price, market cap, supply stats, ATH, and description
- **Historical price charts** — 24h, 7d, 30d, 1y time ranges (via Chart.js)
- **Multi-currency support** — toggle between ZAR, USD, BTC, and ETH
- **Plain-English tooltips** — every stat has an explanation for non-technical users
- **Redux caching** — fetched data is cached in Redux to minimise API calls
- **Responsive design** — works on desktop, tablet, and mobile
- **Retry logic** — handles CoinGecko rate limits gracefully with automatic retries
- **GitHub Pages deployment** with HashRouter for client-side routing

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| State management | Redux Toolkit |
| Routing | React Router v6 (HashRouter) |
| Charts | Chart.js via react-chartjs-2 |
| API | CoinGecko Public API (v3) |
| Deployment | GitHub Pages via gh-pages |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install and run locally
```bash
git clone https://github.com/kay-d-2025/crypto-tracker.git
cd crypto-tracker
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

---

## Project Structure
```
src/
├── api/          # CoinGecko API service layer
├── components/   # Reusable UI components (CoinCard, Tooltip, PriceChart, ...)
├── hooks/        # Custom hooks (useCoinHistory, useWindowSize)
├── pages/        # Route-level pages (Dashboard, CoinDetail)
├── store/        # Redux slices (coins, currency)
├── types/        # TypeScript interfaces
└── utils/        # Formatters and tooltip copy
```

---

## API Attribution

Data provided by [CoinGecko](https://www.coingecko.com?utm_source=crypto-tracker&utm_medium=referral).

---

## Notes for Reviewers

- All prices default to **ZAR** as required, with the option to switch currency
- Redux caching avoids redundant API calls when navigating back to the dashboard
- Retry logic in the API layer handles the free-tier rate limit (10–30 req/min)
- Commit history follows a feature-branch workflow with PRs into `main`