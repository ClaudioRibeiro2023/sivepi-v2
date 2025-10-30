import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertCircle, Users, Package, Calendar, Activity, MapPin, CheckCircle2, Clock, AlertTriangle, Truck, Route, Target, Thermometer, Plus, Save, Camera, Upload, Edit3, Search, Menu, X, ChevronDown, ChevronRight, Filter, Download, RefreshCw, Eye, EyeOff, Info, TrendingUp, BarChart3, PieChart, Zap, Star, Bell, Settings } from 'lucide-react';

// Enhanced design system
const DESIGN_SYSTEM = {
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace'
  },
  typography: {
    h1: { fontSize: '32px', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '24px', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '20px', fontWeight: '600', lineHeight: '1.4' },
    h4: { fontSize: '16px', fontWeight: '500', lineHeight: '1.4' },
    body: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5' },
    caption: { fontSize: '12px', fontWeight: '400', lineHeight: '1.4' },
    label: { fontSize: '13px', fontWeight: '500', lineHeight: '1.3' }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px'
  },
  elevation: {
    1: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    5: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  animation: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    }
  }
};

const ENHANCED_COLORS = {
  primary: {
    50: '#e6f3f7',
    100: '#b3d9e5',
    200: '#80bfd3',
    300: '#4da5c1',
    400: '#1a8baf',
    500: '#0087A8', // Main
    600: '#006d86',
    700: '#005364',
    800: '#003942',
    900: '#001f20'
  },
  secondary: {
    50: '#fff4f0',
    100: '#ffdfcc',
    200: '#ffcaa9',
    300: '#ffb585',
    400: '#ff9061',
    500: '#FF6B35', // Main
    600: '#cc562a',
    700: '#99401f',
    800: '#662b15',
    900: '#33150a'
  },
  success: {
    50: '#f0f9f4',
    100: '#dcf4e3',
    200: '#bbe8d1',
    300: '#86d4aa',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717'
  }
};

// Interfaces (mantendo todas as originais)
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

interface FieldTeam {
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

interface Intervention {
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

interface InventoryItem {
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

interface FieldInput {
  id: string;
  ovitrampaId: number;
  teamId: string;
  dataColeta: string;
  quantidadeOvos: number;
  bairro: string;
  latitude: number;
  longitude: number;
  pesoOvitrampa: number;
  acaoRealizada: string[];
  materialUtilizado: string[];
  observacoes: string;
  evidenciasFotos: File[];
  statusIntervencao: 'PREVENTIVA' | 'CORRETIVA' | 'EMERGENCIAL';
  reincidencia: boolean;
  condicaoClima: 'SECO' | 'CHUVOSO' | 'NUBLADO' | 'ENSOLARADO';
  presencaLarvas: boolean;
  qualidadeAgua: 'LIMPA' | 'TURVA' | 'CONTAMINADA';
  duracaoIntervencao: number;
  proximaVisita?: string;
  responsavelTecnico: string;
}

// Enhanced Theme Hook
const useTheme = (darkMode: boolean) => ({
  colors: darkMode ? {
    bg: ENHANCED_COLORS.neutral[900],
    surface: ENHANCED_COLORS.neutral[800],
    surfaceSecondary: ENHANCED_COLORS.neutral[700],
    text: ENHANCED_COLORS.neutral[50],
    textSecondary: ENHANCED_COLORS.neutral[300],
    textMuted: ENHANCED_COLORS.neutral[500],
    border: ENHANCED_COLORS.neutral[700],
    borderLight: ENHANCED_COLORS.neutral[600],
    primary: ENHANCED_COLORS.primary[400],
    primaryHover: ENHANCED_COLORS.primary[300],
    secondary: ENHANCED_COLORS.secondary[400],
    success: ENHANCED_COLORS.success[400],
    warning: ENHANCED_COLORS.warning[400],
    danger: ENHANCED_COLORS.danger[400],
    overlay: 'rgba(0, 0, 0, 0.8)'
  } : {
    bg: ENHANCED_COLORS.neutral[50],
    surface: 'white',
    surfaceSecondary: ENHANCED_COLORS.neutral[100],
    text: ENHANCED_COLORS.neutral[900],
    textSecondary: ENHANCED_COLORS.neutral[600],
    textMuted: ENHANCED_COLORS.neutral[500],
    border: ENHANCED_COLORS.neutral[200],
    borderLight: ENHANCED_COLORS.neutral[100],
    primary: ENHANCED_COLORS.primary[500],
    primaryHover: ENHANCED_COLORS.primary[600],
    secondary: ENHANCED_COLORS.secondary[500],
    success: ENHANCED_COLORS.success[500],
    warning: ENHANCED_COLORS.warning[500],
    danger: ENHANCED_COLORS.danger[500],
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  spacing: DESIGN_SYSTEM.spacing,
  radius: DESIGN_SYSTEM.radius,
  elevation: DESIGN_SYSTEM.elevation,
  typography: DESIGN_SYSTEM.typography
});

// Enhanced Components
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  style = {},
  ...props 
}) => {
  const theme = useTheme(false);
  
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: `1px solid ${theme.colors.primary}`
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.textSecondary,
      border: 'none'
    }
  };

  const sizes = {
    sm: { padding: `${theme.spacing.xs} ${theme.spacing.md}`, fontSize: '13px' },
    md: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: '14px' },
    lg: { padding: `${theme.spacing.md} ${theme.spacing.lg}`, fontSize: '15px' }
  };

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    fontWeight: '500',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`,
    opacity: disabled || loading ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden',
    ...sizes[size],
    ...variants[variant],
    ...style
  };

  return (
    <button 
      style={baseStyle}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'lg',
  elevation = 2,
  style = {},
  ...props 
}) => {
  const theme = useTheme(false);
  
  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[padding],
    boxShadow: theme.elevation[elevation],
    border: `1px solid ${theme.colors.border}`,
    transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`,
    ...style
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
};

const Input = ({ 
  label, 
  error, 
  success, 
  helper, 
  leftIcon, 
  rightIcon,
  className = '',
  style = {},
  ...props 
}) => {
  const theme = useTheme(false);
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    paddingLeft: leftIcon ? theme.spacing.xl : theme.spacing.md,
    paddingRight: rightIcon ? theme.spacing.xl : theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `1px solid ${error ? theme.colors.danger : success ? theme.colors.success : focused ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: theme.colors.bg,
    color: theme.colors.text,
    fontSize: '14px',
    transition: `all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easeOut}`,
    outline: 'none',
    boxShadow: focused ? `0 0 0 2px ${error ? theme.colors.danger : success ? theme.colors.success : theme.colors.primary}20` : 'none',
    ...style
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
      {label && (
        <label style={{ 
          fontSize: '13px', 
          fontWeight: '500', 
          color: theme.colors.text 
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={{
            position: 'absolute',
            left: theme.spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.colors.textMuted
          }}>
            {leftIcon}
          </div>
        )}
        <input
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <div style={{
            position: 'absolute',
            right: theme.spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.colors.textMuted
          }}>
            {rightIcon}
          </div>
        )}
      </div>
      {(error || success || helper) && (
        <div style={{ 
          fontSize: '12px',
          color: error ? theme.colors.danger : success ? theme.colors.success : theme.colors.textSecondary
        }}>
          {error || success || helper}
        </div>
      )}
    </div>
  );
};

const Badge = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  dot = false,
  className = '' 
}) => {
  const theme = useTheme(false);

  const variants = {
    primary: { 
      backgroundColor: `${theme.colors.primary}15`, 
      color: theme.colors.primary, 
      border: `1px solid ${theme.colors.primary}30` 
    },
    success: { 
      backgroundColor: `${theme.colors.success}15`, 
      color: theme.colors.success, 
      border: `1px solid ${theme.colors.success}30` 
    },
    warning: { 
      backgroundColor: `${theme.colors.warning}15`, 
      color: theme.colors.warning, 
      border: `1px solid ${theme.colors.warning}30` 
    },
    danger: { 
      backgroundColor: `${theme.colors.danger}15`, 
      color: theme.colors.danger, 
      border: `1px solid ${theme.colors.danger}30` 
    },
    neutral: { 
      backgroundColor: `${theme.colors.textMuted}15`, 
      color: theme.colors.textMuted, 
      border: `1px solid ${theme.colors.border}` 
    }
  };

  const sizes = {
    sm: { padding: `2px ${theme.spacing.xs}`, fontSize: '10px' },
    md: { padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: '12px' },
    lg: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: '13px' }
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: dot ? theme.spacing.xs : 0,
    borderRadius: theme.radius.full,
    fontWeight: '500',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant]
  };

  return (
    <span style={style}>
      {dot && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor'
        }} />
      )}
      {children}
    </span>
  );
};

// Main Enhanced Operational Response System Component
const EnhancedOperationalSystem = () => {
  const [activeModule, setActiveModule] = useState('dispatch');
  const [realData, setRealData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fieldTeams, setFieldTeams] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [fieldInputs, setFieldInputs] = useState([]);
  const [currentFieldInput, setCurrentFieldInput] = useState({});
  const [inputMode, setInputMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  const theme = useTheme(darkMode);

  // Enhanced CSS with modern animations and styles
  const enhancedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: ${DESIGN_SYSTEM.fonts.primary};
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes fadeInUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .fade-in-up {
      animation: fadeInUp ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut};
    }
    
    .scale-in {
      animation: scaleIn ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.spring};
    }
    
    .hover-lift {
      transition: all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut};
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.elevation[4]};
    }
    
    .glass-effect {
      backdrop-filter: blur(16px);
      background: ${darkMode ? 'rgba(38, 38, 38, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    }
    
    .metric-card {
      position: relative;
      overflow: hidden;
    }
    
    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      to {
        left: 100%;
      }
    }
    
    .status-pulse {
      position: relative;
    }
    
    .status-pulse::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: currentColor;
      transform: translate(-50%, -50%);
      animation: pulse 2s ease-in-out infinite;
      opacity: 0.3;
    }
  `;

  // Data initialization (keeping all original logic)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fileContent = await window.fs.readFile('banco_dados_aedes_montes_claros_normalizado.csv', { encoding: 'utf8' });
        const lines = fileContent.trim().split('\n');
        if (lines.length === 0) throw new Error('Arquivo CSV vazio');
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          try {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            
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
              data.push(row);
            }
          } catch (lineError) {
            console.warn(`Erro ao processar linha ${i}:`, lineError);
            continue;
          }
        }
        
        if (data.length > 0) {
          setRealData(data);
          console.log(`Dados carregados: ${data.length} registros`);
        } else {
          throw new Error('Nenhum registro válido encontrado');
        }
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(`Falha ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (realData.length > 0) {
      initializeOperationalData();
    }
  }, [realData]);

  const initializeOperationalData = useCallback(() => {
    const teams = [
      {
        id: 'team-01',
        name: 'Equipe Alpha',
        status: 'ATIVO',
        location: { lat: -16.7285, lng: -43.8698 },
        assignedAreas: ['CENTRO', 'JARAGUÁ', 'MORADA DO PARQUE'],
        capacity: 4,
        equipment: ['GPS', 'Spray', 'EPI Completo', 'Camera'],
        lastUpdate: new Date().toISOString(),
        completedToday: 12,
        targetDaily: 20
      },
      {
        id: 'team-02',
        name: 'Equipe Bravo',
        status: 'EM_ROTA',
        location: { lat: -16.7183, lng: -43.8532 },
        assignedAreas: ['VILLAGE DO LAGO', 'SANTOS REIS', 'SAO LUIZ'],
        capacity: 3,
        equipment: ['GPS', 'Larvicida', 'EPI Básico'],
        lastUpdate: new Date(Date.now() - 300000).toISOString(),
        completedToday: 8,
        targetDaily: 15
      },
      {
        id: 'team-03',
        name: 'Equipe Charlie',
        status: 'INTERVENCAO',
        location: { lat: -16.7394, lng: -43.8586 },
        assignedAreas: ['CINTRA', 'IBITURUNA', 'PLANALTO'],
        capacity: 5,
        equipment: ['GPS', 'Spray', 'Aspirador', 'EPI Completo', 'Camera'],
        lastUpdate: new Date(Date.now() - 120000).toISOString(),
        completedToday: 15,
        targetDaily: 25
      }
    ];
    setFieldTeams(teams);

    const inventoryItems = [
      {
        id: 'larv-001',
        name: 'Bacillus thuringiensis israelensis (BTI)',
        category: 'LARVICIDA',
        currentStock: 45,
        minStock: 20,
        unit: 'kg',
        location: 'Almoxarifado Central',
        expiryDate: '2025-06-30',
        cost: 85.50,
        usageRate: 2.5,
        lastRestock: '2024-11-15'
      },
      {
        id: 'epi-001',
        name: 'Máscara PFF2',
        category: 'EPI',
        currentStock: 120,
        minStock: 50,
        unit: 'unidade',
        location: 'Almoxarifado Central',
        expiryDate: '2026-03-15',
        cost: 8.75,
        usageRate: 15,
        lastRestock: '2024-12-01'
      },
      {
        id: 'epi-002',
        name: 'Luvas Nitrílicas',
        category: 'EPI',
        currentStock: 85,
        minStock: 30,
        unit: 'par',
        location: 'Almoxarifado Central',
        cost: 3.25,
        usageRate: 20,
        lastRestock: '2024-11-20'
      },
      {
        id: 'equip-001',
        name: 'Pulverizador Costal 20L',
        category: 'EQUIPAMENTO',
        currentStock: 8,
        minStock: 3,
        unit: 'unidade',
        location: 'Base Operacional Norte',
        cost: 450.00,
        usageRate: 0.1,
        lastRestock: '2024-10-20'
      },
      {
        id: 'equip-002',
        name: 'GPS Portátil',
        category: 'EQUIPAMENTO',
        currentStock: 12,
        minStock: 5,
        unit: 'unidade',
        location: 'Base Operacional Central',
        cost: 320.00,
        usageRate: 0.05,
        lastRestock: '2024-09-15'
      },
      {
        id: 'desc-001',
        name: 'Sacos Plásticos 50L',
        category: 'DESCARTAVEL',
        currentStock: 200,
        minStock: 100,
        unit: 'unidade',
        location: 'Almoxarifado Central',
        cost: 1.20,
        usageRate: 25,
        lastRestock: '2024-12-05'
      }
    ];
    setInventory(inventoryItems);

    generateInterventionsFromData(teams);
  }, [realData]);

  const generateInterventionsFromData = useCallback((teams) => {
    if (realData.length === 0) return;

    const recentData = realData.filter(record => {
      const recordDate = new Date(record.data_coleta);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return recordDate >= thirtyDaysAgo;
    });

    const criticalOvitraps = recentData
      .filter(record => record.quantidade_ovos > 50 || record.reincidencia > 0)
      .slice(0, 20);

    const newInterventions = criticalOvitraps.map((record, index) => {
      const priority = record.quantidade_ovos > 100 ? 'CRITICA' : 
                      record.quantidade_ovos > 50 ? 'ALTA' : 'MEDIA';
      
      const interventionType = record.quantidade_ovos > 80 ? 'ELIMINACAO' : 
                              record.reincidencia > 0 ? 'LARVICIDA' : 'LIMPEZA';
      
      const scheduledDate = new Date(Date.now() + index * 2 * 60 * 60 * 1000);
      
      return {
        id: `int-${record.id_registro}`,
        ovitrampaId: record.id_ovitrampa,
        type: interventionType,
        priority,
        status: index < 5 ? 'CONCLUIDA' : index < 10 ? 'EM_ANDAMENTO' : 'AGENDADA',
        teamId: index < 10 ? teams[index % teams.length]?.id : undefined,
        scheduledDate: scheduledDate.toISOString(),
        completedDate: index < 5 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
        location: {
          lat: record.latitude || -16.7285,
          lng: record.longitude || -43.8698,
          bairro: record.bairro || 'NÃO INFORMADO'
        },
        details: {
          ovosEncontrados: record.quantidade_ovos,
          acaoRealizada: index < 10 ? ['Eliminação de criadouros', 'Aplicação de larvicida'] : [],
          materialUtilizado: index < 10 ? ['BTI 500g', 'EPI Completo'] : [],
          observacoes: record.reincidencia > 0 ? 'Área com histórico de reincidência' : undefined
        },
        estimatedDuration: interventionType === 'ELIMINACAO' ? 45 : interventionType === 'LARVICIDA' ? 30 : 20,
        actualDuration: index < 10 ? Math.floor(Math.random() * 20) + 25 : undefined
      };
    });

    setInterventions(newInterventions);
  }, [realData]);

  const processedData = useMemo(() => {
    if (realData.length === 0) {
      return {
        criticalAreas: [],
        totalOvitraps: 0,
        positiveOvitraps: 0,
        ipo: 0,
        neighborhoodRisk: [],
        urgentInterventions: 0
      };
    }

    const recentData = realData.filter(record => {
      const recordDate = new Date(record.data_coleta);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return recordDate >= thirtyDaysAgo;
    });

    const totalOvitraps = new Set(recentData.map(r => r.id_ovitrampa)).size;
    const positiveOvitraps = new Set(recentData.filter(r => r.quantidade_ovos > 0).map(r => r.id_ovitrampa)).size;
    const ipo = totalOvitraps > 0 ? (positiveOvitraps / totalOvitraps) * 100 : 0;

    const neighborhoodMap = new Map();
    
    recentData.forEach(record => {
      if (!record.bairro) return;
      
      const bairro = record.bairro.trim().toUpperCase();
      if (!neighborhoodMap.has(bairro)) {
        neighborhoodMap.set(bairro, {
          name: bairro,
          totalOvos: 0,
          totalRegistros: 0,
          ovitrampas: new Set(),
          reincidencias: 0,
          coordinates: []
        });
      }
      
      const data = neighborhoodMap.get(bairro);
      data.totalOvos += record.quantidade_ovos;
      data.totalRegistros++;
      data.ovitrampas.add(record.id_ovitrampa);
      if (record.reincidencia > 0) {
        data.reincidencias++;
      }
      if (record.latitude && record.longitude) {
        data.coordinates.push({ lat: record.latitude, lng: record.longitude });
      }
    });

    const neighborhoodRisk = Array.from(neighborhoodMap.values()).map(n => ({
      name: n.name,
      riskScore: (n.totalOvos / n.totalRegistros) * (n.reincidencias + 1),
      ipo: n.totalRegistros > 0 ? (n.totalOvos > 0 ? 100 : 0) : 0,
      ovitrapsCount: n.ovitrampas.size,
      avgCoordinates: n.coordinates.length > 0 ? {
        lat: n.coordinates.reduce((sum, c) => sum + c.lat, 0) / n.coordinates.length,
        lng: n.coordinates.reduce((sum, c) => sum + c.lng, 0) / n.coordinates.length
      } : { lat: -16.7285, lng: -43.8698 }
    })).sort((a, b) => b.riskScore - a.riskScore);

    const criticalAreas = neighborhoodRisk.filter(n => n.riskScore > 50).slice(0, 10);

    return {
      criticalAreas,
      totalOvitraps,
      positiveOvitraps,
      ipo,
      neighborhoodRisk: neighborhoodRisk.slice(0, 20),
      urgentInterventions: interventions.filter(i => i.priority === 'CRITICA' && i.status !== 'CONCLUIDA').length
    };
  }, [realData, interventions]);

  const handleFieldInputSubmit = useCallback(() => {
    if (!currentFieldInput.ovitrampaId || !currentFieldInput.teamId) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const newFieldInput = {
      id: `field-${Date.now()}`,
      ovitrampaId: currentFieldInput.ovitrampaId,
      teamId: currentFieldInput.teamId,
      dataColeta: currentFieldInput.dataColeta || new Date().toISOString().split('T')[0],
      quantidadeOvos: currentFieldInput.quantidadeOvos || 0,
      bairro: currentFieldInput.bairro || '',
      latitude: currentFieldInput.latitude || -16.7285,
      longitude: currentFieldInput.longitude || -43.8698,
      pesoOvitrampa: currentFieldInput.pesoOvitrampa || 0,
      acaoRealizada: currentFieldInput.acaoRealizada || [],
      materialUtilizado: currentFieldInput.materialUtilizado || [],
      observacoes: currentFieldInput.observacoes || '',
      evidenciasFotos: currentFieldInput.evidenciasFotos || [],
      statusIntervencao: currentFieldInput.statusIntervencao || 'PREVENTIVA',
      reincidencia: currentFieldInput.reincidencia || false,
      condicaoClima: currentFieldInput.condicaoClima || 'ENSOLARADO',
      presencaLarvas: currentFieldInput.presencaLarvas || false,
      qualidadeAgua: currentFieldInput.qualidadeAgua || 'LIMPA',
      duracaoIntervencao: currentFieldInput.duracaoIntervencao || 30,
      proximaVisita: currentFieldInput.proximaVisita,
      responsavelTecnico: currentFieldInput.responsavelTecnico || ''
    };

    setFieldInputs(prev => [...prev, newFieldInput]);

    const newRecord = {
      id_registro: realData.length > 0 ? Math.max(...realData.map(r => r.id_registro)) + 1 : 1,
      id_ovitrampa: newFieldInput.ovitrampaId,
      data_instalacao: '',
      data_coleta: newFieldInput.dataColeta,
      quantidade_ovos: newFieldInput.quantidadeOvos,
      ano: new Date(newFieldInput.dataColeta).getFullYear(),
      mes_numero: new Date(newFieldInput.dataColeta).getMonth() + 1,
      mes_nome: new Date(newFieldInput.dataColeta).toLocaleDateString('pt-BR', { month: 'long' }),
      trimestre: Math.ceil((new Date(newFieldInput.dataColeta).getMonth() + 1) / 3),
      semana_epidemiologica: Math.ceil(new Date(newFieldInput.dataColeta).getDate() / 7),
      bairro: newFieldInput.bairro,
      municipio: 'MONTES CLAROS',
      uf: 'MG',
      estado: 'MINAS GERAIS',
      codigo_ibge: 431360,
      latitude: newFieldInput.latitude,
      longitude: newFieldInput.longitude,
      peso_ovitrampa: newFieldInput.pesoOvitrampa,
      reincidencia: newFieldInput.reincidencia ? 1 : 0,
      percentual_diferenca: 0,
      time_original: new Date().toISOString(),
      linha_original: realData.length + 1,
      data_processamento: new Date().toISOString(),
      status_qualidade: 'CAMPO_VALIDADO'
    };

    setRealData(prev => [...prev, newRecord]);
    setCurrentFieldInput({});

    alert('Dados salvos com sucesso!');
  }, [currentFieldInput, realData]);

  // Enhanced Header Component
  const EnhancedHeader = () => (
    <div style={{
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: theme.elevation[4]
    }} className="glass-effect">
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '50%',
        transform: 'translateY(-50%)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.md }}>
          <div>
            <h1 style={{ 
              ...theme.typography.h1, 
              color: 'white', 
              margin: `0 0 ${theme.spacing.sm} 0`,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Sistema de Resposta Operacional
            </h1>
            <p style={{ 
              ...theme.typography.body,
              color: 'rgba(255,255,255,0.9)', 
              margin: `0 0 ${theme.spacing.xs} 0` 
            }}>
              Controle Vetorial Integrado • Aedes aegypti • Montes Claros/MG
            </p>
            <div style={{ 
              ...theme.typography.caption,
              color: 'rgba(255,255,255,0.8)' 
            }}>
              Base: {realData.length.toLocaleString()} registros • Equipes: {fieldTeams.length} ativas • Inputs: {fieldInputs.length}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              leftIcon={darkMode ? <Eye size={16} /> : <EyeOff size={16} />}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white'
              }}
            >
              {darkMode ? 'Claro' : 'Escuro'}
            </Button>
            
            <div style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              backgroundColor: processedData.urgentInterventions > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
              border: `1px solid ${processedData.urgentInterventions > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
              borderRadius: theme.radius.full,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <div className="status-pulse" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: processedData.urgentInterventions > 0 ? '#ef4444' : '#22c55e'
              }} />
              {processedData.urgentInterventions} Alertas Críticos
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.lg, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <Users size={16} />
            <span>{fieldTeams.filter(t => t.status === 'ATIVO').length} Equipes Ativas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <Target size={16} />
            <span>{interventions.filter(i => i.status === 'AGENDADA').length} Intervenções Agendadas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <CheckCircle2 size={16} />
            <span>{interventions.filter(i => i.status === 'CONCLUIDA').length} Concluídas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <Upload size={16} />
            <span>{fieldInputs.length} Registros de Campo</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Module Navigation
  const EnhancedModuleNavigation = () => {
    const modules = [
      { id: 'dispatch', name: 'Dispatch', icon: Users, description: 'Controle de Equipes' },
      { id: 'checklist', name: 'Intervenções', icon: CheckCircle2, description: 'Checklist Operacional' },
      { id: 'inventory', name: 'Estoque', icon: Package, description: 'Gestão de Insumos' },
      { id: 'schedule', name: 'Cronograma', icon: Calendar, description: 'Programação' },
      { id: 'analysis', name: 'Análise', icon: Activity, description: 'Eficácia Operacional' },
      { id: 'field-input', name: 'Campo', icon: Edit3, description: 'Coleta de Dados' }
    ];

    return (
      <div style={{ marginBottom: theme.spacing.xl }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: theme.spacing.md 
        }}>
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <Card
                key={module.id}
                hover={!isActive}
                className={`scale-in ${isActive ? 'gradient-border' : ''}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isActive ? `${theme.colors.primary}15` : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)'
                }}
                onClick={() => setActiveModule(module.id)}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  textAlign: 'center'
                }}>
                  <div style={{
                    padding: theme.spacing.md,
                    borderRadius: theme.radius.lg,
                    backgroundColor: isActive ? theme.colors.primary : `${theme.colors.primary}20`,
                    color: isActive ? 'white' : theme.colors.primary,
                    transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`
                  }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div style={{
                      ...theme.typography.label,
                      color: theme.colors.text,
                      fontWeight: '600',
                      marginBottom: theme.spacing.xs
                    }}>
                      {module.name}
                    </div>
                    <div style={{
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary
                    }}>
                      {module.description}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Enhanced Loading Component
  const EnhancedLoading = ({ message = 'Carregando sistema...' }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60vh',
      gap: theme.spacing.lg
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: `4px solid ${theme.colors.border}`,
          borderTop: `4px solid ${theme.colors.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          border: `2px solid ${theme.colors.secondary}`,
          borderBottom: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite reverse'
        }} />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{
          ...theme.typography.h4,
          color: theme.colors.primary,
          marginBottom: theme.spacing.xs
        }}>
          {message}
        </div>
        <div style={{
          ...theme.typography.caption,
          color: theme.colors.textSecondary
        }}>
          Processando dados operacionais...
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: theme.spacing.xs
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary,
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );

  // Enhanced Team Dispatch Module (COMPLETE)
  const EnhancedTeamDispatch = () => (
    <div className="fade-in-up">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        <Card elevation={3} className="metric-card hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md
          }}>
            <div>
              <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                EQUIPES ATIVAS
              </div>
              <div style={{ ...theme.typography.h1, color: theme.colors.primary }}>
                {fieldTeams.filter(t => t.status === 'ATIVO').length}
              </div>
            </div>
            <div style={{
              padding: theme.spacing.md,
              borderRadius: theme.radius.lg,
              backgroundColor: `${theme.colors.primary}20`,
              color: theme.colors.primary
            }}>
              <Users size={32} />
            </div>
          </div>
          <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
            {fieldTeams.reduce((sum, t) => sum + t.completedToday, 0)} intervenções concluídas hoje
          </div>
        </Card>

        <Card elevation={3} className="metric-card hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md
          }}>
            <div>
              <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                COBERTURA TERRITORIAL
              </div>
              <div style={{ ...theme.typography.h1, color: theme.colors.success }}>
                {new Set(fieldTeams.flatMap(t => t.assignedAreas)).size}
              </div>
            </div>
            <div style={{
              padding: theme.spacing.md,
              borderRadius: theme.radius.lg,
              backgroundColor: `${theme.colors.success}20`,
              color: theme.colors.success
            }}>
              <MapPin size={32} />
            </div>
          </div>
          <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
            bairros sob monitoramento ativo
          </div>
        </Card>

        <Card elevation={3} className="metric-card hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md
          }}>
            <div>
              <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                EFICIÊNCIA OPERACIONAL
              </div>
              <div style={{ ...theme.typography.h1, color: theme.colors.warning }}>
                {((fieldTeams.reduce((sum, t) => sum + t.completedToday, 0) / fieldTeams.reduce((sum, t) => sum + t.targetDaily, 0)) * 100).toFixed(0)}%
              </div>
            </div>
            <div style={{
              padding: theme.spacing.md,
              borderRadius: theme.radius.lg,
              backgroundColor: `${theme.colors.warning}20`,
              color: theme.colors.warning
            }}>
              <TrendingUp size={32} />
            </div>
          </div>
          <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
            da meta diária alcançada
          </div>
        </Card>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.lg
      }}>
        <Card elevation={3} className="hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.lg
          }}>
            <h3 style={{ ...theme.typography.h3, margin: 0 }}>
              Mapa Operacional em Tempo Real
            </h3>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={16} />}>
              Atualizar
            </Button>
          </div>
          
          <div style={{
            height: '400px',
            backgroundColor: darkMode ? theme.colors.surfaceSecondary : '#f8fafc',
            borderRadius: theme.radius.lg,
            position: 'relative',
            overflow: 'hidden',
            border: `2px solid ${theme.colors.border}`
          }}>
            {fieldTeams.map((team, index) => (
              <div
                key={team.id}
                className="hover-lift"
                style={{
                  position: 'absolute',
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`,
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: team.status === 'ATIVO' ? theme.colors.success :
                                  team.status === 'EM_ROTA' ? theme.colors.warning :
                                  team.status === 'INTERVENCAO' ? theme.colors.secondary : 
                                  theme.colors.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: theme.elevation[3],
                  border: '3px solid white',
                  transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`
                }}
                title={`${team.name} - ${team.status}`}
              >
                {team.name.charAt(0)}
              </div>
            ))}
            
            {processedData.criticalAreas.slice(0, 5).map((area, index) => (
              <div
                key={area.name}
                style={{
                  position: 'absolute',
                  right: `${10 + index * 15}%`,
                  top: `${20 + index * 12}%`,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.danger,
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
                title={`${area.name} - Risco: ${area.riskScore.toFixed(1)}`}
              >
                ⚠
              </div>
            ))}
          </div>
        </Card>

        <Card elevation={3} className="hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.lg
          }}>
            <h3 style={{ ...theme.typography.h3, margin: 0 }}>
              Status Detalhado das Equipes
            </h3>
            <Badge variant="primary" size="sm">
              {fieldTeams.length} Equipes
            </Badge>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: theme.spacing.md,
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {fieldTeams.map((team) => {
              const progressPercentage = (team.completedToday / team.targetDaily) * 100;
              const statusColor = team.status === 'ATIVO' ? theme.colors.success :
                                 team.status === 'EM_ROTA' ? theme.colors.warning :
                                 theme.colors.secondary;
              
              return (
                <div
                  key={team.id}
                  className="hover-lift"
                  style={{
                    padding: theme.spacing.md,
                    borderRadius: theme.radius.lg,
                    border: `2px solid ${statusColor}`,
                    backgroundColor: `${statusColor}08`,
                    transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: theme.spacing.md 
                  }}>
                    <div>
                      <h4 style={{ ...theme.typography.h4, margin: `0 0 ${theme.spacing.xs} 0` }}>
                        {team.name}
                      </h4>
                      <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                        {team.assignedAreas.join(' • ')}
                      </div>
                    </div>
                    <Badge variant={team.status === 'ATIVO' ? 'success' : team.status === 'EM_ROTA' ? 'warning' : 'primary'} dot>
                      {team.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div style={{ marginBottom: theme.spacing.sm }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      ...theme.typography.caption,
                      marginBottom: theme.spacing.xs 
                    }}>
                      <span>Progresso Diário</span>
                      <span style={{ fontWeight: '600' }}>
                        {team.completedToday}/{team.targetDaily}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: theme.colors.border,
                      borderRadius: theme.radius.sm,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(progressPercentage, 100)}%`,
                        height: '100%',
                        backgroundColor: progressPercentage >= 100 ? theme.colors.success : theme.colors.warning,
                        borderRadius: theme.radius.sm,
                        transition: `width ${DESIGN_SYSTEM.animation.duration.slow} ${DESIGN_SYSTEM.animation.easeOut}`
                      }} />
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: theme.spacing.md,
                    ...theme.typography.caption,
                    color: theme.colors.textSecondary
                  }}>
                    <span>Capacidade: {team.capacity} agentes</span>
                    <span>Equipamentos: {team.equipment.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );

  // Enhanced Intervention Checklist Module (COMPLETE)
  const EnhancedInterventionChecklist = () => {
    const interventionsByStatus = {
      AGENDADA: interventions.filter(i => i.status === 'AGENDADA'),
      EM_ANDAMENTO: interventions.filter(i => i.status === 'EM_ANDAMENTO'),
      CONCLUIDA: interventions.filter(i => i.status === 'CONCLUIDA')
    };

    return (
      <div className="fade-in-up">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.success}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  CONCLUÍDAS
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.success }}>
                  {interventionsByStatus.CONCLUIDA.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.success}20`,
                color: theme.colors.success
              }}>
                <CheckCircle2 size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Intervenções finalizadas com sucesso
            </div>
          </Card>
          
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.warning}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  EM ANDAMENTO
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.warning }}>
                  {interventionsByStatus.EM_ANDAMENTO.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.warning}20`,
                color: theme.colors.warning
              }}>
                <Clock size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Equipes atualmente em campo
            </div>
          </Card>
          
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.primary}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  AGENDADAS
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.primary }}>
                  {interventionsByStatus.AGENDADA.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary
              }}>
                <Calendar size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Programadas para execução
            </div>
          </Card>
        </div>

        <Card elevation={3} className="hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.lg
          }}>
            <h3 style={{ ...theme.typography.h3, margin: 0 }}>
              Lista de Intervenções Prioritárias
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
                Filtros
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
                Exportar
              </Button>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: theme.spacing.md, 
            maxHeight: '600px', 
            overflowY: 'auto' 
          }}>
            {interventions.slice(0, 12).map((intervention) => {
              const priorityColor = intervention.priority === 'CRITICA' ? theme.colors.danger :
                                  intervention.priority === 'ALTA' ? theme.colors.warning : 
                                  intervention.priority === 'MEDIA' ? theme.colors.primary : theme.colors.success;

              const statusColor = intervention.status === 'CONCLUIDA' ? theme.colors.success :
                                 intervention.status === 'EM_ANDAMENTO' ? theme.colors.warning : theme.colors.primary;

              const team = fieldTeams.find(t => t.id === intervention.teamId);

              return (
                <Card
                  key={intervention.id}
                  hover
                  className="hover-lift"
                  style={{
                    border: `2px solid ${priorityColor}30`,
                    backgroundColor: `${priorityColor}05`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: theme.spacing.md 
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                        <h4 style={{ ...theme.typography.h4, margin: 0, color: theme.colors.text }}>
                          Ovitrampa #{intervention.ovitrampaId}
                        </h4>
                        <Badge variant="neutral" size="sm">
                          {intervention.type}
                        </Badge>
                      </div>
                      <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                        {intervention.location.bairro} • {intervention.details.ovosEncontrados} ovos encontrados
                      </div>
                      {team && (
                        <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                          Equipe: {team.name}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, alignItems: 'flex-end' }}>
                      <Badge 
                        variant={intervention.priority === 'CRITICA' ? 'danger' : 
                               intervention.priority === 'ALTA' ? 'warning' : 'primary'} 
                        size="md"
                      >
                        {intervention.priority}
                      </Badge>
                      <Badge 
                        variant={intervention.status === 'CONCLUIDA' ? 'success' : 
                               intervention.status === 'EM_ANDAMENTO' ? 'warning' : 'neutral'}
                        size="sm"
                        dot
                      >
                        {intervention.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: theme.spacing.md,
                    marginBottom: theme.spacing.md,
                    ...theme.typography.caption,
                    color: theme.colors.textSecondary
                  }}>
                    <div>
                      <strong>Agendada:</strong> {new Date(intervention.scheduledDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <strong>Duração Est.:</strong> {intervention.estimatedDuration}min
                    </div>
                    {intervention.actualDuration && (
                      <div>
                        <strong>Duração Real:</strong> {intervention.actualDuration}min
                      </div>
                    )}
                    {intervention.completedDate && (
                      <div>
                        <strong>Concluída:</strong> {new Date(intervention.completedDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>

                  {intervention.status === 'CONCLUIDA' && intervention.details.acaoRealizada.length > 0 && (
                    <div style={{
                      padding: theme.spacing.sm,
                      backgroundColor: `${theme.colors.success}15`,
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.success}30`
                    }}>
                      <div style={{ ...theme.typography.caption, color: theme.colors.success, fontWeight: 'bold', marginBottom: theme.spacing.xs }}>
                        AÇÕES REALIZADAS
                      </div>
                      <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                        {intervention.details.acaoRealizada.join(', ')}
                      </div>
                      {intervention.details.materialUtilizado.length > 0 && (
                        <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>
                          <strong>Materiais:</strong> {intervention.details.materialUtilizado.join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {intervention.details.observacoes && (
                    <div style={{
                      marginTop: theme.spacing.sm,
                      padding: theme.spacing.sm,
                      backgroundColor: theme.colors.surfaceSecondary,
                      borderRadius: theme.radius.sm,
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary,
                      fontStyle: 'italic'
                    }}>
                      "{intervention.details.observacoes}"
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  // Enhanced Inventory Management Module (COMPLETE)
  const EnhancedInventoryManagement = () => {
    const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
    const expiringItems = inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      return expiryDate <= threeMonthsFromNow;
    });

    const categoryTotals = inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.currentStock * item.cost;
      return acc;
    }, {});

    return (
      <div className="fade-in-up">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.primary}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  ITENS EM ESTOQUE
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.primary }}>
                  {inventory.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary
              }}>
                <Package size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Categorias monitoradas
            </div>
          </Card>

          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${lowStockItems.length > 0 ? theme.colors.danger : theme.colors.success}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  ESTOQUE BAIXO
                </div>
                <div style={{ ...theme.typography.h1, color: lowStockItems.length > 0 ? theme.colors.danger : theme.colors.success }}>
                  {lowStockItems.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: lowStockItems.length > 0 ? `${theme.colors.danger}20` : `${theme.colors.success}20`,
                color: lowStockItems.length > 0 ? theme.colors.danger : theme.colors.success
              }}>
                <AlertTriangle size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Itens abaixo do estoque mínimo
            </div>
          </Card>

          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${expiringItems.length > 0 ? theme.colors.warning : theme.colors.success}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  PRÓXIMO VENCIMENTO
                </div>
                <div style={{ ...theme.typography.h1, color: expiringItems.length > 0 ? theme.colors.warning : theme.colors.success }}>
                  {expiringItems.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: expiringItems.length > 0 ? `${theme.colors.warning}20` : `${theme.colors.success}20`,
                color: expiringItems.length > 0 ? theme.colors.warning : theme.colors.success
              }}>
                <Clock size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Vencem nos próximos 3 meses
            </div>
          </Card>

          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.secondary}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  VALOR TOTAL
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.secondary }}>
                  R$ {Object.values(categoryTotals).reduce((sum, val) => sum + val, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.secondary}20`,
                color: theme.colors.secondary
              }}>
                <BarChart3 size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Investimento em estoque
            </div>
          </Card>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.lg
        }}>
          <Card elevation={3} className="hover-lift">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.lg
            }}>
              <h3 style={{ ...theme.typography.h3, margin: 0 }}>
                Controle Detalhado de Insumos
              </h3>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Novo Item
              </Button>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: theme.spacing.md,
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {inventory.map((item) => {
                const isLowStock = item.currentStock <= item.minStock;
                const isExpiring = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                const stockPercentage = (item.currentStock / (item.minStock * 2)) * 100;

                return (
                  <Card
                    key={item.id}
                    hover
                    className="hover-lift"
                    style={{
                      border: `1px solid ${isLowStock ? theme.colors.danger + '30' : isExpiring ? theme.colors.warning + '30' : theme.colors.border}`,
                      backgroundColor: isLowStock ? `${theme.colors.danger}05` : isExpiring ? `${theme.colors.warning}05` : theme.colors.surface
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: theme.spacing.md
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                          <h4 style={{ ...theme.typography.h4, margin: 0, color: theme.colors.text }}>
                            {item.name}
                          </h4>
                          <Badge variant="neutral" size="sm">
                            {item.category}
                          </Badge>
                        </div>
                        <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                          {item.location}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, alignItems: 'flex-end' }}>
                        {isLowStock && (
                          <Badge variant="danger" size="sm" dot>
                            ESTOQUE BAIXO
                          </Badge>
                        )}
                        {isExpiring && (
                          <Badge variant="warning" size="sm" dot>
                            VENCE EM BREVE
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: theme.spacing.md,
                      marginBottom: theme.spacing.md,
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary
                    }}>
                      <div>
                        <strong>Atual:</strong> {item.currentStock} {item.unit}
                      </div>
                      <div>
                        <strong>Mínimo:</strong> {item.minStock} {item.unit}
                      </div>
                      <div>
                        <strong>Custo Unit.:</strong> R$ {item.cost.toFixed(2)}
                      </div>
                      <div>
                        <strong>Uso/mês:</strong> {item.usageRate} {item.unit}
                      </div>
                      {item.expiryDate && (
                        <div>
                          <strong>Vencimento:</strong> {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: theme.spacing.sm }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        ...theme.typography.caption,
                        marginBottom: theme.spacing.xs 
                      }}>
                        <span>Nível do Estoque</span>
                        <span style={{ fontWeight: '600' }}>
                          {stockPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: theme.colors.border,
                        borderRadius: theme.radius.sm,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(stockPercentage, 100)}%`,
                          height: '100%',
                          backgroundColor: isLowStock ? theme.colors.danger : stockPercentage < 50 ? theme.colors.warning : theme.colors.success,
                          borderRadius: theme.radius.sm,
                          transition: `width ${DESIGN_SYSTEM.animation.duration.slow} ${DESIGN_SYSTEM.animation.easeOut}`
                        }} />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                        Último reabastecimento: {new Date(item.lastRestock).toLocaleDateString('pt-BR')}
                      </div>
                      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="primary" size="sm">
                          Reabastecer
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>

          <Card elevation={3} className="hover-lift">
            <h3 style={{ ...theme.typography.h3, margin: `0 0 ${theme.spacing.lg} 0` }}>
              Resumo por Categoria
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {Object.entries(categoryTotals).map(([category, value]) => {
                const categoryItems = inventory.filter(item => item.category === category);
                const totalValue = value;
                
                return (
                  <Card key={category} style={{ 
                    backgroundColor: theme.colors.surfaceSecondary,
                    border: `1px solid ${theme.colors.border}`
                  }}>
                    <div style={{ marginBottom: theme.spacing.sm }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: theme.spacing.xs
                      }}>
                        <h4 style={{ ...theme.typography.h4, margin: 0 }}>
                          {category.replace('_', ' ')}
                        </h4>
                        <Badge variant="primary" size="sm">
                          {categoryItems.length}
                        </Badge>
                      </div>
                      <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: theme.spacing.xs,
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary
                    }}>
                      {categoryItems.slice(0, 3).map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.name.substring(0, 15)}...</span>
                          <span>{item.currentStock} {item.unit}</span>
                        </div>
                      ))}
                      {categoryItems.length > 3 && (
                        <div style={{ textAlign: 'center', fontStyle: 'italic' }}>
                          +{categoryItems.length - 3} mais...
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Enhanced Action Scheduler Module (COMPLETE)
  const EnhancedActionScheduler = () => {
    const todayInterventions = interventions.filter(i => {
      const today = new Date().toDateString();
      return new Date(i.scheduledDate).toDateString() === today;
    });

    const upcomingInterventions = interventions.filter(i => {
      const interventionDate = new Date(i.scheduledDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return interventionDate > today && interventionDate <= nextWeek;
    });

    const overdue = interventions.filter(i => {
      const interventionDate = new Date(i.scheduledDate);
      const today = new Date();
      return interventionDate < today && i.status !== 'CONCLUIDA';
    });

    return (
      <div className="fade-in-up">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.primary}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  HOJE
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.primary }}>
                  {todayInterventions.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary
              }}>
                <Calendar size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Intervenções programadas
            </div>
          </Card>

          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.warning}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  PRÓXIMOS 7 DIAS
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.warning }}>
                  {upcomingInterventions.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.warning}20`,
                color: theme.colors.warning
              }}>
                <Clock size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Programações futuras
            </div>
          </Card>

          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${overdue.length > 0 ? theme.colors.danger : theme.colors.success}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  ATRASADAS
                </div>
                <div style={{ ...theme.typography.h1, color: overdue.length > 0 ? theme.colors.danger : theme.colors.success }}>
                  {overdue.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: overdue.length > 0 ? `${theme.colors.danger}20` : `${theme.colors.success}20`,
                color: overdue.length > 0 ? theme.colors.danger : theme.colors.success
              }}>
                <AlertTriangle size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Pendências críticas
            </div>
          </Card>

          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.success}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  TAXA DE CONCLUSÃO
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.success }}>
                  {((interventions.filter(i => i.status === 'CONCLUIDA').length / interventions.length) * 100).toFixed(0)}%
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.success}20`,
                color: theme.colors.success
              }}>
                <TrendingUp size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Eficiência operacional
            </div>
          </Card>
        </div>

        <Card elevation={3} className="hover-lift">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.lg
          }}>
            <h3 style={{ ...theme.typography.h3, margin: 0 }}>
              Cronograma Integrado de Intervenções
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <Button variant="outline" size="sm" leftIcon={<Calendar size={16} />}>
                Calendário
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
                Filtros
              </Button>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Nova Intervenção
              </Button>
            </div>
          </div>

          {/* Timeline view */}
          <div style={{ marginBottom: theme.spacing.lg }}>
            <h4 style={{ ...theme.typography.h4, margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.textSecondary }}>
              Hoje - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h4>
            
            {todayInterventions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                {todayInterventions.map((intervention, index) => {
                  const team = fieldTeams.find(t => t.id === intervention.teamId);
                  const timeSlot = new Date(intervention.scheduledDate).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  return (
                    <div key={intervention.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: theme.spacing.md,
                      backgroundColor: theme.colors.surfaceSecondary,
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.border}`,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: intervention.priority === 'CRITICA' ? theme.colors.danger :
                                        intervention.priority === 'ALTA' ? theme.colors.warning : theme.colors.primary,
                        borderRadius: `${theme.radius.sm} 0 0 ${theme.radius.sm}`
                      }} />
                      
                      <div style={{ 
                        marginLeft: theme.spacing.md,
                        flex: 1
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                          <strong style={{ ...theme.typography.h4, margin: 0 }}>
                            {timeSlot}
                          </strong>
                          <span style={{ ...theme.typography.body }}>
                            Ovitrampa #{intervention.ovitrampaId} - {intervention.location.bairro}
                          </span>
                          <Badge variant="neutral" size="sm">
                            {intervention.type}
                          </Badge>
                        </div>
                        
                        <div style={{ display: 'flex', gap: theme.spacing.lg, ...theme.typography.caption, color: theme.colors.textSecondary }}>
                          {team && <span>Equipe: {team.name}</span>}
                          <span>Duração: {intervention.estimatedDuration}min</span>
                          <span>Prioridade: {intervention.priority}</span>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={intervention.status === 'CONCLUIDA' ? 'success' : 
                               intervention.status === 'EM_ANDAMENTO' ? 'warning' : 'neutral'}
                        dot
                      >
                        {intervention.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: theme.spacing['2xl'],
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.surfaceSecondary,
                borderRadius: theme.radius.md
              }}>
                <Calendar size={48} style={{ marginBottom: theme.spacing.md, opacity: 0.5 }} />
                <div style={{ ...theme.typography.body }}>
                  Nenhuma intervenção programada para hoje
                </div>
              </div>
            )}
          </div>

          {/* Upcoming interventions */}
          {upcomingInterventions.length > 0 && (
            <div>
              <h4 style={{ ...theme.typography.h4, margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.textSecondary }}>
                Próximas Intervenções (7 dias)
              </h4>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: theme.spacing.md,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {upcomingInterventions.slice(0, 12).map((intervention) => {
                  const team = fieldTeams.find(t => t.id === intervention.teamId);
                  
                  return (
                    <Card key={intervention.id} hover className="hover-lift" style={{
                      border: `1px solid ${theme.colors.border}`,
                      backgroundColor: theme.colors.surface
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                        <strong style={{ ...theme.typography.h4, margin: 0 }}>
                          Ovitrampa #{intervention.ovitrampaId}
                        </strong>
                        <Badge 
                          variant={intervention.priority === 'CRITICA' ? 'danger' : 
                                 intervention.priority === 'ALTA' ? 'warning' : 'primary'}
                          size="sm"
                        >
                          {intervention.priority}
                        </Badge>
                      </div>
                      
                      <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                        {intervention.location.bairro} • {intervention.type}
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: theme.spacing.sm,
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary
                      }}>
                        <div>
                          <strong>Data:</strong> {new Date(intervention.scheduledDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <strong>Duração:</strong> {intervention.estimatedDuration}min
                        </div>
                        {team && (
                          <div style={{ gridColumn: 'span 2' }}>
                            <strong>Equipe:</strong> {team.name}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  };

  // Enhanced Effectiveness Analysis Module (COMPLETE)
  const EnhancedEffectivenessAnalysis = () => {
    const completedInterventions = interventions.filter(i => i.status === 'CONCLUIDA');
    const totalTime = completedInterventions.reduce((sum, i) => sum + (i.actualDuration || 0), 0);
    const avgTime = completedInterventions.length > 0 ? totalTime / completedInterventions.length : 0;
    
    const teamEfficiency = fieldTeams.map(team => {
      const teamInterventions = interventions.filter(i => i.teamId === team.id && i.status === 'CONCLUIDA');
      const avgDuration = teamInterventions.length > 0 
        ? teamInterventions.reduce((sum, i) => sum + (i.actualDuration || 0), 0) / teamInterventions.length
        : 0;
      
      return {
        ...team,
        completedInterventions: teamInterventions.length,
        avgDuration,
        efficiency: team.targetDaily > 0 ? (team.completedToday / team.targetDaily) * 100 : 0
      };
    });

    const criticalInterventions = interventions.filter(i => i.priority === 'CRITICA');
    const criticalSuccess = criticalInterventions.filter(i => i.status === 'CONCLUIDA').length;
    
    return (
      <div className="fade-in-up">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.success}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  TAXA DE CONCLUSÃO
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.success }}>
                  {((completedInterventions.length / interventions.length) * 100).toFixed(1)}%
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.success}20`,
                color: theme.colors.success
              }}>
                <CheckCircle2 size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              {completedInterventions.length} de {interventions.length} intervenções
            </div>
          </Card>
          
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.primary}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  TEMPO MÉDIO
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.primary }}>
                  {avgTime.toFixed(0)}min
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary
              }}>
                <Clock size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Por intervenção concluída
            </div>
          </Card>
          
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.warning}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  CASOS CRÍTICOS
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.warning }}>
                  {criticalInterventions.length > 0 ? ((criticalSuccess / criticalInterventions.length) * 100).toFixed(0) : 0}%
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.warning}20`,
                color: theme.colors.warning
              }}>
                <AlertTriangle size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              {criticalSuccess} de {criticalInterventions.length} resolvidos
            </div>
          </Card>
          
          <Card elevation={3} className="metric-card hover-lift" style={{
            borderLeft: `4px solid ${theme.colors.secondary}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <div>
                <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  REGISTROS DE CAMPO
                </div>
                <div style={{ ...theme.typography.h1, color: theme.colors.secondary }}>
                  {fieldInputs.length}
                </div>
              </div>
              <div style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: `${theme.colors.secondary}20`,
                color: theme.colors.secondary
              }}>
                <Upload size={32} />
              </div>
            </div>
            <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
              Dados coletados em campo
            </div>
          </Card>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.lg
        }}>
          <Card elevation={3} className="hover-lift">
            <h3 style={{ ...theme.typography.h3, margin: `0 0 ${theme.spacing.lg} 0` }}>
              Performance das Equipes
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {teamEfficiency.map(team => (
                <div key={team.id} style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: theme.spacing.sm
                  }}>
                    <h4 style={{ ...theme.typography.h4, margin: 0 }}>
                      {team.name}
                    </h4>
                    <Badge 
                      variant={team.efficiency >= 100 ? 'success' : team.efficiency >= 75 ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {team.efficiency.toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: theme.spacing.md,
                    ...theme.typography.caption,
                    color: theme.colors.textSecondary
                  }}>
                    <div>
                      <strong>Concluídas:</strong> {team.completedInterventions}
                    </div>
                    <div>
                      <strong>Tempo Médio:</strong> {team.avgDuration.toFixed(0)}min
                    </div>
                    <div>
                      <strong>Meta:</strong> {team.completedToday}/{team.targetDaily}
                    </div>
                  </div>
                  
                  <div style={{
                    marginTop: theme.spacing.sm,
                    width: '100%',
                    height: '6px',
                    backgroundColor: theme.colors.border,
                    borderRadius: theme.radius.sm,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(team.efficiency, 100)}%`,
                      height: '100%',
                      backgroundColor: team.efficiency >= 100 ? theme.colors.success : 
                                     team.efficiency >= 75 ? theme.colors.warning : theme.colors.danger,
                      transition: `width ${DESIGN_SYSTEM.animation.duration.slow} ${DESIGN_SYSTEM.animation.easeOut}`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card elevation={3} className="hover-lift">
            <h3 style={{ ...theme.typography.h3, margin: `0 0 ${theme.spacing.lg} 0` }}>
              Últimos Registros de Campo
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: theme.spacing.md, 
              maxHeight: '400px', 
              overflowY: 'auto' 
            }}>
              {fieldInputs.length > 0 ? fieldInputs.slice(-8).reverse().map((input) => {
                const team = fieldTeams.find(t => t.id === input.teamId);
                const isRecent = new Date(input.dataColeta) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                
                return (
                  <Card
                    key={input.id}
                    hover
                    className="hover-lift"
                    style={{
                      backgroundColor: isRecent ? `${theme.colors.success}05` : theme.colors.surface,
                      border: `1px solid ${isRecent ? theme.colors.success + '30' : theme.colors.border}`
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: theme.spacing.sm 
                    }}>
                      <div>
                        <strong style={{ ...theme.typography.h4, margin: 0 }}>
                          Ovitrampa #{input.ovitrampaId}
                        </strong>
                        <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                          {input.bairro}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                        <Badge 
                          variant={input.quantidadeOvos > 50 ? 'danger' : input.quantidadeOvos > 20 ? 'warning' : 'success'}
                          size="sm"
                        >
                          {input.quantidadeOvos} ovos
                        </Badge>
                        
                        {isRecent && (
                          <Badge variant="success" size="sm" dot>
                            Novo
                          </Badge>
                        )}
                        
                        {input.reincidencia && (
                          <Badge variant="warning" size="sm" dot>
                            Reincidência
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                      gap: theme.spacing.sm,
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary
                    }}>
                      <div>
                        <strong>Data:</strong> {new Date(input.dataColeta).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>Equipe:</strong> {team?.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Duração:</strong> {input.duracaoIntervencao}min
                      </div>
                      <div>
                        <strong>Técnico:</strong> {input.responsavelTecnico.split(' ')[0]}
                      </div>
                    </div>
                    
                    {input.observacoes && (
                      <div style={{
                        marginTop: theme.spacing.sm,
                        padding: theme.spacing.sm,
                        backgroundColor: theme.colors.surfaceSecondary,
                        borderRadius: theme.radius.sm,
                        ...theme.typography.caption,
                        color: theme.colors.textSecondary,
                        fontStyle: 'italic'
                      }}>
                        "{input.observacoes.substring(0, 80)}{input.observacoes.length > 80 ? '...' : ''}"
                      </div>
                    )}
                  </Card>
                );
              }) : (
                <div style={{
                  textAlign: 'center',
                  padding: theme.spacing['2xl'],
                  color: theme.colors.textSecondary,
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderRadius: theme.radius.md
                }}>
                  <Upload size={48} style={{ marginBottom: theme.spacing.md, opacity: 0.5 }} />
                  <div style={{ ...theme.typography.body }}>
                    Nenhum registro de campo disponível
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    style={{ marginTop: theme.spacing.md }}
                    onClick={() => setActiveModule('field-input')}
                  >
                    Criar Primeiro Registro
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Enhanced Field Input Module (COMPLETE with wizard)
  const EnhancedFieldInputModule = () => {
    const [inputStep, setInputStep] = useState(1);
    const totalSteps = 3;
    
    const bairrosDisponiveis = [...new Set(realData.map(r => r.bairro).filter(Boolean))].sort();
    
    const stepTitles = {
      1: 'Identificação',
      2: 'Dados da Coleta',
      3: 'Detalhes Técnicos'
    };

    return (
      <div className="fade-in-up">
        {/* Input Mode Selector */}
        <Card elevation={2} style={{ marginBottom: theme.spacing.lg }}>
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.surfaceSecondary,
            borderRadius: theme.radius.lg
          }}>
            <Button
              variant={inputMode === 'create' ? 'primary' : 'secondary'}
              onClick={() => {
                setInputMode('create');
                setInputStep(1);
              }}
              leftIcon={<Plus size={16} />}
            >
              Novo Registro
            </Button>
            
            <Button
              variant={inputMode === 'search' ? 'primary' : 'secondary'}
              onClick={() => setInputMode('search')}
              leftIcon={<Search size={16} />}
            >
              Consultar Registros
            </Button>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <div style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
                {fieldInputs.length} registros salvos
              </div>
              <Badge variant="primary">{fieldInputs.filter(input => 
                new Date(input.dataColeta).toDateString() === new Date().toDateString()
              ).length} hoje</Badge>
            </div>
          </div>
        </Card>

        {inputMode === 'create' && (
          <Card elevation={3} padding="xl" className="scale-in">
            {/* Wizard Progress */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: theme.spacing.xl,
              paddingBottom: theme.spacing.lg,
              borderBottom: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.md
                }}>
                  {[1, 2, 3].map(step => (
                    <React.Fragment key={step}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: theme.spacing.xs
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: inputStep >= step ? theme.colors.primary : theme.colors.border,
                          color: inputStep >= step ? 'white' : theme.colors.textSecondary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`
                        }}>
                          {inputStep > step ? <CheckCircle2 size={20} /> : step}
                        </div>
                        <div style={{
                          ...theme.typography.caption,
                          color: inputStep >= step ? theme.colors.text : theme.colors.textSecondary,
                          fontWeight: inputStep === step ? '600' : '400'
                        }}>
                          {stepTitles[step]}
                        </div>
                      </div>
                      {step < totalSteps && (
                        <div style={{
                          width: '60px',
                          height: '2px',
                          backgroundColor: inputStep > step ? theme.colors.primary : theme.colors.border,
                          transition: `all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easeOut}`
                        }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentFieldInput({})}
                  leftIcon={<X size={16} />}
                >
                  Limpar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Salvar rascunho')}
                  leftIcon={<Save size={16} />}
                >
                  Salvar Rascunho
                </Button>
              </div>
            </div>

            {/* Step Content */}
            {inputStep === 1 && (
              <div className="fade-in-up">
                <h3 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>
                  Identificação da Coleta
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: theme.spacing.lg 
                }}>
                  <Input
                    label="ID da Ovitrampa"
                    type="number"
                    value={currentFieldInput.ovitrampaId || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, ovitrampaId: parseInt(e.target.value) }))}
                    placeholder="Ex: 1001"
                    leftIcon={<Target size={16} />}
                    helper="Identificador único da armadilha monitorada"
                  />
                  
                  <div>
                    <label style={{ ...theme.typography.label, marginBottom: theme.spacing.xs, display: 'block' }}>
                      Equipe Responsável
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={currentFieldInput.teamId || ''}
                        onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, teamId: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                          paddingLeft: theme.spacing.xl,
                          borderRadius: theme.radius.md,
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.bg,
                          color: theme.colors.text,
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Selecione a equipe</option>
                        {fieldTeams.map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                      <div style={{
                        position: 'absolute',
                        left: theme.spacing.md,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.colors.textMuted,
                        pointerEvents: 'none'
                      }}>
                        <Users size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ ...theme.typography.label, marginBottom: theme.spacing.xs, display: 'block' }}>
                      Bairro
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={currentFieldInput.bairro || ''}
                        onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, bairro: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                          paddingLeft: theme.spacing.xl,
                          borderRadius: theme.radius.md,
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.bg,
                          color: theme.colors.text,
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Selecione o bairro</option>
                        {bairrosDisponiveis.map(bairro => (
                          <option key={bairro} value={bairro}>{bairro}</option>
                        ))}
                      </select>
                      <div style={{
                        position: 'absolute',
                        left: theme.spacing.md,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.colors.textMuted,
                        pointerEvents: 'none'
                      }}>
                        <MapPin size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <Input
                    label="Data da Coleta"
                    type="date"
                    value={currentFieldInput.dataColeta || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, dataColeta: e.target.value }))}
                    leftIcon={<Calendar size={16} />}
                  />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  marginTop: theme.spacing.xl 
                }}>
                  <Button
                    variant="primary"
                    onClick={() => setInputStep(2)}
                    rightIcon={<ChevronRight size={16} />}
                    disabled={!currentFieldInput.ovitrampaId || !currentFieldInput.teamId}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}

            {inputStep === 2 && (
              <div className="fade-in-up">
                <h3 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>
                  Dados da Coleta
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: theme.spacing.lg 
                }}>
                  <Input
                    label="Quantidade de Ovos"
                    type="number"
                    min="0"
                    value={currentFieldInput.quantidadeOvos || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, quantidadeOvos: parseInt(e.target.value) }))}
                    leftIcon={<Activity size={16} />}
                    helper="Número total de ovos coletados"
                  />
                  
                  <Input
                    label="Peso da Ovitrampa (g)"
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentFieldInput.pesoOvitrampa || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, pesoOvitrampa: parseFloat(e.target.value) }))}
                    leftIcon={<Activity size={16} />}
                  />
                  
                  <Input
                    label="Coordenada Latitude"
                    type="number"
                    step="0.0001"
                    value={currentFieldInput.latitude || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                    placeholder="-16.7285"
                    leftIcon={<MapPin size={16} />}
                  />
                  
                  <Input
                    label="Coordenada Longitude"
                    type="number"
                    step="0.0001"
                    value={currentFieldInput.longitude || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                    placeholder="-43.8698"
                    leftIcon={<MapPin size={16} />}
                  />
                </div>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: theme.spacing.lg,
                  marginTop: theme.spacing.lg
                }}>
                  <div>
                    <label style={{ ...theme.typography.label, marginBottom: theme.spacing.sm, display: 'block' }}>
                      Condições Observadas
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={currentFieldInput.presencaLarvas || false}
                          onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, presencaLarvas: e.target.checked }))}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ ...theme.typography.body }}>Presença de larvas</span>
                      </label>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={currentFieldInput.reincidencia || false}
                          onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, reincidencia: e.target.checked }))}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ ...theme.typography.body }}>Reincidência (positiva novamente)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ ...theme.typography.label, marginBottom: theme.spacing.xs, display: 'block' }}>
                      Observações
                    </label>
                    <textarea
                      value={currentFieldInput.observacoes || ''}
                      onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, observacoes: e.target.value }))}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: theme.spacing.sm,
                        borderRadius: theme.radius.md,
                        border: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.bg,
                        color: theme.colors.text,
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                      placeholder="Observações sobre a coleta, condições do local, ações realizadas..."
                    />
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: theme.spacing.xl 
                }}>
                  <Button
                    variant="outline"
                    onClick={() => setInputStep(1)}
                    leftIcon={<ChevronDown style={{ transform: 'rotate(90deg)' }} size={16} />}
                  >
                    Anterior
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={() => setInputStep(3)}
                    rightIcon={<ChevronRight size={16} />}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}

            {inputStep === 3 && (
              <div className="fade-in-up">
                <h3 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>
                  Detalhes Técnicos e Finalização
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: theme.spacing.lg,
                  marginBottom: theme.spacing.lg
                }}>
                  <Input
                    label="Responsável Técnico"
                    type="text"
                    value={currentFieldInput.responsavelTecnico || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, responsavelTecnico: e.target.value }))}
                    placeholder="Nome completo do técnico"
                    leftIcon={<Users size={16} />}
                  />
                  
                  <Input
                    label="Duração da Intervenção (min)"
                    type="number"
                    min="5"
                    value={currentFieldInput.duracaoIntervencao || '30'}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, duracaoIntervencao: parseInt(e.target.value) }))}
                    leftIcon={<Clock size={16} />}
                  />
                  
                  <div>
                    <label style={{ ...theme.typography.label, marginBottom: theme.spacing.xs, display: 'block' }}>
                      Tipo de Intervenção
                    </label>
                    <select
                      value={currentFieldInput.statusIntervencao || 'PREVENTIVA'}
                      onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, statusIntervencao: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        borderRadius: theme.radius.md,
                        border: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.bg,
                        color: theme.colors.text,
                        fontSize: '14px'
                      }}
                    >
                      <option value="PREVENTIVA">Preventiva</option>
                      <option value="CORRETIVA">Corretiva</option>
                      <option value="EMERGENCIAL">Emergencial</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Próxima Visita (Opcional)"
                    type="date"
                    value={currentFieldInput.proximaVisita || ''}
                    onChange={(e) => setCurrentFieldInput(prev => ({ ...prev, proximaVisita: e.target.value }))}
                    leftIcon={<Calendar size={16} />}
                  />
                </div>

                {/* Summary Card */}
                <Card elevation={2} style={{ 
                  backgroundColor: `${theme.colors.primary}08`,
                  border: `1px solid ${theme.colors.primary}30`,
                  marginBottom: theme.spacing.lg
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.md
                  }}>
                    <Info size={20} color={theme.colors.primary} />
                    <h4 style={{ ...theme.typography.h4, margin: 0, color: theme.colors.primary }}>
                      Resumo da Coleta
                    </h4>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: theme.spacing.md,
                    ...theme.typography.body
                  }}>
                    <div>
                      <strong>Ovitrampa:</strong> #{currentFieldInput.ovitrampaId || 'N/A'}
                    </div>
                    <div>
                      <strong>Bairro:</strong> {currentFieldInput.bairro || 'N/A'}
                    </div>
                    <div>
                      <strong>Ovos coletados:</strong> {currentFieldInput.quantidadeOvos || 0}
                    </div>
                    <div>
                      <strong>Data:</strong> {currentFieldInput.dataColeta ? 
                        new Date(currentFieldInput.dataColeta).toLocaleDateString('pt-BR') : 'N/A'
                      }
                    </div>
                    <div>
                      <strong>Equipe:</strong> {fieldTeams.find(t => t.id === currentFieldInput.teamId)?.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Responsável:</strong> {currentFieldInput.responsavelTecnico || 'N/A'}
                    </div>
                  </div>
                </Card>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: theme.spacing.xl 
                }}>
                  <Button
                    variant="outline"
                    onClick={() => setInputStep(2)}
                    leftIcon={<ChevronDown style={{ transform: 'rotate(90deg)' }} size={16} />}
                  >
                    Anterior
                  </Button>
                  
                  <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                    <Button
                      variant="outline"
                      onClick={() => console.log('Salvar como rascunho')}
                      leftIcon={<Save size={16} />}
                    >
                      Salvar Rascunho
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleFieldInputSubmit();
                        setInputStep(1);
                      }}
                      leftIcon={<CheckCircle2 size={16} />}
                      disabled={!currentFieldInput.responsavelTecnico}
                    >
                      Finalizar Registro
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {inputMode === 'search' && (
          <Card elevation={3} className="scale-in">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.lg
            }}>
              <h3 style={{ ...theme.typography.h3, margin: 0 }}>
                Consultar Registros de Campo
              </h3>
              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
                  Filtros
                </Button>
                <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
                  Exportar
                </Button>
              </div>
            </div>
            
            <div style={{ marginBottom: theme.spacing.lg }}>
              <Input
                placeholder="Buscar por ID da ovitrampa, bairro, responsável..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={16} />}
                style={{ fontSize: '16px' }}
              />
            </div>
            
            {fieldInputs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                {fieldInputs
                  .filter(input => 
                    !searchQuery || 
                    input.ovitrampaId.toString().includes(searchQuery) ||
                    input.bairro.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    input.responsavelTecnico.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 10)
                  .map(input => {
                    const team = fieldTeams.find(t => t.id === input.teamId);
                    const isRecent = new Date(input.dataColeta) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <Card
                        key={input.id}
                        hover
                        className="hover-lift"
                        style={{
                          backgroundColor: isRecent ? `${theme.colors.success}05` : theme.colors.surface,
                          border: `1px solid ${isRecent ? theme.colors.success + '30' : theme.colors.border}`
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: theme.spacing.sm 
                        }}>
                          <div>
                            <h4 style={{ ...theme.typography.h4, margin: 0, color: theme.colors.text }}>
                              Ovitrampa #{input.ovitrampaId} - {input.bairro}
                            </h4>
                            {isRecent && (
                              <Badge variant="success" size="sm" style={{ marginTop: theme.spacing.xs }}>
                                Recente
                              </Badge>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                            <Badge 
                              variant={input.quantidadeOvos > 50 ? 'danger' : input.quantidadeOvos > 20 ? 'warning' : 'success'}
                              size="md"
                            >
                              {input.quantidadeOvos} ovos
                            </Badge>
                            
                            {input.reincidencia && (
                              <Badge variant="warning" size="sm" dot>
                                Reincidência
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                          gap: theme.spacing.md,
                          ...theme.typography.caption,
                          color: theme.colors.textSecondary
                        }}>
                          <div>
                            <strong>Data:</strong> {new Date(input.dataColeta).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <strong>Equipe:</strong> {team?.name || 'N/A'}
                          </div>
                          <div>
                            <strong>Responsável:</strong> {input.responsavelTecnico}
                          </div>
                          <div>
                            <strong>Duração:</strong> {input.duracaoIntervencao}min
                          </div>
                          <div>
                            <strong>Clima:</strong> {input.condicaoClima}
                          </div>
                          <div>
                            <strong>Tipo:</strong> {input.statusIntervencao}
                          </div>
                        </div>
                        
                        {input.observacoes && (
                          <div style={{
                            marginTop: theme.spacing.sm,
                            padding: theme.spacing.sm,
                            backgroundColor: theme.colors.surfaceSecondary,
                            borderRadius: theme.radius.sm,
                            ...theme.typography.caption,
                            color: theme.colors.textSecondary,
                            fontStyle: 'italic'
                          }}>
                            "{input.observacoes}"
                          </div>
                        )}
                      </Card>
                    );
                  })}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing['2xl'],
                textAlign: 'center',
                color: theme.colors.textSecondary
              }}>
                <div style={{
                  marginBottom: theme.spacing.lg,
                  padding: theme.spacing.lg,
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.colors.surfaceSecondary
                }}>
                  <Search size={48} />
                </div>
                <h3 style={{
                  ...theme.typography.h3,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm
                }}>
                  Nenhum registro encontrado
                </h3>
                <p style={{
                  ...theme.typography.body,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.lg,
                  maxWidth: '400px'
                }}>
                  Ainda não há registros de campo salvos no sistema. Comece criando o primeiro registro.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setInputMode('create')}
                  leftIcon={<Plus size={16} />}
                >
                  Criar Primeiro Registro
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Floating Stats Widget */}
        {fieldInputs.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: theme.spacing.lg,
            right: theme.spacing.lg,
            width: '300px',
            zIndex: 1000
          }}>
            <Card 
              elevation={5} 
              className="glass-effect hover-lift"
              style={{
                backdropFilter: 'blur(16px)',
                backgroundColor: darkMode ? 'rgba(38, 38, 38, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.md
              }}>
                <h4 style={{ ...theme.typography.h4, margin: 0, color: theme.colors.primary }}>
                  Stats Rápidas
                </h4>
                <Badge variant="primary" size="sm">
                  Tempo Real
                </Badge>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  ...theme.typography.body
                }}>
                  <span style={{ color: theme.colors.textSecondary }}>Total de registros:</span>
                  <strong style={{ color: theme.colors.text }}>{fieldInputs.length}</strong>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  ...theme.typography.body
                }}>
                  <span style={{ color: theme.colors.textSecondary }}>Registros hoje:</span>
                  <Badge variant="success" size="sm">
                    {fieldInputs.filter(input => 
                      new Date(input.dataColeta).toDateString() === new Date().toDateString()
                    ).length}
                  </Badge>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  ...theme.typography.body
                }}>
                  <span style={{ color: theme.colors.textSecondary }}>Ovos coletados:</span>
                  <strong style={{ color: theme.colors.warning }}>
                    {fieldInputs.reduce((sum, input) => sum + input.quantidadeOvos, 0).toLocaleString()}
                  </strong>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  ...theme.typography.body
                }}>
                  <span style={{ color: theme.colors.textSecondary }}>Reincidências:</span>
                  <Badge variant="danger" size="sm">
                    {fieldInputs.filter(input => input.reincidencia).length}
                  </Badge>
                </div>
              </div>
              
              <div style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.sm,
                backgroundColor: `${theme.colors.primary}15`,
                borderRadius: theme.radius.md,
                textAlign: 'center'
              }}>
                <div style={{ 
                  ...theme.typography.caption, 
                  color: theme.colors.primary, 
                  fontWeight: 'bold' 
                }}>
                  MÉDIA DE OVOS POR COLETA
                </div>
                <div style={{ 
                  ...theme.typography.h2, 
                  color: theme.colors.primary, 
                  margin: `${theme.spacing.xs} 0 0 0` 
                }}>
                  {fieldInputs.length > 0 
                    ? (fieldInputs.reduce((sum, input) => sum + input.quantidadeOvos, 0) / fieldInputs.length).toFixed(1)
                    : '0'
                  }
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <EnhancedLoading />;
  
  if (error) return (
    <div style={{
      padding: theme.spacing['2xl'],
      textAlign: 'center'
    }}>
      <Card elevation={3} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing.lg
        }}>
          <div style={{
            padding: theme.spacing.lg,
            borderRadius: theme.radius.full,
            backgroundColor: `${theme.colors.danger}20`,
            color: theme.colors.danger
          }}>
            <AlertCircle size={48} />
          </div>
          
          <div>
            <h3 style={{ ...theme.typography.h3, color: theme.colors.danger, marginBottom: theme.spacing.sm }}>
              Erro no Sistema
            </h3>
            <p style={{ ...theme.typography.body, color: theme.colors.text, marginBottom: theme.spacing.lg }}>
              {error}
            </p>
          </div>
          
          <Button 
            variant="primary"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw size={16} />}
          >
            Recarregar Sistema
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{
      backgroundColor: theme.colors.bg,
      minHeight: '100vh',
      padding: theme.spacing.lg,
      fontFamily: DESIGN_SYSTEM.fonts.primary,
      color: theme.colors.text
    }}>
      <style dangerouslySetInnerHTML={{ __html: enhancedStyles }} />
      
      <EnhancedHeader />
      <EnhancedModuleNavigation />
      
      {activeModule === 'dispatch' && <EnhancedTeamDispatch />}
      {activeModule === 'checklist' && <EnhancedInterventionChecklist />}
      {activeModule === 'inventory' && <EnhancedInventoryManagement />}
      {activeModule === 'schedule' && <EnhancedActionScheduler />}
      {activeModule === 'analysis' && <EnhancedEffectivenessAnalysis />}
      {activeModule === 'field-input' && <EnhancedFieldInputModule />}
    </div>
  );
};

export default EnhancedOperationalSystem;
                