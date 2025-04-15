
import axios from 'axios';
import { getEnvVariable } from '../utils/envUtils';

const BASE_URL = getEnvVariable('BASE_URL');
const X_APP_TOKEN = getEnvVariable('X_APP_TOKEN');

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
  allowAbsoluteUrls: true,
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
    return Promise.reject(error);
  }
);

export default http;
