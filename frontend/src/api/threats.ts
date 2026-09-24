import { apiClient } from './client';
import { ThreatDetail, ThreatIngestPayload, ThreatSummary, ThreatStatus } from '../types/threat';

export interface ThreatFilterParams {
  query?: string;
  sourceType?: string;
  status?: string;
  severity?: string;
  category?: string;
  minRisk?: number;
  maxRisk?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const threatsApi = {
  getThreats: async (params?: ThreatFilterParams): Promise<PagedResponse<ThreatSummary>> => {
    const { data } = await apiClient.get<PagedResponse<ThreatSummary>>('/threats', { params });
    return data;
  },

  getThreatById: async (id: string): Promise<ThreatDetail> => {
    const { data } = await apiClient.get<ThreatDetail>(`/threats/${id}`);
    return data;
  },

  ingestThreat: async (payload: ThreatIngestPayload): Promise<ThreatDetail> => {
    const { data } = await apiClient.post<ThreatDetail>('/threats', payload);
    return data;
  },

  reanalyzeThreat: async (id: string): Promise<ThreatDetail> => {
    const { data } = await apiClient.post<ThreatDetail>(`/threats/${id}/reanalyze`);
    return data;
  },

  updateStatus: async (id: string, status: ThreatStatus): Promise<ThreatDetail> => {
    const { data } = await apiClient.patch<ThreatDetail>(`/threats/${id}/status`, { status });
    return data;
  },

  getMapThreats: async (): Promise<ThreatSummary[]> => {
    const { data } = await apiClient.get<ThreatSummary[]>('/threats/map');
    return data;
  },
};
