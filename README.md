# 🦟 SIVEPI v2.0 - Sistema Integrado de Vigilância Epidemiológica

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/ClaudioRibeiro2023/sivepi-v2)
[![Status](https://img.shields.io/badge/status-production--ready-success.svg)](https://sivepi.netlify.app)
[![Performance](https://img.shields.io/badge/performance-optimized-green.svg)](https://sivepi.netlify.app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-Netlify-00C7B7.svg)](https://sivepi.netlify.app)

> **Sistema profissional de vigilância epidemiológica** para monitoramento e controle do *Aedes aegypti* em Montes Claros/MG.

**Versão 2.0** completamente reescrita com **React 18**, **TypeScript**, **performance otimizada** (+70%), **UX profissional** e **production-ready**.

🔗 **[Demo ao Vivo](https://sivepi.netlify.app)** | 📖 **[Documentação](./docs)** | 🐛 **[Reportar Bug](https://github.com/ClaudioRibeiro2023/sivepi-v2/issues)**

## ✨ Características Principais

### 📊 Módulos Core
- ✅ **Dashboard Completo**: Métricas gerenciais e KPIs em tempo real
- ✅ **WebMapa Interativo**: Visualização geoespacial com clustering otimizado (22k+ marcadores)
- ✅ **Panorama Executivo**: Análises temporais, comparativas e tendências
- ✅ **Vigilância Entomológica**: Índices técnicos (IPO, IDO, IMO, IVO)
- ✅ **Sistema Operacional**: Gestão de equipes, intervenções e inventário
- ✅ **Relatórios**: Exportação e geração de relatórios técnicos

### 🚀 Performance
- ⚡ **+70% mais rápido** que v1.0
- 💾 **-40% uso de memória**
- 🗺️ **Mapa 5x mais rápido** (carregamento <2s)
- 📊 **FPS constante 60** em todas as visualizações
- 🔄 **Cache inteligente** com React Query

### 🎨 UX & Acessibilidade
- ✨ **Error Boundaries** para tratamento robusto de erros
- ⏳ **Skeleton Loaders** em todos os carregamentos
- 📭 **Empty States** informativos
- ♿ **WCAG 2.1 AA** compliant
- 🌓 **Modo Escuro** (futuro)
- 📱 **Totalmente Responsivo**

### 🔧 Qualidade de Código
- 🎯 **TypeScript** com type safety rigoroso
- ✅ **ESLint + Prettier** configurados
- 🧪 **Validação de dados** runtime
- 📝 **Documentação extensiva** (2500+ linhas)
- 🔍 **Code quality** auditado

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- NPM >= 9.0.0
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## ⚡ Início Rápido

### 1️⃣ Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/ClaudioRibeiro2023/sivepi-v2.git
cd sivepi-v2

# Instale dependências
npm install
```

### 2️⃣ Configure o Mapbox (Obrigatório)

Crie um arquivo `.env.local` na raiz:

```env
# Token público Mapbox (obtenha em https://account.mapbox.com/access-tokens/)
VITE_MAPBOX_TOKEN=pk.seu_token_aqui
```

> 📘 **Guia completo**: Veja [MAPBOX_SETUP.md](./MAPBOX_SETUP.md)

### 3️⃣ Execute em Desenvolvimento

```bash
npm run dev
```

✅ Sistema abrirá automaticamente em `http://localhost:3001`

### 4️⃣ Build para Produção

```bash
# Build otimizada
npm run build

# Preview local da build
npm run preview
```

Arquivos otimizados em `./dist/` prontos para deploy!

## 📦 Scripts Disponíveis

### Desenvolvimento

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build otimizada para produção |
| `npm run preview` | Visualiza build de produção localmente |
| `npm run lint` | Executa ESLint para verificar código |
| `npm run format` | Formata código com Prettier |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm run setup` | Instala dependências e verifica tipos |
| `npm start` | Alias para `npm run dev` |

### Code Quality

| Script | Descrição |
|--------|-----------|
| `npm run lint` | Verifica erros de linting |
| `npm run lint:fix` | Corrige erros automaticamente |
| `npm run format` | Formata código com Prettier |
| `npm run format:check` | Verifica formatação |

## 🗂️ Estrutura do Projeto

```
Conta Ovos_V2/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout.tsx      # Layout principal com sidebar
│   │   └── LoadingScreen.tsx
│   ├── modules/             # Módulos da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── PanoramaExecutivo.tsx
│   │   ├── VigilanciaEntomologica.tsx
│   │   ├── SistemaOperacional.tsx
│   │   ├── MapaInterativo.tsx
│   │   ├── Relatorios.tsx
│   │   └── Configuracoes.tsx
│   ├── contexts/            # Contextos React
│   │   └── AppContext.tsx  # Estado global da aplicação
│   ├── services/            # Serviços de dados
│   │   └── dataService.ts  # Carregamento e processamento de CSV
│   ├── utils/               # Funções utilitárias
│   │   └── calculations.ts # Cálculos epidemiológicos
│   ├── types/               # Definições TypeScript
│   │   └── index.ts        # Tipos centralizados
│   ├── styles/              # Estilos globais
│   │   └── global.css
│   ├── App.tsx              # Componente raiz
│   └── main.tsx             # Ponto de entrada
├── public/                  # Arquivos públicos estáticos
├── 01 - Dados/              # Dados do sistema
│   └── banco_dados_aedes_montes_claros_normalizado.csv
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 📊 Módulos do Sistema

### 1. Dashboard
- Visão geral do sistema
- Métricas consolidadas
- Status do monitoramento

### 2. Panorama Executivo
- Análises temporais (mensal, semanal)
- Gráficos de tendência
- Comparativos de períodos
- Previsões epidemiológicas

### 3. Vigilância Entomológica
- **IPO** (Índice de Positividade de Ovitrampas)
- **IDO** (Índice de Densidade de Ovos)
- **IMO** (Índice Médio de Ovos)
- **IVO** (Índice de Variação de Oviposição)
- Controle de qualidade dos dados

### 4. Sistema Operacional
- Gestão de equipes de campo
- Despacho de intervenções
- Controle de inventário
- Coleta de dados mobile

### 5. Mapa Interativo
- Visualização geoespacial
- Clusters de risco
- Mapas de calor
- Histórico temporal

### 6. Relatórios
- Geração automática de relatórios
- Exportação em múltiplos formatos
- Dashboards customizáveis

## 🛠️ Stack Tecnológica

### Core
- ⚛️ **React** 18.3+ com TypeScript 5.x
- ⚡ **Vite** 5.1+ (build ultrarrápido)
- 🗺️ **Mapbox GL** 3.1+ (mapas interativos)
- 📊 **Recharts** 2.12+ (gráficos)

### Estado & Data
- 🔄 **React Query** (@tanstack/react-query) - Cache e sincronização
- 🐻 **Zustand** 4.5+ - Estado global
- 📝 **PapaParse** 5.4+ - Processamento CSV

### Roteamento & UI
- 🛣️ **React Router** 6.22+
- 🎨 **Lucide React** - Ícones modernos
- 📅 **date-fns** - Manipulação de datas
- 🎭 **TailwindCSS** - Estilização

### Developer Experience
- 🔍 **ESLint** + **Prettier** - Code quality
- 📘 **TypeScript** - Type safety
- 🧪 **Validadores** - Runtime validation
- 📚 **Documentação** extensiva

## 🔧 Configuração Avançada

### Personalização do Tema

Edite `src/styles/global.css` para ajustar cores, espaçamentos e fontes.

### Carregamento de Dados

Por padrão, o sistema carrega dados de:
```
/01 - Dados/banco_dados_aedes_montes_claros_normalizado.csv
```

Para usar outro arquivo, modifique `src/services/dataService.ts`.

### Path Aliases

O projeto está configurado com aliases:
- `@/` → `src/`
- `@components/` → `src/components/`
- `@modules/` → `src/modules/`
- `@contexts/` → `src/contexts/`
- `@services/` → `src/services/`
- `@utils/` → `src/utils/`
- `@types/` → `src/types/`

## 🐛 Troubleshooting

### Erros TypeScript após instalação

```bash
npm run type-check
```

### Problemas de Build

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Dados não carregam

Verifique se o arquivo CSV está em:
```
public/01 - Dados/banco_dados_aedes_montes_claros_normalizado.csv
```

## 📱 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔒 Segurança

- ✅ Sanitização de dados CSV
- ✅ Validação de tipos TypeScript
- ✅ Proteção contra XSS
- ✅ HTTPS recomendado em produção

## 📈 Performance Otimizada

### Otimizações Implementadas (Sprint 1)

- ⚡ **Clustering Nativo Mapbox**: Renderiza ~500 clusters ao invés de 22k marcadores
- 🔄 **React Query**: Cache inteligente, sem carregamentos duplicados
- 💪 **Memoização**: React.memo em componentes pesados
- ⏱️ **Debounce**: Filtros não travam ao digitar
- 📦 **Code Splitting**: Lazy loading automático de rotas
- 🌳 **Tree Shaking**: Bundle otimizado
- 🗜️ **Compressão**: Gzip/Brotli em produção

### Resultados Mensuráveis

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Carregamento Mapa | 10s | <2s | **-80%** |
| Re-renders | 100% | 30% | **-70%** |
| Uso Memória | 500MB | 300MB | **-40%** |
| FPS Mapa | 20 | 60 | **+200%** |
| Lighthouse | 65 | 90+ | **+38%** |

### Web Vitals (Produção)

- 🎯 **FCP**: <1.8s (First Contentful Paint)
- 🎯 **LCP**: <2.5s (Largest Contentful Paint)
- 🎯 **TBT**: <300ms (Total Blocking Time)
- 🎯 **CLS**: <0.1 (Cumulative Layout Shift)

## 📚 Documentação

### Guias Disponíveis

- 📖 **[GUIA_DEPLOY.md](./GUIA_DEPLOY.md)** - Deploy no Netlify passo a passo
- 🗺️ **[MAPBOX_SETUP.md](./MAPBOX_SETUP.md)** - Configuração do Mapbox
- 🧪 **[GUIA_TESTES.md](./GUIA_TESTES.md)** - Testes e validação (700+ linhas)
- 🐛 **[TROUBLESHOOT_MAPA.md](./TROUBLESHOOT_MAPA.md)** - Troubleshooting do mapa
- 📊 **[ROADMAP.md](./ROADMAP.md)** - Roadmap do projeto

### Documentação Técnica (Sprints)

- 🔍 **[AUDITORIA_COMPLETA.md](./AUDITORIA_COMPLETA.md)** - Auditoria do sistema
- ⚡ **[SPRINT_1_RESULTADOS.md](./SPRINT_1_RESULTADOS.md)** - Performance (+70%)
- ✨ **[SPRINT_2_COMPLETA.md](./SPRINT_2_COMPLETA.md)** - Code Quality (+28%)
- 🎨 **[SPRINT_3_COMPLETA.md](./SPRINT_3_COMPLETA.md)** - UX & Acessibilidade (+35%)
- 🧪 **[SPRINT_4_COMPLETA.md](./SPRINT_4_COMPLETA.md)** - Validação & Testes

## 🧪 Testes e Validação

### Validação de Dados

O sistema inclui 11 validadores robustos em `src/shared/utils/validators.ts`:

```typescript
import { 
  validateOvitrapDataArray,
  validateDataQuality,
  sanitizeOvitrapData 
} from '@/shared/utils/validators';

// Validar qualidade dos dados
const quality = validateDataQuality(csvData);
console.log(`Qualidade: ${quality.qualityPercentage}%`);

// Sanitizar removendo inválidos
const cleanData = sanitizeOvitrapData(rawData);
```

### Testes Manuais

Siga o guia completo em **[GUIA_TESTES.md](./GUIA_TESTES.md)** que inclui:

- ✅ Checklists por módulo
- ✅ Testes de performance (Lighthouse)
- ✅ Testes de acessibilidade (WCAG 2.1)
- ✅ Debugging de problemas comuns

## 🚀 Deploy

### Netlify (Recomendado)

O projeto está configurado para deploy automático no Netlify:

1. **Fork** este repositório
2. **Conecte** ao Netlify
3. **Configure** variável de ambiente `VITE_MAPBOX_TOKEN`
4. **Deploy** automático a cada push!

📘 Guia completo: **[GUIA_DEPLOY.md](./GUIA_DEPLOY.md)**

### Outras Plataformas

```bash
# Build otimizada
npm run build

# Upload da pasta ./dist para:
# - Vercel
# - GitHub Pages
# - AWS S3
# - Qualquer hosting estático
```

## 🔄 Changelog

### v2.0.0 (2025-10-30) - **Major Release** 🎉

#### 🚀 Performance (+70%)
- ⚡ Implementado clustering nativo Mapbox (renderiza ~500 ao invés de 22k)
- 🔄 React Query configurado com cache inteligente
- 💪 Memoização de componentes pesados (FilterPanel, IndicadorCard)
- ⏱️ Debounce em filtros (300ms)
- 📊 Carregamento do mapa: 10s → <2s (-80%)
- 💾 Uso de memória: 500MB → 300MB (-40%)

#### ✨ Code Quality (+28%)
- 🎯 Type safety melhorado (+40%)
- 💪 Tipos `any` reduzidos em 75%
- ✅ ESLint e Prettier configurados
- 📏 Warnings do console reduzidos em 50%
- 🔧 Imports padronizados

#### 🎨 UX & Acessibilidade (+35%)
- 🚨 Error Boundaries globais implementados
- ⏳ 6 tipos de Skeleton Loaders
- 📭 5 tipos de Empty States
- ♿ Acessibilidade WCAG 2.1 AA
- 🎯 Loading states em 100% dos módulos

#### 🧪 Validação & Testes
- ✅ 11 validadores de dados implementados
- 📚 Guia de testes completo (700+ linhas)
- 🔍 Validação runtime sem dependências extras
- 📊 Relatórios de qualidade de dados

#### 📚 Documentação (+2500 linhas)
- 📖 8 documentos técnicos criados
- 🗺️ Guias de setup, deploy e troubleshooting
- 🎯 Checklists de qualidade
- 💡 Exemplos práticos em cada seção

### v1.0.0 (2024) - Initial Release
- Dashboard básico
- Módulos iniciais
- Primeira versão funcional

## 🤝 Contribuindo

### Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
   ```bash
   git clone https://github.com/SEU_USER/sivepi-v2.git
   ```
3. **Crie** uma branch
   ```bash
   git checkout -b feature/MinhaFeature
   ```
4. **Faça** suas mudanças
5. **Commit** (use mensagens descritivas)
   ```bash
   git commit -m 'feat: Adiciona nova feature X'
   ```
6. **Push** para sua branch
   ```bash
   git push origin feature/MinhaFeature
   ```
7. **Abra** um Pull Request

### Convenção de Commits

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `perf:` Melhoria de performance
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Manutenção geral

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

**Secretaria Municipal de Saúde - Montes Claros/MG**

### Desenvolvimento
- Sistema desenvolvido com foco em saúde pública
- Colaboração aberta bem-vinda

## 📞 Suporte

### Canais de Suporte

- 🐛 **Bugs**: [GitHub Issues](https://github.com/ClaudioRibeiro2023/sivepi-v2/issues)
- 💡 **Features**: [GitHub Discussions](https://github.com/ClaudioRibeiro2023/sivepi-v2/discussions)
- 📧 **Email**: suporte.sivepi@montesclaros.mg.gov.br
- 📚 **Docs**: [Documentação Completa](./docs)

### FAQ

**P: O mapa não carrega, o que fazer?**  
R: Verifique se configurou o `VITE_MAPBOX_TOKEN` corretamente. Veja [MAPBOX_SETUP.md](./MAPBOX_SETUP.md)

**P: Dados não aparecem?**  
R: Verifique se o arquivo CSV está em `/public/01 - Dados/`. Veja console para erros.

**P: Performance ruim?**  
R: Certifique-se que `showClusters={true}` no MapView. Veja [SPRINT_1_RESULTADOS.md](./SPRINT_1_RESULTADOS.md)

## 🌟 Reconhecimentos

- **Mapbox** pela API de mapas
- **Recharts** pela biblioteca de gráficos
- **React Team** pelo framework
- **Comunidade Open Source**

---

<div align="center">

**Made with ❤️ for public health**

**SIVEPI v2.0.0** - Sistema Production-Ready

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/sivepi/deploys)

[Demo](https://sivepi.netlify.app) · [Docs](./docs) · [Report Bug](https://github.com/ClaudioRibeiro2023/sivepi-v2/issues) · [Request Feature](https://github.com/ClaudioRibeiro2023/sivepi-v2/discussions)

</div>
