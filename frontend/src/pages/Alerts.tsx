import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { alertsApi } from '../api/alerts';
import { Alert } from '../types/alert';
import { AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await alertsApi.getAlerts({
        status: statusFilter || undefined,
        severity: severityFilter || undefined,
      });
      setAlerts(res.content);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const handleAcknowledge = async (id: string) => {
    try {
      const updated = await alertsApi.acknowledge(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error('Failed to acknowledge alert', err);
    }
  };

  return (
    <PageContainer
      title="Security Operations Alerts"
      subtitle="Automated high-consequence threat alerts triggered by analytical risk thresholds and critical infrastructure targets."
      actions={
        <Button size="sm" variant="secondary" onClick={fetchAlerts} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Alerts
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="p-3.5 rounded border border-surface-border bg-surface-card flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            {['', 'OPEN', 'ACKNOWLEDGED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                    : 'bg-surface-200 text-slate-400 border-surface-border hover:text-slate-200'
                }`}
              >
                {st || 'ALL'}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Table */}
        {isLoading ? (
          <Loading label="Querying alert engine..." />
        ) : alerts.length > 0 ? (
          <div className="overflow-x-auto border border-surface-border rounded-md bg-surface-card">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-surface-border bg-surface-100/70 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Alert ID</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Rule Condition</th>
                  <th className="py-3 px-4">Origin Threat</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Triggered At</th>
                  <th className="py-3 px-4">Acknowledged By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-100/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-rose-400">{a.alertReference}</td>
                    <td className="py-3 px-4">
                      <Badge severity={a.severity} size="sm">{a.severity}</Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{a.alertType}</td>
                    <td className="py-3 px-4">
                      <Link to={`/app/threats/${a.threatId}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>{a.threatReference}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="status" size="sm">{a.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {a.acknowledgedByName ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {a.acknowledgedByName}
                        </span>
                      ) : (
                        <span className="text-slate-600">Pending Acknowledgment</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {a.status === 'OPEN' ? (
                        <Button size="sm" variant="outline" onClick={() => handleAcknowledge(a.id)}>
                          Acknowledge
                        </Button>
                      ) : (
                        <span className="text-slate-500 text-[10px]">VERIFIED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Active Alerts"
            description="The alert engine has not detected unacknowledged threshold violations."
          />
        )}
      </div>
    </PageContainer>
  );
};
