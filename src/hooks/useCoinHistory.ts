// src/hooks/useCoinHistory.ts

import { useState, useEffect } from 'react';
import { fetchCoinHistory } from '../api';
import type { PricePoint, SupportedCurrency } from '../types/coin';

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

  // Default to 7 day view
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