/**
 * Análises Estatísticas Avançadas - Sprint 2
 * Regressão, correlação, previsão
 */

import type { OvitrapData } from '../types';

export interface StatisticalSummary {
  mean: number;
  median: number;
  mode: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  cv: number; // Coefficient of Variation
  skewness: number;
  kurtosis: number;
}

export interface CorrelationResult {
  correlation: number;
  pValue: number;
  strength: 'fraca' | 'moderada' | 'forte' | 'muito forte';
  direction: 'positiva' | 'negativa' | 'nenhuma';
}

export interface RegressionResult {
  slope: number; // coeficiente angular (b)
  intercept: number; // coeficiente linear (a)
  rSquared: number; // coeficiente de determinação
  prediction: (x: number) => number;
  equation: string;
}

/**
 * Calcula estatísticas descritivas completas
 */
export function calculateStatistics(values: number[]): StatisticalSummary {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  // Média
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;

  // Mediana
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];

  // Moda (valor mais frequente)
  const frequency = new Map<number, number>();
  sorted.forEach(val => frequency.set(val, (frequency.get(val) || 0) + 1));
  const mode = Array.from(frequency.entries()).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  // Variância e Desvio Padrão
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Coeficiente de Variação
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

  // Quartis
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;

  // Skewness (assimetria)
  const skewness = sorted.reduce((sum, val) => 
    sum + Math.pow((val - mean) / stdDev, 3), 0) / n;

  // Kurtosis (curtose)
  const kurtosis = sorted.reduce((sum, val) => 
    sum + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;

  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    min: sorted[0],
    max: sorted[n - 1],
    q1,
    q3,
    iqr,
    cv,
    skewness,
    kurtosis,
  };
}

/**
 * Calcula correlação de Pearson entre duas variáveis
 */
export function calculateCorrelation(x: number[], y: number[]): CorrelationResult {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Arrays devem ter o mesmo tamanho e pelo menos 2 elementos');
  }

  const n = x.length;
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  }

  const correlation = numerator / Math.sqrt(sumSqX * sumSqY);

  // Teste t para significância
  const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
  const pValue = 2 * (1 - cumulativeDistributionT(Math.abs(t), n - 2));

  // Classificar força da correlação
  const absCorr = Math.abs(correlation);
  let strength: 'fraca' | 'moderada' | 'forte' | 'muito forte';
  if (absCorr < 0.3) strength = 'fraca';
  else if (absCorr < 0.5) strength = 'moderada';
  else if (absCorr < 0.7) strength = 'forte';
  else strength = 'muito forte';

  const direction = correlation > 0.1 ? 'positiva' : correlation < -0.1 ? 'negativa' : 'nenhuma';

  return {
    correlation,
    pValue,
    strength,
    direction,
  };
}

/**
 * Regressão linear simples
 */
export function linearRegression(x: number[], y: number[]): RegressionResult {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Arrays devem ter o mesmo tamanho e pelo menos 2 elementos');
  }

  const n = x.length;
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denominator += dx * dx;
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // Calcular R²
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    ssTot += Math.pow(y[i] - meanY, 2);
    ssRes += Math.pow(y[i] - predicted, 2);
  }
  const rSquared = 1 - (ssRes / ssTot);

  return {
    slope,
    intercept,
    rSquared,
    prediction: (xVal: number) => slope * xVal + intercept,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
  };
}

/**
 * Previsão simples baseada em média móvel
 */
export function movingAverageForecas(values: number[], windowSize: number = 3, periods: number = 1): number[] {
  const forecast: number[] = [];
  
  for (let i = 0; i < periods; i++) {
    const data = i === 0 ? values : [...values, ...forecast];
    const window = data.slice(-windowSize);
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
    forecast.push(avg);
  }

  return forecast;
}

/**
 * Detecta outliers usando método IQR
 */
export function detectOutliers(values: number[]): { outliers: number[]; indices: number[] } {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers: number[] = [];
  const indices: number[] = [];

  values.forEach((val, idx) => {
    if (val < lowerBound || val > upperBound) {
      outliers.push(val);
      indices.push(idx);
    }
  });

  return { outliers, indices };
}

/**
 * Testa normalidade (Shapiro-Wilk simplificado)
 */
export function testNormality(values: number[]): { isNormal: boolean; statistic: number } {
  // Implementação simplificada usando skewness e kurtosis
  const stats = calculateStatistics(values);
  
  // Valores próximos de 0 indicam normalidade
  const skewnessThreshold = 2;
  const kurtosisThreshold = 7;
  
  const isNormal = 
    Math.abs(stats.skewness) < skewnessThreshold &&
    Math.abs(stats.kurtosis) < kurtosisThreshold;

  const statistic = Math.abs(stats.skewness) + Math.abs(stats.kurtosis);

  return { isNormal, statistic };
}

/**
 * Calcula tendência (crescente, decrescente, estável)
 */
export function calculateTrend(values: number[]): {
  trend: 'crescente' | 'decrescente' | 'estavel';
  slope: number;
  strength: number;
} {
  const x = Array.from({ length: values.length }, (_, i) => i);
  const regression = linearRegression(x, values);

  let trend: 'crescente' | 'decrescente' | 'estavel';
  if (Math.abs(regression.slope) < 0.1) {
    trend = 'estavel';
  } else if (regression.slope > 0) {
    trend = 'crescente';
  } else {
    trend = 'decrescente';
  }

  return {
    trend,
    slope: regression.slope,
    strength: Math.abs(regression.rSquared),
  };
}

// Funções auxiliares

function percentile(sortedValues: number[], p: number): number {
  const index = (p / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

// Aproximação da distribuição t de Student (simplificada)
function cumulativeDistributionT(t: number, df: number): number {
  // Implementação muito simplificada
  // Para produção, usar biblioteca estatística completa
  const x = df / (df + t * t);
  return 1 - 0.5 * Math.pow(x, df / 2);
}

/**
 * Analisa série temporal completa
 */
export function analyzeTimeSeries(data: OvitrapData[]): {
  statistics: StatisticalSummary;
  trend: ReturnType<typeof calculateTrend>;
  outliers: ReturnType<typeof detectOutliers>;
  forecast: number[];
  seasonality: {
    detected: boolean;
    period: number | null;
  };
} {
  const values = data.map(d => d.quantidade_ovos || 0);
  
  return {
    statistics: calculateStatistics(values),
    trend: calculateTrend(values),
    outliers: detectOutliers(values),
    forecast: movingAverageForecas(values, 3, 5),
    seasonality: {
      detected: false, // Implementar análise de sazonalidade mais complexa
      period: null,
    },
  };
}
