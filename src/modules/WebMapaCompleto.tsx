/**
 * WebMapa v3.0 - REDESIGN COMPLETO
 * Mapa interativo moderno com Design System v3.0
 */

import { useState, useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { MapView } from '../components/map/MapView';
import { Button } from '../design-system/components/Button/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../design-system/components/Card/Card';
import { Badge } from '../design-system/components/Badge/Badge';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import { 
  Map as MapIcon, 
  Droplet, 
  Activity,
  TrendingUp,
  MapPin,
  Layers
} from 'lucide-react';

export default function WebMapaCompleto() {
  const { data, isLoading, error } = useOvitrapData();
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Estatísticas do mapa
  const stats = useMemo(() => {
    const withCoords = data.filter(r => r.latitude && r.longitude);
    const totalOvos = data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const positivas = data.filter(r => r.quantidade_ovos > 0).length;
    const bairros = new Set(data.map(r => r.bairro)).size;
    
    return {
      total: data.length,
      withCoords: withCoords.length,
      totalOvos,
      positivas,
      bairros,
      ipoPercentage: data.length > 0 ? (positivas / data.length * 100).toFixed(1) : '0',
    };
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <Badge variant="error">Erro ao carregar dados</Badge>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 flex items-center gap-3">
            <MapIcon className="text-primary-500" size={48} />
            Mapa Interativo
          </h1>
          <p className="text-lg text-gray-600 mt-2">Visualização geoespacial em tempo real</p>
        </div>
        <Button
          variant={showHeatmap ? 'primary' : 'secondary'}
          size="lg"
          onClick={() => setShowHeatmap(!showHeatmap)}
          leftIcon={<Droplet size={20} />}
        >
          {showHeatmap ? 'Ocultar' : 'Mostrar'} Heatmap
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ovitrampas</p>
              <p className="text-2xl font-bold text-[#0087A8]">{stats.withCoords}</p>
            </div>
            <MapPin className="text-gray-400" size={32} />
          </div>
        </Card>

        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Ovos</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.totalOvos.toLocaleString()}
              </p>
            </div>
            <Activity className="text-gray-400" size={32} />
          </div>
        </Card>

        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">IPO</p>
              <p className="text-2xl font-bold text-red-600">{stats.ipoPercentage}%</p>
            </div>
            <TrendingUp className="text-gray-400" size={32} />
          </div>
        </Card>

        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bairros</p>
              <p className="text-2xl font-bold text-green-600">{stats.bairros}</p>
            </div>
            <MapIcon className="text-gray-400" size={32} />
          </div>
        </Card>
      </div>

      {/* Mapa Container */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Visualização Geoespacial</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {stats.withCoords} ovitrampas mapeadas • Clustering ativo
              </p>
            </div>
            <Layers className="text-gray-400" size={24} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height: '600px', width: '100%', position: 'relative' }}>
            <MapView 
              data={data}
              showHeatmap={showHeatmap}
              showClusters={true}
              onMarkerClick={(record) => {
                console.log('Marker clicked:', record);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-sm">Risco Baixo (0-19 ovos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500" />
          <span className="text-sm">Risco Médio (20-49 ovos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500" />
          <span className="text-sm">Risco Alto (50-99 ovos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-sm">Risco Crítico (100+ ovos)</span>
        </div>
      </div>
    </div>
  );
}
