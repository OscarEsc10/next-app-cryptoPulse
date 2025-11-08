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
        // GetGlobalData returns the data in the format { data: { ... } }
        const response = await GetGlobalData();
        
        // The data comes in the format { data: { data: { ... } } }
        const globalData = response?.data?.data || response?.data || response;
        
        if (!globalData) {
          throw new Error('No data received from API');
        }
        
        // Transform the data to match our expected format
        const formattedData = {
          active_cryptocurrencies: globalData.active_cryptocurrencies,
          markets: globalData.markets,
          total_market_cap: globalData.total_market_cap,
          total_volume: globalData.total_volume,
          market_cap_percentage: globalData.market_cap_percentage,
          market_cap_change_percentage_24h_usd: globalData.market_cap_change_percentage_24h_usd
        };
        
        setGlobalData(formattedData);
        setError(null);
      } catch (error) {
        const err = error as Error & { response?: { data?: any } };
        console.error('Failed to fetch global data:', err);
        const errorMessage = err.message || 'Failed to fetch global data';
        setError(errorMessage);
        setGlobalData(null);
        
        // Log additional error details for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('Error details:', {
            error: err.message,
            response: err.response?.data,
            timestamp: new Date().toISOString()
          });
        }
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