// src/store/coinsSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Coin, SupportedCurrency } from '../types/coin';

// How long before we consider the cache stale and re-fetch (5 minutes)
export const CACHE_DURATION_MS = 5 * 60 * 1000;

interface CurrencyCache {
  pages: Partial<Record<number, Coin[]>>; // keyed by page number
  lastUpdated: number;
}

interface CoinsState {
  cachesByCurrency: Partial<Record<SupportedCurrency, CurrencyCache>>;
}

const initialState: CoinsState = {
  cachesByCurrency: {},
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins(
      state,
      action: PayloadAction<{ coins: Coin[]; currency: SupportedCurrency; page: number }>
    ) {
      const { coins, currency, page } = action.payload;
      const existing = state.cachesByCurrency[currency];
      state.cachesByCurrency[currency] = {
        pages: {
          ...(existing?.pages ?? {}),
          [page]: coins,
        },
        lastUpdated: Date.now(),
      };
    },
  },
});

export const { setCoins } = coinsSlice.actions;
export default coinsSlice.reducer;

export const selectCachedPage = (
  state: { coins: CoinsState },
  currency: SupportedCurrency,
  page: number
): Coin[] | null => {
  const cache = state.coins.cachesByCurrency[currency];
  if (!cache) return null;
  const isStale = Date.now() - cache.lastUpdated > CACHE_DURATION_MS;
  if (isStale) return null;
  return cache.pages[page] ?? null;
};