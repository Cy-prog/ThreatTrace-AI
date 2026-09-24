import React from 'react';
import { ThreatSummary } from '../../types/threat';
import { Badge } from '../common/Badge';
import { ChevronRight, MapPin, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ThreatTableProps {
  threats: ThreatSummary[];
  onSelectThreat?: (threat: ThreatSummary) => void;
}

export const ThreatTable: React.FC<ThreatTableProps> = ({ threats, onSelectThreat }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto border border-surface-border rounded-md bg-surface-card shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-surface-border bg-surface-100/70 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4">Threat ID</th>
            <th className="py-3 px-4">Ingested At</th>
            <th className="py-3 px-4">Source</th>
            <th className="py-3 px-4">Classification</th>
            <th className="py-3 px-4 text-center">Severity</th>
            <th className="py-3 px-4 text-center">Risk Score</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border text-xs font-mono">
          {threats.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelectThreat ? onSelectThreat(t) : navigate(`/app/threats/${t.id}`)}
              className="hover:bg-surface-100/50 transition-colors cursor-pointer group"
            >
              {/* Reference */}
              <td className="py-3 px-4 font-bold text-cyan-400 group-hover:text-cyan-300">
                {t.threatReference}
              </td>

              {/* Timestamp */}
              <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>

              {/* Source */}
              <td className="py-3 px-4 text-slate-300">
                <span className="px-1.5 py-0.5 rounded bg-surface-200 border border-surface-border text-[10px]">
                  {t.sourceType}
                </span>
              </td>

              {/* Classification */}
              <td className="py-3 px-4 font-medium text-slate-200">
                {t.category}
              </td>

              {/* Severity */}
              <td className="py-3 px-4 text-center">
                <Badge severity={t.severity} size="sm">
                  {t.severity}
                </Badge>
              </td>

              {/* Risk Score */}
              <td className="py-3 px-4 text-center">
                <span
                  className={`font-bold text-sm ${
                    t.riskScore >= 80
                      ? 'text-rose-400'
                      : t.riskScore >= 60
                      ? 'text-orange-400'
                      : t.riskScore >= 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {t.riskScore}
                </span>
              </td>

              {/* Location */}
              <td className="py-3 px-4 text-slate-400 max-w-[150px] truncate">
                {t.locationName ? (
                  <span className="flex items-center gap-1 text-[11px] text-slate-300">
                    <MapPin className="w-3 h-3 text-cyan-500 shrink-0" />
                    <span className="truncate">{t.locationName}</span>
                  </span>
                ) : (
                  <span className="text-slate-600 text-[10px]">None Detected</span>
                )}
              </td>

              {/* Status */}
              <td className="py-3 px-4 text-center">
                <Badge variant="status" size="sm">
                  {t.status}
                </Badge>
              </td>

              {/* Action */}
              <td className="py-3 px-4 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/threats/${t.id}`);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-surface-50 inline-flex items-center gap-1 text-xs"
                >
                  <span>Investigate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
