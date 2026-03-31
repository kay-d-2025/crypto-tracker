// src/pages/Wallet.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMetaMask from '../hooks/useMetaMask';
import { fetchTopCoins } from '../api';
import { useAppSelector } from '../store/hooks';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

const Wallet = () => {
  const navigate = useNavigate();
  const currency = useAppSelector(state => state.currency.selected);
  const { isInstalled, isConnected, address, ethBalance, error, connecting, connect } = useMetaMask();
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!isConnected) return;
    // Fetch ETH price by getting it from top coins
    fetchTopCoins(currency, 10, 1).then(coins => {
      const eth = coins.find(c => c.id === 'ethereum');
      if (eth) setEthPrice(eth.current_price);
    });
  }, [isConnected, currency]);

  const ethValueInCurrency = ethBalance && ethPrice
    ? parseFloat(ethBalance) * ethPrice
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: '#f1f1f1',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Nav */}
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
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          background: 'linear-gradient(90deg, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>
          My Wallet 🦊
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>
          Connect your MetaMask wallet to view your holdings.
        </p>

        {!isInstalled && (
          <div style={{
            backgroundColor: '#2d1515',
            border: '1px solid #dc2626',
            borderRadius: '12px',
            padding: '20px',
            color: '#f87171',
            fontSize: '14px',
          }}>
            ⚠️ MetaMask is not installed.{' '}
            
            <a  href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#818cf8' }}
            >
              Download it here
            </a>.
          </div>
        )}

        {isInstalled && !isConnected && (
          <button
            onClick={connect}
            disabled={connecting}
            style={{
              backgroundColor: '#6366f1',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 700,
              padding: '14px 32px',
              opacity: connecting ? 0.7 : 1,
            }}
          >
            {connecting ? 'Connecting...' : '🦊 Connect MetaMask'}
          </button>
        )}

        {error && (
          <p style={{ color: '#f87171', marginTop: '16px', fontSize: '14px' }}>
            ⚠️ {error}
          </p>
        )}

        {isConnected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Address card */}
            <div style={{
              backgroundColor: '#16162a',
              border: '1px solid #2e2e4e',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                Wallet Address
              </p>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', color: '#a5b4fc', wordBreak: 'break-all' }}>
                {address}
              </p>
            </div>

            {/* ETH balance card */}
            <div style={{
              backgroundColor: '#16162a',
              border: '1px solid #2e2e4e',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                ETH Balance
              </p>
              <p style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>
                {ethBalance} ETH
              </p>
              {ethValueInCurrency !== null ? (
                <p style={{ fontSize: '16px', color: '#818cf8' }}>
                  ≈ {formatCurrency(ethValueInCurrency, currency)}
                </p>
              ) : (
                <LoadingSpinner message="Fetching ETH price..." />
              )}
            </div>

            {/* Note about ERC-20 */}
            <p style={{ fontSize: '12px', color: '#4e4e7e', textAlign: 'center' }}>
              Currently showing ETH balance only. ERC-20 token support coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;