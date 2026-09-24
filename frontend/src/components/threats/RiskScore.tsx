import React from 'react';
import { SeverityLevel, SignalBreakdownItem } from '../../types/threat';
import { Badge } from '../common/Badge';
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface RiskScoreProps {
  score: number;
  severity: SeverityLevel;
  signalBreakdown: SignalBreakdownItem[];
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  severity,
  signalBreakdown,
}) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-rose-400 stroke-rose-500';
    if (score >= 60) return 'text-orange-400 stroke-orange-500';
    if (score >= 35) return 'text-amber-400 stroke-amber-500';
    return 'text-emerald-400 stroke-emerald-500';
  };

  const getMeterGradient = () => {
    if (score >= 80) return 'bg-rose-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 35) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="p-5 rounded border border-surface-border bg-surface-card space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
            Calculated Analytical Risk Index
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-extrabold font-mono ${getScoreColor()}`}>
              {score}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
            <Badge severity={severity} className="ml-2">
              {severity}
            </Badge>
          </div>
        </div>

        {score >= 80 ? (
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        ) : score >= 60 ? (
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        ) : (
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getMeterGradient()} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        />
      </div>

      {/* Contributing Signals Breakdown (Explainability) */}
      <div>
        <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wide mb-2.5 flex items-center justify-between">
          <span>Signal Contribution Factors</span>
          <span className="text-[10px] text-slate-500 lowercase font-normal">explainable breakdown</span>
        </div>

        {signalBreakdown && signalBreakdown.length > 0 ? (
          <div className="space-y-1.5 font-mono text-xs">
            {signalBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2.5 rounded bg-surface-200/60 border border-surface-border text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">+{item.points}</span>
                  <span className="text-slate-200">{item.signal}</span>
                </div>
                <span className="text-[11px] text-slate-400 truncate max-w-xs">{item.detail}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono py-2">
            Baseline threat classification scoring applied.
          </div>
        )}
      </div>

      {/* Mandated Explainability Disclaimer */}
      <div className="pt-3 border-t border-surface-border flex items-start gap-2 text-[10px] text-slate-500 font-sans leading-relaxed">
        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <span>
          <strong>Analytical Governance Notice:</strong> The Risk Score represents an objective weighted calculation of linguistic, temporal, and entity indicators extracted from the report. It does not predict future real-world certainty and is intended solely to prioritize human investigator workflow.
        </span>
      </div>
    </div>
  );
};
