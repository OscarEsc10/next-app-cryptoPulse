"use client";

import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalData, GlobalData } from '../../../hooks/useGlobalData';
import { TrendingUp, BarChart2, Clock, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15
    }
  }
} as const;

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {[1, 2, 3].map((i) => (
        <motion.div 
          key={i} 
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          variants={itemVariants}
        >
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/3"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
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
  <motion.div 
    className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        {loading ? (
          <div className="h-8 w-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.p 
            className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {value}
          </motion.p>
        )}
        {change !== undefined && (
          <motion.div 
            className={`inline-flex items-center mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
              change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {change >= 0 ? (
              <ArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change).toFixed(2)}%
          </motion.div>
        )}
      </div>
      <motion.div 
        className={`p-3 rounded-2xl ${
          loading ? 'bg-gray-100' : 'bg-blue-50 text-blue-600'
        }`}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="w-6 h-6"></div>
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </motion.div>
    </div>
  </motion.div>
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
      loading: loading || !globalData,
      color: 'from-blue-500 to-blue-600'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
        </motion.div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardStats />
          </motion.div>
        </Suspense>
      </motion.div>
    </div>
  );
};
