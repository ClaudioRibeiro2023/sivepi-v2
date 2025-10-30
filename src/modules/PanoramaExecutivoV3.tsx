/**
 * Panorama Executivo v3.0 - REDESIGN COMPLETO
 * Análise executiva com gráficos modernos
 */

import { useMemo, useState } from 'react';
import { useOvitrapData } from '../shared/hooks/useOvitrapData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../design-system/components/Card/Card';
import { Select } from '../design-system/components/Select/Select';
import { Badge } from '../design-system/components/Badge/Badge';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  MapPin,
  Activity,
  Download
} from 'lucide-react';
import { Button } from '../design-system/components/Button/Button';

export default function PanoramaExecutivoV3() {
  const { data, isLoading } = useOvitrapData();
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');

  // Anos disponíveis
  const years = useMemo(() => {
    const uniqueYears = [...new Set(data.map(r => r.ano))].filter(Boolean).sort((a, b) => b - a);
    return [
      { value: 'todos', label: 'Todos os anos' },
      ...uniqueYears.map(y => ({ value: String(y), label: String(y) }))
    ];
  }, [data]);

  // Dados filtrados
  const filteredData = useMemo(() => {
    return data.filter(r => {
      if (selectedYear !== 'todos' && String(r.ano) !== selectedYear) return false;
      if (selectedMonth !== 'todos' && String(r.mes_numero) !== selectedMonth) return false;
      return true;
    });
  }, [data, selectedYear, selectedMonth]);

  // Série temporal mensal
  const monthlyData = useMemo(() => {
    const grouped = filteredData.reduce((acc, record) => {
      const key = `${record.ano}-${String(record.mes_numero).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = {
          periodo: key,
          totalOvos: 0,
          ovitrampas: 0,
          positivas: 0,
        };
      }
      acc[key].totalOvos += record.quantidade_ovos || 0;
      acc[key].ovitrampas += 1;
      if (record.quantidade_ovos > 0) acc[key].positivas += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .map((item: any) => ({
        ...item,
        ipo: item.ovitrampas > 0 ? (item.positivas / item.ovitrampas * 100).toFixed(1) : 0,
        mediaOvos: item.ovitrampas > 0 ? (item.totalOvos / item.ovitrampas).toFixed(1) : 0,
      }))
      .sort((a: any, b: any) => a.periodo.localeCompare(b.periodo))
      .slice(-12); // Últimos 12 meses
  }, [filteredData]);

  // Top bairros
  const topBairros = useMemo(() => {
    const grouped = filteredData.reduce((acc, record) => {
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
        ipo: item.total > 0 ? (item.positivas / item.total * 100).toFixed(1) : 0,
      }))
      .sort((a: any, b: any) => b.totalOvos - a.totalOvos)
      .slice(0, 10);
  }, [filteredData]);

  // Métricas gerais
  const metrics = useMemo(() => {
    const totalOvos = filteredData.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const positivas = filteredData.filter(r => r.quantidade_ovos > 0).length;
    const ipo = filteredData.length > 0 ? (positivas / filteredData.length * 100) : 0;
    const bairros = new Set(filteredData.map(r => r.bairro)).size;

    return { totalOvos, positivas, ipo, bairros, total: filteredData.length };
  }, [filteredData]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Panorama Executivo
        </h1>
        <p className="text-lg text-gray-600">
          Análise temporal e distribuição geográfica
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Ano"
              options={years}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              fullWidth
            />
            <Select
              label="Mês"
              options={[
                { value: 'todos', label: 'Todos os meses' },
                { value: '1', label: 'Janeiro' },
                { value: '2', label: 'Fevereiro' },
                { value: '3', label: 'Março' },
                { value: '4', label: 'Abril' },
                { value: '5', label: 'Maio' },
                { value: '6', label: 'Junho' },
                { value: '7', label: 'Julho' },
                { value: '8', label: 'Agosto' },
                { value: '9', label: 'Setembro' },
                { value: '10', label: 'Outubro' },
                { value: '11', label: 'Novembro' },
                { value: '12', label: 'Dezembro' },
              ]}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              fullWidth
            />
            <div className="flex items-end">
              <Button variant="secondary" fullWidth>
                <Download size={20} />
                Exportar Dados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="glass" hoverable>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Activity className="text-red-600" size={24} />
            </div>
            <Badge variant={metrics.ipo > 50 ? 'error' : metrics.ipo > 20 ? 'warning' : 'success'}>
              {metrics.ipo.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">IPO Médio</p>
          <p className="text-4xl font-bold text-gray-900">
            {metrics.ipo.toFixed(1)}%
          </p>
        </Card>

        <Card variant="glass" hoverable>
          <div className="p-3 bg-orange-100 rounded-xl mb-4 w-fit">
            <TrendingUp className="text-orange-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total de Ovos</p>
          <p className="text-4xl font-bold text-gray-900">
            {metrics.totalOvos.toLocaleString()}
          </p>
        </Card>

        <Card variant="glass" hoverable>
          <div className="p-3 bg-primary-100 rounded-xl mb-4 w-fit">
            <Activity className="text-primary-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Ovitrampas</p>
          <p className="text-4xl font-bold text-gray-900">
            {metrics.total}
          </p>
        </Card>

        <Card variant="glass" hoverable>
          <div className="p-3 bg-green-100 rounded-xl mb-4 w-fit">
            <MapPin className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Bairros</p>
          <p className="text-4xl font-bold text-gray-900">
            {metrics.bairros}
          </p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tendência Temporal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tendência Temporal - IPO</CardTitle>
                <CardDescription>Evolução mensal do índice de positividade</CardDescription>
              </div>
              <Calendar className="text-gray-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorIPO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="periodo" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ipo" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  fill="url(#colorIPO)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Total de Ovos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Total de Ovos por Período</CardTitle>
                <CardDescription>Volume de ovos coletados mensalmente</CardDescription>
              </div>
              <TrendingUp className="text-gray-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="periodo" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalOvos" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Total de Ovos"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Bairros */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Bairros - Maior Infestação</CardTitle>
          <CardDescription>Áreas prioritárias para intervenção</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topBairros} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="bairro" type="category" stroke="#6B7280" fontSize={12} width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="totalOvos" fill="#1ABFD1" name="Total de Ovos" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
