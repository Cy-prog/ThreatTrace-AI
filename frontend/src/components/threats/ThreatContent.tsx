import React, { useState } from 'react';
import { ThreatEntity } from '../../types/threat';
import { Badge } from '../common/Badge';
import { Info, ExternalLink } from 'lucide-react';

interface ThreatContentProps {
  content: string;
  entities: ThreatEntity[];
  modelVersion?: string;
}

export const ThreatContent: React.FC<ThreatContentProps> = ({
  content,
  entities,
  modelVersion = 'ThreatNER-CyberLinguistic v2.1.0',
}) => {
  const [selectedEntity, setSelectedEntity] = useState<ThreatEntity | null>(null);

  // Render text with entity highlights based on start/end offsets
  const renderHighlightedContent = () => {
    if (!entities || entities.length === 0) {
      return <span className="text-slate-300 font-mono leading-relaxed">{content}</span>;
    }

    // Sort entities by start offset
    const sorted = [...entities].sort((a, b) => a.startOffset - b.startOffset);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((entity, idx) => {
      // Add text before entity
      if (entity.startOffset > lastIndex) {
        elements.push(
          <span key={`text-${idx}`} className="text-slate-300">
            {content.substring(lastIndex, entity.startOffset)}
          </span>
        );
      }

      // Add highlighted entity
      const isSelected = selectedEntity?.id === entity.id;
      elements.push(
        <button
          key={`entity-${entity.id || idx}`}
          onClick={() => setSelectedEntity(entity)}
          className={`inline-block px-1.5 py-0.5 my-0.5 rounded text-xs font-mono font-semibold transition-all border cursor-pointer ${
            isSelected
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)] ring-1 ring-cyan-400'
              : 'bg-cyan-950/70 text-cyan-300 border-cyan-700/60 hover:bg-cyan-900/60 hover:border-cyan-500'
          }`}
          title={`Click to inspect ${entity.entityType} entity`}
        >
          {entity.sourceSpan || content.substring(entity.startOffset, entity.endOffset)}
          <span className="ml-1 text-[9px] opacity-75 uppercase">[{entity.entityType}]</span>
        </button>
      );

      lastIndex = Math.max(lastIndex, entity.endOffset);
    });

    // Add trailing text
    if (lastIndex < content.length) {
      elements.push(
        <span key="trailing-text" className="text-slate-300">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Content box */}
      <div className="p-4 rounded border border-surface-border bg-surface-200/90 font-mono text-xs leading-relaxed overflow-x-auto select-text whitespace-pre-wrap">
        {renderHighlightedContent()}
      </div>

      {/* Selected Entity Inspector Drawer */}
      {selectedEntity ? (
        <div className="p-3.5 rounded border border-cyan-500/40 bg-cyan-950/30 flex items-start justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Entity Inspector:</span>
              <Badge variant="category">{selectedEntity.entityType}</Badge>
              <span className="text-cyan-400 font-bold">"{selectedEntity.entityValue}"</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-4">
              <span>Confidence: <strong className="text-slate-200">{Math.round(selectedEntity.confidence * 100)}%</strong></span>
              <span>Span: <strong className="text-slate-200">[{selectedEntity.startOffset}:{selectedEntity.endOffset}]</strong></span>
              <span>Model: <strong className="text-slate-200">{modelVersion}</strong></span>
            </div>
          </div>
          <button
            onClick={() => setSelectedEntity(null)}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-500" /> Click on any highlighted entity span above to inspect extraction confidence and model telemetry.
        </div>
      )}
    </div>
  );
};
