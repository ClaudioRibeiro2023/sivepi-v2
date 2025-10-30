/**
 * Funções de cálculo para análises epidemiológicas
 */

import type { OvitrapData } from '../shared/types/index';

export interface ConfidenceInterval {
  mean: number;
  lower: number;
  upper: number;
  stdError: number;
}

/**
 * Calcula intervalo de confiança
 */
export const calculateConfidenceInterval = (
  data: number[],
  confidence: number = 0.95
): ConfidenceInterval => {
  if (data.length === 0) {
    return { mean: 0, lower: 0, upper: 0, stdError: 0 };
  }

  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1 || 1);
  const stdError = Math.sqrt(variance / data.length);
  const tValue = 1.96; // Para 95% de confiança

  return {
    mean,
    lower: mean - tValue * stdError,
    upper: mean + tValue * stdError,
    stdError
  };
};

/**
 * Calcula IPO (Índice de Positividade de Ovitrampas)
 */
export const calculateIPO = (data: OvitrapData[]): number => {
  const uniqueOvitraps = new Set(data.map(r => r.id_ovitrampa));
  const positiveOvitraps = new Set(
    data.filter(r => r.quantidade_ovos > 0).map(r => r.id_ovitrampa)
  );
  
  return uniqueOvitraps.size > 0 
    ? (positiveOvitraps.size / uniqueOvitraps.size) * 100 
    : 0;
};

/**
 * Calcula IDO (Índice de Densidade de Ovos)
 */
export const calculateIDO = (data: OvitrapData[]): number => {
  const positiveTraps = data.filter(r => r.quantidade_ovos > 0);
  const totalEggs = positiveTraps.reduce((sum, r) => sum + r.quantidade_ovos, 0);
  const uniquePositiveTraps = new Set(positiveTraps.map(r => r.id_ovitrampa)).size;
  
  return uniquePositiveTraps > 0 ? totalEggs / uniquePositiveTraps : 0;
};

/**
 * Calcula IMO (Índice Médio de Ovos)
 */
export const calculateIMO = (data: OvitrapData[]): number => {
  const totalEggs = data.reduce((sum, r) => sum + r.quantidade_ovos, 0);
  return data.length > 0 ? totalEggs / data.length : 0;
};

/**
 * Calcula IVO (Índice de Variação de Oviposição)
 */
export const calculateIVO = (data: OvitrapData[]): number => {
  const eggCounts = data.map(r => r.quantidade_ovos);
  const mean = calculateIMO(data);
  
  if (mean === 0 || eggCounts.length === 0) return 0;
  
  const variance = eggCounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / eggCounts.length;
  const stdDev = Math.sqrt(variance);
  
  return (stdDev / mean) * 100;
};

/**
 * Detecta anomalias nos dados
 */
export const detectAnomalies = (
  data: Array<{ ipo: number; period: string }>,
  threshold: number = 2
): Array<{ period: string; ipo: number; zScore: number; anomalyType: string }> => {
  if (data.length < 4) return [];

  const values = data.map(d => d.ipo);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return data
    .filter((d) => Math.abs(d.ipo - mean) > threshold * stdDev)
    .map((d) => ({
      period: d.period,
      ipo: d.ipo,
      zScore: (d.ipo - mean) / stdDev,
      anomalyType: d.ipo > mean ? 'SURTO' : 'QUEDA_ANÔMALA'
    }));
};

/**
 * Calcula classificação de risco baseado no IPO
 */
export const getRiskLevel = (ipo: number): {
  level: 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRÍTICO';
  color: string;
  label: string;
} => {
  if (ipo < 15) {
    return { level: 'BAIXO', color: '#4CAF50', label: 'Risco Baixo' };
  } else if (ipo < 30) {
    return { level: 'MODERADO', color: '#FF9800', label: 'Risco Moderado' };
  } else if (ipo < 50) {
    return { level: 'ALTO', color: '#F44336', label: 'Risco Alto' };
  } else {
    return { level: 'CRÍTICO', color: '#D32F2F', label: 'Risco Crítico' };
  }
};

/**
 * Formata número com casas decimais
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

/**
 * Formata data para exibição
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
};

/**
 * Calcula percentual
 */
export const calculatePercentage = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};
