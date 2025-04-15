
import axios from 'axios';

const apiService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiService;
