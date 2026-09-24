import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { Button } from '../components/common/Button';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('analyst@threattrace.io');
  const [password, setPassword] = useState('AnalystPass123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ username, password });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoRole = (userVal: string, passVal: string) => {
    setUsername(userVal);
    setPassword(passVal);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 radar-grid font-sans">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wider text-slate-100">
            THREATTRACE<span className="text-cyan-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">SECURITY OPERATIONS ACCESS PORTAL</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-lg border border-surface-border bg-surface-card shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-600/50 rounded text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">User Identity / Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst@threattrace.io"
                  className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 pl-9 pr-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Access Credential</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 pl-9 pr-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate SOC Session
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-surface-border">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick-Fill Synthetic Demo Roles:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => selectDemoRole('admin@threattrace.io', 'AdminPass123!')}
                className="p-2 rounded border border-surface-border bg-surface-100 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-300 text-left transition-colors"
              >
                <div className="font-bold text-cyan-400 text-[11px]">ADMIN</div>
                <div className="text-[10px] text-slate-500 truncate">Full SOC privileges</div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoRole('analyst@threattrace.io', 'AnalystPass123!')}
                className="p-2 rounded border border-surface-border bg-surface-100 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-300 text-left transition-colors"
              >
                <div className="font-bold text-cyan-400 text-[11px]">LEAD ANALYST</div>
                <div className="text-[10px] text-slate-500 truncate">Triage & Ingestion</div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoRole('investigator@threattrace.io', 'InvestigatorPass123!')}
                className="p-2 rounded border border-surface-border bg-surface-100 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-300 text-left transition-colors"
              >
                <div className="font-bold text-cyan-400 text-[11px]">INVESTIGATOR</div>
                <div className="text-[10px] text-slate-500 truncate">Case investigation</div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoRole('viewer@threattrace.io', 'ViewerPass123!')}
                className="p-2 rounded border border-surface-border bg-surface-100 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-300 text-left transition-colors"
              >
                <div className="font-bold text-cyan-400 text-[11px]">VIEWER</div>
                <div className="text-[10px] text-slate-500 truncate">Read-only briefings</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-slate-500">
            Need an analyst account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
