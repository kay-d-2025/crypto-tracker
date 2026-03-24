// src/App.tsx
// App.tsx is the root of our component tree.
// Its only responsibility is setting up routing — nothing else.
// This keeps it clean and easy to reason about at a glance.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CoinDetail from './pages/CoinDetail';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    // BrowserRouter enables HTML5 history-based routing (clean URLs, no hash)
    <BrowserRouter>
      <Routes>
        {/* Dashboard is our index/home route */}
        <Route path="/" element={<Dashboard />} />

        {/* :coinId is a URL parameter — e.g. /coin/bitcoin or /coin/ethereum */}
        <Route path="/coin/:coinId" element={<CoinDetail />} />

        {/* Catch-all — any unmatched route shows the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;