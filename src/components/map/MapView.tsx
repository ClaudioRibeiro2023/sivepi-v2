/**
 * Componente principal do mapa com Mapbox GL
 */

import React, { useRef, useState, useCallback, useMemo } from 'react';
import Map, { 
  Marker, 
  Popup, 
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  GeolocateControl,
  Layer,
  Source 
} from 'react-map-gl';
import { MAP_CONFIG, MAPBOX_TOKEN } from '../../config/mapConfig';
import type { AedesRecord } from '../../types';
import { MapPin, Activity } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface AedesRecordWithRisk extends AedesRecord {
  riskLevel: RiskLevel;
}

interface MapViewProps {
  data: AedesRecord[];
  showHeatmap?: boolean;
  showClusters?: boolean;
  onMarkerClick?: (record: AedesRecord) => void;
}

export const MapView: React.FC<MapViewProps> = ({ 
  data, 
  showHeatmap = false,
  showClusters = true,
  onMarkerClick 
}) => {
  const mapRef = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<AedesRecordWithRisk | null>(null);
  const [viewState, setViewState] = useState({
    longitude: MAP_CONFIG.center.lng,
    latitude: MAP_CONFIG.center.lat,
    zoom: MAP_CONFIG.zoom.initial,
  });

  // Processa dados geográficos
  const geoData = useMemo((): AedesRecordWithRisk[] => {
    return data
      .filter(r => r.latitude && r.longitude)
      .map(r => ({
        ...r,
        riskLevel: getRiskLevel(r.quantidade_ovos),
      }));
  }, [data]);

  // GeoJSON para heatmap
  const heatmapGeoJSON = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: geoData.map(r => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [r.longitude, r.latitude],
      },
      properties: {
        value: r.quantidade_ovos,
      },
    })),
  }), [geoData]);

  // Handler de clique em marker
  const handleMarkerClick = useCallback((record: AedesRecordWithRisk) => {
    setSelectedMarker(record);
    onMarkerClick?.(record);
  }, [onMarkerClick]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_CONFIG.styles.streets}
        minZoom={MAP_CONFIG.zoom.min}
        maxZoom={MAP_CONFIG.zoom.max}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Controles do mapa */}
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />
        <FullscreenControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Heatmap Layer */}
        {showHeatmap && (
          <Source
            id="ovitraps-heat"
            type="geojson"
            data={heatmapGeoJSON}
          >
            <Layer
              id="ovitraps-heatmap"
              type="heatmap"
              paint={{
                'heatmap-weight': ['get', 'value'],
                'heatmap-intensity': MAP_CONFIG.heatmap.intensity,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(33, 102, 172, 0)',
                  0.2, 'rgb(103, 169, 207)',
                  0.4, 'rgb(209, 229, 240)',
                  0.6, 'rgb(253, 219, 199)',
                  0.8, 'rgb(239, 138, 98)',
                  1, 'rgb(178, 24, 43)',
                ],
                'heatmap-radius': MAP_CONFIG.heatmap.radius,
                'heatmap-opacity': MAP_CONFIG.heatmap.opacity,
              }}
            />
          </Source>
        )}

        {/* Markers individuais */}
        {!showClusters && geoData.map((record) => (
          <Marker
            key={record.id_registro}
            longitude={record.longitude}
            latitude={record.latitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(record);
            }}
          >
            <div
              style={{
                background: MAP_CONFIG.riskColors[record.riskLevel],
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={14} color="white" />
            </div>
          </Marker>
        ))}

        {/* Popup com detalhes */}
        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            anchor="top"
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div style={{ padding: '8px', minWidth: '200px' }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#262832'
              }}>
                Ovitrampa #{selectedMarker.id_ovitrampa}
              </h3>
              
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ marginBottom: '4px' }}>
                  <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  <strong>Ovos:</strong> {selectedMarker.quantidade_ovos}
                </div>
                
                <div style={{ marginBottom: '4px' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  <strong>Bairro:</strong> {selectedMarker.bairro}
                </div>
                
                <div style={{ marginBottom: '4px' }}>
                  <strong>Data:</strong> {new Date(selectedMarker.data_coleta).toLocaleDateString('pt-BR')}
                </div>
                
                <div style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: MAP_CONFIG.riskColors[selectedMarker.riskLevel] + '20',
                  color: MAP_CONFIG.riskColors[selectedMarker.riskLevel],
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  Risco: {getRiskLabel(selectedMarker.riskLevel)}
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Stats overlay */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '14px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          📍 Total de Ovitrampas
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0087A8' }}>
          {geoData.length}
        </div>
      </div>
    </div>
  );
};

// Helpers
function getRiskLevel(ovos: number): RiskLevel {
  if (ovos === 0) return 'low';
  if (ovos < 20) return 'low';
  if (ovos < 50) return 'medium';
  if (ovos < 100) return 'high';
  return 'critical';
}

function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
    critical: 'Crítico',
  };
  return labels[level];
}
