// src/api/uploadHttp.ts
import axios from 'axios';
import { getEnvVariable } from '../utils/envUtils';
import { getTenantId } from '../utils/tenantUtils';

const BASE_URL = getEnvVariable('BASE_URL');
const X_APP_TOKEN = getEnvVariable('X_APP_TOKEN');

const uploadHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
  // No Content-Type set here: Axios handles it automatically for FormData
});

// Request interceptor
uploadHttp.interceptors.request.use(
  (config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['ngrok-skip-browser-warning'] = '1';
    config.headers['X-App-Token'] = X_APP_TOKEN;
    config.headers['tenant'] = getTenantId();

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
  (error) => Promise.reject(error)
);

// Response interceptor with full JWT expiration handling
uploadHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || '';
    const errorTrace = error.response?.data?.trace || '';

    const redirectToLogin = () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedClinic');
      localStorage.removeItem('selectedBranch');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    };

    if (status === 401) {
      console.error('Unauthorized access: Token may have expired');
      redirectToLogin();
    }

    if (status === 500) {
      if (
        errorMessage.includes('JWT expired') ||
        errorTrace.includes('ExpiredJwtException')
      ) {
        console.error('JWT Token expired (500 error):', errorMessage);
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default uploadHttp;
