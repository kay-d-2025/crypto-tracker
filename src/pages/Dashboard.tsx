// src/pages/Dashboard.tsx
// Redesigned with a friendlier header section and warmer overall feel.
// The subtitle copy is written to welcome non-technical users.

import { useEffect, useState } from 'react';
import { fetchTopCoins } from '../api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCoins, selectCachedCoins } from '../store/coinsSlice';
import type { Coin } from '../types/coin';
import CoinCard from '../components/CoinCard';
import CurrencySelector from '../components/CurrencySelector';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = useAppSelector(state => state.currency.selected);
  const cachedCoins = useAppSelector(state => selectCachedCoins(state, currency));
  const coins = cachedCoins ?? [];

  useEffect(() => {
    if (cachedCoins) return;

    const loadCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTopCoins(currency, 10);
        dispatch(setCoins({ coins: data, currency }));
      } catch (err) {
        setError('Failed to fetch cryptocurrency data. Please try again.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, [currency, dispatch, cachedCoins]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: '#f1f1f1',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Hero header section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f1a 100%)',
        borderBottom: '1px solid #2e2e4e',
        padding: '40px 24px 32px',
        marginBottom: '8px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Title row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}>
                Crypto Tracker 🚀
              </h1>
              <p style={{
                margin: '8px 0 0',
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                Track the world's top cryptocurrencies in real time.
                Hover over any term with a <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#3e3e6e',
                  color: '#a0a0c0',
                  fontSize: '9px',
                  fontWeight: 700,
                }}>?</span> for a plain-English explanation.
              </p>
            </div>
            <CurrencySelector />
          </div>

          {/* Summary stats bar */}
          {coins.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                <span style={{ color: '#818cf8', fontWeight: 600 }}>
                  {coins.filter(c => c.price_change_percentage_24h >= 0).length}
                </span>
                {' '}coins up today
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                <span style={{ color: '#f87171', fontWeight: 600 }}>
                  {coins.filter(c => c.price_change_percentage_24h < 0).length}
                </span>
                {' '}coins down today
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coin list */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 24px 48px' }}>
        {loading && <LoadingSpinner message="Fetching live prices..." />}

        {error && (
          <div style={{
            backgroundColor: '#2d1515',
            border: '1px solid #dc2626',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#f87171',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p style={{
              fontSize: '13px',
              color: '#4e4e7e',
              marginBottom: '12px',
              fontWeight: 500,
            }}>
              TOP 10 BY MARKET CAP
            </p>
            {coins.map((coin: Coin) => (
              <CoinCard key={coin.id} coin={coin} currency={currency} />
            ))}
          </>
        )}
      </div>

      {/* CoinGecko attribution — required by their API terms of service */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        fontSize: '12px',
        color: '#4e4e7e',
      }}>
        Data provided by{' '}
        
          <a href="https://www.coingecko.com/en/api"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#818cf8', textDecoration: 'none' }}
        >
          CoinGecko
        </a>
      </div>
    </div>
  );
};

export default Dashboard;