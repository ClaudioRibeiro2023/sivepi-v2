/**
 * Hook para carregar dados com React Query
 * Conforme ROADMAP.md - FASE 3.4
 */

import { useQuery } from '@tanstack/react-query';
import { loadCSVData } from '../../services/dataService';
import { useDataStore } from '../stores/dataStore';
import { useEffect } from 'react';

export function useOvitrapData() {
  const { setData, setLoading, setError, filteredData } = useDataStore();
  
  const query = useQuery({
    queryKey: ['ovitrap-data'],
    queryFn: loadCSVData,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Sincronizar com Zustand
  useEffect(() => {
    if (query.data) {
      setData(query.data);
    }
    setLoading(query.isLoading);
    setError(query.error ? (query.error as Error).message : null);
  }, [query.data, query.isLoading, query.error, setData, setLoading, setError]);
  
  return {
    data: filteredData,
    allData: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
