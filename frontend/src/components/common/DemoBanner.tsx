import React from 'react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/60 border-b border-amber-600/30 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between font-mono">
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[10px] uppercase font-bold tracking-widest">
          DEMO ENVIRONMENT
        </span>
        <span>All displayed threat signals and incident records are synthetic demo fixtures.</span>
      </div>
      <span className="text-[11px] text-amber-400/80 hidden md:inline">
        AI ASSISTED NON-AUTONOMOUS THREAT ANALYSIS
      </span>
    </div>
  );
};

export default DemoBanner;
