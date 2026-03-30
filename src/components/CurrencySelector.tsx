// src/components/CurrencySelector.tsx

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrency } from '../store/currencySlice';
import type { SupportedCurrency } from '../types/coin';

const CURRENCY_OPTIONS: { value: SupportedCurrency; label: string; symbol: string }[] = [
  { value: 'zar', label: 'ZAR', symbol: 'R' },
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'btc', label: 'BTC', symbol: '₿' },
];

const CurrencySelector = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(state => state.currency.selected);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap', // wraps to next line on very small screens
      gap: '6px',
      backgroundColor: '#1a1a2e',
      padding: '4px',
      borderRadius: '12px',
      border: '1px solid #2e2e4e',
    }}>
      {CURRENCY_OPTIONS.map(option => (
        <button
          key={option.value}
          onClick={() => dispatch(setCurrency(option.value))}
          style={{
            backgroundColor: selected === option.value ? '#6366f1' : 'transparent',
            color: selected === option.value ? '#fff' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '13px',
            fontWeight: selected === option.value ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {option.symbol} {option.label}
        </button>
      ))}
    </div>
  );
};

export default CurrencySelector;