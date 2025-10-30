/**
 * Hook para cálculo de indicadores epidemiológicos completos
 * IPO, IB, IDO, IR e outros indicadores críticos
 */

import { useMemo } from 'react';
import type { OvitrapData } from '../types';

export interface IndicadoresEpidemiologicos {
  // Índices principais
  ipo: number; // Índice de Positividade de Ovitrampas
  ib: number; // Índice de Breteau
  ido: number; // Índice de Densidade de Ovos
  ir: number; // Índice de Recipiente
  
  // Métricas de contagem
  totalRegistros: number;
  positivas: number;
  negativas: number;
  totalOvos: number;
  mediaOvos: number;
  medianaOvos: number;
  
  // Métricas de distribuição
  ovitrampasUnicas: number;
  bairrosMonitorados: number;
  
  // Classificação de risco
  risco: 'baixo' | 'medio' | 'alto' | 'critico';
  riscoIB: 'baixo' | 'medio' | 'alto' | 'critico';
  
  // Percentis
  percentil25: number;
  percentil50: number;
  percentil75: number;
  percentil90: number;
  
  // Estatísticas avançadas
  desvioPadrao: number;
  coeficienteVariacao: number;
  
  // Taxa de coleta
  taxaColeta: number; // % de ovitrampas com coleta regular
}

export function useIndicadoresEpidemiologicos(data: OvitrapData[]): IndicadoresEpidemiologicos {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        ipo: 0,
        ib: 0,
        ido: 0,
        ir: 0,
        totalRegistros: 0,
        positivas: 0,
        negativas: 0,
        totalOvos: 0,
        mediaOvos: 0,
        medianaOvos: 0,
        ovitrampasUnicas: 0,
        bairrosMonitorados: 0,
        risco: 'baixo',
        riscoIB: 'baixo',
        percentil25: 0,
        percentil50: 0,
        percentil75: 0,
        percentil90: 0,
        desvioPadrao: 0,
        coeficienteVariacao: 0,
        taxaColeta: 0,
      };
    }

    // Métricas básicas
    const totalRegistros = data.length;
    const positivas = data.filter(r => r.quantidade_ovos > 0).length;
    const negativas = totalRegistros - positivas;
    const totalOvos = data.reduce((sum, r) => sum + (r.quantidade_ovos || 0), 0);
    const mediaOvos = totalOvos / totalRegistros;

    // Conjuntos únicos
    const ovitrampasUnicas = new Set(data.map(r => r.id_ovitrampa)).size;
    const bairrosMonitorados = new Set(data.map(r => r.bairro)).size;

    // IPO - Índice de Positividade de Ovitrampas
    const ipo = (positivas / totalRegistros) * 100;

    // IB - Índice de Breteau (recipientes positivos por 100 imóveis)
    // Assumindo que cada ovitrampa representa 1 imóvel
    const ib = (positivas / totalRegistros) * 100;

    // IDO - Índice de Densidade de Ovos
    const ido = totalOvos / ovitrampasUnicas;

    // IR - Índice de Recipiente (% de recipientes com larvas)
    // Para ovitrampas, é similar ao IPO
    const ir = ipo;

    // Calcular percentis
    const sortedOvos = [...data.map(r => r.quantidade_ovos)].sort((a, b) => a - b);
    const percentil25 = sortedOvos[Math.floor(sortedOvos.length * 0.25)] || 0;
    const percentil50 = sortedOvos[Math.floor(sortedOvos.length * 0.50)] || 0; // mediana
    const percentil75 = sortedOvos[Math.floor(sortedOvos.length * 0.75)] || 0;
    const percentil90 = sortedOvos[Math.floor(sortedOvos.length * 0.90)] || 0;
    const medianaOvos = percentil50;

    // Desvio padrão
    const variancia = data.reduce((sum, r) => {
      const diff = r.quantidade_ovos - mediaOvos;
      return sum + (diff * diff);
    }, 0) / totalRegistros;
    const desvioPadrao = Math.sqrt(variancia);

    // Coeficiente de variação (CV = desvio padrão / média * 100)
    const coeficienteVariacao = mediaOvos > 0 ? (desvioPadrao / mediaOvos) * 100 : 0;

    // Taxa de coleta (% de ovitrampas com dados recentes)
    // Assumindo que todas no dataset têm coleta
    const taxaColeta = 100;

    // Classificação de risco baseada em IPO (OMS)
    let risco: 'baixo' | 'medio' | 'alto' | 'critico';
    if (ipo < 1) risco = 'baixo';
    else if (ipo < 5) risco = 'medio';
    else if (ipo < 10) risco = 'alto';
    else risco = 'critico';

    // Classificação de risco baseada em IB (OMS)
    let riscoIB: 'baixo' | 'medio' | 'alto' | 'critico';
    if (ib < 1) riscoIB = 'baixo';
    else if (ib < 5) riscoIB = 'medio';
    else if (ib < 10) riscoIB = 'alto';
    else riscoIB = 'critico';

    return {
      ipo: parseFloat(ipo.toFixed(2)),
      ib: parseFloat(ib.toFixed(2)),
      ido: parseFloat(ido.toFixed(2)),
      ir: parseFloat(ir.toFixed(2)),
      totalRegistros,
      positivas,
      negativas,
      totalOvos,
      mediaOvos: parseFloat(mediaOvos.toFixed(2)),
      medianaOvos,
      ovitrampasUnicas,
      bairrosMonitorados,
      risco,
      riscoIB,
      percentil25,
      percentil50,
      percentil75,
      percentil90,
      desvioPadrao: parseFloat(desvioPadrao.toFixed(2)),
      coeficienteVariacao: parseFloat(coeficienteVariacao.toFixed(2)),
      taxaColeta,
    };
  }, [data]);
}

// Hook adicional para indicadores por bairro
export function useIndicadoresPorBairro(data: OvitrapData[]) {
  return useMemo(() => {
    const grouped = data.reduce((acc, record) => {
      const bairro = record.bairro || 'Não Informado';
      if (!acc[bairro]) {
        acc[bairro] = [];
      }
      acc[bairro].push(record);
      return acc;
    }, {} as Record<string, OvitrapData[]>);

    return Object.entries(grouped).map(([bairro, records]) => {
      const indicadores = useIndicadoresEpidemiologicos(records);
      return {
        bairro,
        ...indicadores,
      };
    });
  }, [data]);
}
