/**
 * Panorama Executivo - FASE 6
 * Dashboard gerencial com gráficos e análises estatísticas
 */

import { useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Calendar,
  MapPin,
  BarChart3,
} from 'lucide-react';

export default function PanoramaExecutivoCompleto() {
  const { data, isLoading, error } = useOvitrapData();

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalOvos = data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const avgOvos = data.length > 0 ? totalOvos / data.length : 0;
    const positivas = data.filter((r) => r.quantidade_ovos > 0).length;
    const ipoPercentage = data.length > 0 ? (positivas / data.length) * 100 : 0;
    const bairros = new Set(data.map((r) => r.bairro)).size;
    const ovitrampas = new Set(data.map((r) => r.id_ovitrampa)).size;

    // Calcular tendência (comparar primeiros 30% vs últimos 30%)
    const sortedByDate = [...data].sort(
      (a, b) => new Date(a.data_coleta).getTime() - new Date(b.data_coleta).getTime()
    );
    const chunk = Math.floor(sortedByDate.length * 0.3);
    const firstChunk = sortedByDate.slice(0, chunk);
    const lastChunk = sortedByDate.slice(-chunk);

    const avgFirst = firstChunk.reduce((sum, r) => sum + r.quantidade_ovos, 0) / firstChunk.length;
    const avgLast = lastChunk.reduce((sum, r) => sum + r.quantidade_ovos, 0) / lastChunk.length;
    const trend = avgLast > avgFirst ? 'up' : 'down';
    const trendPercent = avgFirst > 0 ? ((avgLast - avgFirst) / avgFirst) * 100 : 0;

    return {
      totalOvos,
      avgOvos,
      positivas,
      ipoPercentage,
      bairros,
      ovitrampas,
      trend,
      trendPercent,
    };
  }, [data]);

  // Dados por mês
  const monthlyData = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      const key = `${r.mes_nome}/${r.ano}`;
      if (!acc[key]) {
        acc[key] = { name: key, ovos: 0, count: 0, positivas: 0 };
      }
      acc[key].ovos += r.quantidade_ovos || 0;
      acc[key].count += 1;
      if (r.quantidade_ovos > 0) acc[key].positivas += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((item: any) => ({
        name: item.name,
        'Média de Ovos': Math.round(item.ovos / item.count),
        'IPO (%)': Math.round((item.positivas / item.count) * 100),
      }))
      .slice(-12); // Últimos 12 meses
  }, [data]);

  // Top 10 bairros
  const topBairros = useMemo(() => {
    const grouped = data.reduce((acc, r) => {
      if (!r.bairro) return acc;
      if (!acc[r.bairro]) {
        acc[r.bairro] = { bairro: r.bairro, ovos: 0, count: 0 };
      }
      acc[r.bairro].ovos += r.quantidade_ovos || 0;
      acc[r.bairro].count += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((item: any) => ({
        name: item.bairro.substring(0, 20), // Limitar nome
        'Total Ovos': item.ovos,
        'Média': Math.round(item.ovos / item.count),
      }))
      .sort((a, b) => b['Total Ovos'] - a['Total Ovos'])
      .slice(0, 10);
  }, [data]);

  // Distribuição por nível de risco
  const riskDistribution = useMemo(() => {
    const low = data.filter((r) => r.quantidade_ovos >= 0 && r.quantidade_ovos < 20).length;
    const medium = data.filter((r) => r.quantidade_ovos >= 20 && r.quantidade_ovos < 50).length;
    const high = data.filter((r) => r.quantidade_ovos >= 50 && r.quantidade_ovos < 100).length;
    const critical = data.filter((r) => r.quantidade_ovos >= 100).length;

    return [
      { name: 'Baixo', value: low, color: '#22c55e' },
      { name: 'Médio', value: medium, color: '#eab308' },
      { name: 'Alto', value: high, color: '#f97316' },
      { name: 'Crítico', value: critical, color: '#ef4444' },
    ];
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
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="text-[#0087A8]" size={32} />
          Panorama Executivo
        </h1>
        <p className="text-gray-600 mt-2">Análises gerenciais e indicadores estratégicos</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Ovos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Ovos</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.totalOvos.toLocaleString()}
                </p>
              </div>
              <Activity className="text-orange-200" size={40} />
            </div>
            <div className="mt-4 flex items-center">
              {stats.trend === 'up' ? (
                <TrendingUp className="text-red-500 mr-2" size={16} />
              ) : (
                <TrendingDown className="text-green-500 mr-2" size={16} />
              )}
              <span className={`text-sm ${stats.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(stats.trendPercent).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* IPO */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">IPO</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.ipoPercentage.toFixed(1)}%
                </p>
              </div>
              <AlertTriangle className="text-red-200" size={40} />
            </div>
            <div className="mt-4">
              <Badge
                variant={
                  stats.ipoPercentage < 1
                    ? 'low'
                    : stats.ipoPercentage < 5
                    ? 'medium'
                    : stats.ipoPercentage < 10
                    ? 'high'
                    : 'critical'
                }
              >
                {stats.ipoPercentage < 1
                  ? 'Baixo Risco'
                  : stats.ipoPercentage < 5
                  ? 'Risco Médio'
                  : stats.ipoPercentage < 10
                  ? 'Alto Risco'
                  : 'Risco Crítico'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Ovitrampas */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ovitrampas Ativas</p>
                <p className="text-3xl font-bold text-[#0087A8] mt-2">{stats.ovitrampas}</p>
              </div>
              <MapPin className="text-blue-200" size={40} />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {stats.positivas} positivas ({((stats.positivas / data.length) * 100).toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bairros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bairros Monitorados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.bairros}</p>
              </div>
              <Calendar className="text-green-200" size={40} />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Cobertura total do município</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Temporal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Temporal (Últimos 12 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Média de Ovos"
                  stroke="#f97316"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="IPO (%)"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Risco */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Nível de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Bairros */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Bairros - Maior Infestação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topBairros} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total Ovos" fill="#f97316" />
              <Bar dataKey="Média" fill="#0087A8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-700">
            <p>
              • <strong>Situação Geral:</strong> Foram registrados{' '}
              <strong>{stats.totalOvos.toLocaleString()}</strong> ovos em{' '}
              <strong>{stats.ovitrampas}</strong> ovitrampas distribuídas em{' '}
              <strong>{stats.bairros}</strong> bairros.
            </p>
            <p>
              • <strong>Índice de Positividade (IPO):</strong> Atualmente em{' '}
              <strong className="text-red-600">{stats.ipoPercentage.toFixed(1)}%</strong>, indicando{' '}
              {stats.ipoPercentage < 1
                ? 'baixo risco'
                : stats.ipoPercentage < 5
                ? 'risco médio'
                : stats.ipoPercentage < 10
                ? 'alto risco'
                : 'risco crítico'}{' '}
              de infestação.
            </p>
            <p>
              • <strong>Tendência:</strong> Análise temporal indica tendência de{' '}
              <strong className={stats.trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                {stats.trend === 'up' ? 'aumento' : 'redução'}
              </strong>{' '}
              de {Math.abs(stats.trendPercent).toFixed(1)}% na infestação.
            </p>
            <p>
              • <strong>Áreas Críticas:</strong> Recomenda-se atenção especial aos{' '}
              <strong>top 10 bairros</strong> com maior concentração de ovos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
