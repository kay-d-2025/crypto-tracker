// src/store/index.ts
// This is where we assemble the Redux store from all our slices.
// The store is the single source of truth for all global state in the app.

import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './currencySlice';
import coinsReducer from './coinsSlice';

export const store = configureStore({
  reducer: {
    // Each key here becomes a top-level key in the global state object
    // e.g. state.currency.selected, state.coins.list
    currency: currencyReducer,
    coins: coinsReducer,
  },
});

// These types are inferred directly from the store — we export them
// so components can use them with useSelector and useDispatch safely
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;