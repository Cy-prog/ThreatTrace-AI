import React from 'react';
import { SeverityLevel } from '../../types/threat';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'severity' | 'status' | 'category' | 'entity' | 'neutral';
  severity?: SeverityLevel | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  severity,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (variant === 'severity' || severity) {
    const sev = (severity || children)?.toString().toUpperCase();
    if (sev === 'CRITICAL') {
      colorClasses = 'bg-rose-950/80 text-rose-300 border-rose-600/60 shadow-[0_0_8px_rgba(244,63,94,0.25)]';
    } else if (sev === 'HIGH') {
      colorClasses = 'bg-orange-950/80 text-orange-300 border-orange-600/60';
    } else if (sev === 'MEDIUM') {
      colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-600/60';
    } else {
      colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60';
    }
  } else if (variant === 'status') {
    const st = children?.toString().toUpperCase();
    if (st === 'OPEN' || st === 'PENDING') {
      colorClasses = 'bg-amber-950/70 text-amber-300 border-amber-500/40';
    } else if (st === 'IN_REVIEW' || st === 'ANALYZED') {
      colorClasses = 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40';
    } else if (st === 'RESOLVED' || st === 'CLOSED') {
      colorClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    } else if (st === 'FALSE_POSITIVE') {
      colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
    } else {
      colorClasses = 'bg-rose-950/70 text-rose-300 border-rose-500/40';
    }
  } else if (variant === 'entity') {
    colorClasses = 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60 hover:bg-cyan-900/50';
  } else if (variant === 'category') {
    colorClasses = 'bg-slate-800/90 text-slate-200 border-slate-700 font-mono';
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border uppercase tracking-wider font-mono ${sizeClasses} ${colorClasses} ${className}`}>
      {children}
    </span>
  );
};
