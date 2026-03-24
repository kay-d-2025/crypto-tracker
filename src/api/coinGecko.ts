// src/api/coinGecko.ts
// All CoinGecko API calls live here — this is the "service layer" pattern.
// Keeping API logic separate from components means:
//   1. Components stay clean and focused on rendering
//   2. If the API changes, we only update this one file
//   3. Easy to mock for testing later

import axios from 'axios';
import type { Coin, CoinDetail, SupportedCurrency, PricePoint } from '../types/coin';

// Pauses execution for a given number of milliseconds.
// Used to wait before retrying a failed request.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CoinGecko's free public API — no key required for these endpoints
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Create a reusable axios instance with our base config baked in.
// This means we never have to repeat the base URL across multiple calls.
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- DASHBOARD ---
// Fetches the top N coins sorted by market cap descending.
// The 'currency' param lets us switch between ZAR, USD, etc.
// Default is top 10 but we pass it as a param so it's reusable
// (the bonus infinite scroll feature will use this with higher limits)
export async function fetchTopCoins(
  currency: SupportedCurrency = 'zar',
  limit: number = 10
): Promise<Coin[]> {
  // Retry up to 3 times with a 2 second gap between attempts.
  // This handles transient rate limit errors gracefully without
  // requiring the user to manually refresh the page.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await api.get<Coin[]>('/coins/markets', {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
      });
      return response.data;
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      const isLastAttempt = attempt === 3;

      if (isRateLimit && !isLastAttempt) {
        console.warn(`Rate limited — retrying in 2s (attempt ${attempt}/3)`);
        await delay(2000);
      } else {
        throw err;
      }
    }
  }

  // TypeScript requires a return here even though the loop always
  // either returns or throws before reaching this point
  throw new Error('Failed to fetch coins after 3 attempts');
}

// --- COIN DETAIL PAGE ---
// Fetches rich detail for a single coin by its CoinGecko ID (e.g. "bitcoin")
// The detail endpoint returns a lot more data than the markets endpoint
export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await api.get<CoinDetail>(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      });
      return response.data;
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      const isLastAttempt = attempt === 3;

      if (isRateLimit && !isLastAttempt) {
        console.warn(`Rate limited — retrying in 2s (attempt ${attempt}/3)`);
        await delay(2000);
      } else {
        throw err;
      }
    }
  }

  throw new Error('Failed to fetch coin detail after 3 attempts');
}

// --- HISTORICAL CHART DATA ---
// Fetches price history for a coin over a given number of days.
// CoinGecko returns data as an array of [timestamp, price] tuples.
// 'days' can be 1, 7, 30, 365 — maps to our chart granularity selector
export async function fetchCoinHistory(
  coinId: string,
  currency: SupportedCurrency = 'zar',
  days: number = 7
): Promise<PricePoint[]> {
  // Same retry pattern as fetchTopCoins — waits 2 seconds between attempts
  // to handle CoinGecko's free tier rate limiting gracefully
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await api.get<{ prices: PricePoint[] }>(
        `/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: currency,
            days,
          },
        }
      );
      return response.data.prices;
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      const isLastAttempt = attempt === 3;

      if (isRateLimit && !isLastAttempt) {
        console.warn(`Rate limited — retrying in 2s (attempt ${attempt}/3)`);
        await delay(2000);
      } else {
        throw err;
      }
    }
  }

  throw new Error('Failed to fetch coin history after 3 attempts');
}