import { apiClient } from '@/lib/api-client';
import { SupplierRole } from '@/types/supplier';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: SupplierRole | string;
}

export const authService = {
  login: async (email: string, password: string): Promise<{ user: AuthUser }> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<void> => {
    await apiClient.post('/auth/refresh');
  },

  me: async (): Promise<{ user: AuthUser }> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
