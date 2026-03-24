// src/api/coinGecko.ts
// All CoinGecko API calls live here — this is the "service layer" pattern.
// Keeping API logic separate from components means:
//   1. Components stay clean and focused on rendering
//   2. If the API changes, we only update this one file
//   3. Easy to mock for testing later

import axios from 'axios';
import type { Coin, CoinDetail, SupportedCurrency, PricePoint } from '../types/coin';

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
  const response = await api.get<Coin[]>('/coins/markets', {
    params: {
      vs_currency: currency,       // price denomination
      order: 'market_cap_desc',    // sorted highest market cap first
      per_page: limit,
      page: 1,
      sparkline: false,            // we don't need the 7d sparkline data here
      price_change_percentage: '24h',
    },
  });

  return response.data;
}

// --- COIN DETAIL PAGE ---
// Fetches rich detail for a single coin by its CoinGecko ID (e.g. "bitcoin")
// The detail endpoint returns a lot more data than the markets endpoint
export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
  const response = await api.get<CoinDetail>(`/coins/${coinId}`, {
    params: {
      localization: false,      // skip translations to keep response smaller
      tickers: false,           // we don't need exchange ticker data
      market_data: true,        // we DO need market data (price, cap, etc.)
      community_data: false,
      developer_data: false,
    },
  });

  return response.data;
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
  const response = await api.get<{ prices: PricePoint[] }>(
    `/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: currency,
        days,
        // CoinGecko auto-selects granularity:
        // 1 day = hourly, 7-90 days = daily, 90+ days = weekly
      },
    }
  );

  return response.data.prices;
}