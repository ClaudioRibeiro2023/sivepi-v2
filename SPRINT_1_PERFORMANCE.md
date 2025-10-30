# 🚀 SPRINT 1: PERFORMANCE & OTIMIZAÇÃO

> **Objetivo**: Tornar o sistema rápido e responsivo  
> **Duração**: 4-6 horas  
> **Status**: 🟡 PRONTO PARA INICIAR

---

## 🎯 METAS DO SPRINT

### **Quantitativas**:
- ✅ Lighthouse Performance: **65 → 90+**
- ✅ Carregamento do mapa: **10s → 2s**
- ✅ FPS do mapa: **<20 → 60**
- ✅ Memória usada: **500MB → 200MB**

### **Qualitativas**:
- ✅ Mapa responsivo e fluido
- ✅ Filtros aplicam instantaneamente
- ✅ Sem travamentos durante navegação
- ✅ Feedback visual em todas as ações

---

## 📋 TASKS DO SPRINT

### **Task 1: Ativar Clustering no Mapa** 🔴 CRÍTICA

**Problema Atual**:
```tsx
// WebMapaCompleto.tsx - Linha 242
<MapView 
  data={data}           // 22.154 registros
  showClusters={false}  // ❌ Desativado!
/>
```

**Impacto**: Renderiza 22.154 marcadores individuais = travamento

**Solução**:
```tsx
<MapView 
  data={filteredDataForMap}  // ✅ Dados filtrados
  showClusters={true}        // ✅ Ativar clustering!
  showHeatmap={showHeatmap}
/>
```

**Implementação Completa**:

```tsx
// src/modules/WebMapaCompleto.tsx

// 1. Filtrar dados antes de passar pro mapa
const filteredDataForMap = useMemo(() => {
  const withCoords = data.filter(r => r.latitude && r.longitude);
  
  // Se tem mais de 5000, aplicar clustering server-side
  if (withCoords.length > 5000) {
    // Agrupar por grid para reduzir marcadores iniciais
    return clusterDataByGrid(withCoords, 0.01); // ~1km de grid
  }
  
  return withCoords;
}, [data]);

// 2. Função de clustering simples por grid
function clusterDataByGrid(data: OvitrapData[], gridSize: number) {
  const grid = new Map<string, OvitrapData[]>();
  
  data.forEach(point => {
    const lat = Math.floor(point.latitude / gridSize) * gridSize;
    const lng = Math.floor(point.longitude / gridSize) * gridSize;
    const key = `${lat},${lng}`;
    
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key)!.push(point);
  });
  
  // Retornar centróides dos clusters
  return Array.from(grid.values()).map(cluster => {
    const totalOvos = cluster.reduce((sum, p) => sum + p.quantidade_ovos, 0);
    return {
      ...cluster[0],
      quantidade_ovos: totalOvos,
      _cluster: true,
      _count: cluster.length,
    };
  });
}

// 3. No JSX
<MapView 
  data={filteredDataForMap}
  showClusters={true}  // ✅
  showHeatmap={showHeatmap}
/>
```

**Resultado Esperado**:
- Renderiza ~500 clusters ao invés de 22k marcadores
- Carregamento: 10s → 2s
- FPS: 20 → 60

**Tempo**: 1-2h

---

### **Task 2: Memoizar Componentes Pesados** 🔴 CRÍTICA

**Problema**: Componentes re-renderizam desnecessariamente

**Solução**: Usar `React.memo` e `useMemo`/`useCallback`

**Arquivos a Otimizar**:

#### **2.1: FilterPanel**
```tsx
// src/shared/components/FilterPanel.tsx

// ❌ ANTES
export function FilterPanel({ ... }) {
  // renderiza a cada mudança de parent
}

// ✅ DEPOIS
export const FilterPanel = React.memo(function FilterPanel({ ... }) {
  // só renderiza quando props mudam
  
  // Memoizar handlers
  const handleYearChange = useCallback((year: string) => {
    setFilters({ ...filters, year });
  }, [filters, setFilters]);
  
  return (
    // JSX
  );
});
```

#### **2.2: IndicadorCard**
```tsx
// src/shared/components/IndicadorCard.tsx

export const IndicadorCard = React.memo(function IndicadorCard({
  title,
  value,
  icon,
  trend,
  color
}) {
  // Não re-renderiza se props não mudarem
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
});
```

#### **2.3: InteractiveLineChart e InteractiveBarChart**
```tsx
// src/shared/components/charts/InteractiveLineChart.tsx

export const InteractiveLineChart = React.memo(function InteractiveLineChart({
  data,
  lines,
  ...props
}) {
  // Memoizar dados processados
  const processedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      // transformações
    }));
  }, [data]);
  
  return (
    <ResponsiveContainer>
      <LineChart data={processedData}>
        {/* JSX */}
      </LineChart>
    </ResponsiveContainer>
  );
});
```

**Resultado Esperado**:
- Redução de 70% em re-renders
- Navegação mais fluida
- Memória estável

**Tempo**: 1-2h

---

### **Task 3: Otimizar React Query** 🔴 CRÍTICA

**Problema**: Dados carregam 2x (duplicados)

**Causa**: React Query refetch agressivo + StrictMode

**Solução**: Configurar React Query corretamente

```tsx
// src/shared/providers/QueryProvider.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Evitar refetch desnecessários
      refetchOnWindowFocus: false,  // ✅ Não refetch ao focar janela
      refetchOnMount: false,         // ✅ Não refetch ao montar (se tem cache)
      refetchOnReconnect: false,     // ✅ Não refetch ao reconectar
      
      // Tempo de cache
      staleTime: 5 * 60 * 1000,      // ✅ Dados frescos por 5 min
      cacheTime: 10 * 60 * 1000,     // ✅ Cache persiste 10 min
      
      // Retry
      retry: 1,                       // ✅ Só 1 retry (não 3)
      retryDelay: 1000,               // ✅ 1s entre retries
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Hook Otimizado**:
```tsx
// src/shared/hooks/useOvitrapData.ts

export function useOvitrapData() {
  return useQuery({
    queryKey: ['ovitrap-data'],
    queryFn: loadCSVData,
    
    // Configurações específicas (sobrescreve default)
    staleTime: 10 * 60 * 1000,  // 10 min (dados mudam pouco)
    gcTime: 30 * 60 * 1000,     // 30 min (cache mais longo)
    
    // Transformação dos dados
    select: (data) => {
      // Ordenar/processar uma vez
      return data.sort((a, b) => b.ano - a.ano);
    },
  });
}
```

**Resultado Esperado**:
- CSV carrega apenas 1x
- Navegação usa cache (instantânea)
- Memória otimizada

**Tempo**: 30min

---

### **Task 4: Throttle/Debounce em Filtros** 🟡 MÉDIA

**Problema**: Filtros aplicam a cada keystroke (pesado)

**Solução**: Debounce de 300ms

```tsx
// src/shared/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Uso em FilterPanel**:
```tsx
// src/shared/components/FilterPanel.tsx

export function FilterPanel() {
  const [localFilters, setLocalFilters] = useState(filters);
  const debouncedFilters = useDebounce(localFilters, 300);
  
  // Aplicar filtros debounced
  useEffect(() => {
    setFilters(debouncedFilters);
  }, [debouncedFilters, setFilters]);
  
  return (
    <div>
      <input
        value={localFilters.search}
        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
        // ✅ Digita livremente, aplica após 300ms
      />
    </div>
  );
}
```

**Resultado Esperado**:
- Filtros não travam ao digitar
- CPU mais livre
- UX mais fluida

**Tempo**: 30min

---

### **Task 5: Lazy Loading de Componentes Pesados** 🟡 MÉDIA

**Problema**: Recharts carrega mesmo em módulos sem gráficos

**Solução**: Lazy load condicionalmente

```tsx
// src/modules/DashboardCompleto.tsx

import { lazy, Suspense } from 'react';

// Lazy load gráficos
const InteractiveLineChart = lazy(() => 
  import('../shared/components/charts/InteractiveLineChart')
    .then(m => ({ default: m.InteractiveLineChart }))
);

export function DashboardCompleto() {
  const [showCharts, setShowCharts] = useState(false);
  
  return (
    <div>
      {/* Mostrar gráficos só quando necessário */}
      {showCharts && (
        <Suspense fallback={<div>Carregando gráfico...</div>}>
          <InteractiveLineChart data={data} />
        </Suspense>
      )}
    </div>
  );
}
```

**Resultado Esperado**:
- Bundle inicial menor
- Carregamento mais rápido
- Recharts só carrega quando usar gráficos

**Tempo**: 1h

---

### **Task 6: Virtualização de Listas Longas** 🟡 MÉDIA

**Problema**: Tabelas com 100+ linhas renderizam todas de uma vez

**Solução**: Usar `react-window` ou `@tanstack/react-virtual`

```bash
npm install @tanstack/react-virtual
```

**Exemplo: Tabela de Bairros**:
```tsx
// src/modules/VigilanciaEntomologica.tsx

import { useVirtualizer } from '@tanstack/react-virtual';

export function VigilanciaEntomologica() {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: neighborhoodData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // altura estimada da linha
    overscan: 5, // renderizar 5 linhas extras (scroll suave)
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const bairro = neighborhoodData[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* Conteúdo da linha */}
              <div>{bairro.name} - {bairro.ipo}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Resultado Esperado**:
- Renderiza apenas linhas visíveis (~20)
- Scroll suave mesmo com 1000+ linhas
- Memória reduzida

**Tempo**: 1-2h

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

### **Ordem Recomendada**:

1. ⬜ **Task 3**: React Query (30min) - Rápido e alto impacto
2. ⬜ **Task 1**: Clustering Mapa (2h) - Crítico
3. ⬜ **Task 2**: Memoização (2h) - Fundação
4. ⬜ **Task 4**: Debounce (30min) - Polimento
5. ⬜ **Task 5**: Lazy Loading (1h) - Opcional
6. ⬜ **Task 6**: Virtualização (2h) - Opcional

### **Total Mínimo** (Tasks 1-4): **5h**
### **Total Completo** (Tasks 1-6): **8.5h**

---

## 🧪 TESTES DE VALIDAÇÃO

### **Antes de Considerar Completo**:

1. ⬜ **Performance**:
   - Lighthouse Performance: 90+
   - FCP < 1s
   - LCP < 2.5s
   - TTI < 3s

2. ⬜ **Mapa**:
   - Carrega em < 2s
   - FPS 60 ao arrastar
   - Zoom suave
   - Filtros instantâneos

3. ⬜ **Geral**:
   - Navegação fluida entre rotas
   - Sem travamentos
   - Memória estável (<300MB)
   - Console sem erros

---

## 📈 MÉTRICAS DE SUCESSO

### **Performance** (Lighthouse):
- ❌ Antes: 65/100
- ✅ Depois: 90+/100

### **Carregamento do Mapa**:
- ❌ Antes: 10s
- ✅ Depois: 2s

### **FPS do Mapa**:
- ❌ Antes: <20 fps
- ✅ Depois: 60 fps

### **Memória**:
- ❌ Antes: 500MB
- ✅ Depois: 200MB

---

## 🎯 PRÓXIMOS PASSOS APÓS SPRINT 1

Após completar Sprint 1:
1. ✅ Validar melhorias com métricas
2. ✅ Commit e documentar mudanças
3. ➡️ Avançar para **Sprint 2: Code Quality**

---

**Pronto para começar?** 🚀

**Vamos implementar task por task, começando pela Task 3 (React Query)?**
