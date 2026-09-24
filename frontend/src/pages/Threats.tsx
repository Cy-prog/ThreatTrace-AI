import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ThreatTable } from '../components/threats/ThreatTable';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { threatsApi, ThreatFilterParams } from '../../src/api/threats';
import { ThreatSummary } from '../../src/types/threat';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export const Threats: React.FC = () => {
  const [threats, setThreats] = useState<ThreatSummary[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [status, setStatus] = useState('');

  const fetchThreats = async () => {
    setIsLoading(true);
    try {
      const params: ThreatFilterParams = {
        query: query.trim() || undefined,
        category: category || undefined,
        severity: severity || undefined,
        sourceType: sourceType || undefined,
        status: status || undefined,
        page,
        size,
      };
      const res = await threatsApi.getThreats(params);
      setThreats(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load threats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, [page, category, severity, sourceType, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchThreats();
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('');
    setSeverity('');
    setSourceType('');
    setStatus('');
    setPage(0);
  };

  return (
    <PageContainer
      title="Threat Ingestion & Triage Queue"
      subtitle="Examine ingested intelligence signals, filter multi-class classifications, and prioritize high-risk incident reports."
      actions={
        <Button size="sm" variant="secondary" onClick={fetchThreats} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Queue
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded border border-surface-border bg-surface-card space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search raw content, threat reference ID (e.g. THR-2026-000184), or target..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 pl-9 pr-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <Button type="submit" size="sm" variant="primary">
              Filter Corpus
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleClearFilters}>
              Reset
            </Button>
          </form>

          {/* Granular Filter Selects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-surface-border font-mono text-xs">
            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => { setSeverity(e.target.value); setPage(0); }}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2 text-xs text-slate-200"
              >
                <option value="">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2 text-xs text-slate-200"
              >
                <option value="">All Categories</option>
                <option value="VIOLENT_THREAT">VIOLENT_THREAT</option>
                <option value="BOMB_THREAT">BOMB_THREAT</option>
                <option value="CYBER_THREAT">CYBER_THREAT</option>
                <option value="EXTORTION">EXTORTION</option>
                <option value="STALKING">STALKING</option>
                <option value="HARASSMENT">HARASSMENT</option>
                <option value="NON_THREAT">NON_THREAT</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Source Type</label>
              <select
                value={sourceType}
                onChange={(e) => { setSourceType(e.target.value); setPage(0); }}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2 text-xs text-slate-200"
              >
                <option value="">All Sources</option>
                <option value="EMAIL">EMAIL</option>
                <option value="WEB_REPORT">WEB_REPORT</option>
                <option value="SOCIAL_MEDIA">SOCIAL_MEDIA</option>
                <option value="MESSAGE">MESSAGE</option>
                <option value="USER_REPORT">USER_REPORT</option>
                <option value="API">API</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Investigation Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(0); }}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2 text-xs text-slate-200"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="ANALYZED">ANALYZED</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="ESCALATED">ESCALATED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        {isLoading ? (
          <Loading label="Querying threat intelligence database..." />
        ) : threats.length > 0 ? (
          <div className="space-y-4">
            <ThreatTable threats={threats} />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
              <span>Showing {threats.length} of {totalElements} total threat records</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  icon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  icon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Threats Found"
            description="No threat intelligence records matched your query or filter criteria."
            actionLabel="Reset Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>
    </PageContainer>
  );
};
