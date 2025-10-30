# 🏗️ ARQUITETURA TÉCNICA - SIVEPI V2

> **Documentação Completa** da arquitetura do sistema

---

## 📊 VISÃO GERAL

### Stack Tecnológica

```
┌─────────────────────────────────────┐
│  Frontend: React 18 + TypeScript    │
│  ├─ Build: Vite 5                   │
│  ├─ Styling: TailwindCSS 3          │
│  ├─ State: Zustand                  │
│  ├─ Data: TanStack Query            │
│  ├─ Router: React Router v6         │
│  └─ UI: Lucide React + Recharts     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  WebGIS: Mapbox GL JS 3             │
│  ├─ Rendering: WebGL                │
│  ├─ Tiles: Vector Tiles             │
│  └─ Wrapper: react-map-gl           │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Data: CSV → JSON                   │
│  ├─ Parser: PapaParse               │
│  ├─ Volume: 22k+ registros          │
│  └─ Cache: TanStack Query (5min)    │
└─────────────────────────────────────┘
```

---

## 📁 ESTRUTURA DE PASTAS DETALHADA

```
sivepi-v2/
│
├── public/                          # Assets estáticos
│   ├── data/
│   │   └── banco_dados_aedes.csv    # Database CSV (4MB)
│   └── favicon.ico
│
├── src/
│   ├── app/                         # Aplicação principal
│   │   ├── App.tsx                  # Root component
│   │   ├── Router.tsx               # Configuração de rotas
│   │   ├── Layout.tsx               # Layout wrapper
│   │   └── providers/
│   │       └── QueryProvider.tsx    # React Query provider
│   │
│   ├── features/                    # Features modulares
│   │   │
│   │   ├── webmapa/                 # 🗺️ PILAR 1: WebMapa
│   │   │   ├── WebMapaPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── MapView.tsx
│   │   │   │   ├── MarkerCluster.tsx
│   │   │   │   ├── HeatmapLayer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMapState.ts
│   │   │   │   ├── useClusterData.ts
│   │   │   │   └── useHeatmapConfig.ts
│   │   │   ├── config/
│   │   │   │   └── mapConfig.ts
│   │   │   └── utils/
│   │   │       └── geoUtils.ts
│   │   │
│   │   ├── panorama/                # 📊 PILAR 2: Panorama Executivo
│   │   │   ├── PanoramaPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ExecutiveSummary.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── TimeSeriesChart.tsx
│   │   │   │   └── DistributionChart.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useStatistics.ts
│   │   │   │   └── useChartData.ts
│   │   │   └── utils/
│   │   │       └── calculations.ts
│   │   │
│   │   ├── vigilancia/              # 🦟 PILAR 3: Vigilância
│   │   │   ├── VigilanciaPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── IPOCard.tsx
│   │   │   │   ├── RiskTable.tsx
│   │   │   │   └── AlertPanel.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useIPOCalculation.ts
│   │   │   └── utils/
│   │   │       └── ipoCalculator.ts
│   │   │
│   │   ├── resposta/                # 🛡️ PILAR 4: Resposta Operacional
│   │   │   ├── RespostaPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── TeamCard.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   └── InventoryTable.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useTeamManagement.ts
│   │   │   └── stores/
│   │   │       └── teamStore.ts
│   │   │
│   │   └── dashboard/               # 📈 PILAR 5: Dashboard Consolidado
│   │       ├── DashboardPage.tsx
│   │       ├── components/
│   │       │   ├── QuickStats.tsx
│   │       │   ├── AlertsFeed.tsx
│   │       │   └── ModuleCards.tsx
│   │       └── hooks/
│   │           └── useConsolidatedData.ts
│   │
│   ├── shared/                      # Código compartilhado
│   │   │
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── ui/                  # UI primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Alert.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── layout/              # Layout components
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── Container.tsx
│   │   │
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useOvitrapData.ts    # Hook principal de dados
│   │   │   ├── useTheme.ts          # Dark/Light mode
│   │   │   ├── useLocalStorage.ts   # Persistência local
│   │   │   └── useDebounce.ts       # Debounce utility
│   │   │
│   │   ├── stores/                  # Zustand stores
│   │   │   ├── dataStore.ts         # Store de dados global
│   │   │   ├── themeStore.ts        # Store de tema
│   │   │   └── uiStore.ts           # Store de UI state
│   │   │
│   │   ├── services/                # Services externos
│   │   │   ├── dataService.ts       # CSV loading
│   │   │   └── apiService.ts        # API calls (futuro)
│   │   │
│   │   ├── types/                   # TypeScript types
│   │   │   ├── index.ts             # Types principais
│   │   │   ├── ovitrap.types.ts     # Types de ovitrampas
│   │   │   └── chart.types.ts       # Types de gráficos
│   │   │
│   │   └── utils/                   # Utilities
│   │       ├── dates.ts             # Date helpers
│   │       ├── format.ts            # Formatters
│   │       ├── validation.ts        # Validators
│   │       └── cn.ts                # ClassNames utility
│   │
│   ├── styles/
│   │   └── globals.css              # Estilos globais + Tailwind
│   │
│   └── main.tsx                     # Entry point
│
├── tests/                           # Testes (futuro)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                            # Documentação adicional
│
├── .env.example                     # Variáveis de ambiente exemplo
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔄 FLUXO DE DADOS

### 1. Carregamento Inicial

```
User Access
    ↓
index.html loads
    ↓
main.tsx bootstraps React
    ↓
App.tsx renders
    ↓
QueryProvider initializes
    ↓
Router resolves route
    ↓
Feature Page loads
    ↓
useOvitrapData() hook
    ↓
TanStack Query checks cache
    ↓
If not cached:
    ↓
csvService.loadCSVData()
    ↓
fetch('/data/banco_dados_aedes.csv')
    ↓
PapaParse processes
    ↓
Data validated & typed
    ↓
Cached for 5 minutes
    ↓
Returns OvitrapData[]
    ↓
Component receives data
    ↓
UI renders
```

### 2. Navegação Entre Páginas

```
User clicks navigation
    ↓
React Router intercepts
    ↓
Route matches
    ↓
Lazy load component (if needed)
    ↓
Component mounts
    ↓
Hooks execute
    ↓
Data from cache (if available)
    ↓
UI renders instantly
```

### 3. Filtros e Interações

```
User applies filter
    ↓
useState updates
    ↓
useMemo recalculates
    ↓
Filtered data computed
    ↓
UI re-renders with new data
    ↓
No API call (client-side filtering)
```

---

## 🎨 DESIGN PATTERNS

### 1. Feature-Based Structure

Cada feature é **auto-contida**:
- Components próprios
- Hooks próprios
- Stores próprios (se necessário)
- Utils próprios

**Benefício**: Fácil manutenção e remoção de features

### 2. Colocation

Código relacionado fica **junto**:
```
webmapa/
├── WebMapaPage.tsx          ← Entry point
├── components/              ← UI do WebMapa
├── hooks/                   ← Lógica do WebMapa
└── utils/                   ← Helpers do WebMapa
```

### 3. Container/Presentational Pattern

```typescript
// Container (lógica)
function WebMapaContainer() {
  const { data, isLoading } = useOvitrapData();
  const clusters = useClusterData(data);
  
  return <WebMapaView data={clusters} loading={isLoading} />;
}

// Presentational (UI)
function WebMapaView({ data, loading }) {
  return <Map>{/* render */}</Map>;
}
```

### 4. Custom Hooks para Lógica Reutilizável

```typescript
// Hook que encapsula lógica complexa
function useIPOCalculation(data: OvitrapData[]) {
  return useMemo(() => {
    const positive = data.filter(d => d.quantidade_ovos > 0);
    const ipoPercentage = (positive.length / data.length) * 100;
    return { ipoPercentage, riskLevel: getRiskLevel(ipoPercentage) };
  }, [data]);
}
```

---

## 🚀 PERFORMANCE STRATEGIES

### 1. Code Splitting

```typescript
// Lazy loading automático por rota
const WebMapaPage = lazy(() => import('@/features/webmapa/WebMapaPage'));
```

**Resultado**: 
- Bundle inicial: ~200KB
- Cada feature: ~50-100KB carregado sob demanda

### 2. React Query Caching

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 min cache
      cacheTime: 10 * 60 * 1000, // 10 min memória
    },
  },
});
```

**Benefício**: CSV carregado 1x, cached para todas as páginas

### 3. useMemo para Cálculos Pesados

```typescript
const statistics = useMemo(() => {
  return calculateComplexStats(data); // Só recalcula se data mudar
}, [data]);
```

### 4. Virtual Scrolling (futuro)

Para listas com 1000+ items:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## 🔐 TYPE SAFETY

### Principais Types

```typescript
// src/shared/types/index.ts

export interface OvitrapData {
  id_registro: number;
  id_ovitrampa: number;
  data_coleta: string;
  quantidade_ovos: number;
  ano: number;
  mes_numero: number;
  semana_epidemiologica: number;
  bairro: string;
  latitude: number;
  longitude: number;
  status_qualidade: 'OK' | 'ALERTA' | 'CRITICO';
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Statistics {
  total: number;
  avgOvos: number;
  ipoPercentage: number;
  riskLevel: RiskLevel;
}
```

**Benefício**: Autocomplete, type checking, refactoring seguro

---

## 📦 DEPENDENCIES EXPLICADAS

### Produção

| Package | Versão | Propósito |
|---------|--------|-----------|
| `react` | 18.2.0 | Framework UI |
| `react-router-dom` | 6.20.0 | Navegação |
| `zustand` | 4.4.7 | State management |
| `@tanstack/react-query` | 5.14.2 | Data fetching + cache |
| `recharts` | 2.10.3 | Gráficos |
| `lucide-react` | 0.294.0 | Ícones |
| `papaparse` | 5.4.1 | CSV parser |
| `clsx` | 2.0.0 | Conditional classNames |

### Desenvolvimento

| Package | Versão | Propósito |
|---------|--------|-----------|
| `vite` | 5.0.8 | Build tool (10x mais rápido) |
| `typescript` | 5.3.3 | Type safety |
| `tailwindcss` | 3.3.6 | CSS utility-first |
| `@vitejs/plugin-react-swc` | 3.5.0 | React Fast Refresh |

---

## 🎯 DECISÕES TÉCNICAS CHAVE

### Por que Vite?
- ✅ 10x mais rápido que Webpack
- ✅ Hot reload em <50ms
- ✅ Build otimizado automático
- ✅ ESM nativo

### Por que Zustand?
- ✅ Mais simples que Redux
- ✅ Performance excelente
- ✅ TypeScript first-class
- ✅ Sem boilerplate

### Por que TanStack Query?
- ✅ Cache automático inteligente
- ✅ Background refetching
- ✅ Stale-while-revalidate
- ✅ DevTools excelente

### Por que TailwindCSS?
- ✅ Produtividade alta
- ✅ Bundle size pequeno
- ✅ Design consistente
- ✅ Responsive fácil

---

## 🔄 PRÓXIMAS EVOLUÇÕES

### Fase Backend (futuro)

```
Frontend (React)
    ↓
API REST (Express/FastAPI)
    ↓
PostgreSQL + PostGIS
    ↓
Cache (Redis)
```

### Fase Real-time (futuro)

```
WebSocket Server
    ↓
React useEffect subscribe
    ↓
Auto-update UI
```

---

**Arquitetura projetada para**: Escalabilidade, Manutenibilidade, Performance
