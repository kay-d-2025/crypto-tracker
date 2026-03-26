// src/utils/tooltips.ts
// Plain-English explanations for crypto terms.
// Written for someone who has never traded crypto before —
// no jargon, no assumptions about prior knowledge.

export const TOOLTIPS = {
  marketCap: `Think of this like a company's total worth. It's calculated by 
    multiplying the coin's price by how many coins exist. A higher market cap 
    generally means a more established and stable coin.`,

  price: `The current price of one coin in your selected currency. 
    Crypto prices can change dramatically within minutes — 
    this updates every time you load the page.`,

  change24h: `How much the price has gone up or down in the last 24 hours. 
    Green means the price went up 📈, red means it went down 📉.`,

  volume24h: `The total value of this coin bought and sold in the last 24 hours. 
    High volume means lots of people are actively trading it — 
    like how busy a market is on any given day.`,

  circulatingSupply: `The number of coins currently in existence and being traded. 
    Like the number of notes in circulation for a regular currency.`,

  maxSupply: `The maximum number of coins that will ever exist. 
    Bitcoin for example only has 21 million — this limited supply 
    is part of what makes it valuable, like a rare collectible.`,

  ath: `All Time High — the highest price this coin has ever reached in history. 
    Useful for seeing how the current price compares to its best ever value.`,

  athDate: `The date when this coin reached its highest ever price.`,

  rank: `This coin's position among all cryptocurrencies, ranked by total value. 
    #1 means it's the most valuable crypto in the world by market cap.`,

  change7d: `How much the price has changed over the last 7 days. 
    Gives a better picture of recent trends than just the 24 hour change.`,

  change30d: `How much the price has changed over the last 30 days — 
    useful for seeing the bigger monthly trend.`,
} as const;