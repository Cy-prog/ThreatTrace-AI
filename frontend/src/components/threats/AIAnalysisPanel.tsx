import React from 'react';
import { ThreatAnalysis } from '../../types/threat';
import { Badge } from '../common/Badge';
import { Cpu, Activity, Clock, Flame, AlertCircle } from 'lucide-react';

interface AIAnalysisPanelProps {
  analysis?: ThreatAnalysis;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="p-6 rounded border border-surface-border bg-surface-card text-center text-slate-500 font-mono text-xs">
        Analysis pending or pipeline execution incomplete.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded border border-surface-border bg-surface-card">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Predicted Category</div>
          <div className="text-sm font-bold text-slate-100 font-mono mt-0.5 truncate">
            {analysis.predictedCategory}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">
            {Math.round(analysis.confidence * 100)}% Confidence
          </div>
        </div>

        <div className="p-3 rounded border border-surface-border bg-surface-card">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Threat Severity</div>
          <div className="mt-1">
            <Badge severity={analysis.severity}>{analysis.severity}</Badge>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Score: {analysis.riskScore}/100
          </div>
        </div>

        <div className="p-3 rounded border border-surface-border bg-surface-card">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Sentiment & Tone</div>
          <div className="text-sm font-semibold text-slate-200 font-mono mt-0.5">
            {analysis.sentimentLabel}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Polarity: {analysis.sentimentScore}
          </div>
        </div>

        <div className="p-3 rounded border border-surface-border bg-surface-card">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Urgency Signal</div>
          <div className="text-sm font-semibold text-orange-400 font-mono mt-0.5 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            {Math.round(analysis.urgencyScore * 100)}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {analysis.urgencyScore > 0.7 ? 'High Action Window' : 'Standard Window'}
          </div>
        </div>
      </div>

      {/* AI Explainable Summary */}
      <div className="p-4 rounded border border-surface-border bg-surface-200/60 space-y-1.5">
        <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          Explainable Analytical Summary
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {analysis.explanationSummary}
        </p>
      </div>

      {/* Detected Analytical Indicators */}
      <div>
        <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wide mb-2.5 flex items-center justify-between">
          <span>Triggered Analytical Threat Indicators ({analysis.indicators.length})</span>
          <span className="text-[10px] text-slate-500 font-normal">Evidence Snippets</span>
        </div>

        {analysis.indicators.length > 0 ? (
          <div className="space-y-2">
            {analysis.indicators.map((ind, idx) => (
              <div
                key={ind.id || idx}
                className="p-3 rounded border border-surface-border bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="category">{ind.indicatorType}</Badge>
                    <span className="font-semibold text-slate-200">{ind.label}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400 font-mono bg-surface-200/90 px-2 py-1 rounded border border-surface-border/50">
                    "{ind.evidenceSnippet}"
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Signal Weight</span>
                  <span className="text-xs font-bold text-cyan-400">{Math.round(ind.weight * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono p-3 rounded bg-surface-card border border-surface-border">
            No high-urgency indicators detected.
          </div>
        )}
      </div>

      {/* Model Version Telemetry (Requirement #17: Never hide the model version) */}
      <div className="p-3 rounded border border-surface-border bg-surface-card/40 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-500" />
          <span>Deployed Pipeline: <strong>{analysis.modelName}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span>Version: <strong>{analysis.modelVersion}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Analyzed: {new Date(analysis.analyzedAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
