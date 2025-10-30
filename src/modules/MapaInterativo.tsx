import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { MapPin, Layers, AlertCircle, TrendingUp } from 'lucide-react';

const MapaInterativo: React.FC = () => {
  const { data } = useApp();
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Processa dados geográficos
  const geoData = useMemo(() => {
    const points = data
      .filter(r => r.latitude && r.longitude && r.bairro)
      .map(r => ({
        lat: r.latitude,
        lng: r.longitude,
        ovos: r.quantidade_ovos || 0,
        bairro: r.bairro,
        id: r.id_ovitrampa,
        riskLevel: (r.quantidade_ovos || 0) > 50 ? 'high' : (r.quantidade_ovos || 0) > 20 ? 'medium' : 'low'
      }));

    // Agrupa por coordenadas próximas
    const clusters = new Map();
    points.forEach(p => {
      const key = `${p.lat.toFixed(3)}-${p.lng.toFixed(3)}`;
      if (!clusters.has(key)) {
        clusters.set(key, { ...p, count: 1, totalOvos: p.ovos });
      } else {
        const existing = clusters.get(key);
        existing.count++;
        existing.totalOvos += p.ovos;
        if (p.ovos > existing.ovos) existing.ovos = p.ovos;
      }
    });

    return Array.from(clusters.values());
  }, [data]);

  const filteredGeoData = useMemo(() => {
    if (selectedRisk === 'all') return geoData;
    return geoData.filter(p => p.riskLevel === selectedRisk);
  }, [geoData, selectedRisk]);

  const stats = useMemo(() => ({
    total: geoData.length,
    high: geoData.filter(p => p.riskLevel === 'high').length,
    medium: geoData.filter(p => p.riskLevel === 'medium').length,
    low: geoData.filter(p => p.riskLevel === 'low').length,
    bairros: new Set(geoData.map(p => p.bairro)).size
  }), [geoData]);

  // Ranking de bairros por concentração
  const bairroRanking = useMemo(() => {
    const bairroMap = new Map();
    geoData.forEach(p => {
      if (!bairroMap.has(p.bairro)) {
        bairroMap.set(p.bairro, { bairro: p.bairro, pontos: 0, totalOvos: 0 });
      }
      const b = bairroMap.get(p.bairro);
      b.pontos++;
      b.totalOvos += p.ovos;
    });
    return Array.from(bairroMap.values())
      .map(b => ({ ...b, densidade: b.totalOvos / b.pontos }))
      .sort((a, b) => b.densidade - a.densidade)
      .slice(0, 10);
  }, [geoData]);

  const getColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#2196F3';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0087A8 0%, #262832 100%)', borderRadius: '12px', padding: '32px', marginBottom: '24px', color: 'white' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>Mapa Interativo</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Visualização geoespacial de ovitrampas e áreas de risco</p>
      </div>

      {/* Estatísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={<MapPin size={20} />} title="Total de Pontos" value={stats.total} color="#0087A8" />
        <StatCard icon={<AlertCircle size={20} />} title="Risco Alto" value={stats.high} color="#F44336" />
        <StatCard icon={<TrendingUp size={20} />} title="Risco Médio" value={stats.medium} color="#FF9800" />
        <StatCard icon={<Layers size={20} />} title="Bairros" value={stats.bairros} color="#4CAF50" />
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'Todos' }, { key: 'high', label: 'Alto Risco' }, { key: 'medium', label: 'Médio Risco' }, { key: 'low', label: 'Baixo Risco' }].map(filter => (
          <button
            key={filter.key}
            onClick={() => setSelectedRisk(filter.key as any)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: selectedRisk === filter.key ? '#0087A8' : '#e0e0e0', color: selectedRisk === filter.key ? 'white' : '#262832', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
          >
            {filter.label} ({filter.key === 'all' ? stats.total : filter.key === 'high' ? stats.high : filter.key === 'medium' ? stats.medium : stats.low})
          </button>
        ))}
      </div>

      {/* Visualização Geográfica */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Distribuição Geográfica de Ovitrampas</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" dataKey="lng" name="Longitude" tick={{ fontSize: 12 }} label={{ value: 'Longitude', position: 'insideBottom', offset: -10 }} />
            <YAxis type="number" dataKey="lat" name="Latitude" tick={{ fontSize: 12 }} label={{ value: 'Latitude', angle: -90, position: 'insideLeft' }} />
            <ZAxis type="number" dataKey="ovos" range={[50, 500]} name="Ovos" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div style={{ backgroundColor: 'white', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <p style={{ margin: 0, fontWeight: '600', marginBottom: '4px' }}>{data.bairro}</p>
                      <p style={{ margin: 0, fontSize: '12px' }}>Ovos: {data.ovos}</p>
                      <p style={{ margin: 0, fontSize: '12px' }}>Pontos: {data.count}</p>
                      <p style={{ margin: 0, fontSize: '12px' }}>Lat: {data.lat.toFixed(4)}</p>
                      <p style={{ margin: 0, fontSize: '12px' }}>Lng: {data.lng.toFixed(4)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Ovitrampas" data={filteredGeoData} fill="#0087A8">
              {filteredGeoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.riskLevel)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '16px', display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#F44336' }} />
            <span>Alto Risco (&gt;50 ovos)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FF9800' }} />
            <span>Médio Risco (20-50 ovos)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#4CAF50' }} />
            <span>Baixo Risco (&lt;20 ovos)</span>
          </div>
        </div>
      </div>

      {/* Ranking de Bairros */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Top 10 Bairros por Densidade de Infestação</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Bairro</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Pontos</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Ovos</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Densidade</th>
              </tr>
            </thead>
            <tbody>
              {bairroRanking.map((b, index) => (
                <tr key={b.bairro} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{index + 1}</td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{b.bairro}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{b.pontos}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{b.totalOvos}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: b.densidade > 50 ? '#F44336' : b.densidade > 20 ? '#FF9800' : '#4CAF50' }}>
                    {b.densidade.toFixed(2)}
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

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number; color: string }> = ({ icon, title, value, color }) => (
  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>{title}</span>
      <div style={{ color }}>{icon}</div>
    </div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color }}>{value}</div>
  </div>
);

export default MapaInterativo;
