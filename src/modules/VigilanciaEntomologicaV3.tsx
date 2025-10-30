/**
 * Vigilância Entomológica v3.0 - REDESIGN COMPLETO
 * Indicadores técnicos e análise epidemiológica avançada
 */

import { useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { useIndicadoresEpidemiologicos } from '../shared/hooks/useIndicadoresEpidemiologicos';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../design-system/components/Card/Card';
import { Badge } from '../design-system/components/Badge/Badge';
import { Alert } from '../design-system/components/Alert/Alert';
import { Button } from '../design-system/components/Button/Button';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Target,
  MapPin,
  Download,
  Eye
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export default function VigilanciaEntomologicaV3() {
  const { data, isLoading } = useOvitrapData();
  const indicadores = useIndicadoresEpidemiologicos(data);

  // Classificação de risco por índice
  const classificacoes = useMemo(() => {
    const getClasseIPO = (ipo: number) => {
      if (ipo < 5) return { label: 'Baixo Risco', variant: 'success' as const, score: 25 };
      if (ipo < 20) return { label: 'Médio Risco', variant: 'warning' as const, score: 50 };
      if (ipo < 50) return { label: 'Alto Risco', variant: 'warning' as const, score: 75 };
      return { label: 'Risco Crítico', variant: 'error' as const, score: 100 };
    };

    const getClasseIB = (ib: number) => {
      if (ib < 1) return { label: 'Satisfatório', variant: 'success' as const, score: 25 };
      if (ib < 4) return { label: 'Alerta', variant: 'warning' as const, score: 50 };
      return { label: 'Risco', variant: 'error' as const, score: 100 };
    };

    return {
      ipo: getClasseIPO(indicadores.ipo),
      ib: getClasseIB(indicadores.ib),
    };
  }, [indicadores]);

  // Dados para radar chart
  const radarData = useMemo(() => [
    { 
      indicador: 'IPO', 
      valor: Math.min(indicadores.ipo, 100),
      fullMark: 100 
    },
    { 
      indicador: 'IB', 
      valor: Math.min(indicadores.ib * 10, 100), // Normalizar para 0-100
      fullMark: 100 
    },
    { 
      indicador: 'IDO', 
      valor: Math.min(indicadores.ido * 2, 100), // Normalizar
      fullMark: 100 
    },
    { 
      indicador: 'Taxa Coleta', 
      valor: indicadores.taxaColeta,
      fullMark: 100 
    },
  ], [indicadores]);

  // Top áreas críticas
  const areasCriticas = useMemo(() => {
    const grouped = data.reduce((acc, record) => {
      const bairro = record.bairro;
      if (!acc[bairro]) {
        acc[bairro] = { bairro, totalOvos: 0, positivas: 0, total: 0 };
      }
      acc[bairro].totalOvos += record.quantidade_ovos || 0;
      acc[bairro].total += 1;
      if (record.quantidade_ovos > 0) acc[bairro].positivas += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((item: any) => ({
        ...item,
        ipo: item.total > 0 ? (item.positivas / item.total * 100) : 0,
      }))
      .sort((a: any, b: any) => b.ipo - a.ipo)
      .slice(0, 5);
  }, [data]);

  // Cores para o gráfico
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Activity className="text-primary-500" size={48} />
          Vigilância Entomológica
        </h1>
        <p className="text-lg text-gray-600">
          Indicadores técnicos e classificação de risco epidemiológico
        </p>
      </div>

      {/* Alertas de Risco */}
      {(classificacoes.ipo.variant === 'error' || classificacoes.ib.variant === 'error') && (
        <Alert 
          variant="error" 
          title="Situação Crítica Detectada"
          className="mb-8"
          action={
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <Eye size={16} />
                Ver Detalhes
              </Button>
              <Button variant="secondary" size="sm">
                <Download size={16} />
                Exportar Relatório
              </Button>
            </div>
          }
        >
          Índices acima do limite crítico. Recomenda-se ação imediata de controle vetorial.
        </Alert>
      )}

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* IPO */}
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Target className="text-red-600" size={24} />
            </div>
            <Badge variant={classificacoes.ipo.variant}>
              {classificacoes.ipo.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">IPO - Índice de Positividade</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {indicadores.ipo.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            {indicadores.positivas} de {indicadores.totalRegistros} positivas
          </p>
        </Card>

        {/* IB */}
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Activity className="text-orange-600" size={24} />
            </div>
            <Badge variant={classificacoes.ib.variant}>
              {classificacoes.ib.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">IB - Índice de Breteau</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {indicadores.ib.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500">
            Recipientes positivos / 100 imóveis
          </p>
        </Card>

        {/* IDO */}
        <Card variant="glass" hoverable>
          <div className="p-3 bg-primary-100 rounded-xl mb-4 w-fit">
            <TrendingUp className="text-primary-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-1">IDO - Densidade de Ovos</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {indicadores.ido.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">
            Ovos por ovitrampa instalada
          </p>
        </Card>

        {/* Taxa de Coleta */}
        <Card variant="glass" hoverable>
          <div className="p-3 bg-green-100 rounded-xl mb-4 w-fit">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Taxa de Coleta</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {indicadores.taxaColeta.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            Cobertura de monitoramento
          </p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Risco Multidimensional</CardTitle>
            <CardDescription>Análise integrada dos principais indicadores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis 
                  dataKey="indicador" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                <Radar 
                  name="Nível de Risco" 
                  dataKey="valor" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Áreas Críticas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top 5 Áreas Críticas</CardTitle>
                <CardDescription>Bairros prioritários para intervenção</CardDescription>
              </div>
              <MapPin className="text-gray-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={areasCriticas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="bairro" 
                  stroke="#6B7280" 
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="ipo" radius={[8, 8, 0, 0]} name="IPO (%)">
                  {areasCriticas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Epidemiológicas Completas</CardTitle>
          <CardDescription>Análise descritiva e distribuição dos dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Média de Ovos</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.mediaOvos.toFixed(1)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Mediana</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.medianaOvos}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Desvio Padrão</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.desvioPadrao.toFixed(1)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Percentil 90</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.percentil90}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Coef. Variação</p>
              <p className="text-3xl font-bold text-gray-900">{indicadores.coeficienteVariacao.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Alert variant="warning" title="Ação Recomendada">
          Intensificar vigilância nos {areasCriticas.length} bairros críticos identificados.
        </Alert>
        <Alert variant="info" title="Monitoramento">
          Manter acompanhamento semanal dos indicadores IPO e IB.
        </Alert>
        <Alert variant="success" title="Cobertura">
          Taxa de coleta em {indicadores.taxaColeta.toFixed(1)}% - Dentro do esperado.
        </Alert>
      </div>
    </div>
  );
}
