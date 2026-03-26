// src/pages/CoinDetail.tsx
// Redesigned with a friendlier layout — clear sections, tooltips on all
// stats, and a welcoming tone for users new to crypto.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoinDetail } from '../api';
import { useAppSelector } from '../store/hooks';
import type { CoinDetail as CoinDetailType } from '../types/coin';
import { formatCurrency, formatMarketCap, getPriceChangeColour } from '../utils/formatters';
import PriceChart from '../components/PriceChart';
import useCoinHistory from '../hooks/useCoinHistory';
import LoadingSpinner from '../components/LoadingSpinner';
import Tooltip from '../components/Tooltip';
import { TOOLTIPS } from '../utils/tooltips';

// Stat card now accepts ReactNode for label so we can wrap with Tooltip
const StatCard = ({ label, value }: { label: React.ReactNode; value: string }) => (
  <div style={{
    backgroundColor: '#16162a',
    border: '1px solid #2e2e4e',
    borderRadius: '12px',
    padding: '16px',
    transition: 'border-color 0.2s ease',
  }}>
    <div style={{
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '8px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {label}
    </div>
    <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f1f1' }}>
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

  const { priceHistory, loading: chartLoading, error: chartError, timeRange, setTimeRange } =
    useCoinHistory(coinId ?? '', currency);

  useEffect(() => {
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
  }, [coinId]);

  const getMarketValue = (record: Record<string, number> | undefined): number => {
    if (!record) return 0;
    return record[currency] ?? 0;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: '#f1f1f1',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Top nav bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f1a 100%)',
        borderBottom: '1px solid #2e2e4e',
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2e2e4e',
              borderRadius: '8px',
              color: '#818cf8',
              cursor: 'pointer',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2e2e4e'}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px 48px' }}>
        {loading && <LoadingSpinner message="Loading coin details..." />}

        {error && (
          <div style={{
            backgroundColor: '#2d1515',
            border: '1px solid #dc2626',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#f87171',
            fontSize: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && coin && (
          <>
            {/* Coin header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}>
              <img
                src={coin.image.large}
                alt={`${coin.name} logo`}
                width={72}
                height={72}
                style={{ borderRadius: '50%', boxShadow: '0 0 24px rgba(99,102,241,0.3)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
                    {coin.name}
                  </h1>
                  {/* Rank badge */}
                  <span style={{
                    backgroundColor: '#1e1e3e',
                    border: '1px solid #3e3e6e',
                    borderRadius: '6px',
                    padding: '2px 10px',
                    fontSize: '12px',
                    color: '#818cf8',
                    fontWeight: 600,
                  }}>
                    <Tooltip text={TOOLTIPS.rank}>
                      #{coin.market_cap_rank}
                    </Tooltip>
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '4px',
                }}>
                  {coin.symbol}
                </div>
              </div>

              {/* Price section */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>
                  {formatCurrency(getMarketValue(coin.market_data.current_price), currency)}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: coin.market_data.price_change_percentage_24h >= 0
                    ? '#0f2d1f' : '#2d0f0f',
                  color: getPriceChangeColour(coin.market_data.price_change_percentage_24h),
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginTop: '6px',
                }}>
                  <Tooltip text={TOOLTIPS.change24h}>
                    {coin.market_data.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
                    {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}% today
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Price chart */}
            <PriceChart
              priceHistory={priceHistory}
              currency={currency}
              loading={chartLoading}
              error={chartError}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              coinName={coin.name}
            />

            {/* Stats grid */}
            <p style={{
              fontSize: '13px',
              color: '#4e4e7e',
              marginBottom: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Key Statistics
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
            }}>
              <StatCard
                label={<Tooltip text={TOOLTIPS.marketCap}>Market Cap</Tooltip>}
                value={formatMarketCap(getMarketValue(coin.market_data.market_cap), currency)}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.volume24h}>24h Volume</Tooltip>}
                value={formatMarketCap(getMarketValue(coin.market_data.total_volume), currency)}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.change7d}>7 Day Change</Tooltip>}
                value={`${coin.market_data.price_change_percentage_7d?.toFixed(2) ?? 'N/A'}%`}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.change30d}>30 Day Change</Tooltip>}
                value={`${coin.market_data.price_change_percentage_30d?.toFixed(2) ?? 'N/A'}%`}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.circulatingSupply}>Circulating Supply</Tooltip>}
                value={coin.market_data.circulating_supply
                  ? coin.market_data.circulating_supply.toLocaleString()
                  : 'N/A'}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.maxSupply}>Max Supply</Tooltip>}
                value={coin.market_data.max_supply
                  ? coin.market_data.max_supply.toLocaleString()
                  : 'Unlimited ♾️'}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.ath}>All Time High</Tooltip>}
                value={formatCurrency(getMarketValue(coin.market_data.ath), currency)}
              />
              <StatCard
                label={<Tooltip text={TOOLTIPS.athDate}>ATH Date</Tooltip>}
                value={coin.market_data.ath_date?.[currency]
                  ? new Date(coin.market_data.ath_date[currency]).toLocaleDateString('en-ZA', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : 'N/A'}
              />
            </div>

            {/* About section */}
            {coin.description?.en && (
              <div style={{
                backgroundColor: '#16162a',
                border: '1px solid #2e2e4e',
                borderRadius: '12px',
                padding: '24px',
              }}>
                <p style={{
                  fontSize: '13px',
                  color: '#4e4e7e',
                  marginBottom: '12px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  About {coin.name}
                </p>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#9ca3af',
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