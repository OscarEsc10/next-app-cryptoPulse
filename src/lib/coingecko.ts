import axios from "axios";
import { CryptoCurrency } from "../types/coingeckoInterface";

const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || "";
const BASE_URL = "https://api.coingecko.com/api/v3";

if (!COINGECKO_API_KEY) {
  console.warn("CoinGecko API key is not set. Some features may not work correctly.");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(COINGECKO_API_KEY && { "X-CoinGecko-Api-Key": COINGECKO_API_KEY }),
  },
});

export const GetTopCryptos = async (limit: number = 10): Promise<CryptoCurrency[]> => {
  try {
    const { data } = await api.get<CryptoCurrency[]>("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching top cryptocurrencies:", error.message);
    throw new Error(`Failed to fetch top cryptocurrencies: ${error.message}`);
  }
};

export const GetCoinDetails = async (id: string): Promise<any> => {
  try {
    const { data } = await api.get(`/coins/${id}`);
    return data;
  } catch (error: any) {
    console.error(`Error fetching coin details for ${id}:`, error.message);
    throw new Error(`Failed to fetch coin details for ${id}: ${error.message}`);
  }
};

export const GetGlobalData = async (): Promise<any> => {
  try {
    const { data } = await api.get("/global");
    return data;
  } catch (error: any) {
    console.error("Error fetching global data:", error.message);
    throw new Error(`Failed to fetch global data: ${error.message}`);
  }
};
