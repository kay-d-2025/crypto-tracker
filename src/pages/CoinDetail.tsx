// src/pages/CoinDetail.tsx
// Detail page for a single cryptocurrency.
// useParams() will let us extract the coin ID from the URL, e.g. /coin/bitcoin
// We import it now even though we're not using it yet — shows intent clearly.

import { useParams } from 'react-router-dom';

const CoinDetail = () => {
  // coinId comes from the URL — defined in our router as /coin/:coinId
  const { coinId } = useParams<{ coinId: string }>();

  return (
    <div>
      <h1>Coin Detail</h1>
      <p>Showing details for: {coinId}</p>
    </div>
  );
};

export default CoinDetail;