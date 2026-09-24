import { SeverityLevel } from './threat';

export interface DashboardKPI {
  totalThreats: number;
  highRiskThreats: number;
  activeInvestigations: number;
  openAlerts: number;
  requiringReview: number;
  averageRiskScore: number;
  severityDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  sourceDistribution: Record<string, number>;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  threatId: string;
  threatReference: string;
  source: string;
  category: string;
  severity: SeverityLevel;
  riskScore: number;
  status: string;
  analyst: string;
  location?: string;
  snippet: string;
}

export interface CorrelationGraphData {
  nodes: {
    id: string;
    label: string;
    type: string;
    severity?: string;
    riskScore?: number;
  }[];
  links: {
    source: string;
    target: string;
    relation: string;
    weight: number;
  }[];
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress?: string;
  metadata?: string;
  createdAt: string;
}

export interface ModelVersion {
  id: string;
  modelName: string;
  modelVersion: string;
  modelType: string;
  trainingDataset: string;
  evaluationMetrics: string;
  status: string;
  deployedAt: string;
}
