/**
 * Módulo de Mapa Interativo com Mapbox GL
 */

/**
 * Módulo WebMapa - Mapa Interativo
 * FASE 5 - Conforme ROADMAP
 */

import { useState } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { MapView } from '../components/map/MapView';
import { Button, Card, Badge } from '../shared/components/ui';
import { Map as MapIcon, Layers, Droplet, MapPin, Activity } from 'lucide-react';
import { LoadingScreen } from '../shared/components/LoadingScreen';

const MapaInterativoNovo = () => {
  const { data, isLoading, error } = useOvitrapData();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClusters, setShowClusters] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <Badge variant="danger">Erro ao carregar dados</Badge>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header com controles */}
      <div style={{
        background: 'white',
        padding: '16px 24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <MapIcon size={28} color="#0087A8" />
            Mapa Interativo
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
            Visualização geoespacial de ovitrampas em Montes Claros/MG
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowClusters(!showClusters)}
            style={{
              padding: '8px 16px',
              background: showClusters ? '#0087A8' : 'white',
              color: showClusters ? 'white' : '#666',
              border: '1px solid #0087A8',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <Layers size={16} />
            Clusters
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            style={{
              padding: '8px 16px',
              background: showHeatmap ? '#0087A8' : 'white',
              color: showHeatmap ? 'white' : '#666',
              border: '1px solid #0087A8',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <Droplet size={16} />
            Heatmap
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView 
          data={data}
          showHeatmap={showHeatmap}
          showClusters={showClusters}
          onMarkerClick={(record) => {
            console.log('Marker clicked:', record);
          }}
        />
      </div>
    </div>
  );
};

export default MapaInterativoNovo;
