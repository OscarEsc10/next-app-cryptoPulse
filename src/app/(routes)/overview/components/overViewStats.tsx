"use client";

import React from "react";
import { useOverviewData } from "../../../../hooks/useOverView";

const OverviewStats: React.FC = () => {
  const { globalData, coins, loading, error } = useOverviewData();

  if (loading) return <p className="text-center text-gray-500">Loading overview data...</p>;
  if (loading) return <div className="p-4">Loading market data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!globalData || coins.length === 0) return <div className="p-4">No market data available</div>;

  const btcDominance = globalData?.market_cap_percentage?.btc?.toFixed(2);
  const ethDominance = globalData?.market_cap_percentage?.eth?.toFixed(2);

  return (
    <div className="p-6">
      {/* --- GLOBAL STATS --- */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          🌍 Global Market Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Active Cryptocurrencies</p>
            <p className="text-lg font-medium">{globalData.active_cryptocurrencies}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Markets</p>
            <p className="text-lg font-medium">{globalData.markets}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Market Cap (USD)</p>
            <p className="text-lg font-medium">
              ${globalData.total_market_cap.usd.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">24h Volume (USD)</p>
            <p className="text-lg font-medium">
              ${globalData.total_volume.usd.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">BTC Dominance</p>
            <p className="text-lg font-medium">{btcDominance}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ETH Dominance</p>
            <p className="text-lg font-medium">{ethDominance}%</p>
          </div>
        </div>
      </section>

      {/* --- COIN DETAILS --- */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          💰 Top Coin Details
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="border border-gray-100 p-5 rounded-xl hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <p className="font-medium text-gray-800">{coin.name}</p>
                  <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
                </div>
              </div>

              <p className="text-sm text-gray-500">Current Price (USD)</p>
              <p className="text-lg font-semibold mb-2">
                ${coin.current_price?.toLocaleString() || 'N/A'}
              </p>

              <p className="text-sm text-gray-500">Market Cap Rank</p>
              <p className="text-lg font-semibold mb-2">
                {coin.market_cap_rank ? `#${coin.market_cap_rank}` : 'N/A'}
              </p>

              <p className="text-sm text-gray-500">24h Price Change</p>
              <p
                className={`text-lg font-semibold ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h
                  ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OverviewStats;
