import axios from 'axios';

const normalizeApiBaseUrl = (value) => {
  const fallback = 'http://127.0.0.1:8001/api';
  const configuredUrl = (value || fallback).trim().replace(/\/+$/, '');
  return configuredUrl.replace(/(\/api)+$/i, '/api');
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof config.url === 'string') {
    config.url = config.url.replace(/^\/api(?=\/)/i, '');
  }

  const token = localStorage.getItem('fitmanager_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
