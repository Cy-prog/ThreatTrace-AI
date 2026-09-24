import { apiClient } from './client';
import { Alert } from '../types/alert';
import { PagedResponse } from './threats';

export const alertsApi = {
  getAlerts: async (params?: { status?: string; severity?: string; page?: number; size?: number }): Promise<PagedResponse<Alert>> => {
    const { data } = await apiClient.get<PagedResponse<Alert>>('/alerts', { params });
    return data;
  },

  getById: async (id: string): Promise<Alert> => {
    const { data } = await apiClient.get<Alert>(`/alerts/${id}`);
    return data;
  },

  acknowledge: async (id: string): Promise<Alert> => {
    const { data } = await apiClient.post<Alert>(`/alerts/${id}/acknowledge`);
    return data;
  },
};
