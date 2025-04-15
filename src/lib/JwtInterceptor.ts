
import axios from 'axios';
import { getEnvVariable } from '../utils/envUtils';

const BASE_URL = getEnvVariable('BASE_URL');
const X_APP_TOKEN = getEnvVariable('X_APP_TOKEN');

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Add headers to every request
    config.headers['Accept'] = 'application/json';
    config.headers['ngrok-skip-browser-warning'] = '1';
    config.headers['X-App-Token'] = X_APP_TOKEN;

    // Add token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add selected clinic and branch to headers if available
    const selectedClinic = localStorage.getItem('selectedClinic');
    const selectedBranch = localStorage.getItem('selectedBranch');

    if (selectedClinic) {
      config.headers['X-Clinic-ID'] = selectedClinic;
    }

    if (selectedBranch) {
      config.headers['X-Branch-ID'] = selectedBranch;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default http;
