import React, { useEffect, useRef, useState } from 'react';
import { ThreatSummary } from '../../types/threat';
import { Badge } from '../common/Badge';
import { MapPin, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

interface ThreatMapProps {
  threats: ThreatSummary[];
}

export const ThreatMap: React.FC<ThreatMapProps> = ({ threats }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<ThreatSummary | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const navigate = useNavigate();

  // Filter only geo-verified threats with valid coordinates
  const verifiedThreats = threats.filter(
    (t) => t.geoVerified && t.latitude !== null && t.latitude !== undefined && t.longitude !== null && t.longitude !== undefined
  );

  const filteredThreats = verifiedThreats.filter((t) => {
    if (severityFilter === 'ALL') return true;
    return t.severity === severityFilter;
  });

  const unverifiedCount = threats.length - verifiedThreats.length;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map with dark tiles
      const map = L.map(mapContainerRef.current, {
        center: [30.0, 10.0],
        zoom: 2,
        minZoom: 2,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for filtered threats
    filteredThreats.forEach((t) => {
      if (t.latitude !== undefined && t.longitude !== undefined) {
        const markerColor =
          t.severity === 'CRITICAL' ? '#f43f5e' : t.severity === 'HIGH' ? '#f97316' : t.severity === 'MEDIUM' ? '#f59e0b' : '#10b981';

        const marker = L.circleMarker([t.latitude, t.longitude], {
          radius: t.severity === 'CRITICAL' ? 10 : 8,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.75,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedThreat(t);
        });

        marker.bindTooltip(
          `<strong>${t.threatReference}</strong><br/>${t.category} (${t.severity})<br/>${t.locationName || 'Coordinates verified'}`,
          { className: 'leaflet-dark-tooltip font-mono text-xs' }
        );
      }
    });

    if (filteredThreats.length > 0 && filteredThreats[0].latitude && filteredThreats[0].longitude) {
      map.setView([filteredThreats[0].latitude, filteredThreats[0].longitude], 3);
    }
  }, [filteredThreats]);

  return (
    <div className="space-y-4">
      {/* Filter and Governance Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded border border-surface-border bg-surface-card gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400">Severity Filter:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-surface-200 text-slate-400 border-surface-border hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <MapPin className="w-3.5 h-3.5" />
            Plotting {filteredThreats.length} Verified Incidents
          </span>
          {unverifiedCount > 0 && (
            <span className="text-slate-500">
              ({unverifiedCount} reports without verified geolocation)
            </span>
          )}
        </div>
      </div>

      {/* Map Canvas and Selected Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 h-[520px] rounded border border-surface-border overflow-hidden relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {filteredThreats.length === 0 && (
            <div className="absolute inset-0 bg-surface-300/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-6">
              <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />
              <div className="text-sm font-mono text-slate-300 font-semibold">
                No reliable geographic entity detected in current selection.
              </div>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                ThreatTrace strictly avoids inferring user or IP locations. Only explicit entity-extracted locations are plotted.
              </p>
            </div>
          )}
        </div>

        {/* Side Panel: Selected Pin Details */}
        <div className="p-4 rounded border border-surface-border bg-surface-card flex flex-col justify-between h-[520px]">
          <div>
            <div className="text-xs font-mono font-semibold uppercase text-slate-300 pb-2 border-b border-surface-border mb-3 flex items-center justify-between">
              <span>Incident Geolocation</span>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {selectedThreat ? (
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Threat Reference</span>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">{selectedThreat.threatReference}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Location Entity</span>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{selectedThreat.locationName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Coord: [{selectedThreat.latitude?.toFixed(4)}, {selectedThreat.longitude?.toFixed(4)}]
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Category</span>
                    <div className="font-semibold text-slate-300">{selectedThreat.category}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Risk Score</span>
                    <div className="font-bold text-rose-400 text-sm">{selectedThreat.riskScore}/100</div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Ingestion Source</span>
                  <div className="text-slate-300 mt-0.5">{selectedThreat.sourceType} ({selectedThreat.sourceReference})</div>
                </div>

                <button
                  onClick={() => navigate(`/app/threats/${selectedThreat.id}`)}
                  className="w-full mt-4 py-2 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs flex items-center justify-center gap-2"
                >
                  <span>Open Threat Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono py-12 text-center">
                Click any geographical marker pin on the map to inspect incident details.
              </div>
            )}
          </div>

          {/* Mandated Zero-Inference Notice */}
          <div className="pt-3 border-t border-surface-border text-[10px] text-slate-500 font-sans flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-cyan-500 mt-0.5" />
            <span>
              <strong>Zero-Inference Policy:</strong> Geolocation is plotted strictly when verified physical entities exist in text. The platform never speculates or infers user coordinates.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
