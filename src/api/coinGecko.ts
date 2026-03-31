// src/api/coinGecko.ts

import axios from 'axios';
import type { Coin, CoinDetail, SupportedCurrency, PricePoint } from '../types/coin';

// CoinGecko's free public API base URL
const BASE_URL = 'https://api.coingecko.com/api/v3';

// API key in environment variable
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  if (API_KEY) {
    config.params = {
      ...config.params,
      x_cg_demo_api_key: API_KEY,
    };
  }
  return config;
});

// Used to wait before retrying a failed request.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retries up to 3 times with a 2 second gap on rate limit errors (429).
const withRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
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
  throw new Error('Request failed after 3 attempts');
};

// --- DASHBOARD ---
export async function fetchTopCoins(
  currency: SupportedCurrency = 'zar',
  limit: number = 10,
  page: number = 1
): Promise<Coin[]> {
  return withRetry(async () => {
    const response = await api.get<Coin[]>('/coins/markets', {
      params: {
        vs_currency: currency,       // price denomination
        order: 'market_cap_desc',    // sorted highest market cap first
        per_page: limit,
        page: page,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  });
}

// --- COIN DETAIL PAGE ---
export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
  return withRetry(async () => {
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
  });
}

// --- HISTORICAL CHART DATA ---
export async function fetchCoinHistory(
  coinId: string,
  currency: SupportedCurrency = 'zar',
  days: number = 7
): Promise<PricePoint[]> {
  return withRetry(async () => {
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
  });
}