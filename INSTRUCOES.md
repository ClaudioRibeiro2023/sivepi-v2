# 🚀 INSTRUÇÕES DE EXECUÇÃO - SIVEPI v2.0

## ✅ Status da Instalação

**Dependências instaladas com sucesso!** ✓

## 🎯 Próximos Passos

### 1. Iniciar o Sistema

Execute o comando para iniciar em modo de desenvolvimento:

```bash
npm run dev
```

O sistema será aberto automaticamente em: **http://localhost:3000**

### 2. Primeira Execução

Ao iniciar pela primeira vez:
- O sistema tentará carregar automaticamente o arquivo CSV de dados
- Verifique se o arquivo está em: `public/01 - Dados/banco_dados_aedes_montes_claros_normalizado.csv`
- Se necessário, copie o CSV da pasta `01 - Dados/` para `public/01 - Dados/`

### 3. Navegação

Use o menu lateral para acessar os módulos:
- **Dashboard**: Visão geral do sistema
- **Panorama Executivo**: Análises temporais e gráficos
- **Vigilância Entomológica**: Índices técnicos (IPO, IDO, IMO, IVO)
- **Sistema Operacional**: Gestão de equipes e intervenções
- **Mapa Interativo**: Visualização geoespacial
- **Relatórios**: Exportação de dados
- **Configurações**: Preferências do usuário

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build de produção
npm run preview          # Visualiza build localmente

# Qualidade de Código
npm run lint             # Verifica erros de código
npm run format           # Formata código
npm run type-check       # Verifica tipos TypeScript
```

## 📁 Estrutura de Arquivos Importantes

```
Conta Ovos_V2/
├── src/
│   ├── modules/         # Módulos da aplicação (já criados)
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Estado global
│   ├── services/        # Serviços de dados
│   └── utils/           # Funções auxiliares
├── public/              # Arquivos estáticos
├── 01 - Dados/          # Dados originais
└── README.md            # Documentação completa
```

## ⚠️ Troubleshooting

### Problema: Dados não carregam

**Solução**: Copie o CSV para a pasta `public`:

```bash
# Windows (PowerShell)
mkdir -p public/"01 - Dados"
copy "01 - Dados\banco_dados_aedes_montes_claros_normalizado.csv" "public\01 - Dados\"
```

### Problema: Erros de compilação TypeScript

**Solução**: Execute type-check para ver os erros:

```bash
npm run type-check
```

### Problema: Porta 3000 já em uso

**Solução**: O Vite automaticamente usará a próxima porta disponível (3001, 3002, etc.)

## 🎨 Personalização

### Alterar Cores do Tema

Edite o arquivo: `src/styles/global.css`

```css
:root {
  --primary: #0087A8;  /* Cor principal */
  --secondary: #262832; /* Cor secundária */
  /* ... outras cores */
}
```

### Adicionar Novos Módulos

1. Crie um novo arquivo em `src/modules/SeuModulo.tsx`
2. Adicione a rota em `src/App.tsx`
3. Adicione o item no menu em `src/components/Layout.tsx`

## 📊 Dados do Sistema

O sistema usa o arquivo CSV com as seguintes colunas principais:
- `id_registro`, `id_ovitrampa`
- `data_instalacao`, `data_coleta`
- `quantidade_ovos`
- `ano`, `mes_numero`, `mes_nome`
- `semana_epidemiologica`
- `bairro`, `municipio`, `uf`
- `latitude`, `longitude`
- `reincidencia`

## 🔐 Segurança

- ✅ Validação automática de dados CSV
- ✅ Sanitização de inputs
- ✅ TypeScript para type-safety
- ✅ HTTPS recomendado em produção

## 📈 Performance

O sistema está otimizado com:
- Code splitting automático
- Lazy loading de módulos
- Tree shaking
- Minificação
- Compressão

## 🆘 Suporte

Em caso de dúvidas ou problemas:
1. Consulte o `README.md` para documentação completa
2. Verifique os logs do navegador (F12 → Console)
3. Execute `npm run type-check` para verificar erros TypeScript

---

**Sistema pronto para uso! Execute `npm run dev` para iniciar. 🎉**
