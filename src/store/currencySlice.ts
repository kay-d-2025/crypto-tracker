// src/store/currencySlice.ts
// A Redux "slice" manages one specific piece of global state.
// This slice owns the selected currency — we store it globally because
// BOTH the Dashboard and CoinDetail pages need to know about it.
// Without Redux we'd have to pass it as props through multiple components (prop drilling).

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SupportedCurrency } from '../types/coin';

interface CurrencyState {
  selected: SupportedCurrency;
}

// ZAR is the default as per the spec requirements
const initialState: CurrencyState = {
  selected: 'zar',
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    // This is the only action we need — simply set the selected currency
    // PayloadAction<SupportedCurrency> means the action payload must be
    // one of our defined currency strings — TypeScript enforces this
    setCurrency(state, action: PayloadAction<SupportedCurrency>) {
      state.selected = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;