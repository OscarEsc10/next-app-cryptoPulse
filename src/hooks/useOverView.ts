import { useEffect, useState, useCallback } from "react";
import { GetGlobalData, GetTopCryptos } from "../lib/coingecko";
import { CryptoCurrency } from '../types/coingeckoInterface';

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// In-memory cache
const cache = new Map<string, CacheEntry<any>>();

// Helper function to get data from cache or fetch it
async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  
  // Return cached data if it's still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const data = await fetchFn();
    // Update cache
    cache.set(key, { data, timestamp: now });
    return data;
  } catch (error) {
    // If there's an error but we have cached data, return that
    if (cached) {
      console.warn('Using cached data due to error:', error);
      return cached.data;
    }
    throw error;
  }
}

export const useOverviewData = () => {
  const [globalData, setGlobalData] = useState<any>(null);
  const [coins, setCoins] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get global market stats with caching
      const globalResponse = await getCachedOrFetch('global', async () => {
        const response = await GetGlobalData();
        return response?.data || response;
      });
      
      if (!globalResponse) {
        throw new Error('Failed to load global market data');
      }
      
      setGlobalData({
        active_cryptocurrencies: globalResponse.active_cryptocurrencies,
        markets: globalResponse.markets,
        total_market_cap: globalResponse.total_market_cap,
        total_volume: globalResponse.total_volume,
        market_cap_percentage: globalResponse.market_cap_percentage,
        market_cap_change_percentage_24h_usd: globalResponse.market_cap_change_percentage_24h_usd
      });

      const coinIds = [
        "bitcoin",
        "ethereum",
        "solana",
        "ripple",
        "cardano",
      ];

      // Get top coins with caching
      const cacheKey = `top-coins-${coinIds.join('-')}`;
      const response = await getCachedOrFetch(cacheKey, async () => {
        return await GetTopCryptos('usd', 10, 1);
      });

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
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching overview data:', error);
      
      // Implement exponential backoff for retries
      if (retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, delay);
        return;
      }
      
      setError(error instanceof Error ? error.message : 'Failed to load data');
      setLoading(false);
    } finally {
      if (retryCount >= 3 || !error) {
        setLoading(false);
      }
    }
  }, [retryCount]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Add a refresh function that can be called to force a refresh
  const refresh = useCallback(() => {
    // Clear cache for these specific keys
    cache.delete('global');
    cache.delete('top-coins');
    setRetryCount(0);
    fetchOverview();
  }, [fetchOverview]);

  return { globalData, coins, loading, error, refresh };
};
