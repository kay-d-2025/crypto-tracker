# Crypto Tracker

A live cryptocurrency price tracking application built with React and TypeScript,
using the CoinGecko public API. Prices are displayed in ZAR by default with the
option to switch between ZAR, USD, EUR, and BTC.

## Features

- Top 10 cryptocurrencies by market cap on the Dashboard
- Click any coin to view a detailed breakdown
- Historical price charts with 24h, 7d, 30d, and 1y time ranges
- Currency selector (ZAR, USD, EUR, BTC)
- Redux caching layer to minimise unnecessary API calls
- Responsive dark-themed UI

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router v6
- Redux Toolkit
- Recharts
- Axios
- CoinGecko Public API

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/kay-d-2025/crypto-tracker.git
   cd crypto-tracker
```

2. Install dependencies:
```bash
   npm install
```

3. Start the development server:
```bash
   npm run dev
```

4. Open your browser at `http://localhost:5173`

## Project Structure
```
src/
├── api/          # CoinGecko API service layer
├── components/   # Reusable UI components (CoinCard, PriceChart, CurrencySelector)
├── hooks/        # Custom React hooks (useCoinHistory)
├── pages/        # Page components (Dashboard, CoinDetail, NotFound)
├── store/        # Redux slices and store configuration
├── types/        # TypeScript interfaces
└── utils/        # Utility functions (formatters)
```

## Notes

- The CoinGecko free tier has a rate limit of ~10-30 requests per minute.
  The app handles this automatically with a retry mechanism, but switching
  between time ranges quickly may trigger a brief delay.
- All prices default to ZAR as per the project specification.