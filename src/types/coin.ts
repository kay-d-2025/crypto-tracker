// src/types/coin.ts

// Represents a single coin as returned by the /coins/markets endpoint

export interface Coin {
  id: string;              // CoinGecko's unique identifier
  symbol: string;          // Short ticker
  name: string;            // Full name
  image: string;           // URL to coins logo
  current_price: number;   // Current price in the selected currency
  market_cap: number;      // Total market capitalisation
  market_cap_rank: number; // Rank by market cap (1 = largest)
  price_change_percentage_24h: number; // % price change over last 24 hours
  total_volume: number;    // 24h trading volume
  circulating_supply: number;
  total_supply: number | null; // Some coins have no fixed supply
  ath: number;             // All-time high price
  ath_date: string;
}

// detailed coin data returned by /coins/{id}
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
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

export type SupportedCurrency = 'zar' | 'usd' | 'eur' | 'btc';

// use in historical chart data points
export type PricePoint = [number, number];