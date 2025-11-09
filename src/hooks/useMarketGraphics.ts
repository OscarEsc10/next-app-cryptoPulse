import { useEffect, useState } from "react";
import { GetTopCryptos } from "../lib/coingecko";

export const useMarketData = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await GetTopCryptos();
        setCoins(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  return { coins, loading, error };
};
