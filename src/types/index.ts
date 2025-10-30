// ============================================
// TIPOS CENTRALIZADOS DO SISTEMA SIVEPI
// ============================================

/**
 * Registro básico de dados do Aedes aegypti
 */
export interface AedesRecord {
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

/**
 * Filtros globais do sistema
 */
export interface GlobalFilters {
  year: string;
  month: string;
  week: string;
  bairro?: string;
}

/**
 * Dados agregados mensais
 */
export interface MonthlyData {
  period: string;
  month: number;
  year: number;
  monthName: string;
  totalOvos: number;
  mediaOvos: number;
  ipo: number;
  ovitrampasAtivas: number;
  bairrosMonitorados: number;
  registros: number;
  eggs: number;
  positive: number;
}

/**
 * Dados agregados semanais
 */
export interface WeeklyData {
  period: string;
  week: number;
  year: number;
  month: number;
  monthName: string;
  totalOvos: number;
  mediaOvos: number;
  ipo: number;
  registros: number;
  eggs: number;
  positive: number;
}

/**
 * Dados de bairros
 */
export interface NeighborhoodData {
  name: string;
  totalOvos: number;
  avgEggs: number;
  ipo: number;
  ipoCI?: ConfidenceInterval;
  eggsCI?: ConfidenceInterval;
  traps: number;
  reincidence: number;
  registros: number;
  latitude: number;
  longitude: number;
  population?: number;
  eggsPer1000?: number;
  significanceLevel?: 'ALTA' | 'MÉDIA' | 'BAIXA';
}

/**
 * Intervalo de confiança
 */
export interface ConfidenceInterval {
  mean: number;
  lower: number;
  upper: number;
  stdError?: number;
}

/**
 * Equipe de campo
 */
export interface FieldTeam {
  id: string;
  name: string;
  status: 'ATIVO' | 'EM_ROTA' | 'INTERVENCAO' | 'DISPONIVEL' | 'OFFLINE';
  location: { lat: number; lng: number };
  assignedAreas: string[];
  capacity: number;
  equipment: string[];
  lastUpdate: string;
  completedToday: number;
  targetDaily: number;
}

/**
 * Intervenção de campo
 */
export interface Intervention {
  id: string;
  ovitrampaId: number;
  type: 'LIMPEZA' | 'LARVICIDA' | 'ELIMINACAO' | 'REPOSICAO' | 'INSPECAO';
  priority: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  teamId?: string;
  scheduledDate: string;
  completedDate?: string;
  location: { lat: number; lng: number; bairro: string };
  details: {
    ovosEncontrados: number;
    acaoRealizada: string[];
    materialUtilizado: string[];
    observacoes?: string;
    evidencias?: string[];
  };
  estimatedDuration: number;
  actualDuration?: number;
}

/**
 * Item de inventário
 */
export interface InventoryItem {
  id: string;
  name: string;
  category: 'LARVICIDA' | 'EPI' | 'EQUIPAMENTO' | 'DESCARTAVEL';
  currentStock: number;
  minStock: number;
  unit: string;
  location: string;
  expiryDate?: string;
  cost: number;
  usageRate: number;
  lastRestock: string;
}

/**
 * Tema visual do sistema
 */
export interface Theme {
  colors: {
    bg: string;
    surface: string;
    surfaceSecondary?: string;
    text: string;
    textSecondary: string;
    textMuted?: string;
    border: string;
    borderLight?: string;
    primary: string;
    primaryHover?: string;
    primaryLight?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
    accent?: string;
    cardBg?: string;
    overlay?: string;
  };
  spacing: (factor: number) => string;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl?: string;
    '2xl'?: string;
    full?: string;
  };
  shadows?: {
    sm: string;
    md: string;
    lg: string;
  };
  elevation?: {
    [key: number]: string;
  };
  typography?: {
    [key: string]: React.CSSProperties;
  };
}

/**
 * Estado de carregamento
 */
export interface LoadingState {
  [key: string]: boolean;
}

/**
 * Estatísticas gerais
 */
export interface GeneralStats {
  totalOvos: number;
  totalRegistros: number;
  bairrosUnicos: number;
  ovitrampasUnicas: number;
}

/**
 * Módulos do sistema
 */
export type ModuleType = 
  | 'dashboard' 
  | 'panorama' 
  | 'vigilancia' 
  | 'operacional' 
  | 'mapa' 
  | 'relatorios'
  | 'configuracoes';

/**
 * Configurações do usuário
 */
export interface UserPreferences {
  darkMode: boolean;
  explainMode: boolean;
  compareMode: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

/**
 * Notificação do sistema
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
