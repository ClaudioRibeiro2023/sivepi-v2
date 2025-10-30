/**
 * Dashboard Completo - Sprint 1
 * Com mini gráficos, alertas e quick actions
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { useIndicadoresEpidemiologicos } from '../shared/hooks/useIndicadoresEpidemiologicos';
import { FilterPanel } from '../shared/components/FilterPanel';
import { IndicadorCard } from '../shared/components/IndicadorCard';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import {
  Activity,
  AlertTriangle,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Map,
  BarChart3,
  Bug,
  ArrowRight,
  AlertOctagon,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function DashboardCompleto() {
  const { data, isLoading, error } = useOvitrapData();
  const indicadores = useIndicadoresEpidemiologicos(data);

  // Mini gráfico de tendência (últimos 30 dias)
  const trendData = useMemo(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.data_coleta).getTime() - new Date(b.data_coleta).getTime()
    );
    const last30 = sorted.slice(-30);
    
    // Agrupar por data
    const grouped = last30.reduce((acc, r) => {
      const date = r.data_coleta.substring(0, 10);
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += r.quantidade_ovos || 0;
      acc[date].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      avg: data.total / data.count,
    }));
  }, [data]);

  // Calcular tendência
  const tendencia = useMemo(() => {
    if (trendData.length < 2) return { direcao: 'neutro', percentual: 0 };
    
    const primeira = trendData.slice(0, Math.floor(trendData.length / 2));
    const segunda = trendData.slice(Math.floor(trendData.length / 2));
    
    const avgPrimeira = primeira.reduce((sum, d) => sum + d.avg, 0) / primeira.length;
    const avgSegunda = segunda.reduce((sum, d) => sum + d.avg, 0) / segunda.length;
    
    const percentual = avgPrimeira > 0 ? ((avgSegunda - avgPrimeira) / avgPrimeira) * 100 : 0;
    const direcao = percentual > 5 ? 'subindo' : percentual < -5 ? 'descendo' : 'estavel';
    
    return { direcao, percentual: Math.abs(percentual) };
  }, [trendData]);

  // Identificar alertas
  const alertas = useMemo(() => {
    const alerts = [];
    
    if (indicadores.ipo > 10) {
      alerts.push({
        tipo: 'critico',
        mensagem: `IPO Crítico: ${indicadores.ipo}% - Ação imediata necessária`,
        link: '/vigilancia',
      });
    } else if (indicadores.ipo > 5) {
      alerts.push({
        tipo: 'alto',
        mensagem: `IPO Alto: ${indicadores.ipo}% - Atenção necessária`,
        link: '/vigilancia',
      });
    }
    
    if (tendencia.direcao === 'subindo' && tendencia.percentual > 20) {
      alerts.push({
        tipo: 'medio',
        mensagem: `Infestação aumentando ${tendencia.percentual.toFixed(1)}% nas últimas semanas`,
        link: '/panorama',
      });
    }
    
    if (indicadores.positivas > data.length * 0.15) {
      alerts.push({
        tipo: 'medio',
        mensagem: `${indicadores.positivas} ovitrampas positivas detectadas`,
        link: '/webmapa',
      });
    }
    
    return alerts;
  }, [indicadores, tendencia, data.length]);

  // Top 3 bairros críticos
  const top3Bairros = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      if (!r.bairro) return acc;
      if (!acc[r.bairro]) {
        acc[r.bairro] = { bairro: r.bairro, ovos: 0, count: 0 };
      }
      acc[r.bairro].ovos += r.quantidade_ovos || 0;
      acc[r.bairro].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((item: any) => ({
        bairro: item.bairro,
        ovos: item.ovos,
        media: item.ovos / item.count,
      }))
      .sort((a, b) => b.ovos - a.ovos)
      .slice(0, 3);
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de vigilância epidemiológica</p>
      </div>

      {/* Filtros */}
      <FilterPanel data={data} showWeekFilter={false} />

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertOctagon className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 text-lg mb-3">
                  {alertas.length} Alerta{alertas.length > 1 ? 's' : ''} Ativo{alertas.length > 1 ? 's' : ''}
                </h3>
                <div className="space-y-2">
                  {alertas.map((alerta, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-800">{alerta.mensagem}</p>
                      <Link to={alerta.link}>
                        <Button variant="secondary" size="sm">
                          Ver detalhes
                          <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <IndicadorCard
          titulo="IPO (Índice de Positividade)"
          valor={indicadores.ipo}
          formato="percentual"
          icone={AlertTriangle}
          cor={indicadores.ipo < 1 ? 'green' : indicadores.ipo < 5 ? 'yellow' : indicadores.ipo < 10 ? 'orange' : 'red'}
          risco={indicadores.risco}
          descricao="Ovitrampas positivas / Total"
        />

        <div className="relative">
          <IndicadorCard
            titulo="Total de Ovos"
            valor={indicadores.totalOvos}
            formato="numero"
            subtitulo={`Média: ${indicadores.mediaOvos} ovos/armadilha`}
            icone={Activity}
            cor="orange"
          />
          {/* Mini gráfico de tendência */}
          {trendData.length > 0 && (
            <div className="absolute bottom-2 right-2 opacity-50">
              <LineChart width={80} height={30} data={trendData}>
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </div>
          )}
        </div>

        <IndicadorCard
          titulo="Ovitrampas Monitoradas"
          valor={indicadores.ovitrampasUnicas}
          formato="numero"
          subtitulo={`${indicadores.positivas} positivas (${((indicadores.positivas / indicadores.totalRegistros) * 100).toFixed(1)}%)`}
          icone={MapPin}
          cor="blue"
        />

        <IndicadorCard
          titulo="Bairros Monitorados"
          valor={indicadores.bairrosMonitorados}
          formato="numero"
          subtitulo="Cobertura completa"
          icone={Calendar}
          cor="green"
        />
      </div>

      {/* Indicadores Epidemiológicos Avançados */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Epidemiológicos Completos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">IB (Índice de Breteau)</p>
              <p className="text-2xl font-bold text-blue-600">{indicadores.ib}%</p>
              <p className="text-xs text-gray-500 mt-1">Recipientes positivos / 100 imóveis</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">IDO (Densidade de Ovos)</p>
              <p className="text-2xl font-bold text-orange-600">{indicadores.ido.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Ovos por ovitrampa</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Mediana de Ovos</p>
              <p className="text-2xl font-bold text-green-600">{indicadores.medianaOvos}</p>
              <p className="text-xs text-gray-500 mt-1">50% dos valores abaixo</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Desvio Padrão</p>
              <p className="text-2xl font-bold text-purple-600">{indicadores.desvioPadrao}</p>
              <p className="text-xs text-gray-500 mt-1">Variabilidade dos dados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendência e Top 3 Bairros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tendencia.direcao === 'subindo' ? (
                <TrendingUp className="text-red-500" size={20} />
              ) : tendencia.direcao === 'descendo' ? (
                <TrendingDown className="text-green-500" size={20} />
              ) : null}
              Tendência Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                tendencia.direcao === 'subindo'
                  ? 'bg-red-50 border border-red-200'
                  : tendencia.direcao === 'descendo'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className={`text-2xl font-bold ${
                  tendencia.direcao === 'subindo'
                    ? 'text-red-600'
                    : tendencia.direcao === 'descendo'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}>
                  {tendencia.direcao === 'subindo' ? '+' : tendencia.direcao === 'descendo' ? '-' : ''}
                  {tendencia.percentual.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Infestação {tendencia.direcao} nas últimas semanas
                </p>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={trendData}>
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke={tendencia.direcao === 'subindo' ? '#ef4444' : '#22c55e'}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Bairros */}
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Áreas Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top3Bairros.map((bairro, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    idx === 0
                      ? 'bg-red-50 border-red-300'
                      : idx === 1
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-yellow-50 border-yellow-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">
                        #{idx + 1} {bairro.bairro}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {bairro.ovos.toLocaleString()} ovos (média: {bairro.media.toFixed(1)})
                      </p>
                    </div>
                    <Badge variant={idx === 0 ? 'critical' : idx === 1 ? 'high' : 'medium'}>
                      Prioridade {idx + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/webmapa">
              <Button variant="primary" className="w-full h-auto py-6 flex-col gap-2">
                <Map size={32} />
                <span className="text-lg font-semibold">Ver Mapa</span>
                <span className="text-sm opacity-80">Visualização geoespacial</span>
              </Button>
            </Link>
            <Link to="/panorama">
              <Button variant="primary" className="w-full h-auto py-6 flex-col gap-2">
                <BarChart3 size={32} />
                <span className="text-lg font-semibold">Análises</span>
                <span className="text-sm opacity-80">Gráficos e relatórios</span>
              </Button>
            </Link>
            <Link to="/vigilancia">
              <Button variant="primary" className="w-full h-auto py-6 flex-col gap-2">
                <Bug size={32} />
                <span className="text-lg font-semibold">Vigilância</span>
                <span className="text-sm opacity-80">IPO e alertas</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
