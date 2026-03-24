// src/types/coin.ts

// Represents a single coin as returned by the /coins/markets endpoint
// This is used on the Dashboard — it's a lightweight summary of each coin
export interface Coin {
  id: string;              // CoinGecko's unique identifier, e.g. "bitcoin"
  symbol: string;          // Short ticker, e.g. "btc"
  name: string;            // Full name, e.g. "Bitcoin"
  image: string;           // URL to the coin's logo
  current_price: number;   // Current price in the selected currency
  market_cap: number;      // Total market capitalisation
  market_cap_rank: number; // Rank by market cap (1 = largest)
  price_change_percentage_24h: number; // % price change over last 24 hours
  total_volume: number;    // 24h trading volume
  circulating_supply: number;
  total_supply: number | null; // Some coins have no fixed supply (e.g. Ethereum pre-merge)
  ath: number;             // All-time high price
  ath_date: string;
}

// Represents the detailed coin data returned by /coins/{id}
// Used on the CoinDetail page — much richer than the market summary
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string; // CoinGecko returns descriptions in multiple languages
  };
  image: {
    large: string; // We use the large image on the detail page
    small: string;
    thumb: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>; // e.g. { zar: 1200000, usd: 65000 }
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: Record<string, number>;
    ath_date: Record<string, string>;
  };
}

// The currencies a user can select to view prices in
// We keep this as a union type so TypeScript catches any typos
export type SupportedCurrency = 'zar' | 'usd' | 'eur' | 'btc';

// Used for historical chart data points — a tuple of [timestamp, price]
export type PricePoint = [number, number];