/**
 * Utility para Clustering de Markers no Mapa
 * Agrupa markers próximos para melhor visualização
 */

import type { OvitrapData } from '../types';

export interface ClusterPoint {
  id: string;
  lat: number;
  lng: number;
  count: number;
  records: OvitrapData[];
  totalOvos: number;
  avgOvos: number;
  risco: 'baixo' | 'medio' | 'alto' | 'critico';
}

export interface ClusterConfig {
  gridSize: number; // Tamanho da grade em graus (0.01 = ~1km)
  minZoom?: number; // Zoom mínimo para mostrar clustering
  maxZoom?: number; // Zoom máximo para mostrar clustering
}

/**
 * Agrupa pontos próximos em clusters
 */
export function clusterPoints(
  data: OvitrapData[],
  config: ClusterConfig = { gridSize: 0.005 }
): ClusterPoint[] {
  const { gridSize } = config;
  const clusters = new Map<string, ClusterPoint>();

  data.forEach((record) => {
    if (!record.latitude || !record.longitude) return;

    // Calcular célula da grade
    const gridLat = Math.floor(record.latitude / gridSize) * gridSize;
    const gridLng = Math.floor(record.longitude / gridSize) * gridSize;
    const gridKey = `${gridLat.toFixed(6)}_${gridLng.toFixed(6)}`;

    if (clusters.has(gridKey)) {
      // Adicionar ao cluster existente
      const cluster = clusters.get(gridKey)!;
      cluster.records.push(record);
      cluster.count++;
      cluster.totalOvos += record.quantidade_ovos || 0;
    } else {
      // Criar novo cluster
      clusters.set(gridKey, {
        id: gridKey,
        lat: record.latitude,
        lng: record.longitude,
        count: 1,
        records: [record],
        totalOvos: record.quantidade_ovos || 0,
        avgOvos: 0,
        risco: 'baixo',
      });
    }
  });

  // Calcular médias e classificar riscos
  return Array.from(clusters.values()).map((cluster) => {
    cluster.avgOvos = cluster.totalOvos / cluster.count;
    
    // Calcular centroide
    const sumLat = cluster.records.reduce((sum, r) => sum + r.latitude, 0);
    const sumLng = cluster.records.reduce((sum, r) => sum + r.longitude, 0);
    cluster.lat = sumLat / cluster.count;
    cluster.lng = sumLng / cluster.count;

    // Classificar risco baseado em média de ovos
    if (cluster.avgOvos < 20) cluster.risco = 'baixo';
    else if (cluster.avgOvos < 50) cluster.risco = 'medio';
    else if (cluster.avgOvos < 100) cluster.risco = 'alto';
    else cluster.risco = 'critico';

    return cluster;
  });
}

/**
 * Calcula cor do cluster baseado no risco
 */
export function getClusterColor(risco: string): string {
  switch (risco) {
    case 'baixo':
      return '#22c55e'; // green-500
    case 'medio':
      return '#eab308'; // yellow-500
    case 'alto':
      return '#f97316'; // orange-500
    case 'critico':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Calcula tamanho do cluster baseado na contagem
 */
export function getClusterSize(count: number): number {
  if (count === 1) return 30;
  if (count < 5) return 40;
  if (count < 10) return 50;
  if (count < 25) return 60;
  if (count < 50) return 70;
  if (count < 100) return 80;
  return 90;
}

/**
 * Verifica se deve mostrar clustering baseado no zoom
 */
export function shouldCluster(zoom: number, config: ClusterConfig): boolean {
  const minZoom = config.minZoom ?? 0;
  const maxZoom = config.maxZoom ?? 14;
  return zoom >= minZoom && zoom <= maxZoom;
}

/**
 * Calcula estatísticas do cluster
 */
export function getClusterStats(cluster: ClusterPoint) {
  const positivas = cluster.records.filter(r => r.quantidade_ovos > 0).length;
  const ipo = (positivas / cluster.count) * 100;
  
  return {
    total: cluster.count,
    positivas,
    negativas: cluster.count - positivas,
    ipo: ipo.toFixed(1),
    totalOvos: cluster.totalOvos,
    mediaOvos: cluster.avgOvos.toFixed(1),
  };
}
