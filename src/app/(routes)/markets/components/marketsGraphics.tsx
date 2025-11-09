"use client";

import { useState, useEffect, useCallback } from "react";
import { useMarketData } from "../../../../hooks/useMarketGraphics";
import dynamic from 'next/dynamic';
import { CryptoCurrency } from "@/types/coingeckoInterface";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { ChartDataPoint, ChartSeries } from "../../../../types/MarketsInterface";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartType = 'line' | 'bubble';
type TimeRange = '1d' | '7d' | '14d' | '30d' | '90d' | '1y';


export const MarketGraphics = () => {
  const { coins = [], loading = false, error = null } = useMarketData();
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [chartData, setChartData] = useState<ChartSeries[] | null>(null);
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Generate chart data based on selected coin and time range
  const generateChartData = useCallback(() => {
    if (!selectedCoin) return { data: [], options: {} };
    
    const days = {
      '1d': 1,
      '7d': 7,
      '14d': 14,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    }[timeRange] || 7;

    const basePrice = selectedCoin.current_price;
    const volatility = selectedCoin.price_change_percentage_24h / 100 || 0.1;

    // Generate data points
    const data: ChartDataPoint[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const priceChange = (Math.random() * 2 - 1) * volatility * basePrice;
      const price = basePrice + priceChange;
      const volume = Math.random() * (selectedCoin.total_volume * 0.1) || 1000000;

      return {
        x: date.getTime(),
        y: price,
        z: Math.sqrt(volume) * 0.01, // Bubble size based on volume
      };
    });

    const isLineChart = chartType === 'line';
    
    const series: ChartSeries[] = [{
      name: isLineChart ? selectedCoin.name : 'Volume',
      data: data.map(item => ({
        x: new Date(item.x),
        y: item.y,
        ...(!isLineChart && { z: item.z })
      }))
    }];

    const options = {
      chart: {
        type: chartType,
        height: 350,
        background: 'transparent',
        foreColor: '#1f2937',
        toolbar: { show: true },
        zoom: { enabled: true },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: { colors: '#6b7280' }
        }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => formatCurrency(val, 'USD'),
          style: { colors: '#6b7280' }
        }
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
        y: {
          formatter: (val: number) => formatCurrency(val, 'USD')
        },
        theme: 'dark'
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      theme: { mode: 'light' },
      colors: ['#3b82f6'],
      plotOptions: isLineChart ? {} : {
        bubble: {
          minBubbleRadius: 5,
          maxBubbleRadius: 15,
          fillOpacity: 0.7
        }
      }
    };

    return { data: series, options };
  }, [selectedCoin, chartType, timeRange]);

  // Set first coin as selected by default
  useEffect(() => {
    if (coins.length > 0 && !selectedCoin) {
      setIsTransitioning(true);
      setSelectedCoin(coins[0]);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [coins, selectedCoin]);

  // Generate chart data based on selected coin and time range
  useEffect(() => {
    if (!selectedCoin) return;

    const updateChart = () => {
      const { data, options } = generateChartData();
      setChartData(data);
      setChartOptions(options);
      setIsTransitioning(false);
    };

    setIsTransitioning(true);
    const timer = setTimeout(updateChart, 300);

    return () => clearTimeout(timer);
  }, [generateChartData, selectedCoin]);

  // Handle coin selection change
  const handleCoinChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsTransitioning(true);
    const selected = coins.find((coin: CryptoCurrency) => coin.id === e.target.value);
    if (selected) {
      requestAnimationFrame(() => {
        setSelectedCoin(selected);
        setTimeout(() => setIsTransitioning(false), 500);
      });
    }
  }, [coins]);

  // Handle chart type change with transition
  const handleChartTypeChange = useCallback((type: ChartType) => {
    if (type === chartType) return;
    setIsTransitioning(true);
    setChartType(type);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [chartType]);
  
  // Handle time range change with transition
  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    if (range === timeRange) return;
    setIsTransitioning(true);
    setTimeRange(range);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [timeRange]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading market data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error loading market data. Please try again later.
      </div>
    );
  }

  if (!selectedCoin) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600">No cryptocurrency data available.</span>
      </div>
    );
  }
  
  const priceChangeClass = selectedCoin.price_change_percentage_24h >= 0 
    ? 'text-green-600' 
    : 'text-red-600';
    
  const priceChangeIcon = selectedCoin.price_change_percentage_24h >= 0 
    ? <ArrowUp className="w-4 h-4" /> 
    : <ArrowDown className="w-4 h-4" />;

  return (
    <div className={` transition-all duration-300 ${isTransitioning ? 'opacity-75' : 'opacity-100'}`}>
      {/* Header with coin info and controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          {selectedCoin.image && (
            <img 
              src={selectedCoin.image} 
              alt={selectedCoin.name}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/48';
              }}
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCoin.name} ({selectedCoin.symbol?.toUpperCase() || 'N/A'})
            </h2>
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900 mr-2">
                {formatCurrency(selectedCoin.current_price, 'USD')}
              </span>
              <span 
                className={`flex items-center text-sm px-2 py-1 rounded transition-colors duration-200 ${
                  selectedCoin.price_change_percentage_24h >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {priceChangeIcon}
                {Math.abs(selectedCoin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label htmlFor="crypto-select" className="block text-sm font-medium text-gray-600 mb-1">
              Cryptocurrency
            </label>
            <select
              id="crypto-select"
              value={selectedCoin.id}
              onChange={handleCoinChange}
              className="bg-white text-gray-800 rounded-md px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {coins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol?.toUpperCase() || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Chart Type</label>
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button
                onClick={() => handleChartTypeChange('line')}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  chartType === 'line' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => handleChartTypeChange('bubble')}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  chartType === 'bubble' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bubble
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
              className="bg-white text-gray-800 rounded-md px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="1d">24H</option>
            <option value="7d">7D</option>
            <option value="14d">14D</option>
            <option value="30d">30D</option>
            <option value="90d">90D</option>
            <option value="1y">1Y</option>
          </select>
        </div>
      </div>
    </div>

    {/* Chart container */}
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all duration-300 relative overflow-hidden">
      {isTransitioning && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
      
      {chartData && chartOptions ? (
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type={chartType}
            height={400}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
    </div>

    {/* Additional coin info */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Market Cap</p>
        <p className="text-lg font-semibold">
          {formatCurrency(selectedCoin.market_cap, 'USD')}
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">24h Trading Volume</p>
        <p className="text-lg font-semibold">
          {formatCurrency(selectedCoin.total_volume, 'USD')}
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Market Rank</p>
        <p className="text-lg font-semibold">#{selectedCoin.market_cap_rank || 'N/A'}</p>
      </div>
    </div>
  </div>
);
};