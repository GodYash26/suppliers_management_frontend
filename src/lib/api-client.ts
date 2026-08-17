import axios from 'axios';
import { parseApiError } from './api-error';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject x-user-id from localStorage on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    if (userId) config.headers['x-user-id'] = userId;
  }
  return config;
});

// Response interceptor to attach normalized error format
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = parseApiError(error);
    if (error && typeof error === 'object') {
      (error as any).normalizedError = normalized;
    }
    return Promise.reject(error);
  }
);