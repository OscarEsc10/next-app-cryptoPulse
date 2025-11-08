import { CryptoCurrency } from "../types/coingeckoInterface";

const API_BASE = '/api/coingecko';

// Helper function to handle API calls
async function fetchFromApi<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
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
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    // Handle the response structure from our API route
    if (data.data !== undefined) {
      return data.data;
    }
    
    return data;
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
}

export const GetGlobalData = async (): Promise<any> => {
  return fetchFromApi('global');
};

export const GetTopCryptos = async (limit: number = 10, ids?: string[]): Promise<CryptoCurrency[]> => {
  return fetchFromApi('coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: limit,
    page: 1,
    sparkline: false,
    ids: ids ? ids.join(',') : undefined
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