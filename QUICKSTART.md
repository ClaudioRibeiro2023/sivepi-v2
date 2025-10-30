# ⚡ QUICKSTART - SIVEPI V2

> **Guia de Início Rápido** - Do Zero ao Primeiro npm run dev

---

## 🎯 OBJETIVO

Ter a aplicação rodando em **menos de 30 minutos**.

---

## ✅ PRÉ-REQUISITOS (5 minutos)

### Verificar Instalações

```bash
# Node.js 18+
node --version
# Deve retornar: v18.x.x ou superior

# npm 9+
npm --version
# Deve retornar: 9.x.x ou superior

# Git (opcional)
git --version
```

Se algum comando falhar, instale:
- **Node.js**: https://nodejs.org (baixar LTS)
- **Git**: https://git-scm.com

---

## 📦 PASSO 1: CRIAR ESTRUTURA BÁSICA (10 minutos)

### 1.1 - Arquivos de Configuração

Criar na raiz do projeto (`C:\Users\claud\CascadeProjects\Conta Ovos_V2\`):

**package.json**
```json
{
  "name": "sivepi-v2",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.14.2",
    "recharts": "^2.10.3",
    "lucide-react": "^0.294.0",
    "papaparse": "^5.4.1",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**tailwind.config.js**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0087A8',
          secondary: '#262832',
        },
      },
    },
  },
  plugins: [],
};
```

**postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**index.html**
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SIVEPI V2</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 1.2 - Estrutura de Pastas

Criar estas pastas:

```
src/
├── app/
├── shared/
│   ├── components/
│   │   └── ui/
│   └── types/
└── styles/

public/
└── data/
```

### 1.3 - Arquivos Base da Aplicação

**src/main.tsx**
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

**src/styles/globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**src/app/App.tsx**
```typescript
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-primary text-white p-6">
        <h1 className="text-3xl font-bold">SIVEPI V2 🦟</h1>
        <p className="text-sm mt-2">Sistema de Vigilância Epidemiológica</p>
      </header>
      <main className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Sistema Funcionando!
          </h2>
          <p className="text-gray-600">
            A aplicação está rodando corretamente. Próximo passo: implementar features.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
```

---

## 🚀 PASSO 2: INSTALAR E EXECUTAR (10 minutos)

### 2.1 - Instalar Dependências

Abrir terminal na pasta do projeto:

```bash
cd "C:\Users\claud\CascadeProjects\Conta Ovos_V2"
npm install
```

**Aguardar**: Isso pode levar 3-5 minutos.

**Validação**: Pasta `node_modules/` criada com ~500MB

### 2.2 - Executar em Desenvolvimento

```bash
npm run dev
```

**Resultado esperado**:
```
  VITE v5.0.8  ready in 489 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Validação**: 
- Navegador abre automaticamente
- Página mostra "SIVEPI V2 🦟"
- Mensagem "✅ Sistema Funcionando!" aparece

---

## 📊 PASSO 3: CARREGAR DADOS CSV (5 minutos)

### 3.1 - Copiar CSV para public/data/

```bash
copy "01 - Dados\banco_dados_aedes_montes_claros_normalizado.csv" "public\data\banco_dados_aedes.csv"
```

### 3.2 - Criar Types

**src/shared/types/index.ts**
```typescript
export interface OvitrapData {
  id_registro: number;
  id_ovitrampa: number;
  data_coleta: string;
  quantidade_ovos: number;
  latitude: number;
  longitude: number;
  bairro: string;
  status_qualidade: string;
}
```

### 3.3 - Criar Service de Dados

**src/shared/services/dataService.ts**
```typescript
import Papa from 'papaparse';
import type { OvitrapData } from '../types';

export async function loadOvitrapData(): Promise<OvitrapData[]> {
  const response = await fetch('/data/banco_dados_aedes.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<OvitrapData>(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}
```

### 3.4 - Atualizar App.tsx para Mostrar Dados

```typescript
import React, { useEffect, useState } from 'react';
import { loadOvitrapData } from '@/shared/services/dataService';
import type { OvitrapData } from '@/shared/types';

function App() {
  const [data, setData] = useState<OvitrapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOvitrapData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-primary text-white p-6">
        <h1 className="text-3xl font-bold">SIVEPI V2 🦟</h1>
      </header>
      <main className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Dados Carregados!
          </h2>
          <p className="text-gray-600 text-lg">
            <strong>{data.length.toLocaleString()}</strong> registros encontrados
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Primeira coleta: {data[0]?.data_coleta}</p>
            <p>Última coleta: {data[data.length - 1]?.data_coleta}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
```

### 3.5 - Validação Final

Recarregar página:
- ✅ Deve mostrar "✅ Dados Carregados!"
- ✅ Número de registros (ex: "22,156 registros")
- ✅ Datas da primeira e última coleta

---

## 🎯 RESULTADO ESPERADO

Após 30 minutos você terá:

1. ✅ Aplicação React + TypeScript rodando
2. ✅ TailwindCSS funcionando
3. ✅ 22k+ registros CSV carregados
4. ✅ Interface básica responsiva
5. ✅ Hot reload ativo (salvar = atualização automática)

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module 'vite'"
**Solução**: `npm install`

### Erro: "Port 5173 already in use"
**Solução**: Mudar porta no `vite.config.ts`: `port: 5174`

### CSV não carrega
**Solução**: Verificar se arquivo está em `public/data/banco_dados_aedes.csv`

### TypeScript errors
**Solução**: Reiniciar VSCode (`Ctrl+Shift+P` → "Reload Window")

---

## 📚 PRÓXIMOS PASSOS

Agora que o sistema está funcionando:

1. 📖 Ler **ROADMAP.md** para ver todas as fases
2. 🛠️ Ler **IMPLEMENTATION_GUIDE.md** para detalhes técnicos
3. 🗺️ Começar **FASE 2** (Design System)
4. 📊 Implementar features (FASE 5-8)

---

## 🆘 SUPORTE

Se encontrar problemas:

1. Verificar versões: `node --version`, `npm --version`
2. Limpar cache: `npm cache clean --force`
3. Reinstalar: `rm -rf node_modules package-lock.json && npm install`
4. Verificar console do navegador (F12)

---

**Tempo estimado total**: 30 minutos  
**Dificuldade**: Fácil  
**Resultado**: Aplicação funcionando localmente ✅
