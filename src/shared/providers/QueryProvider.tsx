/**
 * React Query Provider
 * Conforme ROADMAP.md - FASE 3.3
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache e Stale Time otimizados
      staleTime: 10 * 60 * 1000,      // 10 minutos (dados epidemiológicos mudam pouco)
      gcTime: 30 * 60 * 1000,         // 30 minutos (cache mais longo)
      
      // Evitar refetch desnecessários
      refetchOnWindowFocus: false,    // Não refetch ao focar janela
      refetchOnMount: false,          // Não refetch ao montar se tem cache
      refetchOnReconnect: false,      // Não refetch ao reconectar rede
      
      // Retry otimizado
      retry: 1,                       // Apenas 1 retry (não 3)
      retryDelay: 1000,               // 1s entre retries
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
