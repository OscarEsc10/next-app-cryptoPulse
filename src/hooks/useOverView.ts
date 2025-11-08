import { useEffect, useState } from "react";
import { GetGlobalData, GetCoinDetails } from "../lib/coingecko";

export const useOverviewData = () => {
    const [globalData, setGlobalData] = useState<any>(null);
    const [coins, setCoins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const globalRes = await GetGlobalData();
                setGlobalData(globalRes.data);

                // Example: show BTC, ETH, and SOL details
                const coinIds = [
                    "bitcoin",     // Bitcoin
                    "ethereum",    // Ethereum
                    "solana",      // Solana
                    "ripple",      // XRP
                    "cardano",     // Cardano
                    "avalanche-2", // Avalanche
                    "polkadot",    // Polkadot
                    "dogecoin",    // Dogecoin
                    "matic-network", // Polygon (MATIC)
                    "chainlink"    // Chainlink
                ];
                const coinData = await Promise.all(coinIds.map((id) => GetCoinDetails(id)));
                setCoins(coinData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    return { globalData, coins, loading, error };
};
