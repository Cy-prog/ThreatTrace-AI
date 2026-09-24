import { SeverityLevel } from './threat';

export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  id: string;
  alertReference: string;
  threatId: string;
  threatReference: string;
  threatSnippet?: string;
  alertType: string;
  severity: SeverityLevel;
  status: AlertStatus;
  acknowledgedById?: string;
  acknowledgedByName?: string;
  acknowledgedAt?: string;
  createdAt: string;
}
