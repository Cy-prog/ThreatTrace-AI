import React from 'react';
import { TimelineEvent } from '../../types/dashboard';
import { Badge } from '../common/Badge';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ThreatTimelineProps {
  events: TimelineEvent[];
}

export const ThreatTimeline: React.FC<ThreatTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-3">
      {events.map((e) => (
        <div
          key={e.id}
          className="p-3 rounded border border-surface-border bg-surface-card hover:bg-surface-100/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
        >
          {/* Left Block */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-slate-600">|</span>
              <Link to={`/app/threats/${e.threatId}`} className="font-bold text-cyan-400 hover:underline">
                {e.threatReference}
              </Link>
              <span className="px-1.5 py-0.2 rounded bg-surface-200 border border-surface-border text-[10px] text-slate-300">
                {e.source}
              </span>
              <Badge severity={e.severity} size="sm">
                {e.severity}
              </Badge>
              <Badge variant="status" size="sm">
                {e.status}
              </Badge>
            </div>

            <p className="text-slate-300 text-xs font-sans line-clamp-1">
              {e.snippet}
            </p>

            <div className="text-[11px] text-slate-500 flex items-center gap-4 flex-wrap">
              <span>Category: <strong className="text-slate-300">{e.category}</strong></span>
              <span>Reviewer: <strong className="text-slate-300">{e.analyst}</strong></span>
              {e.location && (
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-cyan-500" />
                  {e.location}
                </span>
              )}
            </div>
          </div>

          {/* Right Block: Risk Score Gauge */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Risk Index</span>
              <span
                className={`text-base font-bold ${
                  e.riskScore >= 80
                    ? 'text-rose-400'
                    : e.riskScore >= 60
                    ? 'text-orange-400'
                    : e.riskScore >= 35
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {e.riskScore}
                <span className="text-[10px] text-slate-600 font-normal">/100</span>
              </span>
            </div>

            <Link
              to={`/app/threats/${e.threatId}`}
              className="p-1.5 rounded border border-surface-border bg-surface-100 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
              title="Open full threat workspace"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
