/**
 * WebMapa Completo - FASE 5
 * Mapa interativo com sidebar, filtros e estatísticas
 */

import { useState, useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { useDataStore } from '../shared/stores/dataStore';
import { MapView } from '../components/map/MapView';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import { 
  Map as MapIcon, 
  Layers, 
  Droplet, 
  Filter,
  Activity,
  TrendingUp,
  AlertTriangle,
  MapPin,
  X
} from 'lucide-react';

export default function WebMapaCompleto() {
  const { data, isLoading, error } = useOvitrapData();
  const { filters, setFilters } = useDataStore();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

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

  // Anos disponíveis
  const availableYears = useMemo(() => {
    const years = [...new Set(data.map(r => r.ano))].filter(Boolean);
    return years.sort((a, b) => b - a);
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <Badge variant="danger">Erro ao carregar dados</Badge>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapIcon className="text-[#0087A8]" size={24} />
                <h2 className="text-xl font-bold">WebMapa</h2>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Visualização geoespacial de ovitrampas
            </p>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Ovitrampas</p>
                  <p className="text-2xl font-bold text-[#0087A8]">{stats.withCoords}</p>
                </div>
                <MapPin className="text-gray-400" size={32} />
              </div>
            </Card>

            <Card padding="sm">
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

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">IPO</p>
                  <p className="text-2xl font-bold text-red-600">{stats.ipoPercentage}%</p>
                </div>
                <TrendingUp className="text-gray-400" size={32} />
              </div>
            </Card>

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bairros</p>
                  <p className="text-2xl font-bold text-green-600">{stats.bairros}</p>
                </div>
                <MapIcon className="text-gray-400" size={32} />
              </div>
            </Card>

            {/* Filtros */}
            <Card padding="sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <CardTitle>Filtros</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Filtro de Ano */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Ano
                    </label>
                    <select
                      value={filters.year || 'todos'}
                      onChange={(e) => setFilters({ year: e.target.value === 'todos' ? undefined : e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0087A8]"
                    >
                      <option value="todos">Todos os anos</option>
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Limpar filtros */}
                  {filters.year && (
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => setFilters({ year: undefined })}
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Controles do Mapa */}
            <Card padding="sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers size={16} />
                  <CardTitle>Camadas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={showHeatmap ? 'primary' : 'secondary'}
                    size="sm"
                    fullWidth
                    onClick={() => setShowHeatmap(!showHeatmap)}
                  >
                    <Droplet size={16} className="mr-2" />
                    {showHeatmap ? 'Ocultar' : 'Mostrar'} Heatmap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Legenda */}
            <Card padding="sm">
              <CardHeader>
                <CardTitle>Legenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
              </CardContent>
            </Card>
          </div>
        </aside>
      )}

      {/* Mapa */}
      <div className="flex-1 relative" style={{ height: '100vh' }}>
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Filter size={16} />
            <span className="font-medium">Mostrar Filtros</span>
          </button>
        )}
        
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <MapView 
            data={data}
            showHeatmap={showHeatmap}
            showClusters={true}
            onMarkerClick={(record) => {
              console.log('Marker clicked:', record);
            }}
          />
        </div>
      </div>
    </div>
  );
}
