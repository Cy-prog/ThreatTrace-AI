import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { investigationsApi } from '../api/investigations';
import { Investigation } from '../types/investigation';
import { FolderSearch, Clock, ChevronRight, User, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Investigations: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const navigate = useNavigate();

  const fetchInvestigations = async () => {
    setIsLoading(true);
    try {
      const res = await investigationsApi.getInvestigations({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      });
      setInvestigations(res.content);
    } catch (err) {
      console.error('Failed to load investigations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, [statusFilter, priorityFilter]);

  return (
    <PageContainer
      title="Investigation Workspace"
      subtitle="Active SOC cases, forensic evidence tracking, analyst case notes, and inter-agency resolution."
      actions={
        <Button size="sm" variant="secondary" onClick={fetchInvestigations} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Cases
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="p-3.5 rounded border border-surface-border bg-surface-card flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            {['', 'OPEN', 'IN_REVIEW', 'ESCALATED', 'RESOLVED', 'CLOSED'].map((st) => (
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

        {/* List of Investigations */}
        {isLoading ? (
          <Loading label="Fetching active investigation dossiers..." />
        ) : investigations.length > 0 ? (
          <div className="space-y-3">
            {investigations.map((inv) => (
              <div
                key={inv.id}
                onClick={() => navigate(`/app/investigations/${inv.id}`)}
                className="p-4 rounded border border-surface-border bg-surface-card hover:bg-surface-100/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-cyan-400 text-sm">{inv.investigationReference}</span>
                    <Badge severity={inv.priority} size="sm">{inv.priority}</Badge>
                    <Badge variant="status" size="sm">{inv.status}</Badge>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">Threat Ref: <strong className="text-slate-200">{inv.threatReference}</strong></span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 font-sans">{inv.title}</h3>
                  {inv.summary && <p className="text-xs text-slate-400 font-sans line-clamp-1">{inv.summary}</p>}

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-400" />
                      Analyst: <strong className="text-slate-300">{inv.assignedAnalystName || 'Unassigned'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Opened: {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                    <span>Notes: {inv.notes?.length || 0}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button size="sm" variant="secondary" icon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Open Dossier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Investigations"
            description="No cases match current filter criteria. You can open an investigation directly from any ingested threat report."
          />
        )}
      </div>
    </PageContainer>
  );
};
