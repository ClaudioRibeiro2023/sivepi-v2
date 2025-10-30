import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Users, Truck, Package, AlertCircle, CheckCircle, Clock, MapPin, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3'];

interface FieldTeam {
  id: string; name: string; status: string;
  assignedAreas: string[]; completedToday: number; targetDaily: number;
}

interface Intervention {
  id: string; bairro: string; type: string; priority: string;
  status: string; ovosEncontrados: number;
}

const SistemaOperacional: React.FC = () => {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState<'equipes' | 'intervencoes' | 'inventario'>('equipes');

  // Simulação de equipes de campo
  const teams: FieldTeam[] = useMemo(() => [
    { id: '1', name: 'Equipe Alpha', status: 'ATIVO', assignedAreas: ['CENTRO', 'JARAGUÁ'], completedToday: 12, targetDaily: 20 },
    { id: '2', name: 'Equipe Bravo', status: 'EM_ROTA', assignedAreas: ['SANTOS REIS', 'SÃO LUIZ'], completedToday: 8, targetDaily: 15 },
    { id: '3', name: 'Equipe Charlie', status: 'INTERVENÇÃO', assignedAreas: ['CINTRA', 'IBITURUNA'], completedToday: 15, targetDaily: 25 }
  ], []);

  // Gera intervenções baseadas nos dados reais
  const interventions: Intervention[] = useMemo(() => {
    const critical = data
      .filter(r => (r.quantidade_ovos || 0) > 50)
      .slice(0, 15)
      .map((r, i) => ({
        id: `int-${i}`,
        bairro: r.bairro || 'NÃO INFORMADO',
        type: r.quantidade_ovos > 80 ? 'ELIMINAÇÃO' : 'LARVICIDA',
        priority: r.quantidade_ovos > 100 ? 'CRÍTICA' : 'ALTA',
        status: i < 5 ? 'CONCLUÍDA' : i < 10 ? 'EM_ANDAMENTO' : 'AGENDADA',
        ovosEncontrados: r.quantidade_ovos
      }));
    return critical;
  }, [data]);

  // Estatísticas do inventário
  const inventory = [
    { name: 'BTI (Larvicida)', current: 45, min: 20, unit: 'kg', status: 'OK' },
    { name: 'Máscaras PFF2', current: 120, min: 50, unit: 'un', status: 'OK' },
    { name: 'Luvas Nitrílicas', current: 85, min: 30, unit: 'par', status: 'OK' },
    { name: 'Pulverizadores', current: 8, min: 3, unit: 'un', status: 'OK' }
  ];

  // Estatísticas de intervenções
  const interventionStats = useMemo(() => {
    const statusCount = interventions.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Concluídas', value: statusCount['CONCLUÍDA'] || 0, color: '#4CAF50' },
      { name: 'Em Andamento', value: statusCount['EM_ANDAMENTO'] || 0, color: '#FF9800' },
      { name: 'Agendadas', value: statusCount['AGENDADA'] || 0, color: '#2196F3' }
    ];
  }, [interventions]);

  const priorityStats = useMemo(() => {
    const priorityCount = interventions.reduce((acc, i) => {
      acc[i.priority] = (acc[i.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { priority: 'CRÍTICA', count: priorityCount['CRÍTICA'] || 0 },
      { priority: 'ALTA', count: priorityCount['ALTA'] || 0 },
      { priority: 'MÉDIA', count: priorityCount['MÉDIA'] || 0 }
    ];
  }, [interventions]);

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0087A8 0%, #262832 100%)', borderRadius: '12px', padding: '32px', marginBottom: '24px', color: 'white' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>Sistema Operacional</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Gestão de equipes, intervenções de campo e controle de inventário</p>
      </div>

      {/* Métricas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <QuickMetric icon={<Users size={24} />} title="Equipes Ativas" value={teams.filter(t => t.status !== 'OFFLINE').length} color="#0087A8" />
        <QuickMetric icon={<Activity size={24} />} title="Intervenções Hoje" value={interventions.filter(i => i.status === 'EM_ANDAMENTO').length} color="#FF9800" />
        <QuickMetric icon={<CheckCircle size={24} />} title="Concluídas" value={interventions.filter(i => i.status === 'CONCLUÍDA').length} color="#4CAF50" />
        <QuickMetric icon={<AlertCircle size={24} />} title="Prioridade Crítica" value={interventions.filter(i => i.priority === 'CRÍTICA').length} color="#F44336" />
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', borderBottom: '2px solid #e0e0e0' }}>
        {(['equipes', 'intervencoes', 'inventario'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '12px 24px', border: 'none', borderBottom: activeTab === tab ? '3px solid #0087A8' : 'none', backgroundColor: 'transparent', color: activeTab === tab ? '#0087A8' : '#6c757d', cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', fontSize: '16px', transition: 'all 0.2s' }}
          >
            {tab === 'equipes' ? 'Equipes de Campo' : tab === 'intervencoes' ? 'Intervenções' : 'Inventário'}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'equipes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {teams.map(team => (
              <div key={team.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{team.name}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>ID: {team.id}</p>
                  </div>
                  <StatusBadge status={team.status} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MapPin size={16} color="#0087A8" />
                    <span style={{ fontSize: '14px' }}><strong>Áreas:</strong> {team.assignedAreas.join(', ')}</span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                      <span>Progresso Diário</span>
                      <span><strong>{team.completedToday}/{team.targetDaily}</strong></span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(team.completedToday / team.targetDaily) * 100}%`, height: '100%', backgroundColor: '#4CAF50', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'intervencoes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Status das Intervenções</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={interventionStats} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {interventionStats.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Prioridade das Intervenções</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0087A8" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Lista de Intervenções</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Bairro</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Prioridade</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Ovos</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map(inter => (
                    <tr key={inter.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>{inter.id}</td>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{inter.bairro}</td>
                      <td style={{ padding: '12px' }}>{inter.type}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', backgroundColor: inter.priority === 'CRÍTICA' ? '#F4433620' : '#FF980020', color: inter.priority === 'CRÍTICA' ? '#F44336' : '#FF9800' }}>
                          {inter.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', backgroundColor: inter.status === 'CONCLUÍDA' ? '#4CAF5020' : inter.status === 'EM_ANDAMENTO' ? '#FF980020' : '#2196F320', color: inter.status === 'CONCLUÍDA' ? '#4CAF50' : inter.status === 'EM_ANDAMENTO' ? '#FF9800' : '#2196F3' }}>
                          {inter.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>{inter.ovosEncontrados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventario' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Controle de Inventário</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {inventory.map((item, index) => (
              <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', borderLeft: `4px solid ${item.current > item.min * 1.5 ? '#4CAF50' : item.current > item.min ? '#FF9800' : '#F44336'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{item.name}</h3>
                  <Package size={20} color="#0087A8" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: item.current > item.min * 1.5 ? '#4CAF50' : item.current > item.min ? '#FF9800' : '#F44336' }}>
                  {item.current} {item.unit}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Mínimo: {item.min} {item.unit}</div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#4CAF50', backgroundColor: '#4CAF5020', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const QuickMetric: React.FC<{ icon: React.ReactNode; title: string; value: number; color: string }> = ({ icon, title, value, color }) => (
  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>{title}</span>
      <div style={{ color }}>{icon}</div>
    </div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = { ATIVO: '#4CAF50', EM_ROTA: '#2196F3', 'INTERVENÇÃO': '#FF9800', OFFLINE: '#9E9E9E' };
  return (<span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: colors[status] + '20', color: colors[status] }}>{status}</span>);
};

export default SistemaOperacional;
