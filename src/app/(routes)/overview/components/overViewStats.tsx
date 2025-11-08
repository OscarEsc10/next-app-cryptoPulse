"use client";

import React from "react";
import { motion } from "framer-motion";
import { useOverviewData } from "../../../../hooks/useOverView";
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart2, Coins, Activity } from "lucide-react";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  loading = false 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  change?: number;
  loading?: boolean;
}) => (
  <motion.div 
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    whileHover={{ 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    }}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        {loading ? (
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        )}
        {change !== undefined && (
          <div className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {change >= 0 ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change).toFixed(2)}%
          </div>
        )}
      </div>
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

const OverviewStats: React.FC = () => {
  const { globalData, coins, loading, error } = useOverviewData();

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 text-red-700 rounded-xl">
      <p>Error loading market data. Please try again later.</p>
    </div>
  );
  
  if (!globalData || coins.length === 0) return (
    <div className="p-6 bg-yellow-50 text-yellow-700 rounded-xl">
      <p>No market data available at the moment.</p>
    </div>
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const btcDominance = globalData?.market_cap_percentage?.btc?.toFixed(2);
  const ethDominance = globalData?.market_cap_percentage?.eth?.toFixed(2);
  const marketCapChange = globalData?.market_cap_change_percentage_24h_usd?.toFixed(2);

  return (
    <div className="space-y-8">
      {/* --- GLOBAL STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Market Cap" 
          value={formatCurrency(globalData.total_market_cap.usd)}
          icon={BarChart2}
          change={parseFloat(marketCapChange || '0')}
          loading={loading}
        />
        <StatCard 
          title="24h Trading Volume" 
          value={formatCurrency(globalData.total_volume.usd)}
          icon={Activity}
          loading={loading}
        />
        <StatCard 
          title="Active Cryptocurrencies" 
          value={globalData.active_cryptocurrencies.toLocaleString()}
          icon={Coins}
          loading={loading}
        />
        <StatCard 
          title="Total Markets" 
          value={globalData.markets.toLocaleString()}
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard 
          title="BTC Dominance" 
          value={`${btcDominance}%`}
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard 
          title="ETH Dominance" 
          value={`${ethDominance}%`}
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      {/* --- COIN DETAILS --- */}
      <section className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Top Cryptocurrencies
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coins.slice(0, 5).map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-8 w-8 rounded-full mr-3" 
                        src={coin.image} 
                        alt={coin.name}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{coin.name}</div>
                        <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                    coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${coin.market_cap.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OverviewStats;
