import axios from 'axios';
import { API_BASE_URL, API_KEY } from './api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-CoinAPI-Key': API_KEY
    }
});

export default apiClient;