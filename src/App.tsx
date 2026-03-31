// src/App.tsx

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