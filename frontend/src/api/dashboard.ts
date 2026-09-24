import { apiClient } from './client';
import { DashboardKPI, TimelineEvent, CorrelationGraphData, AuditLog, ModelVersion } from '../types/dashboard';
import { User } from '../types/auth';
import { PagedResponse } from './threats';

export const dashboardApi = {
  getKPIs: async (): Promise<DashboardKPI> => {
    const { data } = await apiClient.get<DashboardKPI>('/dashboard/kpi');
    return data;
  },

  getTimeline: async (limit: number = 30): Promise<TimelineEvent[]> => {
    const { data } = await apiClient.get<TimelineEvent[]>('/dashboard/timeline', { params: { limit } });
    return data;
  },

  getCorrelationGraph: async (): Promise<CorrelationGraphData> => {
    const { data } = await apiClient.get<CorrelationGraphData>('/correlations/graph');
    return data;
  },

  getAuditLogs: async (params?: { actor?: string; action?: string; resourceType?: string; page?: number; size?: number }): Promise<PagedResponse<AuditLog>> => {
    const { data } = await apiClient.get<PagedResponse<AuditLog>>('/audit', { params });
    return data;
  },

  getModels: async (): Promise<ModelVersion[]> => {
    const { data } = await apiClient.get<ModelVersion[]>('/models');
    return data;
  },

  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },
};
