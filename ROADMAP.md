# 🗺️ ROADMAP COMPLETO - SIVEPI V2

> **Guia Master Detalhado** - Construção Fase a Fase

---

## 📊 VISÃO GERAL

**Duração Total**: 5 semanas (25 dias úteis)  
**Fases**: 16 fases sequenciais  
**Arquivos Totais**: ~120 arquivos TypeScript

---

## ✅ PRÉ-REQUISITOS (VALIDAR ANTES DE COMEÇAR)

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm 9+ instalado (`npm --version`)
- [ ] Git configurado
- [ ] Editor VSCode instalado
- [ ] Extensões VSCode: ESLint, Prettier, Tailwind IntelliSense
- [ ] Token Mapbox criado (https://account.mapbox.com)
- [ ] CSV de dados disponível em `01 - Dados/`

---

## 🚀 FASE 1: SETUP INICIAL (Dia 1)

### ✅ 1.1 - Arquivos de Configuração

**Status**: ✅ **COMPLETO** (já criados)

**Arquivos**:
- [x] `package.json`
- [x] `tsconfig.json`
- [x] `tsconfig.node.json`
- [x] `vite.config.ts`
- [x] `tailwind.config.js`
- [x] `postcss.config.js`
- [x] `.eslintrc.cjs`
- [x] `.gitignore`
- [x] `index.html`

### ✅ 1.2 - Instalação de Dependências

```bash
npm install
```

**Validação**: `node_modules/` criado com ~500MB

### ✅ 1.3 - Estrutura de Pastas

Criar manualmente:

```
src/
├── app/
├── features/
│   ├── webmapa/
│   ├── panorama/
│   ├── vigilancia/
│   ├── resposta/
│   └── dashboard/
├── shared/
│   ├── components/ui/
│   ├── components/layout/
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   └── utils/
└── styles/

public/
└── data/
```

### ✅ 1.4 - Mover CSV para public/

```bash
# Copiar CSV
copy "01 - Dados\banco_dados_aedes_montes_claros_normalizado.csv" "public\data\banco_dados_aedes.csv"
```

### ✅ 1.5 - Arquivos Base da Aplicação

**Criar em sequência**:

#### `src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### `src/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

#### `src/app/App.tsx`
```typescript
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-primary text-white p-4">
        <h1 className="text-2xl font-bold">SIVEPI V2</h1>
      </header>
      <main className="p-8">
        <h2>Sistema funcionando! ✅</h2>
      </main>
    </div>
  );
}

export default App;
```

### ✅ 1.6 - Testar Aplicação

```bash
npm run dev
```

**Validação**: 
- Navegador abre em http://localhost:5173
- Página mostra "SIVEPI V2" e "Sistema funcionando! ✅"
- Console sem erros

---

## 🎨 FASE 2: DESIGN SYSTEM (Dias 2-3)

### 📝 2.1 - Types Base

#### `src/shared/types/index.ts`
```typescript
export interface OvitrapData {
  id_registro: number;
  id_ovitrampa: number;
  data_coleta: string;
  quantidade_ovos: number;
  ano: number;
  mes_numero: number;
  mes_nome: string;
  semana_epidemiologica: number;
  bairro: string;
  municipio: string;
  latitude: number;
  longitude: number;
  status_qualidade: string;
}

export interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  label: string;
}

export type Theme = 'light' | 'dark';
```

### 📝 2.2 - Design Tokens

#### `src/shared/styles/tokens.ts`
```typescript
export const colors = {
  brand: {
    primary: '#0087A8',
    secondary: '#262832',
  },
  risk: {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};
```

### 📝 2.3 - Componentes UI Base

#### `src/shared/components/ui/Button.tsx`
```typescript
import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-colors',
        {
          'bg-brand-primary text-white hover:bg-brand-primary/90': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'hover:bg-gray-100': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### `src/shared/components/ui/Card.tsx`
```typescript
import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md border border-gray-200',
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 📝 2.4 - Export de Componentes

#### `src/shared/components/ui/index.ts`
```typescript
export { Button } from './Button';
export { Card } from './Card';
```

### ✅ 2.5 - Testar Design System

Atualizar `src/app/App.tsx`:

```typescript
import { Button, Card } from '@/shared/components/ui';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Design System</h1>
        <div className="space-x-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Card>
    </div>
  );
}
```

**Validação**: Botões aparecem estilizados corretamente

---

## 📊 FASE 3: DATA LAYER (Dias 4-5)

### 📝 3.1 - Service de Carregamento de CSV

#### `src/shared/services/csvService.ts`
```typescript
import Papa from 'papaparse';
import type { OvitrapData } from '@/shared/types';

export async function loadCSVData(): Promise<OvitrapData[]> {
  const response = await fetch('/data/banco_dados_aedes.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<OvitrapData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validData = results.data.filter(
          (item) => item.latitude && item.longitude && item.quantidade_ovos >= 0
        );
        resolve(validData);
      },
      error: (error) => reject(error),
    });
  });
}
```

### 📝 3.2 - Zustand Store Global

#### `src/shared/stores/dataStore.ts`
```typescript
import { create } from 'zustand';
import type { OvitrapData } from '@/shared/types';

interface DataStore {
  data: OvitrapData[];
  loading: boolean;
  error: string | null;
  setData: (data: OvitrapData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  loading: false,
  error: null,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
```

### 📝 3.3 - React Query Setup

#### `src/app/providers/QueryProvider.tsx`
```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000,
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

### 📝 3.4 - Hook de Dados

#### `src/shared/hooks/useOvitrapData.ts`
```typescript
import { useQuery } from '@tanstack/react-query';
import { loadCSVData } from '@/shared/services/csvService';

export function useOvitrapData() {
  return useQuery({
    queryKey: ['ovitrap-data'],
    queryFn: loadCSVData,
    staleTime: 5 * 60 * 1000,
  });
}
```

### ✅ 3.5 - Integrar Data Layer

Atualizar `src/app/App.tsx`:

```typescript
import { QueryProvider } from './providers/QueryProvider';
import { useOvitrapData } from '@/shared/hooks/useOvitrapData';

function DataDisplay() {
  const { data, isLoading, error } = useOvitrapData();

  if (isLoading) return <div>Carregando dados...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h2>Dados Carregados: {data?.length} registros</h2>
    </div>
  );
}

function App() {
  return (
    <QueryProvider>
      <div className="p-8">
        <DataDisplay />
      </div>
    </QueryProvider>
  );
}
```

**Validação**: Página mostra "Dados Carregados: 22156 registros"

---

## 🗺️ FASE 4: ROUTING (Dia 6)

### 📝 4.1 - Router Setup

#### `src/app/Router.tsx`
```typescript
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <div>Dashboard</div>,
      },
      {
        path: 'webmapa',
        element: <div>WebMapa</div>,
      },
      {
        path: 'panorama',
        element: <div>Panorama</div>,
      },
      {
        path: 'vigilancia',
        element: <div>Vigilância</div>,
      },
      {
        path: 'resposta',
        element: <div>Resposta</div>,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
```

### 📝 4.2 - Layout Component

#### `src/app/Layout.tsx`
```typescript
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Map, BarChart3, Bug, Shield, Home } from 'lucide-react';

export default function Layout() {
  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'WebMapa', path: '/webmapa', icon: Map },
    { name: 'Panorama', path: '/panorama', icon: BarChart3 },
    { name: 'Vigilância', path: '/vigilancia', icon: Bug },
    { name: 'Resposta', path: '/resposta', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-brand-secondary text-white p-4">
        <h1 className="text-xl font-bold mb-8">SIVEPI V2</h1>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded hover:bg-white/10"
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
```

### ✅ 4.3 - Integrar Router

```typescript
// src/app/App.tsx
import { Router } from './Router';

function App() {
  return <Router />;
}
```

---

## 📍 CHECKLIST POR DIA

### **Dia 1**: FASE 1 Completa
- [ ] Configurações criadas
- [ ] npm install executado
- [ ] App rodando em localhost:5173

### **Dia 2-3**: FASE 2 Completa
- [ ] Types criados
- [ ] Button e Card funcionando
- [ ] Design testado visualmente

### **Dia 4-5**: FASE 3 Completa
- [ ] CSV carregando
- [ ] 22k+ registros aparecendo
- [ ] React Query funcionando

### **Dia 6**: FASE 4 Completa
- [ ] Rotas funcionando
- [ ] Sidebar navegável
- [ ] Layout responsivo

---

## 📌 PRÓXIMAS FASES (RESUMO)

- **FASE 5-8**: Features principais (WebMapa, Panorama, Vigilância, Resposta)
- **FASE 9**: Otimizações (code splitting, lazy loading)
- **FASE 10**: Testes unitários e integração
- **FASE 11**: Documentação completa
- **FASE 12-16**: Features avançadas (Dashboard, IA, PWA)

---

## 🎯 STATUS ATUAL

✅ **FASE 1**: COMPLETA  
🔄 **FASE 2**: EM ANDAMENTO  
⏳ **FASE 3-16**: PENDENTE

---

**Última atualização**: 2025-10-29
