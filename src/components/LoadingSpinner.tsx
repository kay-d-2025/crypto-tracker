// src/components/LoadingSpinner.tsx
// A simple animated spinner used during data fetching.
// Extracting this into its own component means we use the same
// loading indicator everywhere in the app — consistent UX.

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      gap: '16px',
    }}>
      {/* CSS animation spinner — no library needed for something this simple */}
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid #2e2e3e',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6b7280', fontSize: '14px' }}>{message}</p>

      {/* Keyframe animation injected via a style tag — keeps this self contained */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;