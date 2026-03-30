// src/App.tsx
// Using HashRouter instead of BrowserRouter for GitHub Pages compatibility.
// BrowserRouter uses clean URLs (/coin/bitcoin) which GitHub Pages can't handle
// since it's a static host — it doesn't know to serve index.html for every path.
// HashRouter uses hash-based URLs (/#/coin/bitcoin) which always load index.html
// first, then React Router handles the routing client-side. Not as pretty but
// works perfectly on static hosts like GitHub Pages.

import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CoinDetail from './pages/CoinDetail';
import NotFound from './pages/NotFound';

const App = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');
    if (path) {
      window.history.replaceState(null, '', path);
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coin/:coinId" element={<CoinDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

export default App;