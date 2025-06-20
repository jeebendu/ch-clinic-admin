
import axios from 'axios';
import { getEnvVariable } from '../utils/envUtils';
import { getTenantId } from '../utils/tenantUtils';

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
    config.headers['X-App-Token'] = X_APP_TOKEN; // Uncommented this line
    config.headers['tenant'] = getTenantId();

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
      config.headers['Branch'] = selectedBranch;
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
      console.error('Unauthorized access: Token may have expired');
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedClinic');
      localStorage.removeItem('selectedBranch');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    // Handle 500 errors that are JWT related (backend sends 500 instead of 401 for expired JWT)
    if (error.response && error.response.status === 500) {
      const errorMessage = error.response.data?.message || '';
      const errorTrace = error.response.data?.trace || '';
      
      // Check if it's a JWT expiration error
      if (errorMessage.includes('JWT expired') || errorTrace.includes('ExpiredJwtException')) {
        console.error('JWT Token expired (500 error):', errorMessage);
        
        // Clear local storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedClinic');
        localStorage.removeItem('selectedBranch');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default http;
