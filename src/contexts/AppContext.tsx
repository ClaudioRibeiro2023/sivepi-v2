/**
 * Contexto Global da Aplicação SIVEPI
 * Gerencia estado compartilhado entre todos os módulos
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { 
  AedesRecord, 
  GlobalFilters, 
  UserPreferences, 
  LoadingState,
  GeneralStats
} from '../types';
import { loadCSVData, calculateGeneralStats } from '../services/dataService';

interface AppContextType {
  // Dados
  data: AedesRecord[];
  loading: boolean;
  error: string | null;
  
  // Filtros
  filters: GlobalFilters;
  setFilters: (filters: Partial<GlobalFilters>) => void;
  
  // Preferências
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  
  // Estatísticas
  stats: GeneralStats;
  
  // Ações
  reloadData: () => Promise<void>;
  exportData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [data, setData] = useState<AedesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFiltersState] = useState<GlobalFilters>({
    year: '2024',
    month: 'all',
    week: 'all'
  });
  
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('sivepi_preferences');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      explainMode: false,
      compareMode: false,
      notifications: true,
      autoRefresh: false,
      refreshInterval: 300000 // 5 minutos
    };
  });

  const [stats, setStats] = useState<GeneralStats>({
    totalOvos: 0,
    totalRegistros: 0,
    bairrosUnicos: 0,
    ovitrampasUnicas: 0
  });

  // Carrega dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Atualiza estatísticas quando os dados mudam
  useEffect(() => {
    if (data.length > 0) {
      const newStats = calculateGeneralStats(data);
      setStats(newStats);
    }
  }, [data]);

  // Salva preferências no localStorage
  useEffect(() => {
    localStorage.setItem('sivepi_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedData = await loadCSVData();
      setData(loadedData);
      
      // Configura filtros iniciais baseados nos dados
      if (loadedData.length > 0) {
        const years = [...new Set(loadedData.map(r => r.ano).filter(Boolean))];
        const latestYear = Math.max(...years);
        setFiltersState(prev => ({ ...prev, year: latestYear.toString() }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const reloadData = useCallback(async () => {
    await loadInitialData();
  }, []);

  const setFilters = useCallback((newFilters: Partial<GlobalFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setPreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferencesState(prev => ({ ...prev, ...newPrefs }));
  }, []);

  const exportData = useCallback(() => {
    // Implementar exportação de dados
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sivepi_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data]);

  const convertToCSV = (data: AedesRecord[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(header => {
        const value = (row as any)[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  };

  const value: AppContextType = {
    data,
    loading,
    error,
    filters,
    setFilters,
    preferences,
    setPreferences,
    stats,
    reloadData,
    exportData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
