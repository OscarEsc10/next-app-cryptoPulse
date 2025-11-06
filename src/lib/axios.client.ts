import axios from "axios";

const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '';
const BASE_URL = "https://api.coingecko.com/api/v3";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(COINGECKO_API_KEY && { "X-CoinGecko-Api-Key": COINGECKO_API_KEY }),
  },
});
