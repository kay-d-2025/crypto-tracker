// src/utils/formatters.ts
// Centralising formatting logic here means if we ever need to change
// how prices display, we only change it in one place (DRY principle)

import type { SupportedCurrency } from '../types/coin';

// Maps our internal currency keys to proper locale currency codes
const CURRENCY_LOCALE_MAP: Record<SupportedCurrency, string> = {
  zar: 'ZAR',
  usd: 'USD',
  eur: 'EUR',
  btc: 'BTC', // BTC isn't a real ISO currency — we handle it separately below
};

// Formats a number as a currency string, e.g. 1200000 -> "R 1,200,000.00"
export function formatCurrency(value: number, currency: SupportedCurrency): string {
  // BTC prices need special handling — no standard locale formatter for crypto
  if (currency === 'btc') {
    return `₿ ${value.toFixed(8)}`;
  }

  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: CURRENCY_LOCALE_MAP[currency],
    maximumFractionDigits: 2,
  }).format(value);
}

// Formats large numbers into readable shorthand, e.g. 1400000000 -> "R 1.40B"
export function formatMarketCap(value: number, currency: SupportedCurrency): string {
  if (currency === 'btc') {
    return `₿ ${value.toFixed(2)}`;
  }

  const symbol = currency === 'zar' ? 'R' : currency === 'usd' ? '$' : '€';

  if (value >= 1_000_000_000_000) return `${symbol} ${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000)     return `${symbol} ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000)         return `${symbol} ${(value / 1_000_000).toFixed(2)}M`;
  return formatCurrency(value, currency);
}

// Returns a colour string for positive/negative price changes
// Used to colour the 24h % change green or red
export function getPriceChangeColour(change: number): string {
  if (change > 0) return '#16a34a'; // green
  if (change < 0) return '#dc2626'; // red
  return '#6b7280';                 // neutral grey
}