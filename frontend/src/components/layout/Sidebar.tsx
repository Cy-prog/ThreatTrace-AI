import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Radio,
  AlertTriangle,
  FolderSearch,
  MapPin,
  GitBranch,
  BarChart3,
  Cpu,
  History,
  Users,
  Settings,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const Sidebar: React.FC = () => {
  const { hasRole } = useAuth();

  const navSection = (title: string, items: { to: string; label: string; icon: React.ReactNode; adminOnly?: boolean }[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          if (item.adminOnly && !hasRole('ADMIN')) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-100/50'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-surface-300 border-r border-surface-border flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-surface-border bg-surface-card/60">
        <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-wider text-slate-100 font-mono flex items-center gap-1.5">
            THREATTRACE<span className="text-cyan-400">AI</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-tighter">
            OPERATIONS CENTER
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {navSection('Operations', [
          { to: '/app/dashboard', label: 'SOC Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/app/threats', label: 'Threat Ingestion & Triage', icon: <Radio className="w-4 h-4" /> },
          { to: '/app/alerts', label: 'Active Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
          { to: '/app/investigations', label: 'Investigation Cases', icon: <FolderSearch className="w-4 h-4" /> },
        ])}

        {navSection('Intelligence', [
          { to: '/app/map', label: 'Threat Intelligence Map', icon: <MapPin className="w-4 h-4" /> },
          { to: '/app/correlations', label: 'Correlation Graph', icon: <GitBranch className="w-4 h-4" /> },
          { to: '/app/analytics', label: 'Operational Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        ])}

        {navSection('System & Governance', [
          { to: '/app/models', label: 'Model Intelligence', icon: <Cpu className="w-4 h-4" /> },
          { to: '/app/audit', label: 'Security Audit Logs', icon: <History className="w-4 h-4" />, adminOnly: true },
          { to: '/app/users', label: 'User Management', icon: <Users className="w-4 h-4" />, adminOnly: true },
          { to: '/app/settings', label: 'System Configuration', icon: <Settings className="w-4 h-4" /> },
        ])}
      </div>

      {/* Console Status Footer */}
      <div className="p-3 border-t border-surface-border bg-surface-card/40">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            SOC INFERENCE ONLINE
          </span>
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
    </aside>
  );
};
