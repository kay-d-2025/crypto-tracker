// src/components/CurrencySelector.tsx
// Dropdown that lets the user switch between ZAR, USD, EUR, BTC.
// When changed, it dispatches to Redux — this updates the currency
// globally so both Dashboard and CoinDetail reflect the change instantly.

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrency } from '../store/currencySlice';
import type { SupportedCurrency } from '../types/coin';

// The options we display in the dropdown
const CURRENCY_OPTIONS: { value: SupportedCurrency; label: string }[] = [
  { value: 'zar', label: 'ZAR (R)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'btc', label: 'BTC (₿)' },
];

const CurrencySelector = () => {
  const dispatch = useAppDispatch();
  // Read current selection from Redux store
  const selected = useAppSelector(state => state.currency.selected);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Cast is safe here because the select options are derived from SupportedCurrency
    dispatch(setCurrency(e.target.value as SupportedCurrency));
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      style={{
        backgroundColor: '#2a2a3e',
        color: '#f1f1f1',
        border: '1px solid #3e3e5e',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      {CURRENCY_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;