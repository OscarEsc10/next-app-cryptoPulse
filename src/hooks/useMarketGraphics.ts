import { useEffect, useState, useCallback, useRef } from "react";
import { GetTopCryptos, GetCoinMarketChart } from "../lib/coingecko";
import { CryptoCurrency } from "@/types/coingeckoInterface";

export type TimeRange = '1d' | '7d' | '14d' | '30d' | '90d' | '1y';

export const getDaysFromRange = (range: TimeRange): number => {
  switch (range) {
    case '1d': return 1;
    case '7d': return 7;
    case '14d': return 14;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 365;
    default: return 7;
  }
};

export const useMarketData = () => {
  const [coins, setCoins] = useState<CryptoCurrency[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<Record<string, boolean>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMarketData = useCallback(async () => {
    if (loadingRef.current.market) return;
    
    try {
      loadingRef.current.market = true;
      setLoading(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const data = await GetTopCryptos();
      if (!controller.signal.aborted) {
        setCoins(data);
        setError(null);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching market data:', err);
        setError(err.message || 'Failed to fetch market data');
      }
    } finally {
      loadingRef.current.market = false;
      setLoading(false);
    }
  }, []);

  const fetchHistoricalData = useCallback(async (coinId: string, range: TimeRange = '7d') => {
    const dataKey = `${coinId}_${range}`;
    
    // Skip if already loading or already have data
    if (loadingRef.current[dataKey] || historicalData[dataKey]) return;
    
    try {
      loadingRef.current[dataKey] = true;
      setLoading(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const days = getDaysFromRange(range);
      const data = await GetCoinMarketChart(coinId, days);
      
      if (!controller.signal.aborted && data?.prices) {
        setHistoricalData(prev => ({
          ...prev,
          [dataKey]: data.prices
        }));
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(`Failed to fetch historical data for ${coinId}:`, err);
        setHistoricalData(prev => ({
          ...prev,
          [dataKey]: []
        }));
      }
    } finally {
      loadingRef.current[dataKey] = false;
      setLoading(false);
    }
  }, [historicalData]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return { 
    coins, 
    loading, 
    error, 
    historicalData,
    fetchHistoricalData,
    refetch: fetchMarketData 
  };
};
