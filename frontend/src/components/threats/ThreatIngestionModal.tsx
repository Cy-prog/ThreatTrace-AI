import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SourceType } from '../../types/threat';
import { threatsApi } from '../../api/threats';
import { Radio, AlertCircle } from 'lucide-react';

interface ThreatIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_DEMO_THREATS = [
  {
    label: 'Bomb Extortion (Chicago Metro)',
    sourceType: 'EMAIL' as SourceType,
    sourceRef: 'relay-node@darkmail.onion',
    content: '[DEMO DATA] Improvised explosive devices placed in the transit corridors of Central Metro Station Chicago. Detonation scheduled tomorrow at 9:00 AM unless 50 BTC is sent to bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh.',
    loc: 'Central Metro Station, Chicago, USA',
    lat: 41.8781,
    lon: -87.6298,
  },
  {
    label: 'Targeted Assault (New York HQ)',
    sourceType: 'SOCIAL_MEDIA' as SourceType,
    sourceRef: '@shadow_tactical on X',
    content: '[DEMO DATA] Assault team mobilized for strike against Meridian Financial corporate headquarters on 5th Avenue, New York. Target confirmed tonight at 23:00 EST. Retaliation will be lethal.',
    loc: '5th Avenue, New York, NY, USA',
    lat: 40.7744,
    lon: -73.9656,
  },
  {
    label: 'SCADA Infrastructure Zero-Day',
    sourceType: 'WEB_REPORT' as SourceType,
    sourceRef: 'Critical Infra Tip Portal #44',
    content: '[DEMO DATA] Terminated contractor downloaded engineering blueprints for North Water Treatment Plant in Seattle. Mentioned releasing zero-day malware payload to trigger valve failures within 48 hours.',
    loc: 'North Water Treatment Plant, Seattle, WA',
    lat: 47.6062,
    lon: -122.3321,
  },
];

export const ThreatIngestionModal: React.FC<ThreatIngestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [sourceType, setSourceType] = useState<SourceType>('EMAIL');
  const [sourceReference, setSourceReference] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rawContent.trim().length < 5) {
      setError('Content must be at least 5 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await threatsApi.ingestThreat({
        sourceType,
        sourceReference: sourceReference.trim() || undefined,
        rawContent: rawContent.trim(),
        locationName: locationName.trim() || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      });

      // Reset form
      setRawContent('');
      setSourceReference('');
      setLocationName('');
      setLatitude('');
      setLongitude('');

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to ingest threat report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadPreset = (preset: typeof PRESET_DEMO_THREATS[0]) => {
    setSourceType(preset.sourceType);
    setSourceReference(preset.sourceRef);
    setRawContent(preset.content);
    setLocationName(preset.loc);
    setLatitude(preset.lat.toString());
    setLongitude(preset.lon.toString());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ingest Suspicious Threat Signal" maxWidth="2xl">
      {/* Quick Demo Pre-fills */}
      <div className="mb-5 pb-4 border-b border-surface-border">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5" /> Quick Synthetic Scenario Loaders:
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_DEMO_THREATS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 text-xs rounded border border-surface-border bg-surface-100 hover:bg-cyan-950/40 hover:border-cyan-500/50 text-slate-300 font-mono transition-colors text-left"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-950/60 border border-rose-600/50 rounded text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Source Ingestion Channel *</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as SourceType)}
              className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="EMAIL">EMAIL (Encrypted / Relay)</option>
              <option value="WEB_REPORT">WEB_REPORT (Public Triage Portal)</option>
              <option value="SOCIAL_MEDIA">SOCIAL_MEDIA (OSINT Feed)</option>
              <option value="MESSAGE">MESSAGE (Chat / Telegram / IRC)</option>
              <option value="USER_REPORT">USER_REPORT (Internal Tip)</option>
              <option value="API">API (SIEM / Syslog Webhook)</option>
              <option value="FILE_UPLOAD">FILE_UPLOAD (Document / Log File)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Source Reference / Handle</label>
            <input
              type="text"
              placeholder="e.g. tip-4402@proton.me or @handle"
              value={sourceReference}
              onChange={(e) => setSourceReference(e.target.value)}
              className="w-full bg-surface-200 border border-surface-border rounded-sm py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-mono text-slate-300">Raw Threat Content *</label>
            <span className="text-[10px] font-mono text-slate-500">{rawContent.length} / 100,000 characters</span>
          </div>
          <textarea
            required
            rows={5}
            placeholder="Paste raw unedited message, threat email body, dark web post, extortion ultimatum, or operational incident note..."
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            className="w-full bg-surface-200 border border-surface-border rounded-sm p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono resize-y"
          />
        </div>

        {/* Geographic Information */}
        <div className="pt-2 border-t border-surface-border">
          <label className="block text-xs font-mono text-slate-400 mb-2">
            Verified Physical Location Coordinates (Optional — Map will only plot validated locations)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <input
                type="text"
                placeholder="Location / Facility Name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2.5 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                placeholder="Latitude (e.g. 41.8781)"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2.5 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                placeholder="Longitude (e.g. -87.6298)"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-surface-200 border border-surface-border rounded-sm py-1.5 px-2.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Execute AI Pipeline & Ingest
          </Button>
        </div>
      </form>
    </Modal>
  );
};
