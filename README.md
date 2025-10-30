# SIVEPI - Sistema Integrado de Vigilância Epidemiológica

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Sistema profissional de vigilância epidemiológica para monitoramento e controle do *Aedes aegypti* em Montes Claros/MG.

## 🚀 Características Principais

- ✅ **Dashboard Executivo**: Métricas gerenciais e KPIs em tempo real
- ✅ **Panorama Executivo**: Análises temporais, comparativas e tendências
- ✅ **Vigilância Entomológica**: Índices técnicos (IPO, IDO, IMO, IVO)
- ✅ **Sistema Operacional**: Gestão de equipes, intervenções e inventário
- ✅ **Mapa Interativo**: Visualização geoespacial e clusters de risco
- ✅ **Relatórios**: Exportação e geração de relatórios técnicos
- ✅ **Modo Escuro**: Interface adaptável ao ambiente
- ✅ **Responsivo**: Otimizado para desktop, tablet e mobile

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- NPM >= 9.0.0
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## ⚡ Instalação Rápida

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar em Modo Desenvolvimento

```bash
npm run dev
```

O sistema será aberto automaticamente em `http://localhost:3000`

### 3. Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `./dist`

### 4. Preview da Build de Produção

```bash
npm run preview
```

## 📦 Scripts Disponíveis

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

## 🛠️ Tecnologias Utilizadas

- **Framework**: React 18.3+ com TypeScript
- **Build Tool**: Vite 5.1+
- **Roteamento**: React Router DOM 6.22+
- **Gráficos**: Recharts 2.12+
- **Ícones**: Lucide React 0.344+
- **Data**: Date-fns 3.3+, PapaParse 5.4+
- **Estado**: Zustand 4.5+ / Context API
- **Estilização**: CSS Modules + CSS-in-JS
- **Linting**: ESLint + Prettier

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

## 📈 Performance

- ✅ Code splitting automático
- ✅ Lazy loading de módulos
- ✅ Tree shaking de dependências
- ✅ Compressão gzip/brotli
- ✅ Cache otimizado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 License

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

**Secretaria Municipal de Saúde - Montes Claros/MG**

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte.sivepi@montesclaros.mg.gov.br
- Documentação: [Em desenvolvimento]

---

**Made with ❤️ for public health | SIVEPI v2.0.0**
