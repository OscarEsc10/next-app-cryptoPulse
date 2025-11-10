import { CryptoCurrency } from "../types/coingeckoInterface";

const API_BASE = '/api/coingecko';

// Cache interface and setup
interface CacheEntry {
  data: any;
  timestamp: number;
}

const API_CACHE = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle API calls with retry logic
async function fetchFromApi<T>(
  endpoint: string, 
  params: Record<string, any> = {},
  retries = 3,
  backoff = 1000
): Promise<T> {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = API_CACHE.get(cacheKey);
  
  // Return cached data if it's still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  try {
    const queryString = new URLSearchParams();
    
    // Add all non-undefined params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });

    const url = `${API_BASE}?endpoint=${endpoint}&${queryString.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 429) { // Rate limited
      if (retries > 0) {
        await delay(backoff);
        return fetchFromApi(endpoint, params, retries - 1, backoff * 2);
      }
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the successful response
    API_CACHE.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    // Cache the successful response
    API_CACHE.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    // Handle the response structure from our API route
    if (data.data !== undefined) {
      return data.data as T;
    }
    
    return data as T;
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
};

export const GetGlobalData = async (): Promise<any> => {
  return fetchFromApi('global');
};

export const GetTopCryptos = async (vs_currency: string = 'usd', per_page: number = 20, page: number = 1): Promise<any> => {
  return fetchFromApi('coins/markets', {
    vs_currency,
    order: 'market_cap_desc',
    per_page,
    page,
    sparkline: false,
    price_change_percentage: '1h,24h,7d'
  });
};

export const GetCoinDetails = async (id: string): Promise<any> => {
  return fetchFromApi(`coins/${id}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false
  });
};

export const GetCoinMarketChart = async (id: string, days: number = 7, vs_currency: string = 'usd'): Promise<any> => {
  return fetchFromApi(`coins/${id}/market_chart`, {
    vs_currency,
    days,
    interval: days <= 1 ? 'hourly' : 'daily',
    precision: '2'
  });
};