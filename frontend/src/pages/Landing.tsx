import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  Terminal,
  Cpu,
  GitBranch,
  ShieldCheck,
  Radio,
  FolderSearch,
  Lock,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="border-b border-surface-border bg-surface-300/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-base font-bold font-mono tracking-wider text-slate-100">
            THREATTRACE<span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Capabilities</a>
          <a href="#pipeline" className="hover:text-cyan-400 transition-colors">13-Stage Pipeline</a>
          <a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture</a>
          <a href="#governance" className="hover:text-cyan-400 transition-colors">Governance</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button size="sm" variant="ghost">Sign In</Button>
          </Link>
          <Link to="/login">
            <Button size="sm" variant="primary">Launch SOC Console</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-28 max-w-6xl mx-auto flex flex-col items-center text-center radar-grid">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          ENTERPRISE THREAT INTELLIGENCE & EXPLAINABLE RISK SCORING
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-slate-100 max-w-4xl leading-tight">
          Turn Threat Signals Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Actionable Intelligence</span>.
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-sans leading-relaxed">
          ThreatTrace AI ingests suspicious communications and threat reports across emails, web reports, messaging, and API feeds. Powered by modular NLP classification, entity extraction, transparent risk scoring, and human-in-the-loop investigation workflows.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Open SOC Operations Console
            </Button>
          </Link>
          <a href="#pipeline">
            <Button size="lg" variant="secondary" icon={<Terminal className="w-4 h-4" />}>
              View Analytical Pipeline
            </Button>
          </a>
        </div>

        {/* Interactive Threat Intelligence Terminal Visualizer */}
        <div className="mt-16 w-full max-w-4xl rounded-lg border border-surface-border bg-surface-card shadow-2xl overflow-hidden text-left font-mono">
          <div className="px-4 py-2.5 bg-surface-100 border-b border-surface-border flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-mono text-[11px] text-slate-300">live-threat-feed // THR-2026-000184</span>
            </div>
            <span className="text-[10px] text-cyan-400">STATUS: ANALYZED (CRITICAL)</span>
          </div>

          <div className="p-5 text-xs space-y-3 bg-surface-300/90 text-slate-300">
            <div className="text-slate-500 text-[11px]">
              &gt; INGEST: [EMAIL source="sec-tip-4412@relay.net"] "We have planted explosive charges across the transit tunnels connecting Central Metro Station in Chicago. If 50 BTC is not transferred by tomorrow at 9:00 AM, detonation commences..."
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-surface-border/50 text-[11px]">
              <div className="p-2.5 rounded bg-surface-200 border border-surface-border">
                <span className="text-slate-500 block uppercase text-[10px]">Classification</span>
                <span className="font-bold text-rose-400">BOMB_THREAT (96% Conf)</span>
              </div>
              <div className="p-2.5 rounded bg-surface-200 border border-surface-border">
                <span className="text-slate-500 block uppercase text-[10px]">Explainable Risk</span>
                <span className="font-bold text-rose-400">92 / 100 [CRITICAL]</span>
              </div>
              <div className="p-2.5 rounded bg-surface-200 border border-surface-border">
                <span className="text-slate-500 block uppercase text-[10px]">Extracted Entities</span>
                <span className="font-bold text-cyan-400">Central Metro Station, Chicago</span>
              </div>
            </div>
            <div className="text-slate-400 text-[10px] font-mono flex items-center gap-2 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Multi-signal breakdown computed. Automated alert generated. Routed to Senior Investigator queue.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-surface-border">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            ARCHITECTURE & CAPABILITIES
          </span>
          <h2 className="text-3xl font-bold font-mono text-slate-100 mt-2">
            Built for Modern Security Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-md border border-surface-border bg-surface-card hover:border-cyan-500/40 transition-colors">
            <Radio className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold font-mono text-slate-100 mb-2">Heterogeneous Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingest signals across emails, dark web tips, social media feeds, chats, and automated API webhooks with input sanitization and deduplication.
            </p>
          </div>

          <div className="p-6 rounded-md border border-surface-border bg-surface-card hover:border-cyan-500/40 transition-colors">
            <Cpu className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold font-mono text-slate-100 mb-2">Explainable Risk Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent 0–100 scoring based on explicit linguistic, temporal, target, and location weights. Every point is explainable to analysts.
            </p>
          </div>

          <div className="p-6 rounded-md border border-surface-border bg-surface-card hover:border-cyan-500/40 transition-colors">
            <FolderSearch className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold font-mono text-slate-100 mb-2">SOC Investigation Cases</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Escalate high-risk reports to formal case investigations with assigned analysts, evidence notes, status tracking, and exportable reports.
            </p>
          </div>

          <div className="p-6 rounded-md border border-surface-border bg-surface-card hover:border-cyan-500/40 transition-colors">
            <GitBranch className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold font-mono text-slate-100 mb-2">Relational Correlation Graph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify related campaigns using TF-IDF vector similarity and overlapping entity graphs without false attribution claims.
            </p>
          </div>

          <div className="p-6 rounded-md border border-surface-border bg-surface-card hover:border-cyan-500/40 transition-colors">
            <Lock className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold font-mono text-slate-100 mb-2">Immutable Audit Trails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every analyst action, status change, and login produces an immutable audit record preserving chain-of-custody compliance.
            </p>
          </div>

          <div className="p-6 rounded-md border border-surface-border bg-surface-card hover:border-cyan-500/40 transition-colors">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold font-mono text-slate-100 mb-2">Human-in-the-Loop Governance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict governance prevents autonomous retaliatory actions. AI predictions remain analytical signals requiring human analyst review.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-border bg-surface-300 py-8 px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">ThreatTrace AI</span> — AI-Powered Threat Intelligence Platform
          </div>
          <div>
            Built with Java 21, Spring Boot 3.3, Python 3.14, FastAPI &amp; React.
          </div>
        </div>
      </footer>
    </div>
  );
};
