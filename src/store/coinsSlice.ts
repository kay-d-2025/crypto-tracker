// src/store/coinsSlice.ts
// Updated to cache results per currency — previously we only stored one
// list regardless of currency, meaning switching USD → ZAR → USD would
// trigger 3 API calls. Now each currency has its own cached list.

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Coin, SupportedCurrency } from '../types/coin';

// How long before we consider the cache stale and re-fetch (5 minutes)
export const CACHE_DURATION_MS = 5 * 60 * 1000;

interface CurrencyCache {
  list: Coin[];
  lastUpdated: number; // Unix timestamp in ms
}

interface CoinsState {
  // Key is the currency string e.g. 'zar', 'usd'
  // Each currency gets its own cached list and timestamp
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
      action: PayloadAction<{ coins: Coin[]; currency: SupportedCurrency }>
    ) {
      const { coins, currency } = action.payload;
      // Store the result under the currency key with a fresh timestamp
      state.cachesByCurrency[currency] = {
        list: coins,
        lastUpdated: Date.now(),
      };
    },
    clearCoins(state) {
      state.cachesByCurrency = {};
    },
  },
});

export const { setCoins, clearCoins } = coinsSlice.actions;
export default coinsSlice.reducer;

// Selector that returns cached coins for a given currency if still fresh,
// or null if the cache is missing or expired.
// Putting this logic here keeps it close to the state it operates on.
export const selectCachedCoins = (
  state: { coins: CoinsState },
  currency: SupportedCurrency
): Coin[] | null => {
  const cache = state.coins.cachesByCurrency[currency];
  if (!cache) return null;

  const isStale = Date.now() - cache.lastUpdated > CACHE_DURATION_MS;
  if (isStale) return null;

  return cache.list;
};