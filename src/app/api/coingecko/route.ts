import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';

// Enhanced cache interface with type safety
interface CacheEntry {
  data: any;
  timestamp: number;
  isFetching: boolean;
  refreshAt: number;
}

// Cache with TTL and background refresh
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30000; // 30 seconds cache TTL
const BACKGROUND_REFRESH_THRESHOLD = 0.8; // Refresh cache when 80% of TTL is passed

export const dynamic = 'force-dynamic';
export const revalidate = 30; // 30 seconds

// Background refresh queue
const refreshQueue = new Set<string>();

// Function to fetch data from CoinGecko API
async function fetchFromCoinGecko(endpoint: string, params: Record<string, string>) {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };

  if (COINGECKO_API_KEY) {
    headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
  }

  const response = await axios.get(`${COINGECKO_API}/${endpoint}`, {
    params,
    headers,
    timeout: 10000, // 10 second timeout
  });

  return response.data;
}

// Function to refresh cache in background
async function refreshCacheInBackground(cacheKey: string, endpoint: string, params: Record<string, string>) {
  if (refreshQueue.has(cacheKey)) return;
  
  refreshQueue.add(cacheKey);
  
  try {
    const data = await fetchFromCoinGecko(endpoint, params);
    const now = Date.now();
    
    cache.set(cacheKey, {
      data,
      timestamp: now,
      isFetching: false,
      refreshAt: now + CACHE_TTL * BACKGROUND_REFRESH_THRESHOLD,
    });
  } catch (error) {
    console.error('Background refresh failed:', error);
    // Keep the old cache data if refresh fails
  } finally {
    refreshQueue.delete(cacheKey);
  }
}

export async function GET(request: NextRequest) {
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'global';
    const params: Record<string, string> = {};

    // Extract all query parameters except 'endpoint'
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        params[key] = value;
      }
    });

    // Create a cache key based on the request
    const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
    const now = Date.now();
    const cachedEntry = cache.get(cacheKey);

    // Return cached response if available and not expired
    if (cachedEntry) {
      // Trigger background refresh if we're past the refresh threshold
      if (now >= cachedEntry.refreshAt && !cachedEntry.isFetching) {
        // Don't await the refresh to avoid blocking the response
        refreshCacheInBackground(cacheKey, endpoint, params);
      }

      // Return cached data even if we're refreshing in the background
      if (now - cachedEntry.timestamp < CACHE_TTL) {
        return NextResponse.json(cachedEntry.data, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
            'X-Cache': 'HIT',
          }
        });
      }
    }

    // Mark as fetching to prevent duplicate requests
    if (cachedEntry) {
      cachedEntry.isFetching = true;
    }

    // Fetch fresh data
    const responseData = await fetchFromCoinGecko(endpoint, params);
    const entry: CacheEntry = {
      data: responseData,
      timestamp: now,
      isFetching: false,
      refreshAt: now + (CACHE_TTL * BACKGROUND_REFRESH_THRESHOLD),
    };

    // Update cache
    cache.set(cacheKey, entry);

    return NextResponse.json(
      { data: responseData },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
          'X-Cache': 'MISS',
        }
      }
    );

  } catch (error: any) {
    console.error('CoinGecko API Error:', error.message);
    
    // If we have cached data, return it even if it's stale
    const cacheKey = `${new URL(request.url).searchParams.get('endpoint') || 'global'}`;
    const cachedEntry = cache.get(cacheKey);
    
    if (cachedEntry) {
      console.warn('Serving stale cache data due to API error');
      return NextResponse.json(
        { data: cachedEntry.data, fromCache: true },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
            'X-Cache': 'STALE',
            'Warning': '199 - "Returning cached data due to API error"',
          },
          status: 200,
        }
      );
    }
    
    // Handle rate limiting specifically
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '60',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          }
        }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching data' },
      { 
        status: error.response?.status || 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  }
}
