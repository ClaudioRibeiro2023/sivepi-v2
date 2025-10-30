import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const COLORS = ['#0087A8', '#FF6B35', '#4CAF50', '#FF9800', '#9C27B0', '#2196F3'];

const PanoramaExecutivo: React.FC = () => {
  const { data, filters, setFilters, preferences } = useApp();
  const [selectedView, setSelectedView] = useState<'monthly' | 'weekly'>('monthly');

  // Processamento de dados mensais
  const monthlyData = useMemo(() => {
    if (data.length === 0) return [];

    const monthlyMap = new Map();
    
    data.forEach(record => {
      if (!record.mes_numero || !record.ano) return;
      
      const key = `${record.ano}-${String(record.mes_numero).padStart(2, '0')}`;
      
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: record.mes_numero,
          year: record.ano,
          monthName: record.mes_nome || `Mês ${record.mes_numero}`,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0,
          ovitrampas: new Set()
        });
      }
      
      const monthData = monthlyMap.get(key);
      monthData.totalOvos += record.quantidade_ovos || 0;
      monthData.totalRegistros++;
      if ((record.quantidade_ovos || 0) > 0) monthData.positivos++;
      monthData.ovitrampas.add(record.id_ovitrampa);
    });

    return Array.from(monthlyMap.values())
      .map(m => ({
        period: `${m.monthName.substring(0, 3)}/${m.year}`,
        fullPeriod: `${m.monthName}/${m.year}`,
        month: m.month,
        year: m.year,
        mediaOvos: m.totalRegistros > 0 ? m.totalOvos / m.totalRegistros : 0,
        ipo: m.totalRegistros > 0 ? (m.positivos / m.totalRegistros) * 100 : 0,
        totalOvos: m.totalOvos,
        ovitrampas: m.ovitrampas.size,
        registros: m.totalRegistros
      }))
      .sort((a, b) => a.year - b.year || a.month - b.month);
  }, [data]);

  // Processamento de dados semanais
  const weeklyData = useMemo(() => {
    if (data.length === 0) return [];

    const weeklyMap = new Map();
    
    data.forEach(record => {
      if (!record.semana_epidemiologica || !record.ano) return;
      
      const key = `${record.ano}-${record.semana_epidemiologica}`;
      
      if (!weeklyMap.has(key)) {
        weeklyMap.set(key, {
          week: record.semana_epidemiologica,
          year: record.ano,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0
        });
      }
      
      const weekData = weeklyMap.get(key);
      weekData.totalOvos += record.quantidade_ovos || 0;
      weekData.totalRegistros++;
      if ((record.quantidade_ovos || 0) > 0) weekData.positivos++;
    });

    return Array.from(weeklyMap.values())
      .map(w => ({
        period: `S${w.week}/${w.year}`,
        week: w.week,
        year: w.year,
        mediaOvos: w.totalRegistros > 0 ? w.totalOvos / w.totalRegistros : 0,
        ipo: w.totalRegistros > 0 ? (w.positivos / w.totalRegistros) * 100 : 0,
        totalOvos: w.totalOvos,
        registros: w.totalRegistros
      }))
      .sort((a, b) => a.year - b.year || a.week - b.week);
  }, [data]);

  // Dados de bairros
  const neighborhoodData = useMemo(() => {
    if (data.length === 0) return [];

    const neighborhoodMap = new Map();
    
    data.forEach(record => {
      if (!record.bairro?.trim()) return;
      
      const bairro = record.bairro.trim().toUpperCase();
      
      if (!neighborhoodMap.has(bairro)) {
        neighborhoodMap.set(bairro, {
          name: bairro,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0
        });
      }
      
      const neighborhood = neighborhoodMap.get(bairro);
      neighborhood.totalOvos += record.quantidade_ovos || 0;
      neighborhood.totalRegistros++;
      if ((record.quantidade_ovos || 0) > 0) neighborhood.positivos++;
    });

    return Array.from(neighborhoodMap.values())
      .map(n => ({
        name: n.name,
        ipo: n.totalRegistros > 0 ? (n.positivos / n.totalRegistros) * 100 : 0,
        totalOvos: n.totalOvos,
        registros: n.totalRegistros
      }))
      .filter(n => n.registros >= 10)
      .sort((a, b) => b.ipo - a.ipo)
      .slice(0, 10);
  }, [data]);

  const currentData = selectedView === 'monthly' ? monthlyData : weeklyData;
  const latestData = currentData[currentData.length - 1];
  const previousData = currentData[currentData.length - 2];

  // Cálculo de tendências
  const ipoTrend = latestData && previousData 
    ? ((latestData.ipo - previousData.ipo) / previousData.ipo) * 100 
    : 0;
  
  const ovosTrend = latestData && previousData
    ? ((latestData.mediaOvos - previousData.mediaOvos) / previousData.mediaOvos) * 100
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0087A8 0%, #262832 100%)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
          Panorama Executivo
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Análises gerenciais e indicadores estratégicos do programa de vigilância
        </p>
      </div>

      {/* Métricas Resumidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <MetricCard
          title="IPO Atual"
          value={latestData ? `${latestData.ipo.toFixed(1)}%` : '-'}
          trend={ipoTrend}
          icon={<TrendingUp size={24} />}
          color="#0087A8"
        />
        <MetricCard
          title="Média de Ovos"
          value={latestData ? latestData.mediaOvos.toFixed(1) : '-'}
          trend={ovosTrend}
          icon={<Calendar size={24} />}
          color="#FF6B35"
        />
        <MetricCard
          title="Ovitrampas Ativas"
          value={latestData ? latestData.ovitrampas || '-' : '-'}
          trend={null}
          icon={<CheckCircle size={24} />}
          color="#4CAF50"
        />
        <MetricCard
          title="Total de Registros"
          value={latestData ? latestData.registros.toLocaleString('pt-BR') : '-'}
          trend={null}
          icon={<AlertTriangle size={24} />}
          color="#FF9800"
        />
      </div>

      {/* Controles de Visualização */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setSelectedView('monthly')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: selectedView === 'monthly' ? '#0087A8' : '#e0e0e0',
            color: selectedView === 'monthly' ? 'white' : '#262832',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Visão Mensal
        </button>
        <button
          onClick={() => setSelectedView('weekly')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: selectedView === 'weekly' ? '#0087A8' : '#e0e0e0',
            color: selectedView === 'weekly' ? 'white' : '#262832',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Visão Semanal
        </button>
      </div>

      {/* Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Gráfico de Linha - IPO */}
        <ChartCard title="Evolução do IPO">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ipo" 
                stroke="#0087A8" 
                strokeWidth={2}
                name="IPO (%)"
                dot={{ fill: '#0087A8', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Área - Média de Ovos */}
        <ChartCard title="Média de Ovos por Período">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="mediaOvos" 
                stroke="#FF6B35" 
                fill="#FF6B35" 
                fillOpacity={0.3}
                name="Média de Ovos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Barras - Total de Ovos */}
        <ChartCard title="Total de Ovos por Período">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalOvos" fill="#4CAF50" name="Total de Ovos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Pizza - Top 10 Bairros */}
        <ChartCard title="Top 10 Bairros por IPO">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={neighborhoodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, ipo }) => `${name}: ${ipo.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="ipo"
              >
                {neighborhoodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabela de Bairros */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>
          Ranking de Bairros por IPO
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Bairro</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>IPO (%)</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Ovos</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Registros</th>
              </tr>
            </thead>
            <tbody>
              {neighborhoodData.map((neighborhood, index) => (
                <tr key={neighborhood.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{index + 1}</td>
                  <td style={{ padding: '12px' }}>{neighborhood.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: getRiskColor(neighborhood.ipo) }}>
                    {neighborhood.ipo.toFixed(1)}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {neighborhood.totalOvos.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {neighborhood.registros.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
interface MetricCardProps {
  title: string;
  value: string;
  trend: number | null;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, color }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>{title}</span>
        <div style={{ color }}>{icon}</div>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
        {value}
      </div>
      {trend !== null && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontSize: '14px',
          color: trend > 0 ? '#F44336' : '#4CAF50'
        }}>
          {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
        {title}
      </h3>
      {children}
    </div>
  );
};

const getRiskColor = (ipo: number): string => {
  if (ipo > 30) return '#F44336';
  if (ipo > 15) return '#FF9800';
  return '#4CAF50';
};

export default PanoramaExecutivo;
