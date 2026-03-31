// src/components/CoinCard.tsx

import { useNavigate } from 'react-router-dom';
import type { Coin, SupportedCurrency } from '../types/coin';
import { formatCurrency, formatMarketCap, getPriceChangeColour } from '../utils/formatters';
import Tooltip from './Tooltip.tsx';
import { TOOLTIPS } from '../utils/tooltips';

interface CoinCardProps {
  coin: Coin;
  currency: SupportedCurrency;
}

const CoinCard = ({ coin, currency }: CoinCardProps) => {
  const navigate = useNavigate();
  const isPositive = coin.price_change_percentage_24h >= 0;
  const priceChangeColour = getPriceChangeColour(coin.price_change_percentage_24h);

  return (
    <div
      onClick={() => navigate(`/coin/${coin.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        marginBottom: '10px',
        backgroundColor: '#16162a',
        borderRadius: '16px',
        cursor: 'pointer',
        border: '1px solid #2e2e4e',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#1e1e3e';
        e.currentTarget.style.borderColor = '#6366f1';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#16162a';
        e.currentTarget.style.borderColor = '#2e2e4e';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Left: rank, logo, name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Rank badge */}
        <span style={{
          color: '#4e4e7e',
          fontSize: '13px',
          fontWeight: 600,
          width: '20px',
          textAlign: 'center',
        }}>
          {coin.market_cap_rank}
        </span>

        {/* Coin logo */}
        <img
          src={coin.image}
          alt={`${coin.name} logo`}
          width={42}
          height={42}
          style={{ borderRadius: '50%' }}
        />

        {/* Name and symbol */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#f1f1f1' }}>
            {coin.name}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {coin.symbol}
          </div>
        </div>
      </div>

      {/* Right: price info */}
      <div style={{ textAlign: 'right' }}>
        {/* Current price */}
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#f1f1f1' }}>
          {formatCurrency(coin.current_price, currency)}
        </div>

        {/* 24h change badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: isPositive ? '#0f2d1f' : '#2d0f0f',
          color: priceChangeColour,
          borderRadius: '6px',
          padding: '2px 8px',
          fontSize: '12px',
          fontWeight: 600,
          margin: '4px 0',
        }}>
          <Tooltip text={TOOLTIPS.change24h}>
            {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </Tooltip>
        </div>

        {/* Market cap */}
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <Tooltip text={TOOLTIPS.marketCap}>
            MCap
          </Tooltip>
          {': '}{formatMarketCap(coin.market_cap, currency)}
        </div>
      </div>
    </div>
  );
};

export default CoinCard;