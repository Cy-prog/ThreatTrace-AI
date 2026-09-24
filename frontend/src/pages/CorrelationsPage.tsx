import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { dashboardApi } from '../api/dashboard';
import { CorrelationGraphData } from '../types/dashboard';
import { GitBranch, RefreshCw, Layers, ShieldAlert, MapPin, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CorrelationsPage: React.FC = () => {
  const [graphData, setGraphData] = useState<CorrelationGraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getCorrelationGraph();
      setGraphData(data);
    } catch (err) {
      console.error('Failed to load correlation graph', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <PageContainer
      title="Relational Threat Intelligence Graph"
      subtitle="Multi-signal correlation mapping links between threat signals, common facilities, targeted corporations, and extortion vectors."
      actions={
        <Button size="sm" variant="secondary" onClick={fetchGraph} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Recalculate Correlations
        </Button>
      }
    >
      {isLoading ? (
        <Loading label="Computing TF-IDF vector distances and entity intersections..." size="lg" />
      ) : graphData && graphData.nodes.length > 0 ? (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded border border-surface-border bg-surface-card font-mono text-xs">
              <span className="text-slate-500 uppercase block">Active Network Nodes</span>
              <span className="text-2xl font-bold text-slate-100 mt-1 block">{graphData.nodes.length}</span>
              <span className="text-[10px] text-slate-400">Threats, facilities, entities</span>
            </div>

            <div className="p-4 rounded border border-surface-border bg-surface-card font-mono text-xs">
              <span className="text-slate-500 uppercase block">Correlated Relationships</span>
              <span className="text-2xl font-bold text-cyan-400 mt-1 block">{graphData.links.length}</span>
              <span className="text-[10px] text-slate-400">Shared targets & semantic links</span>
            </div>

            <div className="p-4 rounded border border-surface-border bg-surface-card font-mono text-xs">
              <span className="text-slate-500 uppercase block">Correlation Engine</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">HYBRID TF-IDF + ENTITY OVERLAP</span>
              <span className="text-[10px] text-slate-400">Deterministic explainable matching</span>
            </div>
          </div>

          {/* Correlation Links Grid */}
          <div className="p-5 rounded border border-surface-border bg-surface-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-200">
                Discovered Intelligence Links &amp; Overlaps
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Sorted by composite correlation strength
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {graphData.links.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded border border-surface-border bg-surface-200/80 space-y-2 font-mono text-xs hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface-100 border border-surface-border text-cyan-400 font-bold text-[11px]">
                      {link.relation}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      Match: <strong className="text-cyan-400">{Math.round(link.weight * 100)}%</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-border/50 text-[11px] text-slate-400">
                    <div className="truncate max-w-[45%]">
                      <span className="text-slate-500 block text-[9px] uppercase">Node A</span>
                      <strong className="text-slate-200 truncate">{link.source}</strong>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <div className="truncate max-w-[45%] text-right">
                      <span className="text-slate-500 block text-[9px] uppercase">Node B</span>
                      <strong className="text-slate-200 truncate">{link.target}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Correlation Vectors"
          description="Additional threat reports and entity overlaps are needed to formulate relational correlation graphs."
        />
      )}
    </PageContainer>
  );
};
