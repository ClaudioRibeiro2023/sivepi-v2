/**
 * Zustand Store para Dados Globais
 * Conforme ROADMAP.md - FASE 3.2
 */

import { create } from 'zustand';
import type { OvitrapData } from '../types';

interface DataStore {
  // State
  data: OvitrapData[];
  filteredData: OvitrapData[];
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    year?: string;
    month?: string;
    week?: number;
    bairro?: string;
    ovosMin?: number;
    ovosMax?: number;
  };
  
  // Actions
  setData: (data: OvitrapData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<DataStore['filters']>) => void;
  clearFilters: () => void;
  
  // Computed
  applyFilters: () => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  // Initial State
  data: [],
  filteredData: [],
  loading: false,
  error: null,
  filters: {},
  
  // Actions
  setData: (data) => {
    set({ data, filteredData: data });
    get().applyFilters();
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().applyFilters();
  },
  
  clearFilters: () => {
    set({ filters: {} });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { data, filters } = get();
    
    let filtered = [...data];
    
    if (filters.year) {
      filtered = filtered.filter((item) => 
        item.ano.toString() === filters.year
      );
    }
    
    if (filters.month) {
      filtered = filtered.filter((item) => 
        item.mes_numero.toString() === filters.month
      );
    }
    
    if (filters.week) {
      filtered = filtered.filter((item) => 
        item.semana_epidemiologica === filters.week
      );
    }
    
    if (filters.bairro && filters.bairro !== 'todos') {
      filtered = filtered.filter((item) => 
        item.bairro === filters.bairro
      );
    }
    
    if (filters.ovosMin !== undefined) {
      filtered = filtered.filter((item) => 
        item.quantidade_ovos >= filters.ovosMin!
      );
    }
    
    if (filters.ovosMax !== undefined) {
      filtered = filtered.filter((item) => 
        item.quantidade_ovos <= filters.ovosMax!
      );
    }
    
    set({ filteredData: filtered });
  },
}));
