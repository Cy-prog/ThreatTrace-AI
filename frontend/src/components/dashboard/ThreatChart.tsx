import React from 'react';

interface ThreatChartProps {
  categoryDistribution: Record<string, number>;
  severityDistribution: Record<string, number>;
}

export const ThreatChart: React.FC<ThreatChartProps> = ({
  categoryDistribution,
  severityDistribution,
}) => {
  const categories = Object.entries(categoryDistribution);
  const totalCategoryIncidents = categories.reduce((acc, [, val]) => acc + val, 0) || 1;

  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500 text-rose-300 border-rose-600/50';
      case 'HIGH': return 'bg-orange-500 text-orange-300 border-orange-600/50';
      case 'MEDIUM': return 'bg-amber-500 text-amber-300 border-amber-600/50';
      default: return 'bg-emerald-500 text-emerald-300 border-emerald-600/50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Breakdown */}
      <div className="p-4 rounded border border-surface-border bg-surface-card space-y-3">
        <div className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center justify-between">
          <span>Threat Category Distribution</span>
          <span className="text-[10px] text-slate-500 font-normal">Active Corpus</span>
        </div>

        <div className="space-y-2">
          {categories.map(([cat, count]) => {
            const pct = Math.round((count / totalCategoryIncidents) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{cat}</span>
                  <span className="text-slate-500">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="p-4 rounded border border-surface-border bg-surface-card space-y-3">
        <div className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center justify-between">
          <span>Severity Tiers Breakdown</span>
          <span className="text-[10px] text-slate-500 font-normal">Analytical Classification</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {severityOrder.map((sev) => {
            const count = severityDistribution[sev] || 0;
            return (
              <div
                key={sev}
                className="p-3 rounded border border-surface-border bg-surface-200/60 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    {sev}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${getSeverityColor(sev).split(' ')[0]}`} />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
