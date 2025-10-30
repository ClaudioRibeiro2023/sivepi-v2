/**
 * Análise Sazonal - Sprint 2
 * Decomposição temporal, padrões sazonais, boxplots
 */

import { useMemo } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { FilterPanel } from '../shared/components/FilterPanel';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../shared/components/ui';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Calendar, TrendingUp, Activity } from 'lucide-react';

export default function AnaliseSazonal() {
  const { data, isLoading, error } = useOvitrapData();

  // Análise por mês (todos os anos agregados)
  const monthlyAggregate = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      nome: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ][i],
      total: 0,
      count: 0,
      positivas: 0,
      values: [] as number[],
    }));

    data.forEach((record) => {
      if (record.mes_numero) {
        const monthData = months[record.mes_numero - 1];
        monthData.total += record.quantidade_ovos || 0;
        monthData.count++;
        if (record.quantidade_ovos > 0) monthData.positivas++;
        monthData.values.push(record.quantidade_ovos || 0);
      }
    });

    return months.map((m) => ({
      mes: m.nome,
      'Média de Ovos': m.count > 0 ? m.total / m.count : 0,
      'IPO (%)': m.count > 0 ? (m.positivas / m.count) * 100 : 0,
      'Total': m.total,
      'Registros': m.count,
      // Estatísticas para boxplot
      min: Math.min(...m.values),
      q1: percentile(m.values, 25),
      median: percentile(m.values, 50),
      q3: percentile(m.values, 75),
      max: Math.max(...m.values),
    }));
  }, [data]);

  // Análise por semana epidemiológica
  const weeklyPattern = useMemo(() => {
    const weeks = new Map<number, { total: number; count: number; positivas: number }>();

    data.forEach((record) => {
      if (record.semana_epidemiologica) {
        const week = record.semana_epidemiologica;
        if (!weeks.has(week)) {
          weeks.set(week, { total: 0, count: 0, positivas: 0 });
        }
        const weekData = weeks.get(week)!;
        weekData.total += record.quantidade_ovos || 0;
        weekData.count++;
        if (record.quantidade_ovos > 0) weekData.positivas++;
      }
    });

    return Array.from(weeks.entries())
      .map(([week, data]) => ({
        week: `S${week}`,
        'Média de Ovos': data.total / data.count,
        'IPO (%)': (data.positivas / data.count) * 100,
      }))
      .sort((a, b) => {
        const weekA = parseInt(a.week.substring(1));
        const weekB = parseInt(b.week.substring(1));
        return weekA - weekB;
      });
  }, [data]);

  // Identificar pico sazonal
  const peakMonth = useMemo(() => {
    return monthlyAggregate.reduce((peak, current) =>
      current['Média de Ovos'] > peak['Média de Ovos'] ? current : peak
    );
  }, [monthlyAggregate]);

  // Identificar vale sazonal
  const lowMonth = useMemo(() => {
    return monthlyAggregate.reduce((low, current) =>
      current['Média de Ovos'] < low['Média de Ovos'] ? current : low
    );
  }, [monthlyAggregate]);

  // Calcular sazonalidade (coeficiente de variação mensal)
  const seasonalityIndex = useMemo(() => {
    const values = monthlyAggregate.map((m) => m['Média de Ovos']);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return (stdDev / mean) * 100; // CV%
  }, [monthlyAggregate]);

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
          <Calendar className="text-[#0087A8]" size={32} />
          Análise Sazonal
        </h1>
        <p className="text-gray-600 mt-2">
          Padrões temporais, sazonalidade e tendências ao longo do ano
        </p>
      </div>

      {/* Filtros */}
      <FilterPanel data={data} showWeekFilter={false} />

      {/* Cards de Indicadores Sazonais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Pico Sazonal</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{peakMonth.mes}</p>
                <p className="text-sm text-red-700 mt-2">
                  Média: {peakMonth['Média de Ovos'].toFixed(1)} ovos
                </p>
              </div>
              <TrendingUp size={40} className="text-red-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Menor Infestação</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{lowMonth.mes}</p>
                <p className="text-sm text-green-700 mt-2">
                  Média: {lowMonth['Média de Ovos'].toFixed(1)} ovos
                </p>
              </div>
              <Activity size={40} className="text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Índice de Sazonalidade</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {seasonalityIndex.toFixed(1)}%
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  {seasonalityIndex > 50 ? 'Alta variação' : seasonalityIndex > 25 ? 'Moderada' : 'Baixa variação'}
                </p>
              </div>
              <Calendar size={40} className="text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Padrão Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Padrão Sazonal Mensal (Agregado de Todos os Anos)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyAggregate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <ReferenceLine
                yAxisId="left"
                y={monthlyAggregate.reduce((sum, m) => sum + m['Média de Ovos'], 0) / 12}
                stroke="#666"
                strokeDasharray="5 5"
                label={{ value: 'Média Anual', position: 'right' }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Média de Ovos"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 5 }}
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

      {/* Distribuição por Mês (Boxplot simulado) */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Ovos por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyAggregate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis label={{ value: 'Quantidade de Ovos', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border">
                      <p className="font-bold mb-2">{data.mes}</p>
                      <div className="space-y-1 text-sm">
                        <p>Média: {data['Média de Ovos'].toFixed(1)}</p>
                        <p>Mediana: {data.median.toFixed(1)}</p>
                        <p>Min/Max: {data.min} / {data.max}</p>
                        <p>Q1/Q3: {data.q1.toFixed(1)} / {data.q3.toFixed(1)}</p>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="median" fill="#0087A8" name="Mediana" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-2 text-center">
            * Visualização simplificada. Use a mediana para ver o valor central de cada mês.
          </p>
        </CardContent>
      </Card>

      {/* Padrão Semanal */}
      {weeklyPattern.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Padrão por Semana Epidemiológica</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Média de Ovos"
                  stroke="#0087A8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Interpretação */}
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Interpretação da Sazonalidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-900">
            <p>
              • <strong>Pico de Infestação:</strong> O mês de <strong>{peakMonth.mes}</strong> apresenta
              a maior média de ovos ({peakMonth['Média de Ovos'].toFixed(1)}), indicando período crítico
              que requer atenção redobrada.
            </p>
            <p>
              • <strong>Período Favorável:</strong> {lowMonth.mes} tem a menor infestação, sendo
              o período mais adequado para ações preventivas de longo prazo.
            </p>
            <p>
              • <strong>Variação Sazonal:</strong> O índice de {seasonalityIndex.toFixed(1)}% indica
              {seasonalityIndex > 50 ? ' alta ' : seasonalityIndex > 25 ? ' moderada ' : ' baixa '}
              variação ao longo do ano, sugerindo
              {seasonalityIndex > 50
                ? ' forte padrão sazonal com necessidade de planejamento diferenciado por período.'
                : seasonalityIndex > 25
                ? ' padrão sazonal moderado com alguma variação entre meses.'
                : ' pouca variação sazonal, mantendo infestação relativamente constante.'}
            </p>
            <p>
              • <strong>Recomendação:</strong> Intensificar ações de vigilância 1-2 meses antes do pico
              ({peakMonth.mes}), e aproveitar o período de baixa ({lowMonth.mes}) para treinamento e
              preparação de equipes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Função auxiliar para calcular percentil
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
