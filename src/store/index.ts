// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './currencySlice';
import coinsReducer from './coinsSlice';

export const store = configureStore({
  reducer: {
    // each key here becomes a top-level key in the global state object
    currency: currencyReducer,
    coins: coinsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;