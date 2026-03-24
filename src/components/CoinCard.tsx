// src/components/CoinCard.tsx
// A single card representing one cryptocurrency in the list.
// This is a "presentational" component — it receives data via props
// and only worries about how to display it, not where data comes from.
// Keeping it separate from the page means we can reuse it anywhere.

import { useNavigate } from 'react-router-dom';
import type { Coin } from '../types/coin';
import type { SupportedCurrency } from '../types/coin';
import { formatCurrency, formatMarketCap, getPriceChangeColour } from '../utils/formatters';

interface CoinCardProps {
  coin: Coin;
  currency: SupportedCurrency;
}

const CoinCard = ({ coin, currency }: CoinCardProps) => {
  // useNavigate lets us programmatically change the route
  // when the user clicks a card — cleaner than wrapping in an <a> tag
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const priceChangeColour = getPriceChangeColour(coin.price_change_percentage_24h);
  const isPositive = coin.price_change_percentage_24h > 0;

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        marginBottom: '10px',
        backgroundColor: '#1e1e2e',
        borderRadius: '12px',
        cursor: 'pointer',
        border: '1px solid #2e2e3e',
        transition: 'background-color 0.2s ease',
      }}
      // Inline hover effect via JS since we're not using CSS modules yet
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a3e')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e1e2e')}
    >
      {/* Left section: rank, logo, name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#6b7280', width: '24px', textAlign: 'right' }}>
          {coin.market_cap_rank}
        </span>
        <img
          src={coin.image}
          alt={`${coin.name} logo`}
          width={36}
          height={36}
          style={{ borderRadius: '50%' }}
        />
        <div>
          <div style={{ fontWeight: 600, color: '#f1f1f1' }}>{coin.name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
            {coin.symbol}
          </div>
        </div>
      </div>

      {/* Right section: price, 24h change, market cap */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600, color: '#f1f1f1' }}>
          {formatCurrency(coin.current_price, currency)}
        </div>
        <div style={{ fontSize: '13px', color: priceChangeColour }}>
          {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          MCap: {formatMarketCap(coin.market_cap, currency)}
        </div>
      </div>
    </div>
  );
};

export default CoinCard;