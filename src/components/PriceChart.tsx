// src/components/PriceChart.tsx

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { PricePoint, SupportedCurrency } from '../types/coin';
import { formatCurrency } from '../utils/formatters';
import type { TimeRange } from '../hooks/useCoinHistory';
import { TIME_RANGES } from '../hooks/useCoinHistory';
import LoadingSpinner from './LoadingSpinner';

interface PriceChartProps {
  priceHistory: PricePoint[];
  currency: SupportedCurrency;
  loading: boolean;
  error: string | null;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  coinName: string;
}

// The format changes depending on the time range selected
const formatXAxisLabel = (timestamp: number, timeRange: TimeRange): string => {
  const date = new Date(timestamp);
  if (timeRange === '24h') {
    return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: any[];
  currency: SupportedCurrency;
}) => {
  if (!active || !payload?.length) return null;

  const [timestamp, price] = payload[0].payload.raw as PricePoint;

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      border: '1px solid #2e2e3e',
      borderRadius: '8px',
      padding: '10px 14px',
    }}>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
        {new Date(timestamp).toLocaleString('en-ZA')}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f1f1' }}>
        {formatCurrency(price, currency)}
      </div>
    </div>
  );
};

const PriceChart = ({
  priceHistory,
  currency,
  loading,
  error,
  timeRange,
  onTimeRangeChange,
  coinName,
}: PriceChartProps) => {
  const chartData = priceHistory.map(([timestamp, price]) => ({
    timestamp,
    price,
    raw: [timestamp, price] as PricePoint,
  }));

  // line colour bused on if price went up or down
  const lineColour = (() => {
    if (chartData.length < 2) return '#6366f1';
    return chartData[chartData.length - 1].price >= chartData[0].price
      ? '#16a34a'
      : '#dc2626';
  })();

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      border: '1px solid #2e2e3e',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '24px',
    }}>
      {/* Chart header with time range selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '16px', color: '#a0a0b0', margin: 0 }}>
          {coinName} Price History
        </h2>

        {/* Time range toggle buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(Object.keys(TIME_RANGES) as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              style={{
                backgroundColor: timeRange === range ? '#6366f1' : 'transparent',
                color: timeRange === range ? '#fff' : '#6b7280',
                border: `1px solid ${timeRange === range ? '#6366f1' : '#2e2e3e'}`,
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner message="Loading chart..." />}

      {/* Error state */}
      {error && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Chart — ResponsiveContainer makes it fill its parent width */}
      {!loading && !error && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={ts => formatXAxisLabel(ts, timeRange)}
              stroke="#6b7280"
              fontSize={11}
              // Only show a subset of ticks to avoid crowding the axis
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={val => formatCurrency(val, currency)}
              stroke="#6b7280"
              fontSize={11}
              width={90}
              // Auto-scale the Y axis to the data range (better visibility)
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColour}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColour }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceChart;