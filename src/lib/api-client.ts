import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { parseApiError } from './api-error';

const LOCAL_API_URL = 'http://localhost:4000/api';
const PRODUCTION_API_URL = 'https://suppliers-management-backend.onrender.com/api';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type NormalizedErrorCarrier = {
  normalizedError?: ReturnType<typeof parseApiError>;
};

function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL;

  if (typeof window === 'undefined') {
    return configuredUrl;
  }

  const isLocalApp =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  const pointsToLocalApi =
    configuredUrl.includes('localhost') || configuredUrl.includes('127.0.0.1');

  if (!isLocalApp && pointsToLocalApi) {
    return PRODUCTION_API_URL;
  }

  return configuredUrl;
}

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
}

// Response interceptor to handle 401 with automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (typeof window !== 'undefined') {
          window.location.assign('/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const normalized = parseApiError(error);
    if (error && typeof error === 'object') {
      (error as NormalizedErrorCarrier).normalizedError = normalized;
    }
    return Promise.reject(error);
  }
);
