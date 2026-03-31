// src/App.tsx

import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CoinDetail from './pages/CoinDetail';
import NotFound from './pages/NotFound';
import Wallet from './pages/Wallet';

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
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </HashRouter>
  );
};

export default App;