import { apiClient } from '@/lib/api-client';
import { Supplier } from '@/types/supplier';

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await apiClient.get('/suppliers');
    return data;
  },

  getOne: async (id: string): Promise<Supplier> => {
    const { data } = await apiClient.get(`/suppliers/${id}`);
    return data;
  },

  create: async (payload: {
    companyName: string;
    vatId: string;
    country: string;
    contactEmail: string;
  }): Promise<Supplier> => {
    const { data } = await apiClient.post('/suppliers', payload);
    return data;
  },

  submit: async (id: string): Promise<Supplier> => {
    const { data } = await apiClient.post(`/suppliers/${id}/submit`);
    return data;
  },

  approve: async (id: string): Promise<Supplier> => {
    const { data } = await apiClient.post(`/suppliers/${id}/approve`);
    return data;
  },

  reject: async (id: string, reason: string): Promise<Supplier> => {
    const { data } = await apiClient.post(`/suppliers/${id}/reject`, { reason });
    return data;
  },
};