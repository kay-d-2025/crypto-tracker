// src/store/currencySlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SupportedCurrency } from '../types/coin';

interface CurrencyState {
  selected: SupportedCurrency;
}

const initialState: CurrencyState = {
  selected: 'zar',
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
      setCurrency(state, action: PayloadAction<SupportedCurrency>) {
      state.selected = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;