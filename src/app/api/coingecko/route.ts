import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';

// Cache for API responses (in-memory, consider using Redis in production)
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute cache TTL

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 1 minute

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
    const cachedData = cache.get(cacheKey);
    const now = Date.now();

    // Return cached response if available and not expired
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }

    // Make request to CoinGecko API
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    };

    // Add API key if available
    if (COINGECKO_API_KEY) {
      headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
    }

    const response = await axios.get(`${COINGECKO_API}/${endpoint}`, {
      params,
      headers,
      timeout: 10000 // 10 second timeout
    });

    const responseData = response.data;

    // Cache the response
    cache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });

    return NextResponse.json(
      { data: responseData },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );

  } catch (error: any) {
    console.error('CoinGecko API Error:', error.message);
    
    // Handle rate limiting specifically
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '60'
          }
        }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching data' },
      { 
        status: error.response?.status || 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
