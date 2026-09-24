import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ThreatChart } from '../components/dashboard/ThreatChart';
import { Loading } from '../components/common/Loading';
import { dashboardApi } from '../api/dashboard';
import { DashboardKPI } from '../types/dashboard';

export const Analytics: React.FC = () => {
  const [kpi, setKpi] = useState<DashboardKPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getKPIs();
        setKpi(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer
      title="Operational Analytics & Metrics"
      subtitle="Corpus aggregation metrics, model classification distribution, and threat severity trends."
    >
      {isLoading ? (
        <Loading label="Computing database aggregations..." size="lg" />
      ) : kpi ? (
        <div className="space-y-6">
          <ThreatChart
            categoryDistribution={kpi.categoryDistribution}
            severityDistribution={kpi.severityDistribution}
          />

          {/* Sources Breakdown */}
          <div className="p-5 rounded border border-surface-border bg-surface-card space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
              Ingestion Source Channel Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              {Object.entries(kpi.sourceDistribution || {}).map(([src, count]) => (
                <div key={src} className="p-3 rounded bg-surface-200 border border-surface-border">
                  <span className="text-[10px] text-slate-500 uppercase block">{src}</span>
                  <span className="text-xl font-bold text-cyan-400 mt-1 block">{count}</span>
                  <span className="text-[10px] text-slate-400">Total ingested reports</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
};
