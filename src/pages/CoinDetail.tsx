// src/pages/CoinDetail.tsx
// Detail page for a single coin — reached by clicking a card on the Dashboard.
// We extract the coin ID from the URL using useParams, then fetch rich data
// from the CoinGecko /coins/{id} endpoint which has far more detail than
// the markets endpoint used on the Dashboard.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoinDetail } from '../api';
import { useAppSelector } from '../store/hooks';
import type { CoinDetail as CoinDetailType } from '../types/coin';
import { formatCurrency, formatMarketCap, getPriceChangeColour } from '../utils/formatters';
import PriceChart from '../components/PriceChart';
import useCoinHistory from '../hooks/useCoinHistory';

// A small reusable stat block — used repeatedly on this page
// Defined here rather than a separate file since it's only used here
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    backgroundColor: '#1e1e2e',
    border: '1px solid #2e2e3e',
    borderRadius: '10px',
    padding: '16px',
  }}>
    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
      {label}
    </div>
    <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f1f1' }}>
      {value}
    </div>
  </div>
);

const CoinDetail = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const currency = useAppSelector(state => state.currency.selected);

  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull in price history via our custom hook
  // We pass coinId with a fallback empty string — the hook guards against empty coinId internally
  const { priceHistory, loading: chartLoading, error: chartError, timeRange, setTimeRange } = useCoinHistory(coinId ?? '', currency);

  useEffect(() => {
    // Guard clause — coinId should always exist given our route definition
    // but TypeScript requires us to handle the undefined case
    if (!coinId) return;

    const loadCoin = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCoinDetail(coinId);
        setCoin(data);
      } catch (err) {
        setError('Failed to fetch coin details. Please try again.');
        console.error('CoinDetail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoin();
  }, [coinId]); // Only re-fetch if the coinId in the URL changes

  // Helper to safely get a market data value for the selected currency
  // Falls back to 0 if the currency key doesn't exist in the response
  const getMarketValue = (record: Record<string, number> | undefined): number => {
    if (!record) return 0;
    return record[currency] ?? 0;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#13131f',
      color: '#f1f1f1',
      padding: '32px 24px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #2e2e3e',
            borderRadius: '8px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px 16px',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          ← Back to Dashboard
        </button>

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
          }}>
            {error}
          </div>
        )}

        {/* Main content — only renders once we have data */}
        {!loading && !error && coin && (
          <>
            {/* Coin header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}>
              <img
                src={coin.image.large}
                alt={`${coin.name} logo`}
                width={64}
                height={64}
                style={{ borderRadius: '50%' }}
              />
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
                  {coin.name}
                </h1>
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}>
                  {coin.symbol} — Rank #{coin.market_cap_rank}
                </span>
              </div>

              {/* Current price + 24h change — prominent position */}
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>
                  {formatCurrency(getMarketValue(coin.market_data.current_price), currency)}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: getPriceChangeColour(coin.market_data.price_change_percentage_24h),
                }}>
                  {coin.market_data.price_change_percentage_24h > 0 ? '▲' : '▼'}{' '}
                  {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}% (24h)
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
            }}>
              <StatCard
                label="Market Cap"
                value={formatMarketCap(getMarketValue(coin.market_data.market_cap), currency)}
              />
              <StatCard
                label="24h Volume"
                value={formatMarketCap(getMarketValue(coin.market_data.total_volume), currency)}
              />
              <StatCard
                label="7d Change"
                value={`${coin.market_data.price_change_percentage_7d?.toFixed(2) ?? 'N/A'}%`}
              />
              <StatCard
                label="30d Change"
                value={`${coin.market_data.price_change_percentage_30d?.toFixed(2) ?? 'N/A'}%`}
              />
              <StatCard
                label="Circulating Supply"
                value={coin.market_data.circulating_supply
                  ? coin.market_data.circulating_supply.toLocaleString()
                  : 'N/A'}
              />
              <StatCard
                label="Max Supply"
                value={coin.market_data.max_supply
                  ? coin.market_data.max_supply.toLocaleString()
                  : 'Unlimited'}
              />
              <StatCard
                label="All Time High"
                value={formatCurrency(getMarketValue(coin.market_data.ath), currency)}
              />
              <StatCard
                label="ATH Date"
                value={coin.market_data.ath_date?.[currency]
                  ? new Date(coin.market_data.ath_date[currency]).toLocaleDateString()
                  : 'N/A'}
              />
            </div>

            {/* Price history chart */}
                <PriceChart
                    priceHistory={priceHistory}
                    currency={currency}
                    loading={chartLoading}
                    error={chartError}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    coinName={coin.name}
                />

            {/* Description — strip HTML tags that CoinGecko includes */}
            {coin.description?.en && (
              <div style={{
                backgroundColor: '#1e1e2e',
                border: '1px solid #2e2e3e',
                borderRadius: '10px',
                padding: '20px',
              }}>
                <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#a0a0b0' }}>
                  About {coin.name}
                </h2>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#9ca3af',
                  // CoinGecko descriptions contain raw HTML — we render as text
                  // In a production app we'd use a sanitised HTML renderer
                  // but for this assessment plain text is fine
                }}
                  dangerouslySetInnerHTML={{
                    __html: coin.description.en.split('. ').slice(0, 4).join('. ') + '.'
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;