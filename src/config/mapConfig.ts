/**
 * Configurações do Mapbox GL
 */

export const MAP_CONFIG = {
  // Coordenadas de Montes Claros/MG
  center: {
    lng: -43.8644,
    lat: -16.7273,
  },
  
  // Níveis de zoom
  zoom: {
    initial: 12,
    min: 10,
    max: 18,
  },
  
  // Estilos disponíveis
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
  },
  
  // Cores de risco
  riskColors: {
    low: '#22c55e',      // Verde
    medium: '#f59e0b',   // Amarelo
    high: '#ef4444',     // Vermelho
    critical: '#8b5cf6', // Roxo
  },
  
  // Configuração de clustering
  clustering: {
    enabled: true,
    radius: 50,
    maxZoom: 14,
  },
  
  // Configuração de heatmap
  heatmap: {
    radius: 30,
    intensity: 0.7,
    opacity: 0.6,
  },
};

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
