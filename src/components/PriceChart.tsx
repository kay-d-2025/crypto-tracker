// src/components/PriceChart.tsx
// Renders a line chart of historical price data using Recharts.
// Recharts is a React-native charting library built on D3 — we chose it
// because it integrates naturally with React's component model and
// handles responsiveness well out of the box.

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

// Formats a timestamp into a readable label for the X axis.
// The format changes depending on the time range selected —
// hourly labels for 24h, daily for longer ranges.
const formatXAxisLabel = (timestamp: number, timeRange: TimeRange): string => {
  const date = new Date(timestamp);
  if (timeRange === '24h') {
    return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
};

// Custom tooltip shown when hovering over the chart
// We build a custom one instead of using the default so we can
// format the price correctly with our currency formatter
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
  // Transform raw PricePoint tuples into objects Recharts can work with.
  // Recharts expects data as an array of objects, not tuples.
  // We keep the raw tuple alongside so the tooltip can access both values.
  const chartData = priceHistory.map(([timestamp, price]) => ({
    timestamp,
    price,
    raw: [timestamp, price] as PricePoint,
  }));

  // Determine the colour of the line based on whether price went up or down
  // over the selected period — green if up, red if down
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
              // Auto-scale the Y axis to the data range for better visibility
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColour}
              strokeWidth={2}
              // Hiding dots keeps the chart clean for large datasets
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