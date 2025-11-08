import { useEffect, useState } from 'react';
import { GetGlobalData } from '../lib/coingecko';

export interface GlobalData {
  active_cryptocurrencies?: number;
  markets?: number;
  total_market_cap?: {
    usd: number;
  };
  total_volume?: {
    usd: number;
  };
  market_cap_percentage?: {
    btc: number;
    eth: number;
    [key: string]: number | undefined;
  };
  market_cap_change_percentage_24h_usd?: number;
}

export const useGlobalData = () => {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        setLoading(true);
        const response = await GetGlobalData();
        // The API returns the data directly, no need for .data
        setGlobalData(response.data || null);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch global data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch global data');
        setGlobalData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobal();
  }, []);

  return {
    globalData,
    loading,
    error,
  };
};