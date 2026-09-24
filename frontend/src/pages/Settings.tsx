import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { Bell, Radio, Shield, Save, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://siem-relay.threattrace.internal/webhook/alerts');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [demoBannerEnabled, setDemoBannerEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageContainer
      title="System Configuration & Governance"
      subtitle="Operational notification channels, AI microservice connectivity, and multi-channel alerting rules."
    >
      <div className="max-w-3xl space-y-6 font-mono text-xs">
        {savedSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Settings successfully committed to configuration registry.</span>
          </div>
        )}

        {/* Notification Abstraction (Requirement #21) */}
        <form onSubmit={handleSave} className="p-6 rounded border border-surface-border bg-surface-card space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              Outbound Notification Providers (IN_APP, EMAIL, WEBHOOK)
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded bg-surface-200 border border-surface-border">
              <div>
                <strong className="text-slate-200 block">In-App WebSocket Broker Channel</strong>
                <span className="text-[11px] text-slate-400">
                  Broadcasts real-time STOMP alerts to active SOC analyst browser sessions.
                </span>
              </div>
              <input
                type="checkbox"
                checked={inAppAlerts}
                onChange={(e) => setInAppAlerts(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-surface-200 border border-surface-border">
              <div>
                <strong className="text-slate-200 block">Email SMTP Dispatch Provider</strong>
                <span className="text-[11px] text-slate-400">
                  Sends automated notifications on CRITICAL and HIGH severity thresholds.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded bg-surface-200 border border-surface-border space-y-2">
              <strong className="text-slate-200 block">Webhook Ingress / SIEM Relay URL</strong>
              <span className="text-[11px] text-slate-400 block">
                Dispatches signed JSON alert payloads to external SOAR / SIEM systems (e.g. Splunk, Sentinel).
              </span>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-surface-300 border border-surface-border rounded-sm py-2 px-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Demo Mode Configuration (Requirement #48) */}
          <div className="pt-4 border-t border-surface-border space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase">Demo Environment Banner</h4>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-amber-950/20 border border-amber-900/40">
              <span className="text-slate-300">
                Display synthetic demo data notification banner across all views
              </span>
              <input
                type="checkbox"
                checked={demoBannerEnabled}
                onChange={(e) => setDemoBannerEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" icon={<Save className="w-3.5 h-3.5" />}>
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
