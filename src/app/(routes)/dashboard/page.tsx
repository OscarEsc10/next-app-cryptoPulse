"use client";

import { Suspense } from 'react';
import { useGlobalData, GlobalData } from '../../../hooks/useGlobalData';
import { TrendingUp, BarChart2, Clock, AlertCircle } from 'lucide-react';

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats card component
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  loading = false 
}: { 
  title: string; 
  value: string; 
  change?: number; 
  icon: React.ElementType;
  loading?: boolean;
}) => (
  <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        {loading ? (
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        {change !== undefined && (
          <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L12 9.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5A1 1 0 0112 7z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 13a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L12 10.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0112 13z" clipRule="evenodd" />
              </svg>
            )}
            {Math.abs(change).toFixed(2)}%
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${loading ? 'bg-gray-100' : 'bg-blue-50'} text-blue-600`}>
        {loading ? (
          <div className="w-6 h-6"></div>
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const { globalData, loading, error } = useGlobalData();

  // Format currency values
  const formatCurrency = (value?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  // Calculate 24h volume to market cap percentage
  const getVolumeToMarketCapPercentage = (data: GlobalData) => {
    if (!data.total_volume?.usd || !data.total_market_cap?.usd) return 0;
    return (data.total_volume.usd / data.total_market_cap.usd) * 100;
  };

  // Stats data
  const stats = [
    {
      title: "Total Market Cap",
      value: formatCurrency(globalData?.total_market_cap?.usd),
      change: globalData?.market_cap_change_percentage_24h_usd,
      icon: BarChart2,
      loading: loading || !globalData
    },
    {
      title: "24h Trading Volume",
      value: formatCurrency(globalData?.total_volume?.usd),
      change: globalData ? getVolumeToMarketCapPercentage(globalData) : 0,
      icon: TrendingUp,
      loading: loading || !globalData
    },
    {
      title: "Active Cryptocurrencies",
      value: globalData?.active_cryptocurrencies?.toLocaleString() || '0',
      change: undefined,
      icon: Clock,
      loading: loading || !globalData
    }
  ];

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
        <div className="flex">
          <div className="shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {`Failed to load market data. ${error}. Please try again later.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>

      {/* Additional sections can be added here */}
    </div>
  );
}
