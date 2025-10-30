/**
 * Análise Espacial Avançada
 * Autocorrelação, hotspots, kernel density
 */

import type { OvitrapData } from '../types';

export interface SpatialPoint {
  lat: number;
  lng: number;
  value: number;
  id: string;
}

export interface MoransI {
  index: number; // Valor de I (-1 a +1)
  zScore: number;
  pValue: number;
  interpretation: 'agrupado' | 'disperso' | 'aleatorio';
}

export interface Hotspot {
  lat: number;
  lng: number;
  gScore: number; // Getis-Ord Gi*
  zScore: number;
  pValue: number;
  confidence: 90 | 95 | 99;
  type: 'hot' | 'cold';
}

/**
 * Calcula distância euclidiana entre dois pontos
 */
function calculateDistance(p1: SpatialPoint, p2: SpatialPoint): number {
  const dx = p1.lat - p2.lat;
  const dy = p1.lng - p2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcula I de Moran (autocorrelação espacial)
 */
export function calculateMoransI(
  points: SpatialPoint[],
  distanceThreshold: number = 0.01
): MoransI {
  const n = points.length;
  if (n < 3) {
    return {
      index: 0,
      zScore: 0,
      pValue: 1,
      interpretation: 'aleatorio',
    };
  }

  // Calcular média
  const mean = points.reduce((sum, p) => sum + p.value, 0) / n;

  // Criar matriz de pesos espaciais
  const weights: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
  let totalWeight = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const dist = calculateDistance(points[i], points[j]);
        if (dist <= distanceThreshold) {
          weights[i][j] = 1;
          totalWeight++;
        }
      }
    }
  }

  if (totalWeight === 0) {
    return {
      index: 0,
      zScore: 0,
      pValue: 1,
      interpretation: 'aleatorio',
    };
  }

  // Calcular numerador e denominador
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const di = points[i].value - mean;
    denominator += di * di;

    for (let j = 0; j < n; j++) {
      if (weights[i][j] > 0) {
        const dj = points[j].value - mean;
        numerator += weights[i][j] * di * dj;
      }
    }
  }

  // I de Moran
  const moransI = (n / totalWeight) * (numerator / denominator);

  // Z-score (simplificado)
  const expectedI = -1 / (n - 1);
  const variance = 1 / n; // Simplificado
  const zScore = (moransI - expectedI) / Math.sqrt(variance);

  // P-value aproximado
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  // Interpretação
  let interpretation: 'agrupado' | 'disperso' | 'aleatorio';
  if (pValue < 0.05) {
    interpretation = moransI > 0 ? 'agrupado' : 'disperso';
  } else {
    interpretation = 'aleatorio';
  }

  return {
    index: moransI,
    zScore,
    pValue,
    interpretation,
  };
}

/**
 * Detecta hotspots usando Getis-Ord Gi*
 */
export function detectHotspots(
  points: SpatialPoint[],
  distanceThreshold: number = 0.01,
  confidenceLevel: 90 | 95 | 99 = 95
): Hotspot[] {
  const n = points.length;
  const hotspots: Hotspot[] = [];

  // Z-score threshold por nível de confiança
  const zThresholds = {
    90: 1.645,
    95: 1.96,
    99: 2.576,
  };
  const zThreshold = zThresholds[confidenceLevel];

  // Calcular média e desvio padrão global
  const mean = points.reduce((sum, p) => sum + p.value, 0) / n;
  const variance =
    points.reduce((sum, p) => sum + Math.pow(p.value - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Para cada ponto, calcular Gi*
  for (let i = 0; i < n; i++) {
    const focal = points[i];
    let sumValues = 0;
    let sumWeights = 0;

    // Encontrar vizinhos
    for (let j = 0; j < n; j++) {
      const dist = calculateDistance(focal, points[j]);
      if (dist <= distanceThreshold) {
        sumValues += points[j].value;
        sumWeights++;
      }
    }

    if (sumWeights === 0) continue;

    // Calcular Gi*
    const gScore = sumValues / sumWeights;

    // Z-score
    const expectedG = mean;
    const zScore = (gScore - expectedG) / (stdDev / Math.sqrt(sumWeights));

    // Verificar se é significativo
    if (Math.abs(zScore) >= zThreshold) {
      const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

      hotspots.push({
        lat: focal.lat,
        lng: focal.lng,
        gScore,
        zScore,
        pValue,
        confidence: confidenceLevel,
        type: zScore > 0 ? 'hot' : 'cold',
      });
    }
  }

  return hotspots;
}

/**
 * Kernel Density Estimation
 */
export function calculateKernelDensity(
  points: SpatialPoint[],
  gridSize: number = 0.005,
  bandwidth: number = 0.02
): { lat: number; lng: number; density: number }[] {
  if (points.length === 0) return [];

  // Encontrar limites
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const grid: { lat: number; lng: number; density: number }[] = [];

  // Criar grid
  for (let lat = minLat; lat <= maxLat; lat += gridSize) {
    for (let lng = minLng; lng <= maxLng; lng += gridSize) {
      let density = 0;

      // Calcular densidade para este ponto do grid
      for (const point of points) {
        const dist = Math.sqrt(
          Math.pow(lat - point.lat, 2) + Math.pow(lng - point.lng, 2)
        );

        // Kernel Gaussiano
        if (dist <= bandwidth * 3) {
          const kernel = Math.exp(-0.5 * Math.pow(dist / bandwidth, 2));
          density += point.value * kernel;
        }
      }

      if (density > 0) {
        grid.push({ lat, lng, density });
      }
    }
  }

  return grid;
}

/**
 * Buffer zones ao redor de pontos
 */
export function createBufferZones(
  points: SpatialPoint[],
  radius: number = 0.005 // ~500m
): { lat: number; lng: number; radius: number; points: string[] }[] {
  const zones: { lat: number; lng: number; radius: number; points: string[] }[] = [];

  for (const point of points) {
    // Encontrar pontos dentro do raio
    const nearbyPoints = points
      .filter((p) => {
        const dist = calculateDistance(point, p);
        return dist <= radius && p.id !== point.id;
      })
      .map((p) => p.id);

    if (nearbyPoints.length > 0) {
      zones.push({
        lat: point.lat,
        lng: point.lng,
        radius,
        points: [point.id, ...nearbyPoints],
      });
    }
  }

  return zones;
}

/**
 * Análise de dispersão espacial
 */
export function analyzeDispersion(points: SpatialPoint[]): {
  meanCenter: { lat: number; lng: number };
  standardDistance: number;
  dispersionIndex: number;
} {
  const n = points.length;

  // Centro médio
  const meanLat = points.reduce((sum, p) => sum + p.lat, 0) / n;
  const meanLng = points.reduce((sum, p) => sum + p.lng, 0) / n;

  // Distância padrão
  const sumSqDist = points.reduce((sum, p) => {
    const dx = p.lat - meanLat;
    const dy = p.lng - meanLng;
    return sum + dx * dx + dy * dy;
  }, 0);

  const standardDistance = Math.sqrt(sumSqDist / n);

  // Índice de dispersão (variance/mean ratio)
  const values = points.map((p) => p.value);
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const dispersionIndex = mean > 0 ? variance / mean : 0;

  return {
    meanCenter: { lat: meanLat, lng: meanLng },
    standardDistance,
    dispersionIndex,
  };
}

/**
 * Função auxiliar: CDF normal padrão
 */
function normalCDF(z: number): number {
  // Aproximação de erf
  const t = 1 / (1 + 0.5 * Math.abs(z));
  const tau =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    );

  return z >= 0 ? 1 - tau : tau;
}

/**
 * Análise espacial completa
 */
export function performSpatialAnalysis(data: OvitrapData[]): {
  moransI: MoransI;
  hotspots: Hotspot[];
  dispersion: ReturnType<typeof analyzeDispersion>;
  kernelDensity: ReturnType<typeof calculateKernelDensity>;
} {
  const points: SpatialPoint[] = data
    .filter((d) => d.latitude && d.longitude)
    .map((d) => ({
      lat: d.latitude,
      lng: d.longitude,
      value: d.quantidade_ovos || 0,
      id: String(d.id_ovitrampa || Math.random()),
    }));

  return {
    moransI: calculateMoransI(points),
    hotspots: detectHotspots(points, 0.01, 95),
    dispersion: analyzeDispersion(points),
    kernelDensity: calculateKernelDensity(points),
  };
}
