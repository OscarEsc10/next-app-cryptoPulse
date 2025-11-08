export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank?: number;
  market_data?: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
}