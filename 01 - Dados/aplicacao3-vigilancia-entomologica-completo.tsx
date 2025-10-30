import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Interface para os registros de dados
interface AedesRecord {
  id_registro: number;
  id_ovitrampa: number;
  data_instalacao: string;
  data_coleta: string;
  quantidade_ovos: number;
  ano: number;
  mes_numero: number;
  mes_nome: string;
  trimestre: number;
  semana_epidemiologica: number;
  bairro: string;
  municipio: string;
  uf: string;
  estado: string;
  codigo_ibge: number;
  latitude: number;
  longitude: number;
  peso_ovitrampa: number;
  reincidencia: number;
  percentual_diferenca: number;
  time_original: string;
  linha_original: number;
  data_processamento: string;
  status_qualidade: string;
}

// Paleta de cores do projeto
const PROJECT_COLORS = {
  primary: '#0087A8',
  secondary: '#262832',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3'
};

// Componente Loading
const LoadingState: React.FC = () => {
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: spinnerStyle }} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: `4px solid ${PROJECT_COLORS.primary}30`,
          borderTop: `4px solid ${PROJECT_COLORS.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ color: PROJECT_COLORS.primary, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Carregando Vigilância Entomológica
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            Processando dados de ovitrampas...
          </div>
        </div>
      </div>
    </>
  );
};

// Componente de ContextBox colapsível
const ContextBox: React.FC<{
  title: string;
  description: string;
  formula?: string;
  interpretation: string;
  period: string;
  theme: any;
  explainMode: boolean;
}> = ({ title, description, formula, interpretation, period, theme, explainMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      marginTop: '12px',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '8px 12px',
          backgroundColor: theme.colors.bg,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isExpanded ? `1px solid ${theme.colors.border}` : 'none'
        }}
      >
        <div style={{
          fontSize: '9px',
          color: PROJECT_COLORS.primary,
          backgroundColor: PROJECT_COLORS.primary + '10',
          padding: '2px 6px',
          borderRadius: '3px',
          fontWeight: 'bold'
        }}>
          {period}
        </div>
        <div style={{
          fontSize: '10px',
          color: theme.colors.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {title} {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      
      {isExpanded && (
        <div style={{
          padding: '12px',
          backgroundColor: theme.colors.bg,
          fontSize: '11px'
        }}>
          <div style={{ 
            color: theme.colors.textSecondary,
            marginBottom: '8px',
            lineHeight: '1.4'
          }}>
            {description}
          </div>
          {formula && (
            <div style={{
              backgroundColor: theme.colors.surface,
              padding: '6px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '10px',
              margin: '6px 0',
              border: `1px solid ${PROJECT_COLORS.primary}30`
            }}>
              <strong>{explainMode ? 'Como calculamos:' : 'Fórmula:'}</strong> {formula}
            </div>
          )}
          <div style={{ 
            color: theme.colors.text,
            fontSize: '10px',
            fontStyle: 'italic'
          }}>
            {interpretation}
          </div>
        </div>
      )}
    </div>
  );
};

// Função para estilo de card
const cardStyle = (theme: any) => ({
  backgroundColor: theme.colors.cardBg,
  borderRadius: '8px',
  padding: '16px',
  boxShadow: theme.colors.bg === '#1a1a1a' ? 
    '0 2px 8px rgba(0,0,0,0.3)' : 
    '0 2px 8px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.colors.border}`
});

// Função para obter período de análise
const getAnalysisPeriod = (data: AedesRecord[], selectedYear?: string, selectedMonth?: string): string => {
  if (data.length === 0) return "Sem dados";
  
  let filteredData = data;
  
  if (selectedYear) {
    filteredData = filteredData.filter(r => r.ano.toString() === selectedYear);
  }
  
  if (selectedMonth) {
    filteredData = filteredData.filter(r => r.mes_nome === selectedMonth);
  }
    
  if (filteredData.length === 0) return "Sem dados para o período selecionado";
  
  const dates = filteredData.map(r => new Date(r.data_coleta)).sort((a, b) => a.getTime() - b.getTime());
  const startDate = dates[0].toLocaleDateString('pt-BR');
  const endDate = dates[dates.length - 1].toLocaleDateString('pt-BR');
  
  let periodLabel = '';
  
  if (selectedYear && selectedMonth) {
    periodLabel = `${selectedMonth}/${selectedYear}`;
  } else if (selectedYear) {
    periodLabel = `Ano ${selectedYear}`;
  } else if (selectedMonth) {
    periodLabel = `${selectedMonth} (todos os anos)`;
  } else {
    periodLabel = `Período completo`;
  }
  
  return `${periodLabel} - ${startDate} até ${endDate}`;
};

// Aba 3: Índices Técnicos
const IndicesTecnicos: React.FC<{data: AedesRecord[], selectedYear: string, selectedMonth: string, theme: any, explainMode: boolean}> = React.memo(({ data, selectedYear, selectedMonth, theme, explainMode }) => {
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedYear) {
      filtered = filtered.filter(r => r.ano.toString() === selectedYear);
    }
    if (selectedMonth) {
      filtered = filtered.filter(r => r.mes_nome === selectedMonth);
    }
    return filtered;
  }, [data, selectedYear, selectedMonth]);

  const indices = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        ipo: 0,
        ido: 0,
        imo: 0,
        ivo: 0,
        totalOvitraps: 0,
        positiveOvitraps: 0,
        totalEggs: 0,
        neighborhoodRanking: [],
        radarData: []
      };
    }

    // Cálculo do IPO (Índice de Positividade de Ovitrampas)
    const uniqueOvitraps = new Set(filteredData.map(r => r.id_ovitrampa));
    const positiveOvitraps = new Set(filteredData.filter(r => r.quantidade_ovos > 0).map(r => r.id_ovitrampa));
    const totalOvitraps = uniqueOvitraps.size;
    const positiveOvitrapsCount = positiveOvitraps.size;
    const ipo = totalOvitraps > 0 ? (positiveOvitrapsCount / totalOvitraps) * 100 : 0;
    
    // Cálculo do IDO (Índice de Densidade de Ovos)
    const totalEggs = filteredData.reduce((sum, r) => sum + r.quantidade_ovos, 0);
    const ido = positiveOvitrapsCount > 0 ? totalEggs / positiveOvitrapsCount : 0;
    
    // Cálculo do IMO (Índice Médio de Ovos)
    const imo = filteredData.length > 0 ? totalEggs / filteredData.length : 0;
    
    // Cálculo do IVO (Índice de Variação de Oviposição)
    const eggCounts = filteredData.map(r => r.quantidade_ovos);
    const mean = imo;
    const variance = eggCounts.length > 0 ? eggCounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / eggCounts.length : 0;
    const ivo = mean > 0 ? (Math.sqrt(variance) / mean * 100) : 0;

    // Ranking de bairros por densidade
    const neighborhoodMap = filteredData.reduce((acc, record) => {
      if (!record.bairro?.trim()) return acc;
      
      const bairro = record.bairro.trim().toUpperCase();
      if (!acc[bairro]) {
        acc[bairro] = {
          name: bairro,
          totalOvos: 0,
          totalColetas: 0,
          ovitraps: new Set()
        };
      }
      
      acc[bairro].totalOvos += record.quantidade_ovos;
      acc[bairro].totalColetas++;
      acc[bairro].ovitraps.add(record.id_ovitrampa);
      return acc;
    }, {} as any);

    const neighborhoodRanking = Object.values(neighborhoodMap)
      .map((n: any) => ({
        name: n.name,
        density: n.totalColetas > 0 ? n.totalOvos / n.totalColetas : 0,
        totalOvos: n.totalOvos,
        ovitraps: n.ovitraps.size,
        coletas: n.totalColetas
      }))
      .filter(n => n.coletas >= 10) // Filtrar apenas bairros com dados suficientes
      .sort((a, b) => b.density - a.density);

    // Dados para o radar chart
    const radarData = [
      { 
        subject: explainMode ? 'Cobertura' : 'IPO', 
        A: Math.min(ipo / 100 * 5, 5), 
        fullMark: 5 
      },
      { 
        subject: explainMode ? 'Intensidade' : 'IDO', 
        A: Math.min(ido / 100 * 5, 5), 
        fullMark: 5 
      },
      { 
        subject: explainMode ? 'Média Geral' : 'IMO', 
        A: Math.min(imo / 50 * 5, 5), 
        fullMark: 5 
      },
      { 
        subject: explainMode ? 'Variabilidade' : 'IVO', 
        A: Math.min(ivo / 200 * 5, 5), 
        fullMark: 5 
      }
    ];

    return {
      ipo,
      ido,
      imo,
      ivo,
      totalOvitraps,
      positiveOvitraps: positiveOvitrapsCount,
      totalEggs,
      neighborhoodRanking: neighborhoodRanking.slice(0, 15),
      radarData
    };
  }, [filteredData, explainMode]);

  const period = getAnalysisPeriod(filteredData, selectedYear, selectedMonth);

  return (
    <div>
      {/* Header Contextual */}
      <div style={{
        background: `linear-gradient(135deg, ${PROJECT_COLORS.primary} 0%, ${PROJECT_COLORS.secondary} 100%)`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>
          {explainMode ? 'Indicadores Epidemiológicos' : 'Índices Técnicos Especializados'}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {explainMode 
            ? 'Métricas padronizadas para avaliação da infestação e tomada de decisões'
            : 'Índices entomológicos normatizados conforme protocolo MS/PAHO'
          }
        </p>
      </div>

      {/* Cards dos Índices Principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${indices.ipo > 30 ? PROJECT_COLORS.danger : indices.ipo > 15 ? PROJECT_COLORS.warning : PROJECT_COLORS.success}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'TAXA DE COBERTURA (IPO)' : 'IPO - ÍNDICE DE POSITIVIDADE'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.primary, marginBottom: '8px' }}>
            {indices.ipo.toFixed(1)}%
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
            {indices.positiveOvitraps} de {indices.totalOvitraps} ovitrampas positivas
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: indices.ipo > 30 ? PROJECT_COLORS.danger : indices.ipo > 15 ? PROJECT_COLORS.warning : PROJECT_COLORS.success,
            backgroundColor: (indices.ipo > 30 ? PROJECT_COLORS.danger : indices.ipo > 15 ? PROJECT_COLORS.warning : PROJECT_COLORS.success) + '20',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {indices.ipo > 30 ? (explainMode ? 'SITUAÇÃO CRÍTICA' : 'ALTO RISCO') : 
             indices.ipo > 15 ? (explainMode ? 'ATENÇÃO REQUERIDA' : 'RISCO MODERADO') : 
             (explainMode ? 'SITUAÇÃO CONTROLADA' : 'BAIXO RISCO')}
          </div>
          
          <ContextBox
            title={explainMode ? 'Taxa de Cobertura da Infestação' : 'Índice de Positividade de Ovitrampas'}
            description={explainMode ? 
              'Percentual de armadilhas que capturaram ovos, indicando a distribuição geográfica da infestação.' :
              'Proporção de ovitrampas positivas em relação ao total instalado, medindo dispersão espacial do vetor.'
            }
            formula="IPO = (Ovitrampas Positivas / Total de Ovitrampas) × 100"
            interpretation={explainMode ?
              'Valores acima de 30% indicam infestação generalizada, requerendo ação imediata em toda área.' :
              'IPO >30% = situação epidêmica; 15-30% = alerta; <15% = infestação focal.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${indices.ido > 50 ? PROJECT_COLORS.danger : indices.ido > 20 ? PROJECT_COLORS.warning : PROJECT_COLORS.success}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'INTENSIDADE MÉDIA (IDO)' : 'IDO - ÍNDICE DE DENSIDADE'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.warning, marginBottom: '8px' }}>
            {indices.ido.toFixed(1)}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
            ovos por ovitrampa positiva
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: indices.ido > 50 ? PROJECT_COLORS.danger : indices.ido > 20 ? PROJECT_COLORS.warning : PROJECT_COLORS.success,
            backgroundColor: (indices.ido > 50 ? PROJECT_COLORS.danger : indices.ido > 20 ? PROJECT_COLORS.warning : PROJECT_COLORS.success) + '20',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {indices.ido > 50 ? (explainMode ? 'DENSIDADE CRÍTICA' : 'ALTA DENSIDADE') : 
             indices.ido > 20 ? (explainMode ? 'DENSIDADE MODERADA' : 'MÉDIA DENSIDADE') : 
             (explainMode ? 'DENSIDADE BAIXA' : 'BAIXA DENSIDADE')}
          </div>
          
          <ContextBox
            title={explainMode ? 'Intensidade da Reprodução' : 'Índice de Densidade de Ovos'}
            description={explainMode ?
              'Número médio de ovos encontrados nas armadilhas que capturaram ovos, medindo intensidade reprodutiva.' :
              'Média de ovos por ovitrampa positiva, indicando densidade populacional nas áreas infestadas.'
            }
            formula="IDO = Total de Ovos / Número de Ovitrampas Positivas"
            interpretation={explainMode ?
              'Valores altos indicam reprodução intensa, mesmo com poucas armadilhas positivas.' :
              'IDO >50 = alta densidade populacional; 20-50 = densidade moderada; <20 = baixa densidade.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${indices.imo > 25 ? PROJECT_COLORS.danger : indices.imo > 10 ? PROJECT_COLORS.warning : PROJECT_COLORS.success}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'MÉDIA GERAL (IMO)' : 'IMO - ÍNDICE MÉDIO'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.info, marginBottom: '8px' }}>
            {indices.imo.toFixed(1)}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
            ovos por coleta realizada
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: indices.imo > 25 ? PROJECT_COLORS.danger : indices.imo > 10 ? PROJECT_COLORS.warning : PROJECT_COLORS.success,
            backgroundColor: (indices.imo > 25 ? PROJECT_COLORS.danger : indices.imo > 10 ? PROJECT_COLORS.warning : PROJECT_COLORS.success) + '20',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {indices.imo > 25 ? (explainMode ? 'ATIVIDADE INTENSA' : 'ALTA ATIVIDADE') : 
             indices.imo > 10 ? (explainMode ? 'ATIVIDADE MODERADA' : 'MÉDIA ATIVIDADE') : 
             (explainMode ? 'ATIVIDADE BAIXA' : 'BAIXA ATIVIDADE')}
          </div>
          
          <ContextBox
            title={explainMode ? 'Atividade Reprodutiva Geral' : 'Índice Médio de Ovos'}
            description={explainMode ?
              'Média de ovos por coleta considerando todas as armadilhas, incluindo as negativas.' :
              'Número médio de ovos por coleta, considerando o conjunto total de ovitrampas monitoradas.'
            }
            formula="IMO = Total de Ovos / Total de Coletas"
            interpretation={explainMode ?
              'Indica o nível geral de atividade reprodutiva na área monitorada como um todo.' :
              'IMO >25 = alta atividade reprodutiva; 10-25 = atividade moderada; <10 = baixa atividade.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${indices.ivo > 100 ? PROJECT_COLORS.danger : indices.ivo > 50 ? PROJECT_COLORS.warning : PROJECT_COLORS.success}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'VARIABILIDADE (IVO)' : 'IVO - ÍNDICE DE VARIAÇÃO'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.secondary, marginBottom: '8px' }}>
            {indices.ivo.toFixed(1)}%
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
            coeficiente de variação
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: indices.ivo > 100 ? PROJECT_COLORS.danger : indices.ivo > 50 ? PROJECT_COLORS.warning : PROJECT_COLORS.success,
            backgroundColor: (indices.ivo > 100 ? PROJECT_COLORS.danger : indices.ivo > 50 ? PROJECT_COLORS.warning : PROJECT_COLORS.success) + '20',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {indices.ivo > 100 ? (explainMode ? 'MUITO IRREGULAR' : 'ALTA HETEROGENEIDADE') : 
             indices.ivo > 50 ? (explainMode ? 'MODERADAMENTE IRREGULAR' : 'MÉDIA HETEROGENEIDADE') : 
             (explainMode ? 'DISTRIBUIÇÃO HOMOGÊNEA' : 'BAIXA HETEROGENEIDADE')}
          </div>
          
          <ContextBox
            title={explainMode ? 'Irregularidade da Distribuição' : 'Índice de Variação de Oviposição'}
            description={explainMode ?
              'Mede quão irregular é a distribuição de ovos entre as diferentes armadilhas.' :
              'Coeficiente de variação da oviposição, indicando heterogeneidade espacial da infestação.'
            }
            formula="IVO = (Desvio Padrão / Média) × 100"
            interpretation={explainMode ?
              'Valores altos indicam concentração da infestação em poucos pontos específicos.' :
              'IVO >100% = infestação muito heterogênea; 50-100% = moderadamente heterogênea; <50% = homogênea.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      </div>

      {/* Radar Chart dos Índices */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div style={cardStyle(theme)}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
            {explainMode ? 'Panorama Integrado dos Indicadores' : 'Radar dos Índices Técnicos'}
          </h3>
          
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={indices.radarData}>
                <PolarGrid stroke={theme.colors.border} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fontSize: 12, 
                    fill: theme.colors.text,
                    fontWeight: '500'
                  }} 
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 5]} 
                  tick={{ fontSize: 10, fill: theme.colors.textSecondary }}
                  tickCount={6}
                />
                <Radar
                  name={explainMode ? 'Indicadores' : 'Índices'}
                  dataKey="A"
                  stroke={PROJECT_COLORS.primary}
                  fill={PROJECT_COLORS.primary}
                  strokeWidth={3}
                  fillOpacity={0.2}
                  dot={{ fill: PROJECT_COLORS.primary, strokeWidth: 2, r: 4 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <ContextBox
            title={explainMode ? 'Interpretação do Panorama' : 'Análise Multivariada dos Índices'}
            description={explainMode ?
              'Visualização integrada que permite identificar rapidamente os aspectos mais críticos da infestação.' :
              'Representação gráfica multidimensional dos índices entomológicos normalizados em escala 0-5.'
            }
            interpretation={explainMode ?
              'Áreas externas do radar indicam situações que requerem atenção prioritária nas estratégias de controle.' :
              'Valores próximos ao centro = situação controlada; valores externos = situação crítica.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        {/* Ranking de Bairros */}
        <div style={cardStyle(theme)}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
            {explainMode ? 'Bairros por Densidade de Ovos' : 'Ranking de Densidade por Localidade'}
          </h3>
          
          <div style={{
            maxHeight: '350px',
            overflowY: 'auto'
          }}>
            {indices.neighborhoodRanking.length > 0 ? indices.neighborhoodRanking.map((neighborhood, index) => (
              <div key={neighborhood.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: theme.colors.bg,
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`,
                borderLeft: `4px solid ${
                  index === 0 ? PROJECT_COLORS.danger : 
                  index < 3 ? PROJECT_COLORS.warning : 
                  PROJECT_COLORS.primary
                }`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: index === 0 ? PROJECT_COLORS.danger : 
                                     index < 3 ? PROJECT_COLORS.warning : 
                                     PROJECT_COLORS.primary,
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                    <strong style={{ fontSize: '14px' }}>{neighborhood.name}</strong>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: theme.colors.textSecondary,
                    marginTop: '4px',
                    marginLeft: '28px'
                  }}>
                    {neighborhood.ovitraps} ovitrampas • {neighborhood.coletas} coletas • {neighborhood.totalOvos} ovos
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text }}>
                    {neighborhood.density.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '10px', color: theme.colors.textSecondary }}>
                    ovos/coleta
                  </div>
                </div>
              </div>
            )) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: theme.colors.textSecondary
              }}>
                <div>Dados insuficientes para ranking</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Mínimo de 10 coletas por bairro
                </div>
              </div>
            )}
          </div>

          <ContextBox
            title={explainMode ? 'Priorização por Localidade' : 'Estratificação Territorial da Densidade'}
            description={explainMode ?
              'Ranking dos bairros pela densidade média de ovos, permitindo priorizar ações de controle.' :
              'Hierarquização dos bairros por densidade média de oviposição para direcionamento estratégico.'
            }
            interpretation={explainMode ?
              'Bairros no topo necessitam intervenção prioritária e monitoramento intensificado.' :
              'Rankings elevados indicam focos prioritários para estratégias de controle vetorial.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      </div>
    </div>
  );
});

// Aba 4: Controle de Qualidade
const ControleQualidade: React.FC<{data: AedesRecord[], selectedYear: string, selectedMonth: string, theme: any, explainMode: boolean}> = React.memo(({ data, selectedYear, selectedMonth, theme, explainMode }) => {
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedYear) {
      filtered = filtered.filter(r => r.ano.toString() === selectedYear);
    }
    if (selectedMonth) {
      filtered = filtered.filter(r => r.mes_nome === selectedMonth);
    }
    return filtered;
  }, [data, selectedYear, selectedMonth]);

  const qualityMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        total: 0,
        coordsCompleteness: 0,
        datesCompleteness: 0,
        neighborhoodCompleteness: 0,
        weightCompleteness: 0,
        epiWeekCompleteness: 0,
        duplicatesCount: 0,
        duplicatesPercentage: 0,
        statusDistribution: {},
        temporalConsistency: 0,
        dataIntegrity: 0
      };
    }

    const total = filteredData.length;
    
    // Completude de coordenadas
    const withValidCoords = filteredData.filter(r => 
      r.latitude && r.longitude && 
      r.latitude !== 0 && r.longitude !== 0 &&
      r.latitude >= -90 && r.latitude <= 90 &&
      r.longitude >= -180 && r.longitude <= 180
    ).length;
    const coordsCompleteness = (withValidCoords / total) * 100;

    // Completude de datas
    const withValidDates = filteredData.filter(r => 
      r.data_coleta && r.data_instalacao &&
      new Date(r.data_coleta).getTime() > 0
    ).length;
    const datesCompleteness = (withValidDates / total) * 100;

    // Completude de bairros
    const withNeighborhood = filteredData.filter(r => 
      r.bairro && r.bairro.trim().length > 0
    ).length;
    const neighborhoodCompleteness = (withNeighborhood / total) * 100;

    // Completude de peso das ovitrampas
    const withWeight = filteredData.filter(r => 
      r.peso_ovitrampa && r.peso_ovitrampa > 0
    ).length;
    const weightCompleteness = (withWeight / total) * 100;

    // Completude de semanas epidemiológicas
    const withValidEpiWeek = filteredData.filter(r => 
      r.semana_epidemiologica >= 1 && r.semana_epidemiologica <= 53
    ).length;
    const epiWeekCompleteness = (withValidEpiWeek / total) * 100;

    // Detecção de duplicatas
    const uniqueRecords = new Set(
      filteredData.map(r => `${r.id_ovitrampa}-${r.data_coleta}`)
    );
    const duplicatesCount = total - uniqueRecords.size;
    const duplicatesPercentage = (duplicatesCount / total) * 100;

    // Distribuição por status de qualidade
    const statusDistribution = filteredData.reduce((acc, record) => {
      const status = record.status_qualidade || 'NÃO DEFINIDO';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Consistência temporal
    const withValidDateRange = filteredData.filter(r => {
      if (!r.data_coleta || !r.data_instalacao) return false;
      const coleta = new Date(r.data_coleta);
      const instalacao = new Date(r.data_instalacao);
      return coleta >= instalacao;
    }).length;
    const temporalConsistency = total > 0 ? (withValidDateRange / withValidDates) * 100 : 0;

    // Integridade geral dos dados
    const dataIntegrity = (
      coordsCompleteness * 0.2 +
      datesCompleteness * 0.25 +
      neighborhoodCompleteness * 0.2 +
      weightCompleteness * 0.15 +
      epiWeekCompleteness * 0.1 +
      (100 - duplicatesPercentage) * 0.1
    );

    return {
      total,
      coordsCompleteness,
      datesCompleteness,
      neighborhoodCompleteness,
      weightCompleteness,
      epiWeekCompleteness,
      duplicatesCount,
      duplicatesPercentage,
      statusDistribution,
      temporalConsistency,
      dataIntegrity
    };
  }, [filteredData]);

  const period = getAnalysisPeriod(filteredData, selectedYear, selectedMonth);

  // Dados para o gráfico de pizza
  const pieData = Object.entries(qualityMetrics.statusDistribution).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: ((count / qualityMetrics.total) * 100).toFixed(1)
  }));

  const PIE_COLORS = [PROJECT_COLORS.success, PROJECT_COLORS.warning, PROJECT_COLORS.danger, PROJECT_COLORS.info, PROJECT_COLORS.secondary];

  return (
    <div>
      {/* Header Contextual */}
      <div style={{
        background: `linear-gradient(135deg, ${PROJECT_COLORS.secondary} 0%, ${PROJECT_COLORS.primary} 100%)`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>
          {explainMode ? 'Controle de Qualidade dos Dados' : 'Auditoria e Validação de Dados'}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {explainMode 
            ? 'Verificação da confiabilidade e completude das informações coletadas'
            : 'Análise sistemática da integridade, consistência e completude dos registros entomológicos'
          }
        </p>
      </div>

      {/* Métricas Principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${PROJECT_COLORS.primary}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'REGISTROS PROCESSADOS' : 'VOLUME DE DADOS'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.primary, marginBottom: '8px' }}>
            {qualityMetrics.total.toLocaleString()}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            registros no período selecionado
          </div>

          <ContextBox
            title={explainMode ? 'Volume de Dados Coletados' : 'Tamanho da Amostra'}
            description={explainMode ?
              'Quantidade total de registros de coleta processados e validados no sistema.' :
              'Número absoluto de observações entomológicas registradas no período de análise.'
            }
            interpretation={explainMode ?
              'Volume adequado garante representatividade estatística das análises epidemiológicas.' :
              'Amostra robusta (n>1000) permite inferências estatisticamente significativas.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${qualityMetrics.dataIntegrity > 90 ? PROJECT_COLORS.success : qualityMetrics.dataIntegrity > 70 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'QUALIDADE GERAL' : 'ÍNDICE DE INTEGRIDADE'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: qualityMetrics.dataIntegrity > 90 ? PROJECT_COLORS.success : qualityMetrics.dataIntegrity > 70 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger, marginBottom: '8px' }}>
            {qualityMetrics.dataIntegrity.toFixed(1)}%
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
            integridade dos dados
          </div>

          <div style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: qualityMetrics.dataIntegrity > 90 ? PROJECT_COLORS.success : qualityMetrics.dataIntegrity > 70 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger,
            backgroundColor: (qualityMetrics.dataIntegrity > 90 ? PROJECT_COLORS.success : qualityMetrics.dataIntegrity > 70 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger) + '20',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {qualityMetrics.dataIntegrity > 90 ? (explainMode ? 'EXCELENTE' : 'ALTA QUALIDADE') : 
             qualityMetrics.dataIntegrity > 70 ? (explainMode ? 'BOA' : 'QUALIDADE ADEQUADA') : 
             (explainMode ? 'REQUER MELHORIA' : 'BAIXA QUALIDADE')}
          </div>

          <ContextBox
            title={explainMode ? 'Índice de Qualidade Geral' : 'Score Composto de Integridade'}
            description={explainMode ?
              'Métrica consolidada que avalia múltiplos aspectos da qualidade dos dados coletados.' :
              'Indicador ponderado considerando completude, consistência e ausência de duplicações.'
            }
            formula="Integridade = (Coordenadas×0.2 + Datas×0.25 + Bairros×0.2 + Peso×0.15 + SemEpi×0.1 + NoDup×0.1)"
            interpretation={explainMode ?
              'Valores acima de 90% indicam dados confiáveis para tomada de decisões estratégicas.' :
              'Scores >90% = dados altamente confiáveis; 70-90% = qualidade adequada; <70% = revisão necessária.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${qualityMetrics.duplicatesCount === 0 ? PROJECT_COLORS.success : qualityMetrics.duplicatesCount < 10 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'REGISTROS DUPLICADOS' : 'DUPLICAÇÕES DETECTADAS'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: qualityMetrics.duplicatesCount === 0 ? PROJECT_COLORS.success : qualityMetrics.duplicatesCount < 10 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger, marginBottom: '8px' }}>
            {qualityMetrics.duplicatesCount}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            {qualityMetrics.duplicatesPercentage.toFixed(2)}% do total
          </div>

          <ContextBox
            title={explainMode ? 'Controle de Duplicações' : 'Detecção de Redundâncias'}
            description={explainMode ?
              'Identificação de registros potencialmente duplicados baseado na combinação ovitrampa-data.' :
              'Algoritmo de detecção de registros redundantes por chave composta (id_ovitrampa + data_coleta).'
            }
            formula="Duplicatas = Total_registros - COUNT(DISTINCT(id_ovitrampa + data_coleta))"
            interpretation={explainMode ?
              'Baixo número de duplicatas indica bons procedimentos de coleta e digitação.' :
              'Taxa <2% = procedimentos adequados; 2-5% = atenção requerida; >5% = revisão de protocolos.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${qualityMetrics.temporalConsistency > 95 ? PROJECT_COLORS.success : qualityMetrics.temporalConsistency > 85 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'CONSISTÊNCIA TEMPORAL' : 'VALIDAÇÃO CRONOLÓGICA'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: qualityMetrics.temporalConsistency > 95 ? PROJECT_COLORS.success : qualityMetrics.temporalConsistency > 85 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger, marginBottom: '8px' }}>
            {qualityMetrics.temporalConsistency.toFixed(1)}%
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            datas logicamente consistentes
          </div>

          <ContextBox
            title={explainMode ? 'Coerência das Datas' : 'Validação da Sequência Temporal'}
            description={explainMode ?
              'Verifica se as datas de coleta são posteriores às datas de instalação das armadilhas.' :
              'Algoritmo de validação cronológica: data_coleta ≥ data_instalacao para cada registro.'
            }
            formula="Consistência = (Registros_com_sequência_válida / Total_com_datas) × 100"
            interpretation={explainMode ?
              'Alta consistência indica confiabilidade nos procedimentos de coleta e registro.' :
              'Percentuais >95% indicam procedimentos adequados de controle de qualidade temporal.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      </div>

      {/* Gráficos de Qualidade */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Métricas de Completude */}
        <div style={cardStyle(theme)}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
            {explainMode ? 'Completude dos Campos' : 'Índices de Completude por Campo'}
          </h3>
          
          {[
            { 
              label: explainMode ? 'Coordenadas Geográficas' : 'Coordenadas GPS', 
              value: qualityMetrics.coordsCompleteness, 
              color: qualityMetrics.coordsCompleteness > 90 ? PROJECT_COLORS.success : qualityMetrics.coordsCompleteness > 70 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger 
            },
            { 
              label: explainMode ? 'Datas de Coleta' : 'Campos Temporais', 
              value: qualityMetrics.datesCompleteness, 
              color: qualityMetrics.datesCompleteness > 95 ? PROJECT_COLORS.success : qualityMetrics.datesCompleteness > 85 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger 
            },
            { 
              label: explainMode ? 'Identificação de Bairros' : 'Dados Territoriais', 
              value: qualityMetrics.neighborhoodCompleteness, 
              color: qualityMetrics.neighborhoodCompleteness > 95 ? PROJECT_COLORS.success : qualityMetrics.neighborhoodCompleteness > 85 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger 
            },
            { 
              label: explainMode ? 'Peso das Ovitrampas' : 'Dados Biométricos', 
              value: qualityMetrics.weightCompleteness, 
              color: qualityMetrics.weightCompleteness > 80 ? PROJECT_COLORS.success : qualityMetrics.weightCompleteness > 60 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger 
            },
            { 
              label: explainMode ? 'Semanas Epidemiológicas' : 'Calendário Epidemiológico', 
              value: qualityMetrics.epiWeekCompleteness, 
              color: qualityMetrics.epiWeekCompleteness > 95 ? PROJECT_COLORS.success : qualityMetrics.epiWeekCompleteness > 85 ? PROJECT_COLORS.warning : PROJECT_COLORS.danger 
            }
          ].map((metric, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{metric.label}</span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: metric.color
                }}>
                  {metric.value.toFixed(1)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: theme.colors.border,
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${metric.value}%`,
                  height: '100%',
                  backgroundColor: metric.color,
                  transition: 'width 0.8s ease'
                }} />
              </div>
              <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                {Math.round((metric.value / 100) * qualityMetrics.total).toLocaleString()} de {qualityMetrics.total.toLocaleString()} registros
              </div>
            </div>
          ))}

          <ContextBox
            title={explainMode ? 'Avaliação de Completude' : 'Matriz de Completude de Campos'}
            description={explainMode ?
              'Percentual de registros com informações completas para cada tipo de campo obrigatório.' :
              'Análise da completude dos campos essenciais para validação epidemiológica e espacial.'
            }
            interpretation={explainMode ?
              'Completude alta (>95%) garante confiabilidade das análises epidemiológicas.' :
              'Métricas >95% = dados altamente utilizáveis; 85-95% = adequados; <85% = requerem melhoria.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        {/* Distribuição por Status de Qualidade */}
        <div style={cardStyle(theme)}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
            {explainMode ? 'Classificação da Qualidade' : 'Distribuição por Status de Qualidade'}
          </h3>
          
          {pieData.length > 0 ? (
            <>
              <div style={{ height: '250px', marginBottom: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percentage}) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
              }}>
                {pieData.map((item, index) => (
                  <div key={item.name} style={{
                    padding: '12px',
                    backgroundColor: theme.colors.bg,
                    borderRadius: '6px',
                    border: `2px solid ${PIE_COLORS[index % PIE_COLORS.length]}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: PIE_COLORS[index % PIE_COLORS.length],
                      marginBottom: '4px'
                    }}>
                      {item.value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.colors.text, marginBottom: '2px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '10px', color: theme.colors.textSecondary }}>
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: theme.colors.textSecondary
            }}>
              Sem dados de status de qualidade disponíveis
            </div>
          )}

          <ContextBox
            title={explainMode ? 'Categorização da Qualidade' : 'Estratificação por Status de Qualidade'}
            description={explainMode ?
              'Distribuição dos registros por categoria de qualidade atribuída no processo de validação.' :
              'Classificação dos registros segundo critérios de qualidade estabelecidos no protocolo de validação.'
            }
            interpretation={explainMode ?
              'Predominância de registros "OK" indica bons procedimentos de coleta e validação.' :
              'Distribuição adequada: >80% OK, <15% ALERTA, <5% outros status.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      </div>
    </div>
  );
});

// Sub-componente: Situação Atual
const SituacaoAtual: React.FC<{data: AedesRecord[], selectedYear: string, selectedMonth: string, theme: any, explainMode: boolean}> = React.memo(({ data, selectedYear, selectedMonth, theme, explainMode }) => {
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedYear) {
      filtered = filtered.filter(r => r.ano.toString() === selectedYear);
    }
    if (selectedMonth) {
      filtered = filtered.filter(r => r.mes_nome === selectedMonth);
    }
    return filtered;
  }, [data, selectedYear, selectedMonth]);

  const ovitrapStats = useMemo(() => {
    const byOvitrap = filteredData.reduce((acc, record) => {
      if (!acc[record.id_ovitrampa]) {
        acc[record.id_ovitrampa] = {
          id: record.id_ovitrampa,
          bairro: record.bairro,
          totalOvos: 0,
          coletas: 0,
          ultimaColeta: record.data_coleta,
          reincidencias: 0,
          coordenadas: { lat: record.latitude, lng: record.longitude }
        };
      }
      acc[record.id_ovitrampa].totalOvos += record.quantidade_ovos;
      acc[record.id_ovitrampa].coletas++;
      if (record.reincidencia > 0) acc[record.id_ovitrampa].reincidencias++;
      
      if (new Date(record.data_coleta) > new Date(acc[record.id_ovitrampa].ultimaColeta)) {
        acc[record.id_ovitrampa].ultimaColeta = record.data_coleta;
      }
      
      return acc;
    }, {} as any);
    
    return Object.values(byOvitrap).map((ovitrap: any) => ({
      ...ovitrap,
      mediaOvos: ovitrap.totalOvos / ovitrap.coletas,
      status: ovitrap.totalOvos > 100 ? 'critical' : 
              ovitrap.reincidencias > 0 ? 'warning' : 'normal'
    }));
  }, [filteredData]);

  const criticalCount = ovitrapStats.filter(o => o.status === 'critical').length;
  const warningCount = ovitrapStats.filter(o => o.status === 'warning').length;
  const normalCount = ovitrapStats.filter(o => o.status === 'normal').length;
  const mediaGeral = ovitrapStats.length > 0 ? 
    (ovitrapStats.reduce((sum, o) => sum + o.mediaOvos, 0) / ovitrapStats.length) : 0;

  const period = getAnalysisPeriod(filteredData, selectedYear, selectedMonth);

  const criticalOvitraps = ovitrapStats.filter(o => o.status === 'critical').sort((a, b) => b.totalOvos - a.totalOvos);

  return (
    <div>
      {/* Header Contextual */}
      <div style={{
        background: `linear-gradient(135deg, ${PROJECT_COLORS.primary} 0%, ${PROJECT_COLORS.secondary} 100%)`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>
          {explainMode ? 'Situação Atual da Vigilância' : 'Status Operacional Atual'}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {explainMode 
            ? 'Panorama geral da infestação e eficácia das medidas de controle'
            : 'Diagnóstico situacional das ovitrampas e densidade vetorial'
          }
        </p>
      </div>

      {/* Cards de métricas principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ ...cardStyle(theme), borderLeft: `4px solid ${PROJECT_COLORS.danger}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
              {explainMode ? 'Quadrículas Críticas' : 'Ovitrampas Críticas'}
            </h3>
            <div style={{ 
              backgroundColor: PROJECT_COLORS.danger, 
              color: 'white', 
              borderRadius: '50%', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {criticalCount}
            </div>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.danger, marginBottom: '8px' }}>
            {criticalCount}
          </div>
          
          <div style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
            {explainMode ? 'Mais de 100 ovos acumulados' : 'Densidade >100 ovos/período'}
          </div>
          
          <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text }}>
            {ovitrapStats.length} {explainMode ? 'quadrículas monitoradas' : 'ovitrampas ativas'}
          </div>
          
          <ContextBox
            title={explainMode ? 'Análise de Criticidade' : 'Estratificação de Risco'}
            description={explainMode ? 
              'Ovitrampas que acumularam mais de 100 ovos, indicando focos intensos de reprodução do mosquito.' :
              'Ovitrampas com densidade >100 ovos/período, indicando alta atividade reprodutiva vetorial.'
            }
            formula="Críticas = Σ(ovitrampas onde total_ovos > 100)"
            interpretation={explainMode ?
              'Valores altos indicam focos intensos que demandam ação imediata de eliminação.' :
              'Concentrações elevadas requerem intervenção prioritária e monitoramento intensificado.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
        
        <div style={{ ...cardStyle(theme), borderLeft: `4px solid ${PROJECT_COLORS.warning}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
              {explainMode ? 'Com Reincidência' : 'Reinfestação Detectada'}
            </h3>
            <div style={{ 
              backgroundColor: PROJECT_COLORS.warning, 
              color: 'white', 
              borderRadius: '50%', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {warningCount}
            </div>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.warning, marginBottom: '8px' }}>
            {warningCount}
          </div>
          
          <div style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
            {explainMode ? 'Positivas novamente após limpeza' : 'Recolonização pós-intervenção'}
          </div>
          
          <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text }}>
            {ovitrapStats.length > 0 ? ((warningCount / ovitrapStats.length) * 100).toFixed(1) : 0}% do total monitorado
          </div>
          
          <ContextBox
            title={explainMode ? 'Análise de Reincidência' : 'Padrão de Recolonização'}
            description={explainMode ?
              'Ovitrampas que voltaram a ter ovos após limpeza, indicando reinfestação da área.' :
              'Ovitrampas com positividade recorrente, indicando recolonização pós-intervenção de controle.'
            }
            formula="Reincidentes = Σ(ovitrampas onde reincidencia > 0)"
            interpretation={explainMode ?
              'Alta reincidência sugere necessidade de revisão das estratégias de limpeza.' :
              'Taxas elevadas indicam necessidade de revisão dos protocolos de controle vetorial.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
        
        <div style={{ ...cardStyle(theme), borderLeft: `4px solid ${PROJECT_COLORS.success}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
              {explainMode ? 'Normais' : 'Status Controlado'}
            </h3>
            <div style={{ 
              backgroundColor: PROJECT_COLORS.success, 
              color: 'white', 
              borderRadius: '50%', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {normalCount}
            </div>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.success, marginBottom: '8px' }}>
            {normalCount}
          </div>
          
          <div style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
            {explainMode ? 'Baixa ou nenhuma infestação' : 'Densidade vetorial controlada'}
          </div>
          
          <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text }}>
            {ovitrapStats.length > 0 ? ((normalCount / ovitrapStats.length) * 100).toFixed(1) : 0}% em condições adequadas
          </div>
          
          <ContextBox
            title={explainMode ? 'Ovitrampas Controladas' : 'Status de Controle Adequado'}
            description={explainMode ?
              'Ovitrampas com baixa atividade, indicando controle efetivo da população de mosquitos.' :
              'Ovitrampas com baixa densidade de oviposição, indicando controle vetorial eficaz.'
            }
            formula="Normais = Total - (Críticas + Reincidentes)"
            interpretation={explainMode ?
              'Alto percentual indica eficácia das medidas de controle implementadas.' :
              'Percentuais elevados demonstram efetividade das estratégias de controle vetorial.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
        
        <div style={{ ...cardStyle(theme), borderLeft: `4px solid ${PROJECT_COLORS.primary}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
              {explainMode ? 'Densidade Média' : 'Densidade Populacional'}
            </h3>
            <div style={{ 
              backgroundColor: PROJECT_COLORS.primary, 
              color: 'white', 
              borderRadius: '8px', 
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              OVOS/COLETA
            </div>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.primary, marginBottom: '8px' }}>
            {mediaGeral.toFixed(1)}
          </div>
          
          <div style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
            {explainMode ? 'Ovos por coleta/quadrícula' : 'Densidade média de oviposição'}
          </div>
          
          <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text }}>
            {filteredData.length.toLocaleString()} coletas analisadas
          </div>
          
          <ContextBox
            title={explainMode ? 'Densidade Populacional Média' : 'Índice de Densidade Populacional'}
            description={explainMode ?
              'Média geral de ovos coletados por ovitrampa, refletindo a intensidade da infestação.' :
              'Média de ovos por ovitrampa, indicando densidade populacional do Aedes aegypti na área.'
            }
            formula="Densidade = Σ(total_ovos) / Σ(total_coletas)"
            interpretation={explainMode ?
              'Valores maiores que 20 indicam situação preocupante; menor que 10 situação controlada.' :
              'Valores >20 = alta densidade; 10-20 = densidade moderada; <10 = densidade baixa.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      </div>

      {/* Lista detalhada das quadrículas críticas */}
      {criticalOvitraps.length > 0 && (
        <div style={{ ...cardStyle(theme), marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: PROJECT_COLORS.danger, fontSize: '18px' }}>
            {explainMode ? 'Quadrículas Críticas - Requerem Ação Imediata' : 'Focos Críticos - Intervenção Prioritária'}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px',
            maxHeight: '40vh',
            overflowY: 'auto'
          }}>
            {criticalOvitraps.slice(0, 20).map(ovitrap => (
              <div key={ovitrap.id} style={{
                ...cardStyle(theme),
                borderLeft: `4px solid ${PROJECT_COLORS.danger}`,
                backgroundColor: PROJECT_COLORS.danger + '08'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: PROJECT_COLORS.danger }}>
                    {explainMode ? 'Quadrícula' : 'Ovitrampa'} #{ovitrap.id}
                  </h4>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    fontSize: '10px',
                    backgroundColor: PROJECT_COLORS.danger,
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    CRÍTICA
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
                  {ovitrap.bairro || 'Localização não informada'}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: PROJECT_COLORS.danger }}>
                      {ovitrap.totalOvos} ovos
                    </div>
                    <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                      Média: {ovitrap.mediaOvos.toFixed(1)} ovos/coleta
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      {ovitrap.coletas} coletas
                    </div>
                    {ovitrap.reincidencias > 0 && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: PROJECT_COLORS.warning, 
                        fontWeight: 'bold',
                        marginTop: '4px'
                      }}>
                        {ovitrap.reincidencias} reincidência(s)
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '10px', 
                  color: theme.colors.textSecondary,
                  borderTop: `1px solid ${theme.colors.border}`,
                  paddingTop: '8px'
                }}>
                  Última coleta: {new Date(ovitrap.ultimaColeta).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid com todas as quadrículas */}
      <div style={{ ...cardStyle(theme) }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          {explainMode ? `Todas as Quadrículas Monitoradas (${ovitrapStats.length})` : `Panorama Geral das Ovitrampas (${ovitrapStats.length})`}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '12px',
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {ovitrapStats.map(ovitrap => (
            <div key={ovitrap.id} style={{
              ...cardStyle(theme),
              borderLeft: `4px solid ${
                ovitrap.status === 'critical' ? PROJECT_COLORS.danger : 
                ovitrap.status === 'warning' ? PROJECT_COLORS.warning : PROJECT_COLORS.success
              }`,
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '16px' }}>
                  {explainMode ? 'Quadrícula' : 'Ovitrampa'} #{ovitrap.id}
                </h4>
                <span style={{ 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '10px',
                  backgroundColor: PROJECT_COLORS.primary + '20',
                  color: PROJECT_COLORS.primary,
                  fontWeight: 'bold'
                }}>
                  {ovitrap.coletas} coletas
                </span>
              </div>
              
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
                {ovitrap.bairro || 'Localização não informada'}
              </div>
              
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                {ovitrap.totalOvos} ovos
              </div>
              
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
                Média: {ovitrap.mediaOvos.toFixed(1)} ovos/coleta
              </div>
              
              {ovitrap.reincidencias > 0 && (
                <div style={{ 
                  fontSize: '10px', 
                  color: PROJECT_COLORS.warning, 
                  fontWeight: 'bold',
                  backgroundColor: PROJECT_COLORS.warning + '1a',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {ovitrap.reincidencias} reincidência(s)
                </div>
              )}
              
              <div style={{ 
                fontSize: '10px', 
                color: theme.colors.textSecondary,
                marginTop: '8px',
                borderTop: `1px solid ${theme.colors.border}`,
                paddingTop: '8px'
              }}>
                Última: {new Date(ovitrap.ultimaColeta).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Sub-componente: Evolução Temporal
const EvolucaoTemporal: React.FC<{data: AedesRecord[], selectedYear: string, selectedMonth: string, theme: any, explainMode: boolean}> = React.memo(({ data, selectedYear, selectedMonth, theme, explainMode }) => {
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedYear) {
      filtered = filtered.filter(r => r.ano.toString() === selectedYear);
    }
    if (selectedMonth) {
      filtered = filtered.filter(r => r.mes_nome === selectedMonth);
    }
    return filtered;
  }, [data, selectedYear, selectedMonth]);

  const seasonalData = useMemo(() => {
    const monthlyData = filteredData.reduce((acc, record) => {
      const key = record.mes_numero;
      if (!acc[key]) {
        acc[key] = {
          mes_numero: key,
          mes_nome: record.mes_nome,
          ano: record.ano,
          total_ovos: 0,
          total_coletas: 0,
          ovitrampas_positivas: new Set(),
          media_ovos: 0,
          ipo_mensal: 0
        };
      }
      acc[key].total_ovos += record.quantidade_ovos;
      acc[key].total_coletas++;
      if (record.quantidade_ovos > 0) {
        acc[key].ovitrampas_positivas.add(record.id_ovitrampa);
      }
      return acc;
    }, {} as any);

    Object.values(monthlyData).forEach((month: any) => {
      month.media_ovos = month.total_coletas > 0 ? month.total_ovos / month.total_coletas : 0;
      const totalTrapsInMonth = new Set(filteredData.filter(r => r.mes_numero === month.mes_numero).map(r => r.id_ovitrampa)).size;
      month.ipo_mensal = totalTrapsInMonth > 0 ? (month.ovitrampas_positivas.size / totalTrapsInMonth) * 100 : 0;
    });

    const seasonalData = {
      'Verão (Dez-Fev)': { meses: [12, 1, 2], total_ovos: 0, coletas: 0, label: 'Verão', periodos: [] as string[] },
      'Outono (Mar-Mai)': { meses: [3, 4, 5], total_ovos: 0, coletas: 0, label: 'Outono', periodos: [] as string[] },
      'Inverno (Jun-Ago)': { meses: [6, 7, 8], total_ovos: 0, coletas: 0, label: 'Inverno', periodos: [] as string[] },
      'Primavera (Set-Nov)': { meses: [9, 10, 11], total_ovos: 0, coletas: 0, label: 'Primavera', periodos: [] as string[] }
    };

    filteredData.forEach(record => {
      Object.entries(seasonalData).forEach(([season, info]) => {
        if (info.meses.includes(record.mes_numero)) {
          info.total_ovos += record.quantidade_ovos;
          info.coletas++;
          const periodo = `${record.mes_nome}/${record.ano}`;
          if (!info.periodos.includes(periodo)) {
            info.periodos.push(periodo);
          }
        }
      });
    });

    return {
      mensal: Object.values(monthlyData).sort((a: any, b: any) => a.mes_numero - b.mes_numero),
      estacional: seasonalData
    };
  }, [filteredData]);

  const period = getAnalysisPeriod(filteredData, selectedYear, selectedMonth);
  const estacaoMaiorRisco = Object.entries(seasonalData.estacional)
    .filter(([,data]) => data.coletas > 0)
    .sort(([,a], [,b]) => (b.total_ovos/b.coletas) - (a.total_ovos/a.coletas))[0];

  return (
    <div>
      {/* Header Contextual */}
      <div style={{
        background: `linear-gradient(135deg, ${PROJECT_COLORS.warning} 0%, ${PROJECT_COLORS.primary} 100%)`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>
          {explainMode ? 'Evolução Temporal da Infestação' : 'Dinâmica Temporal Vetorial'}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {explainMode 
            ? 'Padrões sazonais e tendências temporais da atividade do mosquito'
            : 'Análise cronológica da densidade populacional e sazonalidade vetorial'
          }
        </p>
      </div>

      {/* Análise estacional */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {Object.entries(seasonalData.estacional).map(([season, data]) => {
          const mediaEstacional = data.coletas > 0 ? data.total_ovos / data.coletas : 0;
          const isHighRisk = estacaoMaiorRisco && season === estacaoMaiorRisco[0];
          const hasData = data.coletas > 0;
          
          return (
            <div key={season} style={{
              ...cardStyle(theme),
              borderLeft: `4px solid ${isHighRisk ? PROJECT_COLORS.danger : hasData ? PROJECT_COLORS.primary : theme.colors.border}`,
              backgroundColor: isHighRisk ? PROJECT_COLORS.danger + '08' : hasData ? 'transparent' : theme.colors.border + '20',
              opacity: hasData ? 1 : 0.6
            }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '14px', 
                color: theme.colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {data.label}
                {isHighRisk && <span style={{ color: PROJECT_COLORS.danger, fontSize: '12px' }}>
                  {explainMode ? 'MAIOR RISCO' : 'PICO SAZONAL'}
                </span>}
                {!hasData && <span style={{ color: theme.colors.textSecondary, fontSize: '10px' }}>SEM DADOS</span>}
              </h3>
              
              <div style={{ 
                fontSize: hasData ? '24px' : '16px', 
                fontWeight: 'bold', 
                color: isHighRisk ? PROJECT_COLORS.danger : hasData ? PROJECT_COLORS.primary : theme.colors.textSecondary,
                marginBottom: '4px'
              }}>
                {hasData ? mediaEstacional.toFixed(1) : '--'}
              </div>
              
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                {explainMode ? 'ovos/coleta média' : 'densidade média'}
              </div>
              
              <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '8px' }}>
                {hasData ? (
                  <>
                    {data.total_ovos.toLocaleString()} ovos • {data.coletas} coletas<br/>
                    <strong>Períodos:</strong> {data.periodos.join(', ')}
                  </>
                ) : (
                  'Nenhum dado disponível para o período selecionado'
                )}
              </div>
              
              {hasData && (
                <ContextBox
                  title={explainMode ? `Sazonalidade - ${season}` : `Padrão Sazonal - ${season}`}
                  description={explainMode ?
                    `Análise da atividade do mosquito durante ${season.split(' ')[1]} no período selecionado, considerando fatores climáticos típicos da estação.` :
                    `Dinâmica populacional do Aedes aegypti em ${season.split(' ')[1]}, correlacionada com variáveis ambientais sazonais.`
                  }
                  interpretation={
                    isHighRisk 
                      ? (explainMode ? "Período de maior risco identificado - intensificar ações de controle e educação em saúde." : "Período de pico populacional - implementar estratégias de controle intensificadas.")
                      : (explainMode ? "Período de menor atividade relativa - momento adequado para ações preventivas." : "Fase de menor densidade - adequado para manutenção preventiva.")
                  }
                  period={period}
                  theme={theme}
                  explainMode={explainMode}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Variação Mensal da Infestação */}
      {seasonalData.mensal.length > 0 && (
        <div style={{ ...cardStyle(theme), marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>
            {explainMode ? 'Variação Mensal da Infestação' : 'Dinâmica Mensal da Densidade Vetorial'}
          </h3>
          
          <div style={{
            backgroundColor: theme.colors.bg,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: `1px solid ${PROJECT_COLORS.primary}30`
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: PROJECT_COLORS.primary, fontSize: '14px' }}>
              {explainMode ? 'Interpretação da Análise Mensal' : 'Análise da Variação Temporal'}
            </h4>
            <div style={{ fontSize: '13px', lineHeight: '1.5', color: theme.colors.text }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>{explainMode ? 'Esta análise revela:' : 'Padrão identificado:'}</strong> {explainMode ? 
                  'O padrão de distribuição mensal dos ovos de Aedes aegypti, identificando períodos de maior e menor atividade reprodutiva.' :
                  'Variação mensal da densidade de oviposição, correlacionada com fatores climáticos e ambientais sazonais.'
                }
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>{explainMode ? 'Significado dos picos:' : 'Interpretação dos máximos:'}</strong> {explainMode ?
                  'Meses com valores elevados indicam condições favoráveis (temperatura ≥25°C, alta umidade), demandando intensificação das ações.' :
                  'Picos indicam condições ótimas para reprodução vetorial (temp. >25°C, UR >70%), requerendo intervenção estratégica.'
                }
              </p>
              <p style={{ margin: '0' }}>
                <strong>{explainMode ? 'Valores baixos:' : 'Mínimos sazonais:'}</strong> {explainMode ?
                  'Representam períodos de menor atividade, ideais para manutenção preventiva e preparação para os próximos ciclos.' :
                  'Indicam janelas de oportunidade para ações preventivas e reforço das medidas de controle.'
                }
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            {seasonalData.mensal.map((month: any) => {
              const maxOvos = Math.max(...seasonalData.mensal.map((m: any) => m.media_ovos));
              const isHigh = month.media_ovos > maxOvos * 0.7;
              const isMedium = month.media_ovos > maxOvos * 0.4;
              
              let riskLevel = explainMode ? 'BAIXO' : 'CONTROLADO';
              let riskColor = PROJECT_COLORS.success;
              if (isHigh) {
                riskLevel = explainMode ? 'ALTO' : 'CRÍTICO';
                riskColor = PROJECT_COLORS.danger;
              } else if (isMedium) {
                riskLevel = explainMode ? 'MÉDIO' : 'MODERADO';
                riskColor = PROJECT_COLORS.warning;
              }
              
              return (
                <div key={month.mes_numero} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {month.mes_nome} {selectedYear && `/${month.ano}`}
                      <span style={{ 
                        color: riskColor, 
                        fontSize: '10px', 
                        backgroundColor: riskColor + '20',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {riskLevel}
                      </span>
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        color: riskColor
                      }}>
                        {month.media_ovos.toFixed(1)}
                      </span>
                      <div style={{ fontSize: '10px', color: theme.colors.textSecondary }}>
                        IPO: {month.ipo_mensal.toFixed(1)}% • {month.total_coletas} coletas
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '12px',
                    backgroundColor: theme.colors.border,
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${maxOvos > 0 ? (month.media_ovos / maxOvos) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: riskColor,
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  
                  <div style={{ 
                    fontSize: '11px', 
                    color: theme.colors.textSecondary, 
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    {explainMode ? (
                      month.media_ovos > 50 ? 'Período crítico - ação imediata requerida' :
                      month.media_ovos > 20 ? 'Período de atenção - monitoramento intensivo' :
                      month.media_ovos > 10 ? 'Período moderado - manter vigilância' :
                      'Período de baixa atividade - foco em prevenção'
                    ) : (
                      month.media_ovos > 50 ? 'Densidade crítica - intervenção urgente' :
                      month.media_ovos > 20 ? 'Densidade elevada - controle intensificado' :
                      month.media_ovos > 10 ? 'Densidade moderada - vigilância ativa' :
                      'Densidade baixa - manutenção preventiva'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <ContextBox
            title={explainMode ? 'Padrão de Sazonalidade' : 'Análise da Dinâmica Temporal'}
            description={explainMode ?
              `Análise temporal detalhada para o período ${period}, mostrando variação mensal da atividade do Aedes aegypti correlacionada com fatores climáticos.` :
              `Caracterização temporal da densidade vetorial no período ${period}, identificando padrões sazonais e janelas de intervenção.`
            }
            formula="Média Mensal = Σ(ovos_mês) / Σ(coletas_mês) • IPO = (ovitrampas_positivas / total_ovitrampas) × 100"
            interpretation={explainMode ?
              'Picos concentrados indicam sazonalidade marcante; distribuição uniforme sugere atividade constante. Valores >50 ovos/coleta requerem intervenção.' :
              'Variação sazonal permite otimização de recursos. Picos >50 ovos/coleta = intervenção imediata; <10 = janela de oportunidade preventiva.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      )}
    </div>
  );
});

// Sub-componente: Areas Prioritárias  
const AreasPrioritarias: React.FC<{data: AedesRecord[], selectedYear: string, selectedMonth: string, theme: any, explainMode: boolean}> = React.memo(({ data, selectedYear, selectedMonth, theme, explainMode }) => {
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedYear) {
      filtered = filtered.filter(r => r.ano.toString() === selectedYear);
    }
    if (selectedMonth) {
      filtered = filtered.filter(r => r.mes_nome === selectedMonth);
    }
    return filtered;
  }, [data, selectedYear, selectedMonth]);

  const neighborhoodData = useMemo(() => {
    const neighborhoodMap = filteredData.reduce((acc, record) => {
      if (!record.bairro || record.bairro.trim() === '') return acc;
      
      const bairro = record.bairro.trim().toUpperCase();
      if (!acc[bairro]) {
        acc[bairro] = {
          name: bairro,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0,
          ovitrampas: new Set(),
          reincidencias: 0,
          coordenadas: { lat: 0, lng: 0, count: 0 }
        };
      }
      
      acc[bairro].totalOvos += record.quantidade_ovos;
      acc[bairro].totalRegistros++;
      if (record.quantidade_ovos > 0) acc[bairro].positivos++;
      acc[bairro].ovitrampas.add(record.id_ovitrampa);
      if (record.reincidencia > 0) acc[bairro].reincidencias++;
      
      if (record.latitude && record.longitude) {
        acc[bairro].coordenadas.lat += record.latitude;
        acc[bairro].coordenadas.lng += record.longitude;
        acc[bairro].coordenadas.count++;
      }
      return acc;
    }, {} as any);

    return Object.values(neighborhoodMap)
      .map((n: any) => ({
        name: n.name,
        totalOvos: n.totalOvos,
        avgEggs: n.totalRegistros > 0 ? n.totalOvos / n.totalRegistros : 0,
        ipo: n.totalRegistros > 0 ? (n.positivos / n.totalRegistros * 100) : 0,
        traps: n.ovitrampas.size,
        reincidence: n.totalRegistros > 0 ? (n.reincidencias / n.totalRegistros * 100) : 0,
        registros: n.totalRegistros,
        latitude: n.coordenadas.count > 0 ? n.coordenadas.lat / n.coordenadas.count : 0,
        longitude: n.coordenadas.count > 0 ? n.coordenadas.lng / n.coordenadas.count : 0,
        riskScore: n.totalRegistros > 0 ? ((n.totalOvos / n.totalRegistros) * (n.positivos / n.totalRegistros * 100) * (n.reincidencias + 1)) / 100 : 0
      }))
      .filter(n => n.registros >= 5)
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [filteredData]);

  const period = getAnalysisPeriod(filteredData, selectedYear, selectedMonth);

  const priorityAreas = neighborhoodData.slice(0, 10);
  const criticalAreas = neighborhoodData.filter(n => n.avgEggs > 50).length;
  const highRiskAreas = neighborhoodData.filter(n => n.ipo > 60).length;
  const reincidenceAreas = neighborhoodData.filter(n => n.reincidence > 15).length;

  return (
    <div>
      {/* Header Contextual */}
      <div style={{
        background: `linear-gradient(135deg, ${PROJECT_COLORS.danger} 0%, ${PROJECT_COLORS.warning} 100%)`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>
          {explainMode ? 'Áreas Prioritárias para Intervenção' : 'Estratificação Territorial de Risco'}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {explainMode 
            ? 'Identificação e priorização de bairros que requerem ação imediata'
            : 'Hierarquização geográfica baseada em score multivariado de risco entomológico'
          }
        </p>
      </div>

      {/* Cards de Resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${criticalAreas > 0 ? PROJECT_COLORS.danger : PROJECT_COLORS.success}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'ÁREAS CRÍTICAS' : 'FOCOS DE ALTA DENSIDADE'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: criticalAreas > 0 ? PROJECT_COLORS.danger : PROJECT_COLORS.success, marginBottom: '8px' }}>
            {criticalAreas}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            {explainMode ? 'bairros com >50 ovos/coleta' : 'localidades com densidade crítica'}
          </div>

          <ContextBox
            title={explainMode ? 'Definição de Área Crítica' : 'Critério de Criticidade'}
            description={explainMode ?
              'Bairros com média superior a 50 ovos por coleta, indicando infestação severa que demanda ação urgente.' :
              'Territórios com densidade média >50 ovos/coleta, caracterizando infestação de alta intensidade.'
            }
            formula="Crítica = avgEggs > 50"
            interpretation={explainMode ?
              'Áreas críticas requerem mobilização imediata de equipes e recursos para controle intensivo.' :
              'Densidade crítica indica necessidade de intervenção imediata e monitoramento contínuo.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${highRiskAreas > 0 ? PROJECT_COLORS.warning : PROJECT_COLORS.success}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'ALTO RISCO' : 'ALTA POSITIVIDADE'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: highRiskAreas > 0 ? PROJECT_COLORS.warning : PROJECT_COLORS.success, marginBottom: '8px' }}>
            {highRiskAreas}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            {explainMode ? 'bairros com IPO >60%' : 'territórios com dispersão elevada'}
          </div>

          <ContextBox
            title={explainMode ? 'Classificação de Alto Risco' : 'Índice de Dispersão Elevada'}
            description={explainMode ?
              'Bairros com mais de 60% das ovitrampas positivas, indicando dispersão generalizada da infestação.' :
              'Territórios com IPO >60%, caracterizando ampla distribuição espacial do vetor.'
            }
            formula="Alto Risco = IPO > 60%"
            interpretation={explainMode ?
              'Alta dispersão indica necessidade de ação coordenada em toda a área do bairro.' :
              'IPO elevado sugere infestação generalizada, requerendo estratégia territorial abrangente.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${reincidenceAreas > 0 ? PROJECT_COLORS.info : PROJECT_COLORS.success}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'COM REINCIDÊNCIA' : 'RECOLONIZAÇÃO FREQUENTE'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: reincidenceAreas > 0 ? PROJECT_COLORS.info : PROJECT_COLORS.success, marginBottom: '8px' }}>
            {reincidenceAreas}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            {explainMode ? 'bairros com >15% reincidência' : 'áreas com reinfestação recorrente'}
          </div>

          <ContextBox
            title={explainMode ? 'Padrão de Reincidência' : 'Taxa de Recolonização'}
            description={explainMode ?
              'Bairros onde mais de 15% das coletas apresentam reincidência, indicando falha no controle ou reinfestação rápida.' :
              'Territórios com taxa de recolonização >15%, sugerindo ineficácia das medidas de controle ou alta pressão de reinfestação.'
            }
            formula="Reincidência = (casos_reincidentes / total_coletas) × 100"
            interpretation={explainMode ?
              'Alta reincidência sugere necessidade de revisão das estratégias de controle e monitoramento mais frequente.' :
              'Taxa elevada indica necessidade de reavaliar protocolos de controle e intensificar vigilância.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>

        <div style={{
          ...cardStyle(theme),
          borderLeft: `4px solid ${PROJECT_COLORS.primary}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary, fontWeight: '600' }}>
              {explainMode ? 'TOTAL MONITORADO' : 'COBERTURA TERRITORIAL'}
            </h3>
          </div>
          
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: PROJECT_COLORS.primary, marginBottom: '8px' }}>
            {neighborhoodData.length}
          </div>
          
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
            {explainMode ? 'bairros com dados suficientes' : 'territórios com n≥5 observações'}
          </div>

          <ContextBox
            title={explainMode ? 'Cobertura do Monitoramento' : 'Abrangência da Vigilância'}
            description={explainMode ?
              'Número total de bairros com dados suficientes (≥5 coletas) para análises epidemiológicas confiáveis.' :
              'Total de territórios com amostragem adequada (n≥5) para inferências estatisticamente válidas.'
            }
            formula="Monitorados = COUNT(bairros WHERE coletas ≥ 5)"
            interpretation={explainMode ?
              'Ampla cobertura permite identificação abrangente de áreas prioritárias para intervenção.' :
              'Cobertura territorial adequada garante representatividade na estratificação de riscos.'
            }
            period={period}
            theme={theme}
            explainMode={explainMode}
          />
        </div>
      </div>

      {/* Ranking das Áreas Prioritárias */}
      <div style={{ ...cardStyle(theme) }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>
            {explainMode ? 'Ranking de Priorização por Bairro' : 'Estratificação Territorial de Risco'}
          </h3>
          <div style={{ 
            fontSize: '12px', 
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.bg,
            padding: '4px 8px',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.border}`
          }}>
            {explainMode ? 'Top 10 Áreas Prioritárias' : 'Score de Risco Multivariado'}
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gap: '12px',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {priorityAreas.map((area, index) => {
            const isTopPriority = index < 3;
            const isHighPriority = index < 6;
            const borderColor = isTopPriority ? PROJECT_COLORS.danger : 
                               isHighPriority ? PROJECT_COLORS.warning : PROJECT_COLORS.primary;

            return (
              <div key={area.name} style={{
                ...cardStyle(theme),
                borderLeft: `4px solid ${borderColor}`,
                backgroundColor: isTopPriority ? PROJECT_COLORS.danger + '08' : 
                               isHighPriority ? PROJECT_COLORS.warning + '05' : 'transparent'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{
                        backgroundColor: borderColor,
                        color: 'white',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                          {area.name}
                        </h4>
                        <div style={{ fontSize: '11px', color: theme.colors.textSecondary }}>
                          {explainMode ? 'Área Prioritária' : 'Território de Risco'} - Score: {area.riskScore.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '12px',
                      fontSize: '12px',
                      color: theme.colors.textSecondary,
                      marginBottom: '8px'
                    }}>
                      <div>
                        <strong>Densidade:</strong> {area.avgEggs.toFixed(1)} ovos/coleta
                      </div>
                      <div>
                        <strong>IPO:</strong> {area.ipo.toFixed(1)}%
                      </div>
                      <div>
                        <strong>Ovitrampas:</strong> {area.traps}
                      </div>
                      <div>
                        <strong>Reincidência:</strong> {area.reincidence.toFixed(1)}%
                      </div>
                      <div>
                        <strong>Total Ovos:</strong> {area.totalOvos.toLocaleString()}
                      </div>
                      <div>
                        <strong>Coletas:</strong> {area.registros}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                    {isTopPriority && (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        backgroundColor: PROJECT_COLORS.danger,
                        color: 'white'
                      }}>
                        {explainMode ? 'URGENTE' : 'CRÍTICO'}
                      </span>
                    )}
                    
                    {area.avgEggs > 50 && (
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        backgroundColor: PROJECT_COLORS.danger + '30',
                        color: PROJECT_COLORS.danger
                      }}>
                        ALTA DENSIDADE
                      </span>
                    )}
                    
                    {area.ipo > 60 && (
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        backgroundColor: PROJECT_COLORS.warning + '30',
                        color: PROJECT_COLORS.warning
                      }}>
                        DISPERSÃO ELEVADA
                      </span>
                    )}
                    
                    {area.reincidence > 15 && (
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        backgroundColor: PROJECT_COLORS.info + '30',
                        color: PROJECT_COLORS.info
                      }}>
                        REINCIDÊNCIA
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações Recomendadas */}
                <div style={{
                  backgroundColor: theme.colors.bg,
                  padding: '10px',
                  borderRadius: '6px',
                  border: `1px solid ${borderColor}30`,
                  fontSize: '11px'
                }}>
                  <strong style={{ color: borderColor, marginBottom: '6px', display: 'block' }}>
                    {explainMode ? '🎯 AÇÕES RECOMENDADAS:' : '📋 ESTRATÉGIAS PRIORITÁRIAS:'}
                  </strong>
                  <div style={{ color: theme.colors.text }}>
                    {isTopPriority ? (
                      explainMode ? 
                        'Mobilização imediata de equipes • Eliminação de criadouros • Aplicação de larvicida • Educação intensiva • Monitoramento semanal' :
                        'Intervenção emergencial • Controle químico • Eliminação mecânica • Vigilância intensificada • Educação comunitária'
                    ) : isHighPriority ? (
                      explainMode ?
                        'Programação de visitas regulares • Mapeamento de criadouros • Ações educativas • Monitoramento quinzenal' :
                        'Controle programado • Mapeamento entomológico • Educação sanitária • Monitoramento regular'
                    ) : (
                      explainMode ?
                        'Manutenção preventiva • Monitoramento mensal • Ações educativas pontuais' :
                        'Vigilância preventiva • Monitoramento de rotina • Educação continuada'
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <ContextBox
          title={explainMode ? 'Metodologia de Priorização' : 'Algoritmo de Estratificação'}
          description={explainMode ?
            `Ranking baseado em score multivariado considerando densidade média, dispersão (IPO), reincidência e volume total de ovos para o período ${period.split(' - ')[0]}.` :
            `Score composto: densidade×IPO×(reincidência+1)/100, hierarquizando territórios por risco entomológico integrado no período ${period.split(' - ')[0]}.`
          }
          formula="Score = (avgEggs × IPO × (reincidence + 1)) / 100"
          interpretation={explainMode ?
            'Bairros com score elevado requerem atenção prioritária e alocação preferencial de recursos para controle.' :
            'Scores elevados indicam necessidade de intervenção prioritária e monitoramento intensificado.'
          }
          period={period}
          theme={theme}
          explainMode={explainMode}
        />
      </div>
    </div>
  );
});

// Componente de Filtros Temporais
const TemporalFilters: React.FC<{
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  availableYears: string[];
  availableMonths: string[];
  theme: any;
}> = ({ selectedYear, selectedMonth, onYearChange, onMonthChange, availableYears, availableMonths, theme }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: theme.colors.surface,
    borderRadius: '8px',
    border: `1px solid ${theme.colors.border}`,
    flexWrap: 'wrap'
  }}>
    <span style={{ 
      fontSize: '14px', 
      fontWeight: '500', 
      color: theme.colors.text,
      minWidth: '120px'
    }}>
      Filtros Temporais:
    </span>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label style={{ fontSize: '12px', color: theme.colors.textSecondary, fontWeight: '500' }}>
        Ano:
      </label>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.cardBg,
          color: theme.colors.text,
          fontSize: '13px',
          cursor: 'pointer',
          minWidth: '100px'
        }}
      >
        <option value="">Todos os anos</option>
        {availableYears.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label style={{ fontSize: '12px', color: theme.colors.textSecondary, fontWeight: '500' }}>
        Mês:
      </label>
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.cardBg,
          color: theme.colors.text,
          fontSize: '13px',
          cursor: 'pointer',
          minWidth: '140px',
          opacity: availableMonths.length === 0 ? 0.5 : 1
        }}
        disabled={availableMonths.length === 0}
      >
        <option value="">Todos os meses</option>
        {availableMonths.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>

    {(selectedYear || selectedMonth) && (
      <button
        onClick={() => {
          onYearChange('');
          onMonthChange('');
        }}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: `1px solid ${PROJECT_COLORS.warning}`,
          backgroundColor: PROJECT_COLORS.warning + '20',
          color: PROJECT_COLORS.warning,
          fontSize: '11px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Limpar Filtros
      </button>
    )}
  </div>
);

// Componente de Tabs
const TabNavigation: React.FC<{
  activeTab: number;
  onTabChange: (index: number) => void;
  theme: any;
}> = ({ activeTab, onTabChange, theme }) => {
  const tabs = [
    'Situação Atual', 
    'Evolução Temporal', 
    'Áreas Prioritárias', 
    'Índices Técnicos', 
    'Controle de Qualidade'
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabChange(index)}
          style={{
            padding: '12px 24px',
            marginRight: '8px',
            marginBottom: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === index ? PROJECT_COLORS.primary : theme.colors.surface,
            color: activeTab === index ? 'white' : theme.colors.text,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// Componente Principal
const VigilanciaEntomologica: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [realData, setRealData] = useState<AedesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [explainMode, setExplainMode] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(realData.map(r => r.ano.toString()))).sort((a, b) => parseInt(b) - parseInt(a));
    return years;
  }, [realData]);
  
  const availableMonths = useMemo(() => {
    let filteredData = realData;
    
    if (selectedYear) {
      filteredData = filteredData.filter(r => r.ano.toString() === selectedYear);
    }
    
    const months = Array.from(new Set(filteredData.map(r => r.mes_nome))).sort((a, b) => {
      const monthOrder = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                         'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
    return months;
  }, [realData, selectedYear]);

  useEffect(() => {
    if (selectedMonth && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth('');
    }
  }, [selectedMonth, availableMonths]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fileContent = await window.fs.readFile(
          'banco_dados_aedes_montes_claros_normalizado.csv', 
          { encoding: 'utf8' }
        );
        
        const lines = fileContent.trim().split('\n');
        
        if (lines.length === 0) {
          throw new Error('Arquivo CSV vazio');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const data: AedesRecord[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          try {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            
            const row: any = {};
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              if (['id_registro', 'id_ovitrampa', 'quantidade_ovos', 'ano', 'mes_numero', 
                   'semana_epidemiologica', 'reincidencia', 'codigo_ibge', 'trimestre'].includes(header)) {
                row[header] = parseInt(value) || 0;
              } else if (['latitude', 'longitude', 'peso_ovitrampa', 'percentual_diferenca'].includes(header)) {
                row[header] = parseFloat(value) || 0;
              } else {
                row[header] = value;
              }
            });
            
            if (row.id_registro && row.id_ovitrampa >= 0) {
              data.push(row as AedesRecord);
            }
            
          } catch (lineError) {
            console.warn(`Erro ao processar linha ${i}:`, lineError);
            continue;
          }
        }
        
        if (data.length > 0) {
          setRealData(data);
          console.log(`Dados reais carregados: ${data.length} registros`);
        } else {
          throw new Error('Nenhum registro válido encontrado');
        }
        
      } catch (err: any) {
        console.error('Erro ao carregar dados reais:', err);
        setError(`Falha ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const theme = {
    colors: darkMode ? {
      bg: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      primary: PROJECT_COLORS.primary,
      cardBg: PROJECT_COLORS.secondary
    } : {
      bg: '#f8f9fa',
      surface: '#ffffff',
      text: PROJECT_COLORS.secondary,
      textSecondary: '#6c757d',
      border: '#e0e0e0',
      primary: PROJECT_COLORS.primary,
      cardBg: '#ffffff'
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div style={{ 
      backgroundColor: theme.colors.bg, 
      color: theme.colors.text,
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${PROJECT_COLORS.primary} 0%, ${PROJECT_COLORS.secondary} 100%)`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        color: 'white',
        position: 'relative'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>Vigilância Entomológica</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
          Monitoramento de {new Set(realData.map(r => r.id_ovitrampa)).size} quadrículas • {realData.length.toLocaleString()} registros • Montes Claros/MG
        </p>
        
        {/* Controles do Header */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => setExplainMode(!explainMode)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: explainMode ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
          >
            {explainMode ? 'Linguagem Gerencial' : 'Linguagem Técnica'}
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
          >
            {darkMode ? 'Claro' : 'Escuro'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: PROJECT_COLORS.danger + '20',
          border: `1px solid ${PROJECT_COLORS.danger}`,
          borderRadius: '8px',
          marginBottom: '24px',
          color: PROJECT_COLORS.danger
        }}>
          <strong>Aviso:</strong> {error}. Sistema funcionando com capacidade limitada.
        </div>
      )}

      {/* Tabs */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        theme={theme} 
      />

      {/* Filtros Temporais */}
      <TemporalFilters
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        availableYears={availableYears}
        availableMonths={availableMonths}
        theme={theme}
      />

      {/* Tab Content */}
      {activeTab === 0 && <SituacaoAtual data={realData} selectedYear={selectedYear} selectedMonth={selectedMonth} theme={theme} explainMode={explainMode} />}
      {activeTab === 1 && <EvolucaoTemporal data={realData} selectedYear={selectedYear} selectedMonth={selectedMonth} theme={theme} explainMode={explainMode} />}
      {activeTab === 2 && <AreasPrioritarias data={realData} selectedYear={selectedYear} selectedMonth={selectedMonth} theme={theme} explainMode={explainMode} />}
      {activeTab === 3 && <IndicesTecnicos data={realData} selectedYear={selectedYear} selectedMonth={selectedMonth} theme={theme} explainMode={explainMode} />}
      {activeTab === 4 && <ControleQualidade data={realData} selectedYear={selectedYear} selectedMonth={selectedMonth} theme={theme} explainMode={explainMode} />}

      {/* Dicionário de Termos no Rodapé */}
      <DicionarioTermos theme={theme} explainMode={explainMode} />
    </div>
  );
};

// Componente do Dicionário de Termos
const DicionarioTermos: React.FC<{theme: any, explainMode: boolean}> = ({ theme, explainMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const termos = [
    {
      termo: "IPO - Índice de Positividade de Ovitrampas",
      definicao: explainMode 
        ? "Percentual de armadilhas que capturaram ovos do mosquito Aedes aegypti, indicando a dispersão geográfica da infestação na área monitorada."
        : "Proporção de ovitrampas positivas em relação ao total instalado, medindo dispersão espacial do vetor. Fórmula: (Ovitrampas Positivas / Total Ovitrampas) × 100.",
      referencia: "Limiar crítico: >30% (OMS/PAHO)"
    },
    {
      termo: "IDO - Índice de Densidade de Ovos", 
      definicao: explainMode
        ? "Número médio de ovos encontrados nas armadilhas que capturaram ovos, indicando a intensidade da reprodução do mosquito nas áreas infestadas."
        : "Densidade média de oviposição nas ovitrampas positivas, refletindo intensidade reprodutiva vetorial. Fórmula: Total de Ovos / Ovitrampas Positivas.",
      referencia: "Limiar alto: >50 ovos/ovitrampa"
    },
    {
      termo: "IMO - Índice Médio de Ovos",
      definicao: explainMode
        ? "Média geral de ovos por coleta considerando todas as armadilhas (positivas e negativas), refletindo o nível geral de atividade reprodutiva."
        : "Densidade média de oviposição considerando todas as ovitrampas monitoradas. Fórmula: Total de Ovos / Total de Coletas.",
      referencia: "Limiar alto: >25 ovos/coleta"
    },
    {
      termo: "IVO - Índice de Variação de Oviposição",
      definicao: explainMode
        ? "Medida de quão irregular é a distribuição de ovos entre diferentes armadilhas, indicando se a infestação está concentrada ou dispersa."
        : "Coeficiente de variação da oviposição, medindo heterogeneidade espacial da infestação. Fórmula: (Desvio Padrão / Média) × 100.",
      referencia: "Limiar alto: >100% (muito heterogênea)"
    },
    {
      termo: "Reincidência",
      definicao: explainMode
        ? "Situação em que uma armadilha volta a capturar ovos após ter sido limpa, indicando que os mosquitos retornaram para a mesma área."
        : "Fenômeno de recolonização pós-intervenção, onde ovitrampas apresentam positividade recorrente após período negativo.",
      referencia: "Limiar crítico: >15% das coletas"
    },
    {
      termo: "Densidade Populacional Vetorial",
      definicao: explainMode
        ? "Medida da quantidade de mosquitos Aedes aegypti em uma determinada área, estimada através da contagem de ovos nas armadilhas."
        : "Estimativa da abundância populacional do vetor baseada na densidade de oviposição coletada nas ovitrampas sentinela.",
      referencia: "Alta densidade: >20 ovos/coleta média"
    },
    {
      termo: "Semana Epidemiológica",
      definicao: explainMode
        ? "Sistema de datação usado em saúde pública onde o ano é dividido em 52-53 semanas para facilitar o acompanhamento de doenças."
        : "Sistema padronizado de datação epidemiológica (ISO 8601/CDC MMWR) para vigilância temporal consistente.",
      referencia: "Ano dividido em 52-53 semanas"
    },
    {
      termo: "Quadrícula/Ovitrampa",
      definicao: explainMode
        ? "Armadilha utilizada para capturar ovos do mosquito Aedes aegypti, consistindo em recipiente escuro com água e substrato para postura."
        : "Dispositivo de vigilância entomológica: recipiente padronizado com palheta para oviposição e monitoramento vetorial passivo.",
      referencia: "Padrão: recipiente escuro 300ml + palheta"
    },
    {
      termo: "Sazonalidade",
      definicao: explainMode
        ? "Variação da atividade do mosquito ao longo das estações do ano, influenciada por temperatura, chuva e umidade."
        : "Padrão cíclico anual da densidade populacional vetorial, correlacionado com variáveis climáticas (temperatura >25°C, UR >70%).",
      referencia: "Pico: período chuvoso e quente"
    },
    {
      termo: "Score de Risco Multivariado",
      definicao: explainMode
        ? "Pontuação que combina diferentes indicadores (densidade, dispersão, reincidência) para identificar áreas que precisam de ação prioritária."
        : "Índice composto integrando múltiplas variáveis entomológicas para estratificação territorial de risco.",
      referencia: "Fórmula: (Densidade × IPO × Reincidência) / 100"
    },
    {
      termo: "Completude de Dados",
      definicao: explainMode
        ? "Percentual de informações preenchidas corretamente nos registros de coleta, indicando qualidade dos dados coletados."
        : "Métrica de qualidade indicando proporção de campos obrigatórios adequadamente preenchidos nos registros.",
      referencia: "Adequado: >95% de completude"
    },
    {
      termo: "Integridade Temporal",
      definicao: explainMode
        ? "Verificação se as datas registradas são logicamente corretas (data de coleta posterior à instalação da armadilha)."
        : "Validação cronológica da sequência temporal dos registros (data_coleta ≥ data_instalação).",
      referencia: "Consistência adequada: >95%"
    }
  ];

  return (
    <div style={{
      marginTop: '48px',
      ...cardStyle(theme),
      backgroundColor: PROJECT_COLORS.secondary,
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isExpanded ? '24px' : '0',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={{ 
          margin: 0, 
          color: 'white',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          📚 Dicionário de Termos {explainMode ? 'Gerenciais' : 'Técnicos'}
        </h3>
        <button style={{
          background: 'none',
          border: `1px solid ${PROJECT_COLORS.primary}`,
          color: PROJECT_COLORS.primary,
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {isExpanded ? 'Recolher ▲' : 'Expandir ▼'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {termos.map((item, index) => (
              <div key={index} style={{
                padding: '16px',
                backgroundColor: 'rgba(0,135,168,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(0,135,168,0.3)'
              }}>
                <div style={{
                  fontWeight: 'bold',
                  color: PROJECT_COLORS.primary,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  {item.termo}
                </div>
                <div style={{
                  fontSize: '12px',
                  lineHeight: '1.5',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '8px'
                }}>
                  {item.definicao}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#FFD700',
                  fontWeight: 'bold'
                }}>
                  <strong>Referência:</strong> {item.referencia}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(0,135,168,0.2)',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(0,135,168,0.4)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              📖 Referências Metodológicas
            </div>
            <div style={{ fontSize: '11px', lineHeight: '1.4', color: 'rgba(255,255,255,0.8)' }}>
              <strong>Organização Mundial da Saúde (OMS)</strong> - Guidelines for Aedes aegypti Surveillance | 
              <strong> Ministério da Saúde (BR)</strong> - Diretrizes Nacionais para Prevenção e Controle de Dengue | 
              <strong> PAHO/WHO</strong> - Entomological Surveillance Methods | 
              <strong> Secretaria de Vigilância em Saúde (SVS)</strong> - Protocolo de Vigilância Entomológica
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VigilanciaEntomologica;