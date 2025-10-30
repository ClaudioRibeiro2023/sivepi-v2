import React from 'react';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, loading, error, stats } = useApp();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando dados...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#F44336' }}>
        <AlertTriangle size={48} />
        <p style={{ marginTop: '16px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          Dashboard Principal
        </h1>
        <p style={{ color: '#6c757d' }}>
          Visão geral do sistema de vigilância epidemiológica
        </p>
      </div>

      {/* Cards de Resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <MetricCard
          icon={<Activity size={24} color="#0087A8" />}
          title="Total de Registros"
          value={stats.totalRegistros.toLocaleString('pt-BR')}
          trend="+12% vs mês anterior"
          color="#0087A8"
        />
        <MetricCard
          icon={<TrendingUp size={24} color="#4CAF50" />}
          title="Ovitrampas Ativas"
          value={stats.ovitrampasUnicas}
          trend="Monitoramento ativo"
          color="#4CAF50"
        />
        <MetricCard
          icon={<CheckCircle size={24} color="#2196F3" />}
          title="Bairros Monitorados"
          value={stats.bairrosUnicos}
          trend="Cobertura total"
          color="#2196F3"
        />
        <MetricCard
          icon={<AlertTriangle size={24} color="#FF9800" />}
          title="Total de Ovos"
          value={stats.totalOvos.toLocaleString('pt-BR')}
          trend="Período atual"
          color="#FF9800"
        />
      </div>

      {/* Informações Adicionais */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Bem-vindo ao SIVEPI</h2>
        <p style={{ color: '#6c757d', marginBottom: '16px' }}>
          Sistema Integrado de Vigilância Epidemiológica de Montes Claros/MG.
        </p>
        <ul style={{ color: '#6c757d', paddingLeft: '20px' }}>
          <li>Use o menu lateral para navegar entre os módulos</li>
          <li><strong>Panorama Executivo:</strong> Análises gerenciais e indicadores estratégicos</li>
          <li><strong>Vigilância Entomológica:</strong> Índices técnicos (IPO, IDO, IMO, IVO)</li>
          <li><strong>Sistema Operacional:</strong> Gestão de equipes e intervenções de campo</li>
          <li><strong>Mapa Interativo:</strong> Visualização geoespacial dos dados</li>
        </ul>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, color }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        {icon}
        <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>{title}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#6c757d' }}>
        {trend}
      </div>
    </div>
  );
};

export default Dashboard;
