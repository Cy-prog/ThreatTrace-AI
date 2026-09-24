import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { investigationsApi } from '../api/investigations';
import { Investigation, InvestigationStatus } from '../types/investigation';
import {
  ArrowLeft,
  User,
  Clock,
  Send,
  CheckCircle,
  AlertTriangle,
  FolderCheck,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';

export const InvestigationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const fetchInvestigation = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await investigationsApi.getById(id);
      setInvestigation(data);
    } catch (err) {
      console.error('Failed to load investigation', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigation();
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const updated = await investigationsApi.addNote(id, newNote.trim());
      setInvestigation(updated);
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleStatusUpdate = async (status: InvestigationStatus) => {
    if (!id) return;
    try {
      const updated = await investigationsApi.updateStatus(id, status, resolutionNotes || undefined);
      setInvestigation(updated);
      setIsResolving(false);
    } catch (err) {
      console.error('Failed to update investigation status', err);
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Investigation Dossier">
        <Loading label="Decrypting and loading investigation case file..." size="lg" />
      </PageContainer>
    );
  }

  if (!investigation) {
    return (
      <PageContainer title="Investigation Dossier">
        <div className="p-8 text-center text-slate-400 font-mono">
          Case file not found.
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/investigations')} className="mt-4">
            Return to Case List
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={investigation.investigationReference}
      subtitle={investigation.title}
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate('/app/investigations')} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Case Queue
          </Button>
          <Link to={`/app/threats/${investigation.threatId}`}>
            <Button size="sm" variant="secondary" icon={<ExternalLink className="w-3.5 h-3.5 text-cyan-400" />}>
              View Origin Threat ({investigation.threatReference})
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Metadata */}
        <div className="p-4 rounded border border-surface-border bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-cyan-400 text-sm">{investigation.investigationReference}</span>
            <Badge severity={investigation.priority}>{investigation.priority}</Badge>
            <Badge variant="status">{investigation.status}</Badge>

            <span className="text-slate-500">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Lead Analyst: <strong className="text-slate-200">{investigation.assignedAnalystName || 'Unassigned'}</strong>
            </span>
          </div>

          {/* Status Change Buttons */}
          <div className="flex items-center gap-2">
            {investigation.status !== 'RESOLVED' && investigation.status !== 'CLOSED' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('ESCALATED')}
                  className="px-2.5 py-1 text-xs rounded border border-rose-600/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50"
                >
                  Escalate
                </button>
                <button
                  onClick={() => setIsResolving(!isResolving)}
                  className="px-2.5 py-1 text-xs rounded border border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
                >
                  Resolve Case
                </button>
              </>
            )}
            {investigation.status === 'RESOLVED' && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> CASE RESOLVED
              </span>
            )}
          </div>
        </div>

        {/* Resolution Notes Box if triggered */}
        {isResolving && (
          <div className="p-4 rounded border border-emerald-500/40 bg-emerald-950/20 space-y-3 font-mono text-xs">
            <span className="text-emerald-400 font-bold block">Case Resolution Briefing</span>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="State final finding: Threat mitigated, perpetrator identified, law enforcement referral..."
              className="w-full bg-surface-200 border border-surface-border rounded-sm p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsResolving(false)}>Cancel</Button>
              <Button size="sm" variant="primary" onClick={() => handleStatusUpdate('RESOLVED')}>Confirm Resolution</Button>
            </div>
          </div>
        )}

        {/* 2 Column: Summary and Threat Context vs Analyst Notes Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Scope & Evidence */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-4 rounded border border-surface-border bg-surface-card space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300 pb-2 border-b border-surface-border">
                Investigation Scope &amp; Hypothesis
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {investigation.summary || 'Initial triage phase active. Evidence gathering and target verification in progress.'}
              </p>

              {investigation.resolutionNotes && (
                <div className="mt-3 p-3 rounded bg-surface-200 border border-emerald-500/30">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">
                    Formal Resolution Finding
                  </span>
                  <p className="text-xs text-slate-300 font-sans">{investigation.resolutionNotes}</p>
                </div>
              )}
            </div>

            {/* Linked Threat Snippet */}
            <div className="p-4 rounded border border-surface-border bg-surface-card space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300 pb-2 border-b border-surface-border flex items-center justify-between">
                <span>Linked Threat Signal</span>
                <Link to={`/app/threats/${investigation.threatId}`} className="text-cyan-400 hover:underline">
                  {investigation.threatReference}
                </Link>
              </h3>
              <div className="p-3 rounded bg-surface-200 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                "{investigation.threatContentSnippet}"
              </div>
            </div>
          </div>

          {/* Right Column: Immutable Case Notes Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded border border-surface-border bg-surface-card space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300 pb-2 border-b border-surface-border flex items-center justify-between">
                <span>Investigator Log &amp; Case Notes ({investigation.notes?.length || 0})</span>
                <span className="text-[10px] text-slate-500 font-normal">Tamper-evident chain of custody</span>
              </h3>

              {/* Notes List */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {investigation.notes && investigation.notes.length > 0 ? (
                  investigation.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded border border-surface-border bg-surface-200/80 space-y-1.5 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-cyan-400 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {note.authorName}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-sans leading-relaxed pt-1">
                        {note.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 font-mono py-8 text-center">
                    No notes recorded yet. Add the first investigator note below.
                  </div>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-3 border-t border-surface-border space-y-2 font-mono text-xs">
                <textarea
                  required
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record forensic observation, subpoena status, external IOC verification, or law enforcement handover note..."
                  className="w-full bg-surface-200 border border-surface-border rounded-sm p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" variant="primary" isLoading={isSubmittingNote} icon={<Send className="w-3.5 h-3.5" />}>
                    Append to Case Log
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
