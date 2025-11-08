"use client";

import React from "react";
import { useGlobalData } from "../../../../hooks/useGlobalData";

const GlobalStats: React.FC = () => {
  const { globalData, loading, error } = useGlobalData();

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Market Overview</h2>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !globalData) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error || 'Failed to load global market data. Please try again later.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { 
    active_cryptocurrencies = 0,
    markets = 0,
    total_market_cap = { usd: 0 },
    total_volume = { usd: 0 },
    market_cap_percentage = { btc: 0, eth: 0 }
  } = globalData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatCurrency(total_market_cap.usd),
      change: 2.5, // This would come from your API if available
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h7m0 0v7m0-7l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      label: '24h Volume',
      value: formatCurrency(total_volume.usd),
      change: 1.8,
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      label: 'Active Cryptocurrencies',
      value: formatNumber(active_cryptocurrencies),
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      label: 'Markets',
      value: formatNumber(markets),
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      label: 'BTC Dominance',
      value: `${market_cap_percentage.btc?.toFixed(1) || 0}%`,
      change: -0.8,
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.98 3.45 3.51 1.77.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-3.12-3.66-3.56z"/>
        </svg>
      )
    },
    {
      label: 'ETH Dominance',
      value: `${market_cap_percentage.eth?.toFixed(1) || 0}%`,
      change: 0.3,
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.37 4.354 7.35-4.35L12.056 0z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Market Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable stat card component
const StatCard = ({ 
  label, 
  value, 
  change,
  icon
}: { 
  label: string; 
  value: string; 
  change?: number;
  icon?: React.ReactNode;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors duration-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {icon && <div className="p-1 bg-white rounded-md shadow-sm">{icon}</div>}
    </div>
    <p className="text-xl font-semibold text-gray-900">{value}</p>
    {change !== undefined && (
      <div className={`mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {change >= 0 ? (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L12 9.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5A1 1 0 0112 7z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 13a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L12 10.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0112 13z" clipRule="evenodd" />
          </svg>
        )}
        {Math.abs(change)}%
      </div>
    )}
  </div>
);

export default GlobalStats;