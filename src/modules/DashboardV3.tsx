/**
 * Dashboard v3.0 - REDESIGN COMPLETO
 * Interface moderna com Design System v3.0
 */

import { useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { useIndicadoresEpidemiologicos } from '../shared/hooks/useIndicadoresEpidemiologicos';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../design-system/components/Card/Card';
import { Button } from '../design-system/components/Button/Button';
import { Badge } from '../design-system/components/Badge/Badge';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  BarChart3,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';

export default function DashboardV3() {
  const { data, isLoading, error } = useOvitrapData();
  const indicadores = useIndicadoresEpidemiologicos(data);

  // Cálculos de métricas
  const metrics = useMemo(() => {
    if (!data.length) return null;

    const totalOvos = data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const ovitrampasPositivas = data.filter(r => r.quantidade_ovos > 0).length;
    const ipo = data.length > 0 ? (ovitrampasPositivas / data.length) * 100 : 0;
    const bairrosUnicos = new Set(data.map(r => r.bairro)).size;

    // Tendência (comparar últimas 2 semanas)
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recentData = data.filter(r => new Date(r.data_instalacao) >= twoWeeksAgo);
    const olderData = data.filter(r => new Date(r.data_instalacao) < twoWeeksAgo);
    
    const recentIPO = recentData.length > 0 
      ? (recentData.filter(r => r.quantidade_ovos > 0).length / recentData.length) * 100 
      : 0;
    const olderIPO = olderData.length > 0 
      ? (olderData.filter(r => r.quantidade_ovos > 0).length / olderData.length) * 100 
      : 0;
    
    const trend = recentIPO - olderIPO;

    return {
      totalOvos,
      ovitrampasPositivas,
      totalOvitrampas: data.length,
      ipo,
      bairrosUnicos,
      trend,
    };
  }, [data]);

  // Alertas críticos
  const alerts = useMemo(() => {
    if (!metrics) return [];
    
    const alertList = [];
    
    if (metrics.ipo > 50) {
      alertList.push({
        type: 'error' as const,
        title: 'IPO Crítico',
        message: `IPO em ${metrics.ipo.toFixed(1)}% - Ação imediata necessária`,
        action: 'Ver Mapa',
      });
    }
    
    if (metrics.trend > 10) {
      alertList.push({
        type: 'warning' as const,
        title: 'Tendência Crescente',
        message: `Aumento de ${metrics.trend.toFixed(1)}% nas últimas 2 semanas`,
        action: 'Análise',
      });
    }

    return alertList;
  }, [metrics]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="p-8 text-center text-red-600">Erro ao carregar dados</div>;
  if (!metrics) return <div className="p-8 text-center">Sem dados disponíveis</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Visão Geral
        </h1>
        <p className="text-lg text-gray-600">
          Monitoramento em tempo real • {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Alertas Críticos */}
      {alerts.length > 0 && (
        <Card variant="gradient" className="mb-8" hoverable>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={32} />
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {alerts.length} Alerta{alerts.length > 1 ? 's' : ''} Crítico{alerts.length > 1 ? 's' : ''}
                </h2>
                <p className="text-white/90">Requer atenção imediata</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            {alerts.map((alert, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} />
                  <div>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-sm text-white/80">{alert.message}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  {alert.action}
                  <ChevronRight size={16} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* IPO */}
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Activity className="text-red-600" size={24} />
            </div>
            <Badge variant={metrics.ipo > 50 ? 'error' : metrics.ipo > 20 ? 'warning' : 'success'}>
              {metrics.ipo > 50 ? 'Crítico' : metrics.ipo > 20 ? 'Alto' : 'Normal'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">IPO (Índice Positivo)</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.ipo.toFixed(1)}%
          </p>
          <div className="flex items-center gap-2 text-sm">
            {metrics.trend > 0 ? (
              <>
                <TrendingUp size={16} className="text-red-500" />
                <span className="text-red-600">+{metrics.trend.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className="text-green-500" />
                <span className="text-green-600">{metrics.trend.toFixed(1)}%</span>
              </>
            )}
            <span className="text-gray-500">vs. 2 semanas</span>
          </div>
        </Card>

        {/* Total de Ovos */}
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total de Ovos</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.totalOvos.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Em {metrics.totalOvitrampas} ovitrampas
          </p>
        </Card>

        {/* Ovitrampas Positivas */}
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Activity className="text-primary-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Ovitrampas Positivas</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.ovitrampasPositivas}
          </p>
          <p className="text-sm text-gray-500">
            de {metrics.totalOvitrampas} instaladas
          </p>
        </Card>

        {/* Bairros Monitorados */}
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <MapPin className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Bairros Monitorados</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.bairrosUnicos}
          </p>
          <p className="text-sm text-gray-500">
            Cobertura completa
          </p>
        </Card>
      </div>

      {/* Indicadores Epidemiológicos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Indicadores Epidemiológicos Completos</CardTitle>
          <CardDescription>Métricas técnicas de vigilância entomológica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">IB (Índice de Breteau)</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.ib.toFixed(2)}%</p>
              <p className="text-xs text-gray-500 mt-1">Recipientes positivos / 100 imóveis</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">IDO (Densidade de Ovos)</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.ido.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Ovos por ovitrampa</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Mediana de Ovos</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.medianaOvos}</p>
              <p className="text-xs text-gray-500 mt-1">Valor central</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Desvio Padrão</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.desvioPadrao.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Variabilidade</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable clickable className="text-center p-8">
          <MapPin size={48} className="mx-auto mb-4 text-primary-500" />
          <h3 className="text-xl font-bold mb-2">Ver Mapa Completo</h3>
          <p className="text-gray-600 mb-4">Visualização geoespacial detalhada</p>
          <Button variant="primary" fullWidth>
            <Eye size={20} />
            Abrir Mapa
          </Button>
        </Card>

        <Card hoverable clickable className="text-center p-8">
          <BarChart3 size={48} className="mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-bold mb-2">Análise Profunda</h3>
          <p className="text-gray-600 mb-4">Tendências e padrões sazonais</p>
          <Button variant="secondary" fullWidth>
            <Activity size={20} />
            Ver Análise
          </Button>
        </Card>

        <Card hoverable clickable className="text-center p-8">
          <Download size={48} className="mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-bold mb-2">Exportar Relatório</h3>
          <p className="text-gray-600 mb-4">Relatório executivo completo</p>
          <Button variant="secondary" fullWidth>
            <Download size={20} />
            Gerar PDF
          </Button>
        </Card>
      </div>
    </div>
  );
}
