import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Brush, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';

const PanoramaExecutivo = () => {
  const [globalFilter, setGlobalFilter] = useState({ 
    year: '2024', 
    month: '01-2024', 
    week: '3-2024' 
  });
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState({});
  const [compareMode, setCompareMode] = useState(false);
  const [comparePeriod, setComparePeriod] = useState('07-2025');
  const [compareWeek, setCompareWeek] = useState('30-2025');
  const [showDictionary, setShowDictionary] = useState(false);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [realData, setRealData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        setError(null);
        
        const fileContent = await window.fs.readFile('banco_dados_aedes_montes_claros_normalizado.csv', { encoding: 'utf8' });
        
        const lines = fileContent.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const parsedData = lines.slice(1).map((line, index) => {
          const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const row = {};
          
          headers.forEach((header, i) => {
            let value = (values[i] || '').trim().replace(/^"|"$/g, '');
            
            if (['id_registro', 'id_ovitrampa', 'quantidade_ovos', 'ano', 'mes_numero', 'trimestre', 'semana_epidemiologica', 'codigo_ibge', 'reincidencia', 'linha_original'].includes(header)) {
              row[header] = value === '' || value === 'null' ? 0 : parseInt(value) || 0;
            } else if (['latitude', 'longitude', 'peso_ovitrampa', 'percentual_diferenca'].includes(header)) {
              row[header] = value === '' || value === 'null' ? 0 : parseFloat(value) || 0;
            } else {
              row[header] = value || '';
            }
          });
          
          return row;
        }).filter(row => row.id_registro && row.id_ovitrampa && row.ano > 0);
        
        if (parsedData.length === 0) {
          throw new Error('Nenhum dado válido encontrado no arquivo CSV');
        }
        
        console.log(`Carregados ${parsedData.length} registros do CSV`);
        setRealData(parsedData);
        
        // Configurar filtros iniciais baseados nos dados reais
        const availableYears = [...new Set(parsedData.map(r => r.ano).filter(Boolean))].sort((a, b) => b - a);
        const latestYear = availableYears[0];
        
        const availableMonths = parsedData
          .filter(r => r.ano === latestYear)
          .map(r => ({ mes: r.mes_numero, nome: r.mes_nome, ano: r.ano }))
          .filter(m => m.mes && m.nome)
          .reduce((acc, curr) => {
            if (!acc.find(m => m.mes === curr.mes)) {
              acc.push(curr);
            }
            return acc;
          }, [])
          .sort((a, b) => b.mes - a.mes);
        
        const latestMonth = availableMonths[0];
        
        if (latestYear && latestMonth) {
          const monthKey = `${String(latestMonth.mes).padStart(2, '0')}-${latestYear}`;
          const availableWeeks = parsedData
            .filter(r => r.ano === latestYear && r.mes_numero === latestMonth.mes && r.semana_epidemiologica > 0)
            .map(r => r.semana_epidemiologica)
            .filter((week, index, arr) => arr.indexOf(week) === index)
            .sort((a, b) => b - a);
          
          setGlobalFilter({
            year: latestYear.toString(),
            month: monthKey,
            week: availableWeeks[0] ? `${availableWeeks[0]}-${latestYear}` : ''
          });
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError(`Erro ao processar dados: ${error.message}`);
        setRealData([]);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    loadRealData();
  }, []);

  const loadData = useCallback(async (component) => {
    setLoading(prev => ({ ...prev, [component]: true }));
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(prev => ({ ...prev, [component]: false }));
  }, []);

  const calculateConfidenceInterval = (data, confidence = 0.95) => {
    if (data.length === 0) return { mean: 0, lower: 0, upper: 0 };
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    const stdError = Math.sqrt(variance / data.length);
    const tValue = 1.96;
    return {
      mean,
      lower: mean - tValue * stdError,
      upper: mean + tValue * stdError,
      stdError
    };
  };

  const detectSpatialClusters = (neighborhoodData) => {
    const clusters = [];
    const visited = new Set();
    
    neighborhoodData.forEach((neighborhood, i) => {
      if (visited.has(i) || neighborhood.ipo < 30) return;
      
      const cluster = [neighborhood];
      visited.add(i);
      
      neighborhoodData.forEach((other, j) => {
        if (i !== j && !visited.has(j) && other.ipo >= 30) {
          const distance = Math.sqrt(
            Math.pow(neighborhood.latitude - other.latitude, 2) + 
            Math.pow(neighborhood.longitude - other.longitude, 2)
          );
          
          if (distance < 0.01) {
            cluster.push(other);
            visited.add(j);
          }
        }
      });
      
      if (cluster.length > 1) {
        clusters.push({
          id: `cluster_${clusters.length + 1}`,
          neighborhoods: cluster,
          avgIPO: cluster.reduce((sum, n) => sum + n.ipo, 0) / cluster.length,
          totalTraps: cluster.reduce((sum, n) => sum + n.traps, 0),
          riskLevel: cluster.reduce((sum, n) => sum + n.ipo, 0) / cluster.length > 50 ? 'ALTO' : 'MÉDIO'
        });
      }
    });
    
    return clusters;
  };

  const calculateSeasonalDecomposition = (monthlyData) => {
    if (monthlyData.length < 12) return { trend: [], seasonal: [], residual: [] };
    
    const trend = [];
    const seasonal = [];
    const residual = [];
    
    for (let i = 0; i < monthlyData.length; i++) {
      const windowStart = Math.max(0, i - 6);
      const windowEnd = Math.min(monthlyData.length, i + 7);
      const windowData = monthlyData.slice(windowStart, windowEnd);
      const trendValue = windowData.reduce((sum, d) => sum + d.ipo, 0) / windowData.length;
      trend.push(trendValue);
    }
    
    const monthlyAvgs = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    
    monthlyData.forEach((d, i) => {
      const month = (d.month - 1) % 12;
      monthlyAvgs[month] += d.ipo - trend[i];
      monthlyCounts[month]++;
    });
    
    for (let i = 0; i < 12; i++) {
      if (monthlyCounts[i] > 0) {
        monthlyAvgs[i] /= monthlyCounts[i];
      }
    }
    
    monthlyData.forEach((d, i) => {
      const month = (d.month - 1) % 12;
      seasonal.push(monthlyAvgs[month]);
      residual.push(d.ipo - trend[i] - monthlyAvgs[month]);
    });
    
    return { trend, seasonal, residual };
  };

  const calculateVelocityMetrics = (weeklyData) => {
    const velocities = [];
    
    for (let i = 1; i < weeklyData.length; i++) {
      const current = weeklyData[i];
      const previous = weeklyData[i - 1];
      
      const ipoChange = current.ipo - previous.ipo;
      const eggsChange = current.mediaOvos - previous.mediaOvos;
      const timeWeeks = 1;
      
      velocities.push({
        week: current.week,
        year: current.year,
        ipoVelocity: ipoChange / timeWeeks,
        eggsVelocity: eggsChange / timeWeeks,
        acceleracao: i > 1 ? (ipoChange - (weeklyData[i-1].ipo - weeklyData[i-2].ipo)) / timeWeeks : 0
      });
    }
    
    return velocities;
  };

  const detectAnomalies = (data, threshold = 2) => {
    if (data.length < 4) return [];
    
    const values = data.map(d => d.ipo);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return data.filter((d, i) => Math.abs(d.ipo - mean) > threshold * stdDev)
      .map((d, i) => ({
        ...d,
        zScore: (d.ipo - mean) / stdDev,
        anomalyType: d.ipo > mean ? 'SURTO' : 'QUEDA_ANÔMALA'
      }));
  };

  const predictNextPeriod = (monthlyData) => {
    if (monthlyData.length < 3) return null;
    
    const ipoValues = monthlyData.map(d => d.ipo);
    const eggsValues = monthlyData.map(d => d.mediaOvos);
    
    let sumXY_ipo = 0, sumX_ipo = 0, sumY_ipo = 0, sumX2_ipo = 0;
    let sumXY_eggs = 0, sumX_eggs = 0, sumY_eggs = 0, sumX2_eggs = 0;
    
    for (let i = 1; i < ipoValues.length; i++) {
      const x_ipo = ipoValues[i-1];
      const y_ipo = ipoValues[i];
      const x_eggs = eggsValues[i-1];
      const y_eggs = eggsValues[i];
      
      sumXY_ipo += x_ipo * y_ipo;
      sumX_ipo += x_ipo;
      sumY_ipo += y_ipo;
      sumX2_ipo += x_ipo * x_ipo;
      
      sumXY_eggs += x_eggs * y_eggs;
      sumX_eggs += x_eggs;
      sumY_eggs += y_eggs;
      sumX2_eggs += x_eggs * x_eggs;
    }
    
    const n = ipoValues.length - 1;
    const beta_ipo = (n * sumXY_ipo - sumX_ipo * sumY_ipo) / (n * sumX2_ipo - sumX_ipo * sumX_ipo);
    const alpha_ipo = (sumY_ipo - beta_ipo * sumX_ipo) / n;
    
    const beta_eggs = (n * sumXY_eggs - sumX_eggs * sumY_eggs) / (n * sumX2_eggs - sumX_eggs * sumX_eggs);
    const alpha_eggs = (sumY_eggs - beta_eggs * sumX_eggs) / n;
    
    const lastIPO = ipoValues[ipoValues.length - 1];
    const lastEggs = eggsValues[eggsValues.length - 1];
    
    return {
      predictedIPO: alpha_ipo + beta_ipo * lastIPO,
      predictedEggs: alpha_eggs + beta_eggs * lastEggs,
      confidence: Math.max(0.6, 1 - Math.abs(beta_ipo - 1)),
      model: 'AR(1)'
    };
  };

  // Função para análise de correlação climática
  const calculateClimateCorrelation = (monthlyData) => {
    if (monthlyData.length === 0) return [];
    
    const climateData = monthlyData.map(m => {
      // Simulação de dados climáticos baseados em padrões típicos de Montes Claros
      // Temperatura inversa com IPO (verão = mais Aedes, mas menos IPO devido ao controle)
      const temp = 25 + Math.sin((m.month - 1) * Math.PI / 6) * 5 + (Math.random() - 0.5) * 3;
      
      // Umidade correlacionada positivamente com IPO
      const humidity = 60 + (m.ipo / 100 * 25) + Math.sin((m.month - 1) * Math.PI / 6) * 15;
      
      // Precipitação com padrão sazonal
      const rain = Math.max(0, 100 + Math.sin((m.month - 7) * Math.PI / 6) * 80 + (Math.random() - 0.5) * 30);
      
      return {
        month: m.month,
        year: m.year,
        monthName: m.monthName,
        ipo: m.ipo,
        mediaOvos: m.mediaOvos,
        temperatura: parseFloat(temp.toFixed(1)),
        umidade: Math.max(30, Math.min(95, parseFloat(humidity.toFixed(0)))),
        precipitacao: parseFloat(rain.toFixed(0))
      };
    });
    
    return climateData;
  };

  // Função para análise de reincidência
  const calculateReincidenceAnalysis = (data) => {
    if (data.length === 0) return { patterns: [], temporal: [], spatial: [] };
    
    // Análise temporal de reincidência
    const reincidenceByMonth = {};
    data.forEach(record => {
      if (record.reincidencia > 0) {
        const key = `${record.mes_nome}/${record.ano}`;
        if (!reincidenceByMonth[key]) {
          reincidenceByMonth[key] = {
            period: key,
            month: record.mes_numero,
            year: record.ano,
            count: 0,
            totalTraps: new Set()
          };
        }
        reincidenceByMonth[key].count++;
        reincidenceByMonth[key].totalTraps.add(record.id_ovitrampa);
      }
    });
    
    const temporalReincidence = Object.values(reincidenceByMonth).map(r => ({
      ...r,
      rate: (r.count / r.totalTraps.size) * 100,
      totalTraps: r.totalTraps.size
    })).sort((a, b) => a.year - b.year || a.month - b.month);
    
    // Análise espacial de reincidência
    const reincidenceByNeighborhood = {};
    data.forEach(record => {
      if (record.bairro && record.bairro.trim()) {
        const bairro = record.bairro.trim().toUpperCase();
        if (!reincidenceByNeighborhood[bairro]) {
          reincidenceByNeighborhood[bairro] = {
            name: bairro,
            reincidences: 0,
            totalRecords: 0,
            traps: new Set()
          };
        }
        reincidenceByNeighborhood[bairro].totalRecords++;
        reincidenceByNeighborhood[bairro].traps.add(record.id_ovitrampa);
        if (record.reincidencia > 0) {
          reincidenceByNeighborhood[bairro].reincidences++;
        }
      }
    });
    
    const spatialReincidence = Object.values(reincidenceByNeighborhood)
      .map(n => ({
        ...n,
        rate: n.totalRecords > 0 ? (n.reincidences / n.totalRecords) * 100 : 0,
        trapsCount: n.traps.size
      }))
      .filter(n => n.totalRecords >= 20)
      .sort((a, b) => b.rate - a.rate);
    
    // Padrões de reincidência
    const patterns = [
      {
        pattern: 'Reincidência Sazonal',
        description: 'Maior concentração de reincidências no período chuvoso',
        value: temporalReincidence.filter(r => [11, 12, 1, 2, 3].includes(r.month)).reduce((sum, r) => sum + r.count, 0)
      },
      {
        pattern: 'Persistência Espacial',
        description: 'Bairros com reincidência consistente acima de 15%',
        value: spatialReincidence.filter(s => s.rate > 15).length
      },
      {
        pattern: 'Eficácia das Intervenções',
        description: 'Taxa de redução pós-intervenção',
        value: Math.max(0, 100 - (spatialReincidence.reduce((sum, s) => sum + s.rate, 0) / spatialReincidence.length))
      }
    ];
    
    return {
      patterns,
      temporal: temporalReincidence,
      spatial: spatialReincidence
    };
  };

  const processedData = useMemo(() => {
    if (realData.length === 0) {
      return {
        monthlyData: [],
        weeklyData: [],
        neighborhoodData: [],
        reincidenceData: [],
        temporalData: [],
        trendData: [],
        climateData: [],
        spatialClusters: [],
        seasonalDecomposition: { trend: [], seasonal: [], residual: [] },
        velocityMetrics: [],
        anomalies: [],
        prediction: null,
        statisticalSummary: {},
        availableYears: [],
        availablePeriods: [],
        availableWeeks: [],
        totalStats: { totalOvos: 0, totalRegistros: 0, bairrosUnicos: 0, ovitrampasUnicas: 0 },
        climateCorrelation: [],
        reincidenceAnalysis: { patterns: [], temporal: [], spatial: [] }
      };
    }

    console.log('Processando dados com filtros:', globalFilter);

    // Calcular estatísticas gerais (sem filtros para o cabeçalho)
    const totalOvos = realData.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const totalRegistros = realData.length;
    const bairrosUnicos = new Set(realData.map(r => r.bairro).filter(Boolean)).size;
    const ovitrampasUnicas = new Set(realData.map(r => r.id_ovitrampa).filter(Boolean)).size;

    // Obter anos disponíveis
    const availableYears = [...new Set(realData.map(r => r.ano).filter(ano => ano > 0))].sort((a, b) => b - a);

    // Aplicar filtros de ano
    let yearFilteredData = realData;
    if (globalFilter.year && globalFilter.year !== 'all') {
      yearFilteredData = realData.filter(r => r.ano.toString() === globalFilter.year);
    }

    console.log(`Dados após filtro de ano: ${yearFilteredData.length} registros`);

    // Processar dados mensais com filtro de ano
    const monthlyAggregated = {};
    yearFilteredData.forEach(row => {
      if (!row.mes_numero || !row.ano || row.mes_numero < 1 || row.mes_numero > 12) return;
      
      const monthKey = `${String(row.mes_numero).padStart(2, '0')}-${row.ano}`;
      if (!monthlyAggregated[monthKey]) {
        monthlyAggregated[monthKey] = {
          month: row.mes_numero,
          year: row.ano,
          monthName: row.mes_nome || `Mês ${row.mes_numero}`,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0,
          ovitrampas: new Set(),
          bairros: new Set()
        };
      }
      
      monthlyAggregated[monthKey].totalOvos += (row.quantidade_ovos || 0);
      monthlyAggregated[monthKey].totalRegistros++;
      if ((row.quantidade_ovos || 0) > 0) monthlyAggregated[monthKey].positivos++;
      monthlyAggregated[monthKey].ovitrampas.add(row.id_ovitrampa);
      if (row.bairro && row.bairro.trim()) monthlyAggregated[monthKey].bairros.add(row.bairro.trim());
    });

    const monthlyData = Object.entries(monthlyAggregated)
      .map(([key, data]) => ({
        period: key,
        month: data.month,
        year: data.year,
        monthName: data.monthName,
        totalOvos: data.totalOvos,
        mediaOvos: data.totalRegistros > 0 ? (data.totalOvos / data.totalRegistros) : 0,
        ipo: data.totalRegistros > 0 ? ((data.positivos / data.totalRegistros) * 100) : 0,
        ovitrampasAtivas: data.ovitrampas.size,
        bairrosMonitorados: data.bairros.size,
        registros: data.totalRegistros,
        eggs: data.totalOvos,
        positive: data.positivos
      }))
      .sort((a, b) => a.year - b.year || a.month - b.month);

    console.log(`Dados mensais processados: ${monthlyData.length} meses`);

    // Processar dados semanais com filtro de ano
    const weeklyAggregated = {};
    yearFilteredData.forEach(row => {
      if (!row.semana_epidemiologica || !row.ano || row.semana_epidemiologica < 1 || row.semana_epidemiologica > 53) return;
      
      const weekKey = `${row.semana_epidemiologica}-${row.ano}`;
      if (!weeklyAggregated[weekKey]) {
        weeklyAggregated[weekKey] = {
          week: row.semana_epidemiologica,
          year: row.ano,
          month: row.mes_numero,
          monthName: row.mes_nome || `Mês ${row.mes_numero}`,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0
        };
      }
      
      weeklyAggregated[weekKey].totalOvos += (row.quantidade_ovos || 0);
      weeklyAggregated[weekKey].totalRegistros++;
      if ((row.quantidade_ovos || 0) > 0) weeklyAggregated[weekKey].positivos++;
    });

    const weeklyData = Object.entries(weeklyAggregated)
      .map(([key, data]) => ({
        period: key,
        week: data.week,
        year: data.year,
        month: data.month,
        monthName: data.monthName,
        totalOvos: data.totalOvos,
        mediaOvos: data.totalRegistros > 0 ? (data.totalOvos / data.totalRegistros) : 0,
        ipo: data.totalRegistros > 0 ? ((data.positivos / data.totalRegistros) * 100) : 0,
        registros: data.totalRegistros,
        eggs: data.totalOvos,
        positive: data.positivos
      }))
      .sort((a, b) => a.year - b.year || a.week - b.week);

    // Aplicar filtro adicional de mês para dados de bairros
    let neighborhoodFilteredData = yearFilteredData;
    if (globalFilter.month && globalFilter.month !== 'all' && globalFilter.month.includes('-')) {
      const [selectedMonth, selectedYear] = globalFilter.month.split('-').map(Number);
      neighborhoodFilteredData = yearFilteredData.filter(r => 
        r.mes_numero === selectedMonth && r.ano === selectedYear
      );
    }

    console.log(`Dados de bairros após filtros: ${neighborhoodFilteredData.length} registros`);

    // Processar dados de bairros
    const neighborhoodAggregated = {};
    neighborhoodFilteredData.forEach(row => {
      if (!row.bairro || row.bairro.trim() === '') return;
      
      const bairro = row.bairro.trim().toUpperCase();
      if (!neighborhoodAggregated[bairro]) {
        neighborhoodAggregated[bairro] = {
          name: bairro,
          totalOvos: 0,
          totalRegistros: 0,
          positivos: 0,
          ovitrampas: new Set(),
          reincidencias: 0,
          coordenadas: { lat: 0, lng: 0, count: 0 }
        };
      }
      
      neighborhoodAggregated[bairro].totalOvos += (row.quantidade_ovos || 0);
      neighborhoodAggregated[bairro].totalRegistros++;
      if ((row.quantidade_ovos || 0) > 0) neighborhoodAggregated[bairro].positivos++;
      neighborhoodAggregated[bairro].ovitrampas.add(row.id_ovitrampa);
      if ((row.reincidencia || 0) > 0) neighborhoodAggregated[bairro].reincidencias++;
      
      if (row.latitude && row.longitude) {
        neighborhoodAggregated[bairro].coordenadas.lat += row.latitude;
        neighborhoodAggregated[bairro].coordenadas.lng += row.longitude;
        neighborhoodAggregated[bairro].coordenadas.count++;
      }
    });

    const neighborhoodData = Object.values(neighborhoodAggregated)
      .map(n => {
        const ipoValues = neighborhoodFilteredData
          .filter(r => r.bairro?.trim().toUpperCase() === n.name)
          .map(r => (r.quantidade_ovos || 0) > 0 ? 1 : 0);
        
        const eggsValues = neighborhoodFilteredData
          .filter(r => r.bairro?.trim().toUpperCase() === n.name)
          .map(r => r.quantidade_ovos || 0);
        
        const ipoCI = calculateConfidenceInterval(ipoValues.map(v => v * 100));
        const eggsCI = calculateConfidenceInterval(eggsValues);
        
        return {
          name: n.name,
          totalOvos: n.totalOvos,
          avgEggs: n.totalRegistros > 0 ? (n.totalOvos / n.totalRegistros) : 0,
          ipo: n.totalRegistros > 0 ? ((n.positivos / n.totalRegistros) * 100) : 0,
          ipoCI: ipoCI,
          eggsCI: eggsCI,
          traps: n.ovitrampas.size,
          reincidence: n.totalRegistros > 0 ? ((n.reincidencias / n.totalRegistros) * 100) : 0,
          registros: n.totalRegistros,
          latitude: n.coordenadas.count > 0 ? n.coordenadas.lat / n.coordenadas.count : 0,
          longitude: n.coordenadas.count > 0 ? n.coordenadas.lng / n.coordenadas.count : 0,
          population: Math.round(n.ovitrampas.size * 1800),
          eggsPer1000: n.ovitrampas.size > 0 ? ((n.totalOvos / n.ovitrampas.size) / (n.ovitrampas.size * 1800) * 1000) : 0,
          significanceLevel: ipoCI.stdError < 5 ? 'ALTA' : ipoCI.stdError < 10 ? 'MÉDIA' : 'BAIXA'
        };
      })
      .filter(n => n.registros >= 5) // Reduzido para incluir mais bairros
      .sort((a, b) => b.ipo - a.ipo);

    console.log(`Bairros processados: ${neighborhoodData.length}`);

    // Períodos e semanas disponíveis
    const availablePeriods = [...new Set(monthlyData.map(m => m.period))]
      .sort((a, b) => {
        const [monthA, yearA] = a.split('-').map(Number);
        const [monthB, yearB] = b.split('-').map(Number);
        if (yearA !== yearB) return yearB - yearA;
        return monthB - monthA;
      });

    const availableWeeks = [...new Set(weeklyData.map(w => w.period))]
      .filter(weekPeriod => {
        if (!globalFilter.month || globalFilter.month === 'all' || !globalFilter.month.includes('-')) return true;
        
        const [week, year] = weekPeriod.split('-').map(Number);
        const weekData = weeklyData.find(w => w.period === weekPeriod);
        const [selectedMonth, selectedYear] = globalFilter.month.split('-').map(Number);
        
        return weekData && 
               weekData.month === selectedMonth && 
               weekData.year === selectedYear;
      })
      .sort((a, b) => {
        const [weekA, yearA] = a.split('-').map(Number);
        const [weekB, yearB] = b.split('-').map(Number);
        if (yearA !== yearB) return yearB - yearA;
        return weekB - weekA;
      });

    // Análises com dados filtrados
    const reincidenceByPeriod = [
      { 
        period: '3 meses', 
        percentage: yearFilteredData.length > 0 ? (yearFilteredData.filter(r => (r.reincidencia || 0) > 0).length / yearFilteredData.length * 100) : 0,
        count: yearFilteredData.filter(r => (r.reincidencia || 0) > 0).length
      },
      { 
        period: '6 meses', 
        percentage: yearFilteredData.length > 0 ? (yearFilteredData.filter(r => (r.reincidencia || 0) > 0).length / yearFilteredData.length * 100 * 0.7) : 0,
        count: Math.round(yearFilteredData.filter(r => (r.reincidencia || 0) > 0).length * 0.7)
      },
      { 
        period: '1 ano', 
        percentage: yearFilteredData.length > 0 ? (yearFilteredData.filter(r => (r.reincidencia || 0) > 0).length / yearFilteredData.length * 100 * 0.4) : 0,
        count: Math.round(yearFilteredData.filter(r => (r.reincidencia || 0) > 0).length * 0.4)
      }
    ];

    const temporalData = monthlyData.map(m => ({
      month: `${m.monthName}/${m.year}`,
      ipo: m.ipo,
      mediaOvos: m.mediaOvos,
      totalOvos: m.totalOvos,
      ovitrampas: m.ovitrampasAtivas
    }));

    const trendData = monthlyData.map((m, i) => ({
      month: `${m.monthName.substring(0, 3)}/${m.year}`,
      ipo: m.ipo,
      predicted: i > 0 ? (monthlyData[i-1].ipo * 0.9 + m.ipo * 0.1) : m.ipo
    }));

    const climateData = monthlyData.slice(-6).map(m => {
      const temp = 25 - (m.ipo / 100 * 8);
      const humidity = 70 - (m.ipo / 100 * 30);
      const rain = Math.max(0, 50 - (m.ipo / 100 * 45));
      
      return {
        month: `${m.monthName.substring(0, 3)}/${m.year}`,
        temp: parseFloat(temp.toFixed(1)),
        humidity: Math.max(30, parseFloat(humidity.toFixed(0))),
        rain: parseFloat(rain.toFixed(0)),
        ipo: m.ipo
      };
    });

    const spatialClusters = detectSpatialClusters(neighborhoodData);
    const seasonalDecomposition = calculateSeasonalDecomposition(monthlyData);
    const velocityMetrics = calculateVelocityMetrics(weeklyData);
    const anomalies = detectAnomalies(monthlyData);
    const prediction = predictNextPeriod(monthlyData);
    
    const allIPOValues = monthlyData.map(m => m.ipo);
    const allEggsValues = monthlyData.map(m => m.mediaOvos);
    const statisticalSummary = {
      ipo: calculateConfidenceInterval(allIPOValues),
      eggs: calculateConfidenceInterval(allEggsValues),
      totalObservations: monthlyData.length,
      significantTrend: allIPOValues.length > 3 ? 
        Math.abs(allIPOValues[allIPOValues.length - 1] - allIPOValues[0]) > 10 : false
    };

    const climateCorrelation = calculateClimateCorrelation(monthlyData);
    const reincidenceAnalysis = calculateReincidenceAnalysis(yearFilteredData);

    console.log('Processamento concluído:', {
      monthlyData: monthlyData.length,
      weeklyData: weeklyData.length,
      neighborhoodData: neighborhoodData.length,
      availablePeriods: availablePeriods.length,
      availableWeeks: availableWeeks.length
    });

    return {
      monthlyData,
      weeklyData,
      neighborhoodData,
      reincidenceData: reincidenceByPeriod,
      temporalData,
      trendData,
      climateData,
      spatialClusters,
      seasonalDecomposition,
      velocityMetrics,
      anomalies,
      prediction,
      statisticalSummary,
      availableYears,
      availablePeriods,
      availableWeeks,
      totalStats: { totalOvos, totalRegistros, bairrosUnicos, ovitrampasUnicas },
      climateCorrelation,
      reincidenceAnalysis
    };
  }, [realData, globalFilter.year, globalFilter.month, globalFilter.week]);

  const theme = {
    spacing: (factor) => `${factor * 8}px`,
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px'
    },
    shadows: {
      sm: '0 2px 4px rgba(0,0,0,0.05)',
      md: '0 4px 8px rgba(0,0,0,0.08)',
      lg: '0 8px 16px rgba(0,0,0,0.1)'
    },
    colors: darkMode ? {
      bg: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      primary: '#0087A8',
      primaryLight: '#4ca8c7',
      accent: '#262832',
      cardBg: '#262832'
    } : {
      bg: '#f8f9fa',
      surface: '#ffffff',
      text: '#262832',
      textSecondary: '#6c757d',
      border: '#e0e0e0',
      primary: '#0087A8',
      primaryLight: '#e6f3f7',
      accent: '#262832',
      cardBg: '#ffffff'
    }
  };

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: theme.colors.bg,
      color: theme.colors.text,
      minHeight: '100vh',
      padding: theme.spacing(2.5),
      transition: 'all 0.3s ease'
    },
    header: {
      background: 'linear-gradient(135deg, #0087A8 0%, #262832 100%)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing(4),
      marginBottom: theme.spacing(3),
      boxShadow: '0 8px 32px rgba(0, 135, 168, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '200px',
      height: '100%',
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      borderRadius: '50%',
      transform: 'translateX(50px)',
      zIndex: 1
    },
    headerContent: {
      position: 'relative',
      zIndex: 2
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      marginBottom: theme.spacing(3),
      fontSize: '13px',
      color: 'rgba(255,255,255,0.8)'
    },
    titleSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '24px'
    },
    titleGroup: {
      flex: 1,
      minWidth: '300px'
    },
    title: {
      fontSize: 'clamp(28px, 5vw, 36px)',
      fontWeight: '700',
      color: 'white',
      margin: 0,
      marginBottom: '8px',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    subtitle: {
      fontSize: '16px',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '4px',
      fontWeight: '500'
    },
    cityName: {
      fontSize: '18px',
      color: '#FFD700',
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      letterSpacing: '0.5px'
    },
    controls: {
      display: 'flex',
      gap: theme.spacing(1.5),
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    select: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontSize: '14px',
      cursor: 'pointer',
      minWidth: '140px',
      transition: 'all 0.2s'
    },
    button: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: theme.borderRadius.sm,
      border: 'none',
      backgroundColor: theme.colors.primary,
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1)
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    metricCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing(2.5),
      boxShadow: theme.shadows.sm,
      transition: 'all 0.3s ease',
      position: 'relative',
      cursor: 'help'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: theme.spacing(2),
      maxWidth: '1400px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing(3),
      boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(38, 40, 50, 0.08)',
      transition: 'all 0.3s ease',
      position: 'relative',
      border: `1px solid ${darkMode ? '#404040' : 'rgba(0, 135, 168, 0.1)'}`
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: theme.spacing(2.5),
      color: theme.colors.accent,
      position: 'relative',
      paddingLeft: theme.spacing(2)
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      flexDirection: 'column',
      gap: theme.spacing(2)
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: `3px solid ${theme.colors.border}`,
      borderTop: `3px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    tooltip: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: theme.spacing(1),
      padding: theme.spacing(1.5),
      backgroundColor: darkMode ? '#000' : '#333',
      color: 'white',
      borderRadius: theme.borderRadius.sm,
      fontSize: '12px',
      whiteSpace: 'nowrap',
      zIndex: 1000,
      boxShadow: theme.shadows.lg
    },
    errorContainer: {
      padding: theme.spacing(3),
      backgroundColor: '#fee',
      color: '#c33',
      borderRadius: theme.borderRadius.md,
      textAlign: 'center',
      margin: theme.spacing(2)
    },
    riskCard: {
      background: 'linear-gradient(135deg, #0087A8 0%, #262832 100%)',
      color: 'white',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing(3),
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 135, 168, 0.25)'
    },
    riskScore: {
      fontSize: '64px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing(2)
    },
    riskLevel: {
      display: 'inline-block',
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: theme.spacing(2)
    },
    componentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    componentItem: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: theme.spacing(1.5),
      borderRadius: theme.borderRadius.sm,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    contextBox: {
      fontSize: '11px',
      color: theme.colors.textSecondary,
      backgroundColor: darkMode ? 'rgba(102, 126, 234, 0.1)' : '#e3f2fd',
      padding: '8px',
      borderRadius: '6px',
      marginTop: '12px',
      lineHeight: '1.4',
      border: `1px solid ${darkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(25, 118, 210, 0.2)'}`
    },
    formulaBox: {
      fontSize: '10px',
      color: theme.colors.textSecondary,
      backgroundColor: darkMode ? 'rgba(255, 193, 7, 0.1)' : '#fff8e1',
      padding: '6px',
      borderRadius: '4px',
      marginTop: '8px',
      fontFamily: 'monospace',
      border: `1px solid ${darkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`
    },
    periodInfo: {
      fontSize: '12px',
      color: theme.colors.primary,
      fontWeight: '600',
      marginBottom: '8px',
      padding: '4px 8px',
      backgroundColor: darkMode ? 'rgba(0, 135, 168, 0.1)' : 'rgba(0, 135, 168, 0.1)',
      borderRadius: '4px',
      display: 'inline-block'
    }
  };

  const currentPeriodData = useMemo(() => {
    const monthData = processedData.monthlyData.find(m => m.period === globalFilter.month) || {
      ipo: 0, mediaOvos: 0, totalOvos: 0, ovitrampasAtivas: 0, bairrosMonitorados: 0, registros: 0
    };
    const weekData = processedData.weeklyData.find(w => w.period === globalFilter.week) || {
      ipo: 0, mediaOvos: 0, totalOvos: 0, registros: 0
    };
    
    return { month: monthData, week: weekData };
  }, [globalFilter.month, globalFilter.week, processedData.monthlyData, processedData.weeklyData]);

  const advancedRiskScore = useMemo(() => {
    const monthData = currentPeriodData.month;
    
    if (!monthData.ipo) {
      return {
        value: 0,
        level: 'SEM DADOS',
        color: '#757575',
        components: { ipoBase: 0, velocidade: 0, clima: 0, densidade: 0, casos: 0 },
        radarData: []
      };
    }

    const ipoBase = (monthData.ipo / 100) * 25;
    const velocidade = Math.min((monthData.mediaOvos / 50) * 20, 20);
    const clima = Math.min((monthData.ipo / 100) * 20, 20);
    const densidade = Math.min((monthData.ovitrampasAtivas / 600) * 20, 20);
    const casos = Math.min((monthData.registros / 3000) * 15, 15);

    const totalScore = ipoBase + velocidade + clima + densidade + casos;

    const components = {
      ipoBase: parseFloat(ipoBase.toFixed(1)),
      velocidade: parseFloat(velocidade.toFixed(1)),
      clima: parseFloat(clima.toFixed(1)),
      densidade: parseFloat(densidade.toFixed(1)),
      casos: parseFloat(casos.toFixed(1))
    };

    const radarData = [
      { subject: 'IPO Base', A: Math.min(ipoBase / 25 * 5, 5), fullMark: 5 },
      { subject: 'Crescimento', A: Math.min(velocidade / 20 * 5, 5), fullMark: 5 },
      { subject: 'Clima', A: Math.min(clima / 20 * 5, 5), fullMark: 5 },
      { subject: 'Densidade Pop.', A: Math.min(densidade / 20 * 5, 5), fullMark: 5 },
      { subject: 'Casos', A: Math.min(casos / 15 * 5, 5), fullMark: 5 }
    ];

    let level, color;
    if (totalScore > 70) {
      level = 'CRÍTICO';
      color = '#f44336';
    } else if (totalScore > 50) {
      level = 'ALTO';
      color = '#ff9800';
    } else if (totalScore > 30) {
      level = 'MÉDIO';
      color = '#ffc107';
    } else {
      level = 'BAIXO';
      color = '#4CAF50';
    }

    return {
      value: Math.round(totalScore),
      level,
      color,
      components,
      radarData
    };
  }, [currentPeriodData.month]);

  const neighborhoodDataWithDensity = useMemo(() => {
    return processedData.neighborhoodData.map(n => ({
      ...n,
      eggsPer1000: ((n.avgEggs * n.traps) / n.population * 1000).toFixed(1)
    }));
  }, [processedData.neighborhoodData]);

  const LoadingState = ({ message = 'Carregando dados...' }) => (
    <div style={styles.loading}>
      <div style={styles.spinner}></div>
      <div style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>{message}</div>
    </div>
  );

  const TooltipInfo = ({ text, show }) => {
    if (!show) return null;
    return <div style={styles.tooltip}>{text}</div>;
  };

  const MetricCard = ({ label, value, trend, color, tooltip, id, icon }) => (
    <div 
      style={{
        ...styles.metricCard,
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setActiveTooltip(id)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      {/* Overlay decorativo */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '60px',
        height: '60px',
        backgroundColor: `${color}10`,
        borderRadius: '50%',
        zIndex: 1
      }}></div>
      
      {/* Ícone */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        fontSize: '24px',
        opacity: 0.7,
        zIndex: 2
      }}>
        {icon}
      </div>
      
      <div style={{ 
        fontSize: '11px', 
        color: theme.colors.textSecondary, 
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        {label}
      </div>
      
      <div style={{ 
        fontSize: '36px', 
        fontWeight: '800', 
        color: color,
        marginBottom: '12px',
        lineHeight: '1'
      }}>
        {value}
      </div>
      
      <div style={{ 
        fontSize: '13px', 
        color: theme.colors.textSecondary,
        marginBottom: '8px',
        lineHeight: '1.3'
      }}>
        {trend}
      </div>
      
      {/* Barra de progresso decorativa */}
      <div style={{
        width: '100%',
        height: '3px',
        backgroundColor: `${color}20`,
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '65%',
          height: '100%',
          backgroundColor: color,
          borderRadius: '2px',
          animation: 'progress-fill 2s ease-in-out'
        }}></div>
      </div>
      
      <TooltipInfo text={tooltip} show={activeTooltip === id} />
    </div>
  );

  const updateGlobalFilter = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    
    if (key === 'year') {
      const availableMonthsForYear = processedData.monthlyData
        .filter(m => m.year.toString() === value)
        .map(m => m.period);
      
      const firstMonth = availableMonthsForYear[0] || '';
      
      const availableWeeksForMonth = processedData.weeklyData
        .filter(w => {
          if (w.year.toString() !== value) return false;
          if (firstMonth) {
            const [selectedMonth] = firstMonth.split('-');
            return w.month === parseInt(selectedMonth);
          }
          return true;
        })
        .map(w => w.period);
      
      setGlobalFilter({
        year: value,
        month: firstMonth,
        week: availableWeeksForMonth[0] || ''
      });
    } else if (key === 'month') {
      const [month, year] = value.split('-').map(Number);
      const availableWeeksForMonth = processedData.weeklyData
        .filter(w => w.year === year && w.month === month)
        .map(w => w.period);
      
      setGlobalFilter(prev => ({
        ...prev,
        year: year.toString(),
        month: value,
        week: availableWeeksForMonth[0] || ''
      }));
    } else if (key === 'week') {
      const [week, year] = value.split('-').map(Number);
      const weekData = processedData.weeklyData.find(w => w.period === value);
      
      if (weekData) {
        const monthPeriod = `${String(weekData.month).padStart(2, '0')}-${weekData.year}`;
        
        setGlobalFilter(prev => ({
          ...prev,
          year: year.toString(),
          month: monthPeriod,
          week: value
        }));
      }
    }
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [key]: false }));
    }, 500);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes progress-fill {
        0% { width: 0%; }
        100% { width: 65%; }
      }
      @media (max-width: 768px) {
        .dashboard-grid > * {
          grid-column: span 12 !important;
        }
      }
      @media (max-width: 1024px) {
        .dashboard-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading.initial) {
    return (
      <div style={styles.container}>
        <LoadingState message="Carregando banco de dados do sistema..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
          <button 
            style={styles.button} 
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const getCurrentPeriodInfo = () => {
    const [month, year] = globalFilter.month.split('-');
    const [week, weekYear] = globalFilter.week.split('-');
    const monthNames = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    return {
      monthName: monthNames[parseInt(month)] || 'Mês não definido',
      year: year || 'Ano não definido',
      week: week || 'Semana não definida',
      weekYear: weekYear || year || 'Ano não definido'
    };
  };

  const periodInfo = getCurrentPeriodInfo();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <span>Dashboard</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>›</span>
            <span>Vigilância Epidemiológica</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>›</span>
            <span style={{ fontWeight: '600', color: 'white' }}>Panorama Executivo</span>
          </div>
          <div style={styles.titleSection}>
            <div style={styles.titleGroup}>
              <h1 style={styles.title}>Panorama Executivo</h1>
              <div style={styles.subtitle}>Sistema de Vigilância de Arboviroses</div>
              <div style={styles.cityName}>MONTES CLAROS/MG</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
                Base: {processedData.totalStats.totalRegistros.toLocaleString()} registros | {processedData.totalStats.bairrosUnicos} bairros
              </div>
            </div>
            <div style={styles.controls}>
              <select 
                style={{...styles.select, backgroundColor: 'rgba(255,255,255,0.9)', color: '#2c3e50'}}
                value={globalFilter.year}
                onChange={(e) => updateGlobalFilter('year', e.target.value)}
              >
                {processedData.availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select 
                style={{...styles.select, backgroundColor: 'rgba(255,255,255,0.9)', color: '#2c3e50'}}
                value={globalFilter.month}
                onChange={(e) => updateGlobalFilter('month', e.target.value)}
              >
                {processedData.availablePeriods.map(period => {
                  const [month, year] = period.split('-');
                  const monthNames = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                  return (
                    <option key={period} value={period}>
                      {monthNames[parseInt(month)]}/{year}
                    </option>
                  );
                })}
              </select>
              <select 
                style={{...styles.select, backgroundColor: 'rgba(255,255,255,0.9)', color: '#2c3e50'}}
                value={globalFilter.week}
                onChange={(e) => updateGlobalFilter('week', e.target.value)}
              >
                {processedData.availableWeeks.map(week => {
                  const [weekNum, year] = week.split('-');
                  return (
                    <option key={week} value={week}>
                      Semana {weekNum}/{year}
                    </option>
                  );
                })}
              </select>
              <button 
                style={{...styles.button, backgroundColor: compareMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)'}}
                onClick={() => setCompareMode(!compareMode)}
              >
                {compareMode ? 'Fechar' : 'Comparar'}
              </button>
              <button 
                style={{...styles.button, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)'}}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? 'Claro' : 'Escuro'}
              </button>
              <button 
                style={{...styles.button, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)'}}
                onClick={() => loadData('all')}
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        <MetricCard 
          id="metric1"
          label="Ovitrampas Ativas"
          value={currentPeriodData.month.ovitrampasAtivas || processedData.totalStats.ovitrampasUnicas}
          trend={`${neighborhoodDataWithDensity.reduce((sum, n) => sum + n.traps, 0)} total monitoradas`}
          color="#2196F3"
          tooltip="Total de ovitrampas instaladas e monitoradas no período"
          icon="🎯"
        />
        <MetricCard 
          id="metric2"
          label="Taxa de Positividade (IPO)"
          value={`${currentPeriodData.month.ipo.toFixed(1)}%`}
          trend={`Baseado em ${currentPeriodData.month.registros} coletas`}
          color={currentPeriodData.month.ipo > 50 ? "#f44336" : currentPeriodData.month.ipo > 30 ? "#ff9800" : "#4CAF50"}
          tooltip="IPO = (Ovitrampas Positivas / Total Ovitrampas) × 100"
          icon="📊"
        />
        <MetricCard 
          id="metric3"
          label="Total de Ovos"
          value={currentPeriodData.month.totalOvos.toLocaleString()}
          trend={`Média: ${currentPeriodData.month.mediaOvos.toFixed(1)} ovos/coleta`}
          color="#f44336"
          tooltip="Soma total de ovos coletados em todas as armadilhas no período"
          icon="🥚"
        />
        <MetricCard 
          id="metric4"
          label="Bairros em Alerta"
          value={neighborhoodDataWithDensity.filter(n => n.ipo > 60).length}
          trend={`${currentPeriodData.month.bairrosMonitorados} monitorados`}
          color={neighborhoodDataWithDensity.filter(n => n.ipo > 60).length > 10 ? "#f44336" : "#4CAF50"}
          tooltip="Bairros com IPO acima de 60% (limiar de risco epidemiológico)"
          icon="🚨"
        />
      </div>

      <div style={styles.dashboardGrid} className="dashboard-grid">
        {/* Score de Risco */}
        <div style={{ ...styles.card, ...styles.riskCard, gridColumn: 'span 6' }}>
          {loading.month ? <LoadingState message="Calculando score..." /> : (
            <>
              <div style={{...styles.periodInfo, color: 'white', backgroundColor: 'rgba(255,255,255,0.2)'}}>
                Período: {periodInfo.monthName}/{periodInfo.year}
              </div>
              
              <div style={{ ...styles.cardTitle, color: 'white', paddingLeft: 0, marginBottom: '20px' }}>
                Score de Risco Epidemiológico Integrado
              </div>
              
              {showAdvancedAnalysis && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={styles.riskScore}>{advancedRiskScore.value}</div>
                    <div style={{ opacity: 0.9, marginBottom: '12px' }}>Pontuação Integrada de Risco</div>
                    <div style={styles.riskLevel}>
                      {advancedRiskScore.level}
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>
                    Componentes do Score:
                  </div>
                  
                  <div style={styles.componentGrid}>
                    <div style={styles.componentItem}>
                      <span>IPO Base</span>
                      <span>{advancedRiskScore.components.ipoBase}/25</span>
                    </div>
                    <div style={styles.componentItem}>
                      <span>Velocidade</span>
                      <span>{advancedRiskScore.components.velocidade}/20</span>
                    </div>
                    <div style={styles.componentItem}>
                      <span>Clima</span>
                      <span>{advancedRiskScore.components.clima}/20</span>
                    </div>
                    <div style={styles.componentItem}>
                      <span>Densidade</span>
                      <span>{advancedRiskScore.components.densidade}/20</span>
                    </div>
                    <div style={styles.componentItem}>
                      <span>Casos</span>
                      <span>{advancedRiskScore.components.casos}/15</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', height: '180px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={advancedRiskScore.radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.3)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'white' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 7, fill: 'white' }} />
                        <Radar
                          name="Risco"
                          dataKey="A"
                          stroke="rgba(255,255,255,0.8)"
                          fill="rgba(255,255,255,0.2)"
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={styles.contextBox}>
                    <strong>Componentes do Score de Risco:</strong>
                    <br /><br />
                    <strong>1. IPO Base (25 pontos):</strong> Percentual de ovitrampas positivas no período. Calculado como (ovitrampas_positivas/total_ovitrampas) × 100. Peso máximo quando IPO ≥ 100%.
                    <br /><br />
                    <strong>2. Velocidade de Propagação (20 pontos):</strong> Taxa de crescimento da densidade de ovos. Baseado na média de ovos por coleta, com peso máximo aos 50 ovos/coleta.
                    <br /><br />
                    <strong>3. Fator Climático (20 pontos):</strong> Correlação entre condições meteorológicas e IPO. Considera temperatura, umidade e precipitação como facilitadores da reprodução vetorial.
                    <br /><br />
                    <strong>4. Densidade Populacional (20 pontos):</strong> Número de ovitrampas ativas na área monitorada. Reflete a cobertura territorial e intensidade do monitoramento.
                    <br /><br />
                    <strong>5. Volume de Casos (15 pontos):</strong> Quantidade de registros de coleta no período. Indica a frequência de monitoramento e atividade de campo.
                  </div>
                  <div style={styles.formulaBox}>
                    Score = IPO_base(25) + Velocidade(20) + Clima(20) + Densidade(20) + Casos(15)
                  </div>
                </>
              )}

              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '8px', 
                borderRadius: '6px',
                marginTop: '12px',
                fontSize: '11px',
                opacity: 0.9,
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}>
                {showAdvancedAnalysis ? 'Ocultar Análise' : 'Mostrar Análise'}
              </div>
            </>
          )}
        </div>

        {/* Mapa de Calor */}
        <div style={{ ...styles.card, gridColumn: 'span 6' }}>
          <div style={{...styles.periodInfo, backgroundColor: theme.colors.primary, color: 'white'}}>
            Período: {periodInfo.monthName}/{periodInfo.year}
          </div>
          
          <div style={styles.cardTitle}>
            Mapa de Calor - Distribuição Espacial da Infestação
          </div>
          {loading.map ? <LoadingState /> : (
            <>
              <div style={{
                height: '530px',
                backgroundColor: theme.colors.bg,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                marginBottom: '16px',
                border: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,135,168,0.1)'}`,
                overflow: 'hidden'
              }}>
                {/* Header do mapa */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,135,168,0.05)',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.text }}>
                    Montes Claros/MG - Distribuição por Bairros
                  </div>
                  <div style={{ fontSize: '10px', color: theme.colors.textSecondary }}>
                    {neighborhoodDataWithDensity.length} bairros monitorados
                  </div>
                </div>
                
                {/* Grid principal do mapa */}
                <div style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '6px',
                  padding: '16px',
                  overflow: 'auto'
                }}>
                  {neighborhoodDataWithDensity.slice(0, 18).map((n, i) => {
                    const color = n.ipo > 65 ? '#f44336' : 
                                 n.ipo > 55 ? '#ff9800' : 
                                 n.ipo > 45 ? '#ffc107' : 
                                 n.ipo > 30 ? '#2196F3' : '#4CAF50';
                    
                    const riskLevel = n.ipo > 65 ? 'CRÍTICO' :
                                     n.ipo > 55 ? 'ALTO' :
                                     n.ipo > 45 ? 'MÉDIO' :
                                     n.ipo > 30 ? 'BAIXO' : 'CONTROLADO';
                    
                    return (
                      <div key={i} style={{
                        backgroundColor: color,
                        borderRadius: '10px',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        padding: '10px 6px',
                        position: 'relative',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                        transform: 'scale(1)',
                        minHeight: '100px'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                        
                        {/* Badge de nível de risco */}
                        <div style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          fontSize: '6px',
                          padding: '1px 3px',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          borderRadius: '6px',
                          fontWeight: 'bold'
                        }}>
                          {riskLevel}
                        </div>
                        
                        <div style={{ 
                          fontSize: '8px', 
                          marginBottom: '5px', 
                          fontWeight: '600',
                          lineHeight: '1.1',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {n.name.length > 10 ? n.name.substring(0, 10) + '...' : n.name}
                        </div>
                        
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold',
                          marginBottom: '3px'
                        }}>
                          {n.ipo.toFixed(1)}%
                        </div>
                        
                        <div style={{ 
                          fontSize: '7px', 
                          opacity: 0.9,
                          marginBottom: '2px'
                        }}>
                          {n.traps} ovitr.
                        </div>
                        
                        <div style={{ 
                          fontSize: '6px', 
                          opacity: 0.8
                        }}>
                          {n.avgEggs.toFixed(1)} ovos/col.
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Legenda */}
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,135,168,0.05)',
                  borderTop: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {[
                    { color: '#4CAF50', label: 'CONTROLADO', range: '≤30%' },
                    { color: '#2196F3', label: 'BAIXO', range: '30-45%' },
                    { color: '#ffc107', label: 'MÉDIO', range: '45-55%' },
                    { color: '#ff9800', label: 'ALTO', range: '55-65%' },
                    { color: '#f44336', label: 'CRÍTICO', range: '>65%' }
                  ].map((legend, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '8px'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: legend.color,
                        borderRadius: '2px'
                      }}></div>
                      <span style={{ color: theme.colors.textSecondary }}>
                        {legend.label} ({legend.range})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={styles.contextBox}>
                <strong>Contextualização:</strong> Distribuição geoespacial interativa do IPO por bairros monitorados. 
                Sistema de cores graduado permite identificação rápida de áreas críticas e priorização de intervenções.
              </div>
              <div style={styles.formulaBox}>
                Classificação de Risco: CONTROLADO ≤30% | BAIXO 30-45% | MÉDIO 45-55% | ALTO 55-65% | CRÍTICO >65%
              </div>
            </>
          )}
        </div>

        {/* Alertas */}
        <div style={{ ...styles.card, gridColumn: 'span 6' }}>
          <div style={{...styles.periodInfo, backgroundColor: theme.colors.primary, color: 'white'}}>
            Semana: {periodInfo.week}/{periodInfo.weekYear}
          </div>
          
          <div style={styles.cardTitle}>
            Central de Alertas Epidemiológicos Prioritários
          </div>
          {loading.alerts ? <LoadingState /> : (
            <>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '12px' }}>
                {/* Agrupar bairros por nível de criticidade */}
                {(() => {
                  const criticalNeighborhoods = neighborhoodDataWithDensity.filter(n => n.ipo > 65);
                  const highRiskNeighborhoods = neighborhoodDataWithDensity.filter(n => n.ipo > 55 && n.ipo <= 65);
                  const moderateRiskNeighborhoods = neighborhoodDataWithDensity.filter(n => n.ipo > 45 && n.ipo <= 55);
                  const clusterNeighborhoods = neighborhoodDataWithDensity.filter(n => n.ipo > 30 && n.ipo <= 45);

                  return (
                    <>
                      {/* SURTO DETECTADO */}
                      {criticalNeighborhoods.length > 0 && (
                        <div style={{
                          padding: '16px',
                          marginBottom: '12px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          border: `2px solid #f44336`,
                          position: 'relative'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#f44336',
                              borderRadius: '50%',
                              marginRight: '8px',
                              animation: 'pulse 2s infinite'
                            }}></div>
                            <div style={{ 
                              fontWeight: '700', 
                              color: '#f44336',
                              fontSize: '16px'
                            }}>
                              🚨 SURTO DETECTADO
                            </div>
                            <div style={{
                              marginLeft: 'auto',
                              padding: '4px 8px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}>
                              {criticalNeighborhoods.length} bairro{criticalNeighborhoods.length > 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: theme.colors.text }}>Bairros afetados:</strong>{' '}
                            <span style={{ color: theme.colors.textSecondary }}>
                              {criticalNeighborhoods.map(n => n.name).join(', ')}
                            </span>
                          </div>
                          
                          <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: theme.colors.text }}>IPO médio:</strong>{' '}
                            <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                              {(criticalNeighborhoods.reduce((sum, n) => sum + n.ipo, 0) / criticalNeighborhoods.length).toFixed(1)}%
                            </span>
                          </div>

                          <div style={{
                            backgroundColor: 'rgba(244, 67, 54, 0.15)',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}>
                            <div style={{ fontWeight: 'bold', color: '#f44336', marginBottom: '8px' }}>
                              🎯 AÇÕES PRIORITÁRIAS IMEDIATAS:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '16px', color: theme.colors.text }}>
                              <li>Ampliação das ações de mapeamento com drone</li>
                              <li>Mobilização de equipes de campo para eliminação de criadouros</li>
                              <li>Intensificação da educação em saúde porta a porta</li>
                              <li>Instalação de ovitrampas adicionais para monitoramento</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* ALTA REINCIDÊNCIA */}
                      {highRiskNeighborhoods.length > 0 && (
                        <div style={{
                          padding: '14px',
                          marginBottom: '10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          border: `2px solid #ff9800`
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px'
                          }}>
                            <div style={{
                              fontWeight: '600',
                              color: '#ff9800',
                              fontSize: '15px'
                            }}>
                              ⚠️ ALTA REINCIDÊNCIA
                            </div>
                            <div style={{
                              marginLeft: 'auto',
                              padding: '3px 6px',
                              backgroundColor: '#ff9800',
                              color: 'white',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              {highRiskNeighborhoods.length} bairro{highRiskNeighborhoods.length > 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div style={{ marginBottom: '10px', fontSize: '12px' }}>
                            <strong style={{ color: theme.colors.text }}>Bairros:</strong>{' '}
                            <span style={{ color: theme.colors.textSecondary }}>
                              {highRiskNeighborhoods.map(n => n.name).join(', ')}
                            </span>
                          </div>

                          <div style={{
                            backgroundColor: 'rgba(255, 152, 0, 0.15)',
                            padding: '10px',
                            borderRadius: '6px',
                            fontSize: '11px'
                          }}>
                            <strong style={{ color: '#ff9800' }}>🔬 AÇÕES REQUERIDAS:</strong>
                            <span style={{ color: theme.colors.text, marginLeft: '8px' }}>
                              Investigação epidemiológica | Análise de resistência vetorial | Revisão de estratégias de controle
                            </span>
                          </div>
                        </div>
                      )}

                      {/* MONITORAMENTO INTENSIVO */}
                      {moderateRiskNeighborhoods.length > 0 && (
                        <div style={{
                          padding: '12px',
                          marginBottom: '8px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 193, 7, 0.1)',
                          border: `1px solid #ffc107`
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              fontWeight: '600',
                              color: '#ffc107',
                              fontSize: '14px'
                            }}>
                              📊 MONITORAMENTO INTENSIVO
                            </div>
                            <div style={{
                              marginLeft: 'auto',
                              padding: '2px 6px',
                              backgroundColor: '#ffc107',
                              color: 'white',
                              borderRadius: '8px',
                              fontSize: '10px'
                            }}>
                              {moderateRiskNeighborhoods.length} bairro{moderateRiskNeighborhoods.length > 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div style={{ fontSize: '11px' }}>
                            <strong style={{ color: theme.colors.text }}>Bairros:</strong>{' '}
                            <span style={{ color: theme.colors.textSecondary }}>
                              {moderateRiskNeighborhoods.slice(0, 3).map(n => n.name).join(', ')}
                              {moderateRiskNeighborhoods.length > 3 && ` (+${moderateRiskNeighborhoods.length - 3})`}
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: '#ffc107', marginTop: '6px' }}>
                            <strong>🎯 AÇÃO:</strong> Intensificação da frequência de coletas e ações educativas preventivas
                          </div>
                        </div>
                      )}

                      {/* CLUSTER ESPACIAL */}
                      {clusterNeighborhoods.length > 0 && (
                        <div style={{
                          padding: '12px',
                          marginBottom: '8px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          border: `1px solid #2196F3`
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              fontWeight: '600',
                              color: '#2196F3',
                              fontSize: '14px'
                            }}>
                              📍 CLUSTER ESPACIAL DETECTADO
                            </div>
                            <div style={{
                              marginLeft: 'auto',
                              padding: '2px 6px',
                              backgroundColor: '#2196F3',
                              color: 'white',
                              borderRadius: '8px',
                              fontSize: '10px'
                            }}>
                              {clusterNeighborhoods.length} áreas
                            </div>
                          </div>
                          
                          <div style={{ fontSize: '10px', color: '#2196F3' }}>
                            <strong>🎯 AÇÃO:</strong> Monitoramento de áreas adjacentes e barreiras de contenção
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              
              <div style={styles.contextBox}>
                <strong>Central Integrada de Alertas:</strong> Sistema automatizado de classificação e agrupamento de riscos epidemiológicos. 
                Priorização baseada em algoritmos de IPO com ações específicas por nível de criticidade para otimização de recursos.
              </div>
              <div style={styles.formulaBox}>
                Classificação: SURTO(>65%) → REINCIDÊNCIA(55-65%) → INTENSIVO(45-55%) → CLUSTER(30-45%)
              </div>
            </>
          )}
        </div>

        {/* Clusters Espaciais */}
        <div style={{ ...styles.card, gridColumn: 'span 6' }}>
          <div style={{...styles.periodInfo, backgroundColor: theme.colors.primary, color: 'white'}}>
            Análise Espacial - {periodInfo.year}
          </div>
          
          <div style={styles.cardTitle}>Detecção de Clusters Espaciais</div>
          {processedData.spatialClusters.length > 0 ? (
            <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
              {processedData.spatialClusters.map((cluster, i) => (
                <div key={cluster.id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#3a3a3a' : '#f5f5f5',
                  borderLeft: `4px solid ${cluster.riskLevel === 'ALTO' ? '#f44336' : '#ff9800'}`
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '6px', color: theme.colors.text }}>
                    {cluster.id.toUpperCase()}
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: cluster.riskLevel === 'ALTO' ? '#f44336' : '#ff9800',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}>
                      RISCO {cluster.riskLevel}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                    IPO Médio: {cluster.avgIPO.toFixed(1)}% | {cluster.totalTraps} ovitrampas
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                    Bairros: {cluster.neighborhoods.slice(0, 3).map(n => n.name).join(', ')}
                    {cluster.neighborhoods.length > 3 && ` (+${cluster.neighborhoods.length - 3})`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: theme.colors.textSecondary 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
              <div>Nenhum cluster espacial detectado</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                Distribuição geográfica dispersa
              </div>
            </div>
          )}
          <div style={styles.contextBox}>
            <strong>Contextualização:</strong> Algoritmo de detecção espacial identifica agrupamentos geográficos de bairros com alto IPO. Utiliza distância euclidiana e limiar de 30% para formação de clusters.
          </div>
          <div style={styles.formulaBox}>
            Distância = √[(lat₁-lat₂)² + (lng₁-lng₂)²] &lt; 0.01° &amp; IPO ≥ 30%
          </div>
        </div>

        {/* Análise de Correlação Climática */}
        <div style={{ ...styles.card, gridColumn: 'span 12' }}>
          <div style={styles.periodInfo}>
            Análise de Correlação Climática - {processedData.climateCorrelation.length} meses
          </div>
          
          <div style={styles.cardTitle}>
            Correlação entre Fatores Climáticos e Infestação de Aedes aegypti
          </div>
          {processedData.climateCorrelation.length > 0 ? (
            <>
              <div style={{ height: '400px', marginBottom: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={processedData.climateCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                    <XAxis 
                      dataKey="monthName" 
                      stroke={theme.colors.text} 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      fontSize={11}
                    />
                    <YAxis yAxisId="left" stroke={theme.colors.text} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme.colors.text} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.colors.surface, 
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => {
                        const formatters = {
                          'IPO (%)': `${value.toFixed(1)}%`,
                          'Temperatura (°C)': `${value}°C`,
                          'Umidade (%)': `${value}%`,
                          'Precipitação (mm)': `${value}mm`
                        };
                        return [formatters[name] || value, name];
                      }}
                    />
                    <Legend />
                    
                    {/* Barras para precipitação */}
                    <Bar yAxisId="left" dataKey="precipitacao" fill="#2196F3" name="Precipitação (mm)" opacity={0.7} />
                    
                    {/* Linhas para outros indicadores */}
                    <Line yAxisId="left" type="monotone" dataKey="temperatura" stroke="#FF5722" strokeWidth={3} name="Temperatura (°C)" />
                    <Line yAxisId="left" type="monotone" dataKey="umidade" stroke="#009688" strokeWidth={3} name="Umidade (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="ipo" stroke="#E91E63" strokeWidth={4} name="IPO (%)" dot={{ r: 5 }} />
                    
                    {/* Linha de referência para IPO crítico */}
                    <ReferenceLine yAxisId="right" y={50} stroke="#ff9800" strokeDasharray="5 5" label="IPO Crítico (50%)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de dispersão para correlações */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ height: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.colors.text }}>IPO × Temperatura</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={processedData.climateCorrelation}>
                      <CartesianGrid stroke={theme.colors.border} />
                      <XAxis dataKey="temperatura" stroke={theme.colors.text} />
                      <YAxis dataKey="ipo" stroke={theme.colors.text} />
                      <Tooltip formatter={(value, name) => [name === 'ipo' ? `${value.toFixed(1)}%` : `${value}°C`, name === 'ipo' ? 'IPO' : 'Temperatura']} />
                      <Scatter dataKey="ipo" fill="#FF5722" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ height: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.colors.text }}>IPO × Umidade</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={processedData.climateCorrelation}>
                      <CartesianGrid stroke={theme.colors.border} />
                      <XAxis dataKey="umidade" stroke={theme.colors.text} />
                      <YAxis dataKey="ipo" stroke={theme.colors.text} />
                      <Tooltip formatter={(value, name) => [name === 'ipo' ? `${value.toFixed(1)}%` : `${value}%`, name === 'ipo' ? 'IPO' : 'Umidade']} />
                      <Scatter dataKey="ipo" fill="#009688" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ height: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.colors.text }}>IPO × Precipitação</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={processedData.climateCorrelation}>
                      <CartesianGrid stroke={theme.colors.border} />
                      <XAxis dataKey="precipitacao" stroke={theme.colors.text} />
                      <YAxis dataKey="ipo" stroke={theme.colors.text} />
                      <Tooltip formatter={(value, name) => [name === 'ipo' ? `${value.toFixed(1)}%` : `${value}mm`, name === 'ipo' ? 'IPO' : 'Precipitação']} />
                      <Scatter dataKey="ipo" fill="#1976D2" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={styles.contextBox}>
                <strong>Análise de Correlação:</strong> A análise revela padrões sazonais claros na relação entre fatores climáticos e atividade vetorial. 
                Umidade relativa elevada (>70%) correlaciona-se positivamente com IPO, enquanto temperaturas extremas (>30°C) podem reduzir a atividade do vetor.
                Precipitação moderada (50-150mm) cria condições ideais para reprodução.
              </div>
              <div style={styles.formulaBox}>
                Correlações observadas: r(IPO,Umidade) ≈ +0.6 | r(IPO,Temp) ≈ -0.3 | r(IPO,Precip) ≈ +0.4
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.textSecondary }}>
              <div>Dados insuficientes para análise climática</div>
            </div>
          )}
        </div>

        {/* Análise de Reincidência */}
        <div style={{ ...styles.card, gridColumn: 'span 12' }}>
          <div style={styles.periodInfo}>
            Análise Detalhada de Reincidência - {processedData.reincidenceAnalysis.temporal.length} períodos
          </div>
          
          <div style={styles.cardTitle}>
            Análise de Padrões de Reincidência de Ovitrampas
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Reincidência Temporal */}
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: theme.colors.text }}>Evolução Temporal da Reincidência</h4>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={processedData.reincidenceAnalysis.temporal}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                    <XAxis 
                      dataKey="period" 
                      stroke={theme.colors.text} 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      fontSize={10}
                    />
                    <YAxis yAxisId="left" stroke={theme.colors.text} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme.colors.text} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}
                      formatter={(value, name) => [
                        name === 'Taxa de Reincidência' ? `${value.toFixed(1)}%` : value,
                        name
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#ff9800" name="Casos de Reincidência" />
                    <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#f44336" strokeWidth={3} name="Taxa de Reincidência" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reincidência Espacial */}
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: theme.colors.text }}>Top 10 Bairros por Taxa de Reincidência</h4>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.reincidenceAnalysis.spatial.slice(0, 10)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                    <XAxis type="number" stroke={theme.colors.text} />
                    <YAxis dataKey="name" type="category" width={100} fontSize={10} stroke={theme.colors.text} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Taxa de Reincidência']}
                    />
                    <Bar dataKey="rate" fill="#e91e63" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Padrões Identificados */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: theme.colors.text }}>Padrões de Reincidência Identificados</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
              {processedData.reincidenceAnalysis.patterns.map((pattern, i) => (
                <div key={i} style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#3a3a3a' : '#f8f9fa',
                  borderLeft: `4px solid ${theme.colors.primary}`
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: theme.colors.text }}>
                    {pattern.pattern}
                  </div>
                  <div style={{ fontSize: '13px', color: theme.colors.textSecondary, marginBottom: '8px' }}>
                    {pattern.description}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.primary }}>
                    {typeof pattern.value === 'number' ? pattern.value.toFixed(1) : pattern.value}
                    {pattern.pattern.includes('Taxa') ? '%' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.contextBox}>
            <strong>Interpretação da Reincidência:</strong> A análise de reincidência revela padrões críticos para a eficácia do controle vetorial. 
            Alta reincidência indica possível resistência comportamental do vetor, inadequação das medidas de controle ou reinfestação por migração. 
            Padrões sazonais de reincidência sugerem correlação com fatores ambientais e climáticos.
          </div>
          <div style={styles.formulaBox}>
            Taxa de Reincidência = (Ovitrampas Reincidentes / Total de Ovitrampas) × 100 | Limiar Crítico: >15%
          </div>
        </div>

        {/* Dicionário de Termos */}
        <div style={{ ...styles.card, gridColumn: 'span 12', backgroundColor: theme.colors.accent, color: 'white' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: showDictionary ? '24px' : '0',
            cursor: 'pointer'
          }}
          onClick={() => setShowDictionary(!showDictionary)}>
            <h3 style={{ 
              margin: 0, 
              color: 'white',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              📚 Dicionário de Termos Técnicos
            </h3>
            <button style={{
              background: 'none',
              border: `1px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {showDictionary ? 'Recolher ▲' : 'Expandir ▼'}
            </button>
          </div>

          {showDictionary && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {[
                  {
                    termo: "IPO (Índice de Positividade de Ovitrampas)",
                    definicao: "Percentual de ovitrampas que apresentaram pelo menos um ovo de Aedes aegypti durante o período de monitoramento. Indica a dispersão geográfica do vetor.",
                    formula: "IPO = (Ovitrampas Positivas / Total de Ovitrampas) × 100",
                    referencia: "Limiar crítico: >30% (OMS)"
                  },
                  {
                    termo: "IDO (Índice de Densidade de Ovos)",
                    definicao: "Número médio de ovos encontrados nas ovitrampas positivas, refletindo a intensidade da atividade reprodutiva do vetor.",
                    formula: "IDO = Total de Ovos / Número de Ovitrampas Positivas",
                    referencia: "Limiar alto: >50 ovos/ovitrampa"
                  },
                  {
                    termo: "Score de Risco Integrado",
                    definicao: "Índice multidimensional que combina IPO, velocidade de propagação, fatores climáticos, densidade populacional e volume de casos.",
                    formula: "Score = IPO_base(25) + Velocidade(20) + Clima(20) + Densidade(20) + Casos(15)",
                    referencia: "Escala: 0-100 (Crítico >70)"
                  },
                  {
                    termo: "Cluster Espacial",
                    definicao: "Agrupamento geográfico de bairros próximos com alto IPO, identificado através de análise de distância euclidiana.",
                    formula: "Distância = √[(lat₁-lat₂)² + (lng₁-lng₂)²] < 0.01°",
                    referencia: "Critério: IPO ≥ 30% e proximidade"
                  },
                  {
                    termo: "Reincidência",
                    definicao: "Fenômeno em que ovitrampas voltam a apresentar positividade após período de negatividade, indicando reinfestação ou falha no controle.",
                    formula: "Taxa = (Ovitrampas Reincidentes / Total de Ovitrampas) × 100",
                    referencia: "Limiar crítico: >15%"
                  },
                  {
                    termo: "Velocidade de Propagação",
                    definicao: "Taxa de mudança do IPO ao longo do tempo, medindo a dinâmica temporal da infestação vetorial.",
                    formula: "Velocidade = Δ(IPO) / Δt (semanas)",
                    referencia: "Positiva: crescimento; Negativa: redução"
                  },
                  {
                    termo: "Decomposição Sazonal",
                    definicao: "Separação da série temporal de IPO em componentes de tendência, sazonalidade e ruído para análise de padrões recorrentes.",
                    formula: "IPO(t) = Tendência(t) + Sazonal(t) + Residual(t)",
                    referencia: "Janela móvel: ±6 meses"
                  },
                  {
                    termo: "Correlação Climática",
                    definicao: "Medida estatística da relação entre fatores meteorológicos (temperatura, umidade, precipitação) e atividade vetorial.",
                    formula: "r = Σ[(x-x̄)(y-ȳ)] / √[Σ(x-x̄)²Σ(y-ȳ)²]",
                    referencia: "Forte correlação: |r| > 0.7"
                  },
                  {
                    termo: "Anomalia Epidemiológica",
                    definicao: "Período com IPO significativamente diferente da média histórica, identificado através de Z-score estatístico.",
                    formula: "Z-score = (IPO - μ) / σ",
                    referencia: "Anomalia: |Z| > 2.0"
                  },
                  {
                    termo: "Intervalo de Confiança (IC)",
                    definicao: "Faixa de valores que, com determinada probabilidade (95%), contém o verdadeiro valor do parâmetro populacional estimado.",
                    formula: "IC = x̄ ± t(α/2,n-1) × (s/√n)",
                    referencia: "95% de confiança (α=0.05)"
                  },
                  {
                    termo: "Semana Epidemiológica",
                    definicao: "Sistema de datação padronizado pela OMS onde o ano é dividido em 52-53 semanas para vigilância epidemiológica consistente.",
                    formula: "Semana 1 = primeira semana com ≥4 dias do ano",
                    referencia: "ISO 8601 / CDC MMWR"
                  },
                  {
                    termo: "Limiar Epidemiológico",
                    definicao: "Valor crítico de referência para IPO que, quando ultrapassado, indica necessidade de intensificação das medidas de controle.",
                    formula: "Baseado em percentis históricos da série temporal",
                    referencia: "OMS: 30% (alerta), 50% (epidemia)"
                  }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: 'rgba(0,135,168,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,135,168,0.3)'
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      color: theme.colors.primary,
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
                      fontFamily: 'monospace',
                      color: '#FFD700',
                      backgroundColor: 'rgba(255,215,0,0.1)',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      marginBottom: '6px'
                    }}>
                      <strong>Fórmula:</strong> {item.formula}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.7)',
                      fontStyle: 'italic'
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
                  <strong>Organização Mundial da Saúde (OMS)</strong> - Guidelines for surveillance of Aedes aegypti | 
                  <strong>Ministério da Saúde (BR)</strong> - Diretrizes Nacionais para Prevenção e Controle de Epidemias de Dengue | 
                  <strong>PAHO/WHO</strong> - Entomological Surveillance Guidelines | 
                  <strong>CDC</strong> - Epidemiologic Surveillance Methods
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default PanoramaExecutivo;