// src/main.tsx
// The Redux Provider makes the store available to every component in the tree
// It must wrap the entire app (done here at the root level)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider injects the Redux store into React's context system */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

//temp

console.log('API KEY:', import.meta.env.VITE_COINGECKO_API_KEY);