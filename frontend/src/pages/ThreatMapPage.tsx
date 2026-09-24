import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ThreatMap } from '../components/dashboard/ThreatMap';
import { Loading } from '../components/common/Loading';
import { Button } from '../components/common/Button';
import { threatsApi } from '../api/threats';
import { ThreatSummary } from '../types/threat';
import { RefreshCw } from 'lucide-react';

export const ThreatMapPage: React.FC = () => {
  const [threats, setThreats] = useState<ThreatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMapThreats = async () => {
    setIsLoading(true);
    try {
      const data = await threatsApi.getMapThreats();
      setThreats(data);
    } catch (err) {
      console.error('Failed to load map data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapThreats();
  }, []);

  return (
    <PageContainer
      title="Threat Intelligence Map"
      subtitle="Spatial distribution of verified physical facilities, transport nodes, and geographic incident anchors."
      actions={
        <Button size="sm" variant="secondary" onClick={fetchMapThreats} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Map
        </Button>
      }
    >
      {isLoading ? (
        <Loading label="Plotting verified geographic coordinates..." size="lg" />
      ) : (
        <ThreatMap threats={threats} />
      )}
    </PageContainer>
  );
};
