import { SeverityLevel } from './threat';

export type InvestigationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type InvestigationStatus = 'OPEN' | 'IN_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'FALSE_POSITIVE' | 'CLOSED';

export interface InvestigationNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Investigation {
  id: string;
  investigationReference: string;
  threatId: string;
  threatReference: string;
  threatContentSnippet?: string;
  assignedAnalystId?: string;
  assignedAnalystName?: string;
  priority: InvestigationPriority;
  status: InvestigationStatus;
  title: string;
  summary?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  notes: InvestigationNote[];
}
