import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DemoBanner } from '../common/DemoBanner';
import { ThreatIngestionModal } from '../threats/ThreatIngestionModal';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mandatory Demo Banner */}
        <DemoBanner />

        {/* Topbar */}
        <Topbar onOpenIngestModal={() => setIsIngestModalOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-background radar-grid">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-surface-border gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono flex items-center gap-2">
                <span className="w-1.5 h-4 bg-cyan-500 rounded-sm"></span>
                {title}
              </h1>
              {subtitle && <p className="text-xs text-slate-400 mt-1 font-sans">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>

          {/* Child content */}
          {children}
        </main>
      </div>

      {/* Global Ingestion Modal */}
      <ThreatIngestionModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onSuccess={() => {
          setIsIngestModalOpen(false);
          // Optional notification or refresh
          window.location.reload();
        }}
      />
    </div>
  );
};
