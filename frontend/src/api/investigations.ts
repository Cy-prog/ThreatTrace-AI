import { apiClient } from './client';
import { Investigation, InvestigationPriority, InvestigationStatus } from '../types/investigation';
import { PagedResponse } from './threats';

export const investigationsApi = {
  getInvestigations: async (params?: { status?: string; priority?: string; page?: number; size?: number }): Promise<PagedResponse<Investigation>> => {
    const { data } = await apiClient.get<PagedResponse<Investigation>>('/investigations', { params });
    return data;
  },

  getById: async (id: string): Promise<Investigation> => {
    const { data } = await apiClient.get<Investigation>(`/investigations/${id}`);
    return data;
  },

  create: async (payload: { threatId: string; title: string; summary?: string; priority: InvestigationPriority; assignedAnalystId?: string }): Promise<Investigation> => {
    const { data } = await apiClient.post<Investigation>('/investigations', payload);
    return data;
  },

  updateStatus: async (id: string, status: InvestigationStatus, resolutionNotes?: string): Promise<Investigation> => {
    const { data } = await apiClient.patch<Investigation>(`/investigations/${id}/status`, { status, resolutionNotes });
    return data;
  },

  addNote: async (id: string, content: string): Promise<Investigation> => {
    const { data } = await apiClient.post<Investigation>(`/investigations/${id}/notes`, { content });
    return data;
  },
};
