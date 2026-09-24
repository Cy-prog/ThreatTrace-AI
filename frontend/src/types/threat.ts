export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ThreatStatus = 'PENDING' | 'ANALYZED' | 'IN_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'FALSE_POSITIVE';

export type SourceType = 'EMAIL' | 'WEB_REPORT' | 'SOCIAL_MEDIA' | 'MESSAGE' | 'USER_REPORT' | 'API' | 'FILE_UPLOAD';

export interface ThreatEntity {
  id: string;
  entityType: string;
  entityValue: string;
  confidence: number;
  startOffset: number;
  endOffset: number;
  sourceSpan: string;
}

export interface ThreatIndicator {
  id: string;
  indicatorType: string;
  label: string;
  weight: number;
  evidenceSnippet: string;
}

export interface SignalBreakdownItem {
  signal: string;
  points: number;
  detail: string;
}

export interface ThreatAnalysis {
  id: string;
  predictedCategory: string;
  confidence: number;
  riskScore: number;
  severity: SeverityLevel;
  sentimentLabel: string;
  sentimentScore: number;
  urgencyScore: number;
  explanationSummary: string;
  signalBreakdown: SignalBreakdownItem[];
  modelName: string;
  modelVersion: string;
  humanReviewRequired: boolean;
  analyzedAt: string;
  entities: ThreatEntity[];
  indicators: ThreatIndicator[];
}

export interface ThreatSummary {
  id: string;
  threatReference: string;
  sourceType: SourceType;
  sourceReference: string;
  status: ThreatStatus;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  geoVerified: boolean;
  createdAt: string;
  category: string;
  severity: SeverityLevel;
  riskScore: number;
  confidence: number;
}

export interface ThreatDetail {
  id: string;
  threatReference: string;
  sourceType: SourceType;
  sourceReference: string;
  rawContent: string;
  status: ThreatStatus;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  geoVerified: boolean;
  reportedByUsername?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  analysis?: ThreatAnalysis;
}

export interface ThreatIngestPayload {
  sourceType: SourceType;
  sourceReference?: string;
  rawContent: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
}
