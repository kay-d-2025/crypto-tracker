// src/api/index.ts
// Barrel export — consumers import from 'api/' not 'api/coinGecko'
// This lets us reorganise internals without touching every import
export { fetchTopCoins, fetchCoinDetail, fetchCoinHistory } from './coinGecko';