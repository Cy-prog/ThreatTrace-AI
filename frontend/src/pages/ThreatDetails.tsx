import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ThreatContent } from '../components/threats/ThreatContent';
import { RiskScore } from '../components/threats/RiskScore';
import { AIAnalysisPanel } from '../components/threats/AIAnalysisPanel';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Modal } from '../components/common/Modal';
import { threatsApi } from '../api/threats';
import { investigationsApi } from '../api/investigations';
import { ThreatDetail, ThreatStatus } from '../types/threat';
import {
  ShieldAlert,
  FolderPlus,
  RefreshCw,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  UserCheck,
} from 'lucide-react';

export const ThreatDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [threat, setThreat] = useState<ThreatDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isInvestigateModalOpen, setIsInvestigateModalOpen] = useState(false);

  // Investigation form
  const [caseTitle, setCaseTitle] = useState('');
  const [casePriority, setCasePriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [caseSummary, setCaseSummary] = useState('');
  const [isCreatingCase, setIsCreatingCase] = useState(false);

  const fetchThreat = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await threatsApi.getThreatById(id);
      setThreat(data);
      setCaseTitle(`Investigation into ${data.threatReference} - ${data.analysis?.predictedCategory || 'Threat Signal'}`);
      setCasePriority(data.analysis?.severity || 'HIGH');
    } catch (err) {
      console.error('Failed to load threat', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreat();
  }, [id]);

  const handleReanalyze = async () => {
    if (!id) return;
    setIsReanalyzing(true);
    try {
      const updated = await threatsApi.reanalyzeThreat(id);
      setThreat(updated);
    } catch (err) {
      console.error('Failed to reanalyze', err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleStatusChange = async (newStatus: ThreatStatus) => {
    if (!id) return;
    try {
      const updated = await threatsApi.updateStatus(id, newStatus);
      setThreat(updated);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCreateInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsCreatingCase(true);
    try {
      const inv = await investigationsApi.create({
        threatId: id,
        title: caseTitle,
        summary: caseSummary || undefined,
        priority: casePriority,
      });
      setIsInvestigateModalOpen(false);
      navigate(`/app/investigations/${inv.id}`);
    } catch (err) {
      console.error('Failed to create investigation', err);
    } finally {
      setIsCreatingCase(false);
    }
  };

  const handleExportJSON = () => {
    if (!threat) return;
    const blob = new Blob([JSON.stringify(threat, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${threat.threatReference}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleExportCSV = () => {
    if (!threat) return;
    const csvContent =
      `"ThreatReference","Category","Severity","RiskScore","Confidence","Status","Source","Location","SubmittedAt"\n` +
      `"${threat.threatReference}","${threat.analysis?.predictedCategory || ''}","${threat.analysis?.severity || ''}","${threat.analysis?.riskScore || 0}","${threat.analysis?.confidence || 0}","${threat.status}","${threat.sourceType}","${threat.locationName || ''}","${threat.submittedAt}"`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-summary-${threat.threatReference}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  if (isLoading) {
    return (
      <PageContainer title="Threat Workspace">
        <Loading label="Loading threat intelligence dossier..." size="lg" />
      </PageContainer>
    );
  }

  if (!threat) {
    return (
      <PageContainer title="Threat Workspace">
        <div className="p-8 text-center text-slate-400 font-mono">
          Threat report not found.
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/threats')} className="mt-4">
            Return to Queue
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={threat.threatReference}
      subtitle={`Ingested via ${threat.sourceType} on ${new Date(threat.submittedAt).toLocaleString()}`}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="ghost" onClick={() => navigate('/app/threats')} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Queue
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleReanalyze}
            isLoading={isReanalyzing}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Re-analyze
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsInvestigateModalOpen(true)}
            icon={<FolderPlus className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Open Investigation
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportJSON}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportCSV}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Workspace Header Strip (Requirement #15) */}
        <div className="p-4 rounded border border-surface-border bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xl font-bold text-cyan-400">{threat.threatReference}</span>
            <Badge severity={threat.analysis?.severity}>{threat.analysis?.severity || 'LOW'}</Badge>
            <Badge variant="status">{threat.status}</Badge>

            {threat.analysis?.humanReviewRequired && (
              <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-600/50 text-rose-300 text-xs font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                REQUIRES HUMAN REVIEW
              </span>
            )}
          </div>

          {/* Quick Review Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('IN_REVIEW')}
              className="px-2.5 py-1 text-xs rounded border border-surface-border bg-surface-100 hover:bg-surface-50 text-slate-300"
            >
              Mark In Review
            </button>
            <button
              onClick={() => handleStatusChange('RESOLVED')}
              className="px-2.5 py-1 text-xs rounded border border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleStatusChange('FALSE_POSITIVE')}
              className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-surface-100 text-slate-400 hover:bg-surface-50"
            >
              False Positive
            </button>
          </div>
        </div>

        {/* 2-Column Split: Content & Risk Engine vs AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Original Content & Risk Score (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded border border-surface-border bg-surface-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">
                  Original Submitted Report Content
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Interactive Entity Spans
                </span>
              </div>

              <ThreatContent
                content={threat.rawContent}
                entities={threat.analysis?.entities || []}
                modelVersion={threat.analysis?.modelVersion}
              />
            </div>

            {/* Explainable Risk Scoring Engine */}
            {threat.analysis && (
              <RiskScore
                score={threat.analysis.riskScore}
                severity={threat.analysis.severity}
                signalBreakdown={threat.analysis.signalBreakdown}
              />
            )}
          </div>

          {/* Right Column: AI Analysis Panel (5 cols) */}
          <div className="lg:col-span-5">
            <AIAnalysisPanel analysis={threat.analysis} />
          </div>
        </div>
      </div>

      {/* Escalate to Investigation Modal */}
      <Modal
        isOpen={isInvestigateModalOpen}
        onClose={() => setIsInvestigateModalOpen(false)}
        title="Open Case Investigation"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateInvestigation} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Investigation Title *</label>
            <input
              type="text"
              required
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Case Priority *</label>
            <select
              value={casePriority}
              onChange={(e) => setCasePriority(e.target.value as any)}
              className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Triage Summary / Scope</label>
            <textarea
              rows={4}
              value={caseSummary}
              onChange={(e) => setCaseSummary(e.target.value)}
              placeholder="Initial lead hypothesis, assigned partners, cross-jurisdiction notes..."
              className="w-full bg-surface-200 border border-surface-border rounded-sm p-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-surface-border">
            <Button type="button" variant="secondary" onClick={() => setIsInvestigateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreatingCase}>
              Initiate Investigation
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
