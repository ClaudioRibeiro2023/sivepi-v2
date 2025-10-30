# 🛠️ GUIA DE IMPLEMENTAÇÃO DETALHADO

## FASES 5-16: FEATURES E OTIMIZAÇÕES

---

## 🗺️ FASE 5: WEBMAPA (Dias 7-8)

### Objetivo
Implementar WebGIS completo com Mapbox GL

### 5.1 - Setup Mapbox

#### `.env.local`
```env
VITE_MAPBOX_TOKEN=pk.seu_token_aqui
```

#### `src/features/webmapa/config/mapConfig.ts`
```typescript
export const MAP_CONFIG = {
  center: [-43.8644, -16.7273] as [number, number], // Montes Claros
  zoom: 12,
  style: 'mapbox://styles/mapbox/streets-v12',
};
```

### 5.2 - Componente Principal

#### `src/features/webmapa/WebMapaPage.tsx`
```typescript
import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useOvitrapData } from '@/shared/hooks/useOvitrapData';
import { MAP_CONFIG } from './config/mapConfig';

export function WebMapaPage() {
  const { data, isLoading } = useOvitrapData();
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  if (isLoading) return <div>Carregando mapa...</div>;

  return (
    <div className="h-screen w-full">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: MAP_CONFIG.center[0],
          latitude: MAP_CONFIG.center[1],
          zoom: MAP_CONFIG.zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_CONFIG.style}
      >
        {data?.map((item) => (
          <Marker
            key={item.id_registro}
            longitude={item.longitude}
            latitude={item.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker(item);
            }}
          />
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            onClose={() => setSelectedMarker(null)}
          >
            <div>
              <h3>Ovitrampa {selectedMarker.id_ovitrampa}</h3>
              <p>Ovos: {selectedMarker.quantidade_ovos}</p>
              <p>Bairro: {selectedMarker.bairro}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
```

### 5.3 - Clustering (Avançado)

#### `src/features/webmapa/hooks/useClusterData.ts`
```typescript
import { useMemo } from 'react';
import type { OvitrapData } from '@/shared/types';

interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  totalEggs: number;
}

export function useClusterData(data: OvitrapData[], zoom: number) {
  return useMemo(() => {
    if (zoom > 14) return null; // Sem cluster em zoom alto

    // Agrupar por proximidade (simplificado)
    const gridSize = 0.01; // ~1km
    const clusters = new Map<string, Cluster>();

    data.forEach((item) => {
      const lat = Math.floor(item.latitude / gridSize) * gridSize;
      const lng = Math.floor(item.longitude / gridSize) * gridSize;
      const key = `${lat},${lng}`;

      const existing = clusters.get(key);
      if (existing) {
        existing.count++;
        existing.totalEggs += item.quantidade_ovos;
      } else {
        clusters.set(key, {
          id: key,
          latitude: lat,
          longitude: lng,
          count: 1,
          totalEggs: item.quantidade_ovos,
        });
      }
    });

    return Array.from(clusters.values());
  }, [data, zoom]);
}
```

### ✅ Validação Fase 5
- [ ] Mapa renderiza sem erros
- [ ] Markers aparecem nas coordenadas corretas
- [ ] Popup funciona ao clicar
- [ ] Performance: <100ms para renderizar 500+ markers

---

## 📊 FASE 6: PANORAMA EXECUTIVO (Dias 9-10)

### 6.1 - Estrutura de Componentes

```
panorama/
├── PanoramaPage.tsx
├── components/
│   ├── ExecutiveSummary.tsx
│   ├── ChartSection.tsx
│   └── StatCard.tsx
├── hooks/
│   └── useStatistics.ts
└── utils/
    └── calculations.ts
```

### 6.2 - Hook de Estatísticas

#### `src/features/panorama/hooks/useStatistics.ts`
```typescript
import { useMemo } from 'react';
import type { OvitrapData } from '@/shared/types';

export function useStatistics(data: OvitrapData[]) {
  return useMemo(() => {
    const total = data.length;
    const totalOvos = data.reduce((acc, item) => acc + item.quantidade_ovos, 0);
    const avgOvos = totalOvos / total;

    const positivas = data.filter((item) => item.quantidade_ovos > 0).length;
    const ipoPercentage = (positivas / total) * 100;

    const bairros = [...new Set(data.map((item) => item.bairro))];

    return {
      total,
      totalOvos,
      avgOvos,
      positivas,
      ipoPercentage,
      totalBairros: bairros.length,
    };
  }, [data]);
}
```

### 6.3 - Componente Principal

#### `src/features/panorama/PanoramaPage.tsx`
```typescript
import React from 'react';
import { useOvitrapData } from '@/shared/hooks/useOvitrapData';
import { useStatistics } from './hooks/useStatistics';
import { Card } from '@/shared/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function PanoramaPage() {
  const { data, isLoading } = useOvitrapData();
  const stats = useStatistics(data || []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panorama Executivo</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <h3 className="text-gray-500">Total Ovitrampas</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500">Total Ovos</h3>
          <p className="text-3xl font-bold">{stats.totalOvos.toLocaleString()}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500">Média Ovos</h3>
          <p className="text-3xl font-bold">{stats.avgOvos.toFixed(1)}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500">IPO</h3>
          <p className="text-3xl font-bold">{stats.ipoPercentage.toFixed(1)}%</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Distribuição por Semana</h2>
        <BarChart width={800} height={300} data={data.slice(0, 10)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semana_epidemiologica" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantidade_ovos" fill="#0087A8" />
        </BarChart>
      </Card>
    </div>
  );
}
```

---

## 🦟 FASE 7: VIGILÂNCIA ENTOMOLÓGICA (Dias 11-12)

### 7.1 - Cálculo de IPO

#### `src/features/vigilancia/utils/ipoCalculator.ts`
```typescript
import type { OvitrapData } from '@/shared/types';

export function calculateIPO(data: OvitrapData[]) {
  const totalOvitrampas = data.length;
  const positivas = data.filter((item) => item.quantidade_ovos > 0).length;
  
  const ipoPercentage = (positivas / totalOvitrampas) * 100;
  
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (ipoPercentage < 1) riskLevel = 'low';
  else if (ipoPercentage < 5) riskLevel = 'medium';
  else if (ipoPercentage < 10) riskLevel = 'high';
  else riskLevel = 'critical';

  return {
    totalOvitrampas,
    positivas,
    negativas: totalOvitrampas - positivas,
    ipoPercentage,
    riskLevel,
  };
}
```

### 7.2 - Página Principal

#### `src/features/vigilancia/VigilanciaPage.tsx`
```typescript
import React from 'react';
import { useOvitrapData } from '@/shared/hooks/useOvitrapData';
import { calculateIPO } from './utils/ipoCalculator';
import { Card } from '@/shared/components/ui';
import { AlertTriangle } from 'lucide-react';

export function VigilanciaPage() {
  const { data, isLoading } = useOvitrapData();

  if (isLoading) return <div>Carregando...</div>;

  const ipo = calculateIPO(data || []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Vigilância Entomológica</h1>

      <Card className="bg-risk-high/10 border-risk-high">
        <div className="flex items-center gap-4">
          <AlertTriangle className="text-risk-high" size={40} />
          <div>
            <h2 className="text-2xl font-bold">IPO: {ipo.ipoPercentage.toFixed(2)}%</h2>
            <p className="text-gray-600">
              Nível de Risco: <span className="font-bold">{ipo.riskLevel.toUpperCase()}</span>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h3>Total de Ovitrampas</h3>
          <p className="text-3xl font-bold">{ipo.totalOvitrampas}</p>
        </Card>
        <Card>
          <h3>Positivas</h3>
          <p className="text-3xl font-bold text-risk-high">{ipo.positivas}</p>
        </Card>
        <Card>
          <h3>Negativas</h3>
          <p className="text-3xl font-bold text-risk-low">{ipo.negativas}</p>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🛡️ FASE 8: RESPOSTA OPERACIONAL (Dias 13-14)

### 8.1 - Store de Equipes

#### `src/features/resposta/stores/teamStore.ts`
```typescript
import { create } from 'zustand';

interface Team {
  id: string;
  name: string;
  members: number;
  area: string;
  status: 'available' | 'busy' | 'offline';
}

interface TeamStore {
  teams: Team[];
  addTeam: (team: Team) => void;
  updateTeamStatus: (id: string, status: Team['status']) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  updateTeamStatus: (id, status) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
}));
```

### 8.2 - Página de Despacho

#### `src/features/resposta/RespostaPage.tsx`
```typescript
import React, { useState } from 'react';
import { useTeamStore } from './stores/teamStore';
import { Card, Button } from '@/shared/components/ui';
import { Users, Plus } from 'lucide-react';

export function RespostaPage() {
  const { teams, addTeam } = useTeamStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resposta Operacional</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} /> Nova Equipe
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} />
              <h3 className="font-bold">{team.name}</h3>
            </div>
            <p className="text-sm text-gray-600">Membros: {team.members}</p>
            <p className="text-sm text-gray-600">Área: {team.area}</p>
            <span
              className={`inline-block mt-2 px-2 py-1 rounded text-sm ${
                team.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
              }`}
            >
              {team.status}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## ⚡ FASE 9: OTIMIZAÇÕES (Dia 15)

### 9.1 - Lazy Loading de Rotas

#### Atualizar `src/app/Router.tsx`
```typescript
import { lazy, Suspense } from 'react';

const WebMapaPage = lazy(() => import('@/features/webmapa/WebMapaPage'));
const PanoramaPage = lazy(() => import('@/features/panorama/PanoramaPage'));
const VigilanciaPage = lazy(() => import('@/features/vigilancia/VigilanciaPage'));
const RespostaPage = lazy(() => import('@/features/resposta/RespostaPage'));

// No router:
{
  path: 'webmapa',
  element: (
    <Suspense fallback={<div>Carregando...</div>}>
      <WebMapaPage />
    </Suspense>
  ),
}
```

### 9.2 - Virtual Scrolling (se necessário)

#### `src/shared/components/VirtualList.tsx`
```typescript
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  height: number;
}

export function VirtualList<T>({ items, renderItem, height }: VirtualListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height, overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index])}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 FASE 10: TESTES (Dias 16-17)

### 10.1 - Setup Vitest

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 10.2 - Setup File

#### `src/tests/setup.ts`
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### 10.3 - Teste Exemplo

#### `src/shared/components/ui/__tests__/Button.test.tsx`
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-brand-primary');
  });
});
```

---

## 📚 CHECKLIST COMPLETO DE IMPLEMENTAÇÃO

### **Setup Inicial**
- [ ] package.json criado
- [ ] TypeScript configurado
- [ ] TailwindCSS funcionando
- [ ] npm install completo

### **Design System**
- [ ] Tokens de cores
- [ ] Button component
- [ ] Card component
- [ ] Layout responsivo

### **Data Layer**
- [ ] CSV carregando
- [ ] Zustand store funcionando
- [ ] React Query configurado
- [ ] Hook useOvitrapData testado

### **Routing**
- [ ] React Router configurado
- [ ] 5 rotas funcionando
- [ ] Sidebar navegável
- [ ] Lazy loading implementado

### **Features**
- [ ] WebMapa com markers
- [ ] Panorama com gráficos
- [ ] Vigilância com IPO
- [ ] Resposta com equipes
- [ ] Dashboard consolidado

### **Qualidade**
- [ ] ESLint sem erros
- [ ] TypeScript sem erros
- [ ] Testes unitários passando
- [ ] Performance otimizada

---

**Próximo passo**: Escolha a fase atual e siga os passos sequencialmente!
