import { useEffect, useState } from "react";
import { GetGlobalData, GetTopCryptos } from "../lib/coingecko";
import { CryptoCurrency } from '../types/coingeckoInterface';

export const useOverviewData = () => {
  const [globalData, setGlobalData] = useState<any>(null);
  const [coins, setCoins] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get global market stats
        const globalResponse = await GetGlobalData();
        // Handle nested data structure
        const globalData = globalResponse?.data || globalResponse;
        
        if (!globalData) {
          throw new Error('Failed to load global market data');
        }
        
        setGlobalData({
          active_cryptocurrencies: globalData.active_cryptocurrencies,
          markets: globalData.markets,
          total_market_cap: globalData.total_market_cap,
          total_volume: globalData.total_volume,
          market_cap_percentage: globalData.market_cap_percentage,
          market_cap_change_percentage_24h_usd: globalData.market_cap_change_percentage_24h_usd
        });

        const coinIds = [
          "bitcoin",
          "ethereum",
          "solana",
          // "ripple",
          // "cardano",
          // "avalanche-2",
          // "polkadot",
          // "dogecoin",
          // "matic-network",
          // "chainlink",
        ];

        const response = await GetTopCryptos(10, coinIds);
        // Handle the response which could be either CryptoCurrency[] or { data: CryptoCurrency[] }
        const topCoins = Array.isArray(response) 
          ? response 
          : (response as { data?: CryptoCurrency[] })?.data;
        
        if (Array.isArray(topCoins)) {
          setCoins(topCoins);
        } else {
          console.warn('Unexpected coins data format:', response);
          setCoins([]);
        }
      } catch (error) {
        const err = error as Error;
        console.error('Failed to fetch overview data:', err);
        setError(err.message || 'Failed to fetch overview data');
        setGlobalData(null);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return { globalData, coins, loading, error };
};
