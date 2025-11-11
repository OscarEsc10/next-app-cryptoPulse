import { useEffect, useState, useCallback, useRef } from "react";
import { GetTopCryptos, GetCoinMarketChart, GetCoinDetails } from "../lib/coingecko";
import type { CryptoCurrency } from "@/types/coingeckoInterface";

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

      // Reduced list of top 5 major cryptocurrencies
      const requiredCoins = [
        'bitcoin',      // BTC - Most reliable
        'ethereum',     // ETH - Very reliable
        'tether',       // USDT - Stablecoin, usually quick
        // 'usd-coin',     // USDC - Another stablecoin
        // 'binancecoin',  // BNB - Binance's coin
        // 'ripple',       // XRP - Well-established
        // 'cardano',      // ADA - Popular and usually stable
        // 'solana',       // SOL - Fast blockchain
        // 'polkadot',     // DOT - Reliable
      ];
      // Fetch only the top 5 coins
      let data = await GetTopCryptos('usd', 5);

      // Filter to only include our required coins
      data = data.filter((coin: CryptoCurrency) =>
        requiredCoins.includes(coin.id)
      );

      // Add any missing required coins
      const missingCoins = requiredCoins.filter(
        coinId => !data.some((coin: CryptoCurrency) => coin.id === coinId)
      );

      // Fetch missing coins individually if needed
      if (missingCoins.length > 0) {
        try {
          const missingCoinsData = await Promise.all(
            missingCoins.map(coinId =>
              GetCoinDetails(coinId)
                .then(coin => ({
                  id: coin.id,
                  name: coin.name,
                  symbol: coin.symbol.toUpperCase(),
                  current_price: coin.market_data?.current_price?.usd || 0,
                  price_change_percentage_24h: coin.market_data?.price_change_percentage_24h || 0,
                  market_cap: coin.market_data?.market_cap?.usd || 0,
                  image: coin.image?.small || coin.image?.thumb || ''
                }))
                .catch(() => null)
            )
          );

          // Add successfully fetched coins
          missingCoinsData.forEach(coin => {
            if (coin) {
              data.push(coin);
            }
          });

          // Sort by market cap
          data.sort((a: CryptoCurrency, b: CryptoCurrency) => b.market_cap - a.market_cap);

        } catch (error) {
          console.warn('Failed to fetch some coin data:', error);
        }
      }

      if (!controller.signal.aborted) {
        setCoins(data);
        setError(null);

        // Pre-fetch historical data for the first 3 coins with increased delays
        data.slice(0, 3).forEach((coin: CryptoCurrency, index: number) => {
          setTimeout(() => {
            fetchHistoricalData(coin.id, '7d');
          }, 2000 * (index + 1)); // 2s delay between each request
        });
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
        // Don't cache errors to allow retries
      }
    } finally {
      loadingRef.current[dataKey] = false;
      setLoading(false);
    }
  }, [historicalData]);

  useEffect(() => {
    fetchMarketData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMarketData]);

  return {
    coins,
    loading,
    error,
    historicalData,
    fetchHistoricalData,
    refresh: fetchMarketData
  };
};

export default useMarketData;