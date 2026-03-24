// src/pages/Dashboard.tsx
// The landing page — fetches and displays the top 10 coins by market cap.
// This is a "container" component: it handles data fetching and state,
// then passes results down to presentational components like CoinCard.

import { useEffect, useState } from 'react';
import { fetchTopCoins } from '../api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCoins } from '../store/coinsSlice';
import type { Coin } from '../types/coin';
import CoinCard from '../components/CoinCard';
import CurrencySelector from '../components/CurrencySelector';

const Dashboard = () => {
  const dispatch = useAppDispatch();

  // Local state for loading and error — these are UI concerns, not global state,
  // so they live in component state rather than Redux
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull coins and currency from the Redux store
  const coins = useAppSelector(state => state.coins.list);
  const currency = useAppSelector(state => state.currency.selected);

  // Re-fetch whenever the selected currency changes
  // The dependency array [currency] ensures this runs on currency change
  useEffect(() => {
    const loadCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTopCoins(currency, 10);
        // Store result in Redux — this also timestamps the cache
        dispatch(setCoins(data));
      } catch (err) {
        setError('Failed to fetch cryptocurrency data. Please try again.');
        console.error('Dashboard fetch error:', err);
      } finally {
        // Always runs — clears loading state whether fetch succeeded or failed
        setLoading(false);
      }
    };

    loadCoins();
  }, [currency, dispatch]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#13131f',
      color: '#f1f1f1',
      padding: '32px 24px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
              Crypto Tracker
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
              Top 10 cryptocurrencies by market cap
            </p>
          </div>
          <CurrencySelector />
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
            Loading...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            backgroundColor: '#2d1515',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            padding: '16px',
            color: '#dc2626',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {/* Coin list — only renders when we have data */}
        {!loading && !error && coins.map((coin: Coin) => (
          <CoinCard key={coin.id} coin={coin} currency={currency} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;