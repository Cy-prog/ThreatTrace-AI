import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: string;
  highlight?: 'rose' | 'amber' | 'cyan' | 'emerald';
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subValue,
  icon,
  highlight = 'cyan',
}) => {
  const highlightStyles = {
    rose: 'border-rose-900/50 bg-rose-950/10 text-rose-400',
    amber: 'border-amber-900/50 bg-amber-950/10 text-amber-400',
    cyan: 'border-cyan-900/50 bg-cyan-950/10 text-cyan-400',
    emerald: 'border-emerald-900/50 bg-emerald-950/10 text-emerald-400',
  }[highlight];

  return (
    <div className="p-4 rounded-md border border-surface-border bg-surface-card hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
          {label}
        </span>
        <div className={`p-2 rounded border ${highlightStyles}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
          {value}
        </span>
        {subValue && (
          <span className="text-[11px] font-mono text-slate-500">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};
