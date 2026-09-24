import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { KPICard } from '../components/dashboard/KPICard';
import { ThreatTimeline } from '../components/dashboard/ThreatTimeline';
import { ThreatChart } from '../components/dashboard/ThreatChart';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { dashboardApi } from '../api/dashboard';
import { DashboardKPI, TimelineEvent } from '../types/dashboard';
import {
  ShieldAlert,
  Radio,
  FolderSearch,
  AlertTriangle,
  FileCheck,
  Activity,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Dashboard: React.FC = () => {
  const [kpi, setKpi] = useState<DashboardKPI | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [kpiRes, timelineRes] = await Promise.all([
        dashboardApi.getKPIs(),
        dashboardApi.getTimeline(25),
      ]);
      setKpi(kpiRes);
      setTimeline(timelineRes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect to ThreatTrace backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <PageContainer
      title="SOC Operations Center"
      subtitle="Real-time analytical threat intelligence monitoring, explainable risk scoring, and active alert feeds."
      actions={
        <Button
          size="sm"
          variant="secondary"
          onClick={fetchDashboardData}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Feeds
        </Button>
      }
    >
      {isLoading ? (
        <Loading label="Aggregating database KPI metrics and active threat feeds..." size="lg" />
      ) : error ? (
        <EmptyState
          title="Telemetry Feed Error"
          description={error}
          actionLabel="Retry Connection"
          onAction={fetchDashboardData}
        />
      ) : (
        <div className="space-y-6">
          {/* Top KPI Row (Requirement #5) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPICard
              label="Total Reports"
              value={kpi?.totalThreats ?? 0}
              subValue="Database corpus"
              icon={<Radio className="w-4 h-4 text-cyan-400" />}
              highlight="cyan"
            />
            <KPICard
              label="High-Risk Reports"
              value={kpi?.highRiskThreats ?? 0}
              subValue="Score >= 60"
              icon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
              highlight="rose"
            />
            <KPICard
              label="Active Cases"
              value={kpi?.activeInvestigations ?? 0}
              subValue="In review / open"
              icon={<FolderSearch className="w-4 h-4 text-amber-400" />}
              highlight="amber"
            />
            <KPICard
              label="Open Alerts"
              value={kpi?.openAlerts ?? 0}
              subValue="Requires ack"
              icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
              highlight="rose"
            />
            <KPICard
              label="Require Review"
              value={kpi?.requiringReview ?? 0}
              subValue="Human in loop"
              icon={<FileCheck className="w-4 h-4 text-cyan-400" />}
              highlight="cyan"
            />
            <KPICard
              label="Avg Risk Index"
              value={`${kpi?.averageRiskScore ?? 0}`}
              subValue="Out of 100"
              icon={<Activity className="w-4 h-4 text-emerald-400" />}
              highlight="emerald"
            />
          </div>

          {/* Analytical Distribution Charts (Requirement #27) */}
          {kpi && (
            <ThreatChart
              categoryDistribution={kpi.categoryDistribution}
              severityDistribution={kpi.severityDistribution}
            />
          )}

          {/* Real-time Threat Activity Timeline (Requirement #6) */}
          <div className="p-5 rounded-md border border-surface-border bg-surface-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Live Threat Activity Stream
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Chronological ingestion stream with analytical categories, severity tiers, and reviewer assignments.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Displaying latest {timeline.length} events
              </span>
            </div>

            {timeline.length > 0 ? (
              <ThreatTimeline events={timeline} />
            ) : (
              <EmptyState
                title="No Threat Reports Ingested"
                description="The threat intelligence database currently contains zero incident records. Ingest a report to initiate AI analysis."
              />
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
