/**
 * Types Base do SIVEPI V2
 * Conforme ROADMAP.md - FASE 2.1
 */

export interface OvitrapData {
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

export interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  label: string;
}

export type Theme = 'light' | 'dark';

export interface Statistics {
  total: number;
  avgOvos: number;
  ipoPercentage: number;
  riskLevel: RiskLevel['level'];
}
