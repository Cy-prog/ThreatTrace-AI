import React from 'react';
import { Search, LogOut, User, Bell, Plus } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface TopbarProps {
  onOpenIngestModal?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenIngestModal }) => {
  const { user, logout } = useAuth();

  const primaryRole = user?.roles[0]?.replace('ROLE_', '') || 'ANALYST';

  return (
    <header className="h-16 border-b border-surface-border bg-surface-200/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search Threat ID, IOC, entity, keyword..."
          className="w-full bg-surface-card border border-surface-border rounded-sm py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors font-mono"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {onOpenIngestModal && (
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenIngestModal}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Ingest Threat
          </Button>
        )}

        <div className="h-5 w-px bg-surface-border"></div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface-100 border border-surface-border flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200 font-mono leading-none">
              {user?.fullName || user?.username}
            </span>
            <div className="mt-1">
              <Badge variant="status" size="sm">
                {primaryRole}
              </Badge>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign out of Operations Console"
          className="p-2 rounded text-slate-400 hover:text-rose-400 hover:bg-surface-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
