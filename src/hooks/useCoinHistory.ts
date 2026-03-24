// src/hooks/useCoinHistory.ts
// A custom hook that encapsulates fetching historical price data.
// Custom hooks are a React pattern for extracting reusable stateful logic
// out of components — the component just calls this hook and gets back
// the data it needs without caring about how it was fetched.

import { useState, useEffect } from 'react';
import { fetchCoinHistory } from '../api';
import type { PricePoint, SupportedCurrency } from '../types/coin';

// The time range options we expose in the UI
// Using a const object instead of an enum — simpler and works better
// with TypeScript's type inference
export const TIME_RANGES = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '1y': 365,
} as const;

export type TimeRange = keyof typeof TIME_RANGES;

interface UseCoinHistoryResult {
  priceHistory: PricePoint[];
  loading: boolean;
  error: string | null;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const useCoinHistory = (
  coinId: string,
  currency: SupportedCurrency
): UseCoinHistoryResult => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to 7 day view — good balance of detail and context
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  useEffect(() => {
    if (!coinId) return;

    const loadHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const days = TIME_RANGES[timeRange];
        const data = await fetchCoinHistory(coinId, currency, days);
        setPriceHistory(data);
      } catch (err) {
        setError('Failed to load price history.');
        console.error('useCoinHistory error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [coinId, currency, timeRange]); // Re-fetch when any of these change

  return { priceHistory, loading, error, timeRange, setTimeRange };
};

export default useCoinHistory;