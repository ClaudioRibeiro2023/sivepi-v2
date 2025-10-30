import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';

const VigilanciaEntomologica: React.FC = () => {
  const { data, preferences } = useApp();

  // Cálculo dos índices técnicos
  const indices = useMemo(() => {
    if (data.length === 0) {
      return {
        ipo: 0, ido: 0, imo: 0, ivo: 0,
        totalOvitraps: 0, positiveOvitraps: 0, totalEggs: 0,
        neighborhoodRanking: [], radarData: []
      };
    }

    // IPO - Índice de Positividade de Ovitrampas
    const uniqueOvitraps = new Set(data.map(r => r.id_ovitrampa));
    const positiveOvitraps = new Set(data.filter(r => r.quantidade_ovos > 0).map(r => r.id_ovitrampa));
    const totalOvitraps = uniqueOvitraps.size;
    const positiveOvitrapsCount = positiveOvitraps.size;
    const ipo = totalOvitraps > 0 ? (positiveOvitrapsCount / totalOvitraps) * 100 : 0;
    
    // IDO - Índice de Densidade de Ovos
    const totalEggs = data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const ido = positiveOvitrapsCount > 0 ? totalEggs / positiveOvitrapsCount : 0;
    
    // IMO - Índice Médio de Ovos
    const imo = data.length > 0 ? totalEggs / data.length : 0;
    
    // IVO - Índice de Variação de Oviposição
    const eggCounts = data.map(r => r.quantidade_ovos || 0);
    const mean = imo;
    const variance = eggCounts.length > 0 
      ? eggCounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / eggCounts.length 
      : 0;
    const ivo = mean > 0 ? (Math.sqrt(variance) / mean * 100) : 0;

    // Ranking de bairros
    const neighborhoodMap = new Map();
    data.forEach(record => {
      if (!record.bairro?.trim()) return;
      const bairro = record.bairro.trim().toUpperCase();
      if (!neighborhoodMap.has(bairro)) {
        neighborhoodMap.set(bairro, { name: bairro, totalOvos: 0, totalColetas: 0, ovitraps: new Set() });
      }
      const n = neighborhoodMap.get(bairro);
      n.totalOvos += record.quantidade_ovos || 0;
      n.totalColetas++;
      n.ovitraps.add(record.id_ovitrampa);
    });

    const neighborhoodRanking = Array.from(neighborhoodMap.values())
      .map(n => ({
        name: n.name,
        density: n.totalColetas > 0 ? n.totalOvos / n.totalColetas : 0,
        totalOvos: n.totalOvos,
        ovitraps: n.ovitraps.size,
        coletas: n.totalColetas
      }))
      .filter(n => n.coletas >= 10)
      .sort((a, b) => b.density - a.density)
      .slice(0, 15);

    // Dados para radar
    const radarData = [
      { subject: 'IPO', value: Math.min(ipo / 20, 5), fullMark: 5 },
      { subject: 'IDO', value: Math.min(ido / 20, 5), fullMark: 5 },
      { subject: 'IMO', value: Math.min(imo / 10, 5), fullMark: 5 },
      { subject: 'IVO', value: Math.min(ivo / 40, 5), fullMark: 5 }
    ];

    return {
      ipo, ido, imo, ivo,
      totalOvitraps, positiveOvitraps: positiveOvitrapsCount, totalEggs,
      neighborhoodRanking, radarData
    };
  }, [data]);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0087A8 0%, #262832 100%)',
        borderRadius: '12px', padding: '32px', marginBottom: '24px', color: 'white'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
          Vigilância Entomológica
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Índices técnicos especializados para avaliação entomológica (IPO, IDO, IMO, IVO)
        </p>
      </div>

      {/* Cards dos Índices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <IndexCard
          title="IPO - Índice de Positividade"
          subtitle="Ovitrampas Positivas"
          value={`${indices.ipo.toFixed(1)}%`}
          detail={`${indices.positiveOvitraps} de ${indices.totalOvitraps} ovitrampas`}
          riskLevel={indices.ipo > 30 ? 'CRÍTICO' : indices.ipo > 15 ? 'ALERTA' : 'CONTROLADO'}
          color={indices.ipo > 30 ? '#F44336' : indices.ipo > 15 ? '#FF9800' : '#4CAF50'}
          icon={<Activity size={24} />}
          formula="IPO = (Ovitrampas Positivas / Total) × 100"
          interpretation=">30% = situação epidêmica | 15-30% = alerta | <15% = focal"
        />
        <IndexCard
          title="IDO - Índice de Densidade"
          subtitle="Ovos por Ovitrampa Positiva"
          value={indices.ido.toFixed(1)}
          detail={`${indices.totalEggs.toLocaleString('pt-BR')} ovos totais`}
          riskLevel={indices.ido > 50 ? 'ALTA DENSIDADE' : indices.ido > 20 ? 'MÉDIA' : 'BAIXA'}
          color={indices.ido > 50 ? '#F44336' : indices.ido > 20 ? '#FF9800' : '#4CAF50'}
          icon={<TrendingUp size={24} />}
          formula="IDO = Total de Ovos / Ovitrampas Positivas"
          interpretation=">50 = alta densidade | 20-50 = moderada | <20 = baixa"
        />
        <IndexCard
          title="IMO - Índice Médio"
          subtitle="Média Geral de Ovos"
          value={indices.imo.toFixed(1)}
          detail={`${data.length.toLocaleString('pt-BR')} coletas realizadas`}
          riskLevel={indices.imo > 25 ? 'ALTA ATIVIDADE' : indices.imo > 10 ? 'MÉDIA' : 'BAIXA'}
          color={indices.imo > 25 ? '#F44336' : indices.imo > 10 ? '#FF9800' : '#4CAF50'}
          icon={<BarChart3 size={24} />}
          formula="IMO = Total de Ovos / Total de Coletas"
          interpretation=">25 = alta atividade | 10-25 = moderada | <10 = baixa"
        />
        <IndexCard
          title="IVO - Índice de Variação"
          subtitle="Coeficiente de Variação"
          value={`${indices.ivo.toFixed(1)}%`}
          detail="Heterogeneidade espacial"
          riskLevel={indices.ivo > 100 ? 'MUITO IRREGULAR' : indices.ivo > 50 ? 'MODERADO' : 'HOMOGÊNEO'}
          color={indices.ivo > 100 ? '#F44336' : indices.ivo > 50 ? '#FF9800' : '#4CAF50'}
          icon={<AlertTriangle size={24} />}
          formula="IVO = (Desvio Padrão / Média) × 100"
          interpretation=">100% = muito heterogêneo | 50-100% = moderado | <50% = homogêneo"
        />
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Radar dos Índices */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Panorama Integrado dos Índices</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={indices.radarData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 14, fontWeight: '500' }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Radar name="Índices" dataKey="value" stroke="#0087A8" fill="#0087A8" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '12px', textAlign: 'center' }}>
            Valores normalizados em escala 0-5 para comparação integrada
          </p>
        </div>

        {/* Ranking de Bairros */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Top 15 Bairros por Densidade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={indices.neighborhoodRanking.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="density" fill="#0087A8" name="Densidade (ovos/coleta)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Ranking Detalhado de Bairros</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Bairro</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Densidade</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Ovos</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Ovitrampas</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Coletas</th>
              </tr>
            </thead>
            <tbody>
              {indices.neighborhoodRanking.map((n, index) => (
                <tr key={n.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{index + 1}</td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{n.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#0087A8' }}>
                    {n.density.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{n.totalOvos.toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{n.ovitraps}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{n.coletas.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Índice
interface IndexCardProps {
  title: string; subtitle: string; value: string; detail: string;
  riskLevel: string; color: string; icon: React.ReactNode;
  formula: string; interpretation: string;
}

const IndexCard: React.FC<IndexCardProps> = ({ title, subtitle, value, detail, riskLevel, color, icon, formula, interpretation }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#9e9e9e' }}>{subtitle}</p>
        </div>
        <div style={{ color }}>{icon}</div>
      </div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>{detail}</div>
      <div style={{ fontSize: '11px', fontWeight: '500', color, backgroundColor: color + '20', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
        {riskLevel}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', padding: '8px', marginTop: '8px', border: `1px solid ${color}`, borderRadius: '6px', backgroundColor: 'transparent', color, cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
      >
        {expanded ? 'Ocultar Detalhes ▲' : 'Ver Detalhes ▼'}
      </button>
      {expanded && (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '11px' }}>
          <div style={{ marginBottom: '8px' }}><strong>Fórmula:</strong> {formula}</div>
          <div><strong>Interpretação:</strong> {interpretation}</div>
        </div>
      )}
    </div>
  );
};

export default VigilanciaEntomologica;
