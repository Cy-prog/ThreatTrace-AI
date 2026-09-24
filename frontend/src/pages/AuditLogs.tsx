import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { dashboardApi } from '../api/dashboard';
import { AuditLog } from '../types/dashboard';
import { History, Shield, RefreshCw } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getAuditLogs({ size: 100 });
      setLogs(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <PageContainer
      title="Security Audit Log Trail"
      subtitle="Immutable cryptographic audit trail recording all SOC analyst actions, classifications, case updates, and access attempts."
      actions={
        <Button size="sm" variant="secondary" onClick={fetchLogs} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Audit Trail
        </Button>
      }
    >
      {isLoading ? (
        <Loading label="Querying security audit store..." />
      ) : logs.length > 0 ? (
        <div className="overflow-x-auto border border-surface-border rounded-md bg-surface-card font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-100/70 text-[10px] uppercase text-slate-400">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / Actor</th>
                <th className="py-3 px-4">Security Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Origin IP</th>
                <th className="py-3 px-4">Audit Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-100/40 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-cyan-400">{log.actor}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-1.5 py-0.5 rounded bg-surface-200 border border-surface-border text-slate-200 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    {log.resourceType}: <span className="text-slate-400">{log.resourceId}</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">{log.ipAddress || 'internal'}</td>
                  <td className="py-2.5 px-4 text-slate-400 text-[10px] max-w-xs truncate">
                    {log.metadata || '{}'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Audit Trail Empty" description="No audit events found in storage." />
      )}
    </PageContainer>
  );
};
