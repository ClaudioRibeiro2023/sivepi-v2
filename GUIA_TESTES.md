# 🧪 GUIA DE TESTES - SIVEPI V2

> **Sprint 4 - Testes & Validação**  
> **Data**: 2025-10-30

---

## 📋 ÍNDICE

1. [Validação de Dados](#validação-de-dados)
2. [Testes Manuais](#testes-manuais)
3. [Testes de Performance](#testes-de-performance)
4. [Testes de Acessibilidade](#testes-de-acessibilidade)
5. [Checklist de Qualidade](#checklist-de-qualidade)

---

## 🔍 VALIDAÇÃO DE DADOS

### **Validadores Implementados**

Local: `src/shared/utils/validators.ts`

#### **1. Validação de Coordenadas**
```typescript
import { validateCoordinates } from '@/shared/utils/validators';

const result = validateCoordinates(-16.7273, -43.8644);
console.log(result.valid); // true
console.log(result.errors); // []

// Coordenada inválida
const invalid = validateCoordinates(100, 200);
console.log(invalid.valid); // false
console.log(invalid.errors); // ['Latitude deve estar entre -90 e 90', ...]
```

#### **2. Validação de Semana Epidemiológica**
```typescript
import { validateEpiWeek } from '@/shared/utils/validators';

validateEpiWeek(25); // { valid: true, errors: [] }
validateEpiWeek(54); // { valid: false, errors: ['Semana deve estar entre 1 e 53'] }
```

#### **3. Validação de Registro Completo**
```typescript
import { validateOvitrapRecord } from '@/shared/utils/validators';

const record = {
  id_registro: 1,
  id_ovitrampa: 123,
  quantidade_ovos: 25,
  latitude: -16.7273,
  longitude: -43.8644,
  ano: 2024,
  mes_numero: 10,
  semana_epidemiologica: 43,
  bairro: 'Centro',
  // ... outros campos
};

const validation = validateOvitrapRecord(record);
console.log(validation.valid); // true ou false
console.log(validation.errors); // Array de erros encontrados
```

#### **4. Validação de Array de Dados**
```typescript
import { validateOvitrapDataArray } from '@/shared/utils/validators';

const data = [record1, record2, record3];
const result = validateOvitrapDataArray(data);

console.log(result.validCount);        // Quantidade válida
console.log(result.invalidCount);      // Quantidade inválida
console.log(result.validRecords);      // Registros válidos
console.log(result.invalidRecords);    // Registros inválidos com índice
console.log(result.errors);            // Erros detalhados por índice
```

#### **5. Sanitização de Dados**
```typescript
import { sanitizeOvitrapData } from '@/shared/utils/validators';

const rawData = [validRecord, invalidRecord1, validRecord2, invalidRecord2];
const cleanData = sanitizeOvitrapData(rawData);

// Retorna apenas registros válidos
console.log(cleanData.length); // 2 (apenas os válidos)
// Aviso automático no console sobre registros removidos
```

#### **6. Validação de Qualidade Geral**
```typescript
import { validateDataQuality } from '@/shared/utils/validators';

const quality = validateDataQuality(data);

console.log(quality.totalRecords);           // Total de registros
console.log(quality.validRecords);           // Registros válidos
console.log(quality.invalidRecords);         // Registros inválidos
console.log(quality.qualityPercentage);      // % de qualidade (0-100)
console.log(quality.issues.missingCoordinates);  // Problemas específicos
console.log(quality.issues.invalidDates);
console.log(quality.issues.negativeValues);
console.log(quality.issues.missingBairro);
```

---

## 🧪 TESTES MANUAIS

### **Checklist de Testes por Módulo**

#### **1. Dashboard**
```bash
# Iniciar aplicação
npm run dev

# Navegar para: http://localhost:3001/dashboard
```

**Testes**:
- [ ] Cards de métricas carregam
- [ ] Valores corretos exibidos
- [ ] Gráficos renderizam
- [ ] Mini gráfico de tendência aparece
- [ ] Filtros aplicam corretamente
- [ ] Skeleton loader aparece durante carregamento
- [ ] Sem erros no console

**Critérios de Sucesso**:
- ✅ Carregamento < 2s
- ✅ Valores numéricos corretos
- ✅ Gráficos interativos
- ✅ Responsivo (testar resize)

---

#### **2. WebMapa**
```bash
# Navegar para: http://localhost:3001/webmapa
```

**Testes**:
- [ ] Mapa carrega com clusters
- [ ] Clusters exibem contagem
- [ ] Zoom in: clusters viram pontos individuais
- [ ] Pontos coloridos por nível de risco (verde, amarelo, laranja, vermelho)
- [ ] Sidebar com filtros funciona
- [ ] Filtros aplicam no mapa
- [ ] Heatmap toggle funciona
- [ ] Popup ao clicar em marcador

**Performance**:
- [ ] Carregamento < 2s
- [ ] FPS > 50 ao arrastar mapa
- [ ] Zoom suave
- [ ] Sem travamentos

**Critérios de Sucesso**:
- ✅ ~500 clusters ao invés de 22k marcadores
- ✅ Navegação fluida
- ✅ Cores corretas por risco
- ✅ Sem erros Mapbox no console

---

#### **3. Panorama Executivo**
```bash
# Navegar para: http://localhost:3001/panorama
```

**Testes**:
- [ ] Dados carregam
- [ ] Gráficos renderizam
- [ ] Tabelas exibem dados
- [ ] Exportação funciona (se implementada)
- [ ] Filtros aplicam
- [ ] Loading state aparece

**Critérios de Sucesso**:
- ✅ Sem warnings Recharts
- ✅ Gráficos responsivos
- ✅ Dados consistentes

---

#### **4. Vigilância Entomológica**
```bash
# Navegar para: http://localhost:3001/vigilancia
```

**Testes**:
- [ ] IPO calculado corretamente
- [ ] Dados por bairro carregam
- [ ] Gráficos de tendência corretos
- [ ] Tabela de bairros funciona
- [ ] Ordenação funciona

**Critérios de Sucesso**:
- ✅ Cálculos matemáticos corretos
- ✅ Performance boa com muitos bairros

---

### **Testes de Navegação**

**Fluxo Completo**:
```
Dashboard → WebMapa → Panorama → Vigilância → Dashboard
```

**Verificar**:
- [ ] Navegação suave entre rotas
- [ ] Cache do React Query funciona (2ª visita é instantânea)
- [ ] Sem re-carregamento desnecessário de dados
- [ ] Breadcrumb/navegação clara
- [ ] Sidebar sempre acessível

---

### **Testes de Filtros**

**Todos os Módulos**:
- [ ] Filtro por ano funciona
- [ ] Filtro por mês funciona
- [ ] Filtro por semana epidemiológica funciona
- [ ] Filtro por bairro funciona
- [ ] Limpar filtros volta ao estado inicial
- [ ] Filtros persistem ao navegar?
- [ ] Debounce funciona (não trava ao digitar)

---

## ⚡ TESTES DE PERFORMANCE

### **Google Lighthouse**

```bash
# 1. Build de produção
npm run build
npm run preview

# 2. Abrir Chrome DevTools
# 3. Aba Lighthouse
# 4. Rodar audit (Desktop)
```

**Métricas Alvo**:
- Performance: **90+/100**
- Accessibility: **90+/100**
- Best Practices: **90+/100**
- SEO: **90+/100**

**Métricas Web Vitals**:
- FCP (First Contentful Paint): **< 1.8s**
- LCP (Largest Contentful Paint): **< 2.5s**
- TBT (Total Blocking Time): **< 300ms**
- CLS (Cumulative Layout Shift): **< 0.1**

---

### **Performance do Mapa**

**Teste Manual**:
1. Abrir WebMapa
2. Abrir DevTools → Performance
3. Iniciar gravação
4. Arrastar mapa, dar zoom, clicar em clusters
5. Parar gravação

**Analisar**:
- [ ] FPS durante arraste: **> 50**
- [ ] Tempo de resposta ao click: **< 100ms**
- [ ] Memória estável (não cresce indefinidamente)

**Chrome DevTools → Memory**:
1. Tirar snapshot inicial
2. Navegar pelo sistema
3. Tirar snapshot final
4. Comparar

**Critério**: Memória não deve crescer > 50MB sem motivo

---

### **Network Performance**

**DevTools → Network**:
- [ ] CSV carrega 1x apenas (não duplicado)
- [ ] Imagens otimizadas
- [ ] Sem recursos bloqueantes
- [ ] Gzip/compression ativo (produção)

---

## ♿ TESTES DE ACESSIBILIDADE

### **Ferramentas Automatizadas**

#### **1. axe DevTools**
```bash
# Instalar extensão: https://www.deque.com/axe/devtools/

# Usar em cada página:
# 1. Abrir DevTools
# 2. Aba "axe DevTools"
# 3. "Scan ALL of my page"
```

**Meta**: **0 violações críticas**

#### **2. WAVE**
```bash
# Instalar extensão: https://wave.webaim.org/extension/

# Usar em cada página e verificar:
# - Erros (0)
# - Alertas (mínimo)
# - Contraste adequado
```

---

### **Testes Manuais de Acessibilidade**

#### **Navegação por Teclado**
- [ ] `Tab` navega por elementos focáveis
- [ ] `Shift + Tab` navega para trás
- [ ] `Enter` ativa botões/links
- [ ] `Esc` fecha modals
- [ ] Foco visível (outline)
- [ ] Ordem de foco lógica

#### **Screen Reader** (NVDA/JAWS/VoiceOver)
- [ ] Títulos de página anunciados
- [ ] Landmarks (navigation, main, etc)
- [ ] Botões têm labels descritivos
- [ ] Imagens têm alt text
- [ ] Formulários têm labels
- [ ] Status messages anunciados

#### **Contraste de Cores**
```bash
# Usar ferramenta: https://webaim.org/resources/contrastchecker/

# Verificar:
# - Texto normal: 4.5:1 (AA)
# - Texto grande: 3:1 (AA)
# - Componentes UI: 3:1 (AA)
```

---

## ✅ CHECKLIST DE QUALIDADE

### **Pré-Deploy**

#### **Código**
- [ ] `npm run type-check` sem erros
- [ ] `npm run lint` sem erros
- [ ] `npm run format:check` OK
- [ ] Sem `console.log` desnecessários
- [ ] Sem TODOs críticos
- [ ] Sem código comentado

#### **Funcionalidade**
- [ ] Todos os módulos funcionam
- [ ] Filtros aplicam corretamente
- [ ] Dados carregam sem erros
- [ ] Navegação fluida
- [ ] Sem memory leaks

#### **Performance**
- [ ] Lighthouse > 90
- [ ] Mapa < 2s carregamento
- [ ] Navegação usa cache
- [ ] Bundle size otimizado

#### **UX**
- [ ] Loading states em todos os módulos
- [ ] Empty states onde aplicável
- [ ] Error boundaries funcionando
- [ ] Mensagens de erro claras
- [ ] Feedback visual em ações

#### **Acessibilidade**
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Contraste adequado
- [ ] ARIA labels apropriados
- [ ] Foco visível

#### **Segurança**
- [ ] Token Mapbox público (pk.)
- [ ] Sem dados sensíveis no código
- [ ] .env não commitado
- [ ] HTTPS em produção

---

## 🐛 DEBUGGING

### **Problemas Comuns e Soluções**

#### **Mapa não carrega**
```typescript
// Verificar no console:
console.log('Token:', import.meta.env.VITE_MAPBOX_TOKEN);
console.log('Dados:', data.length);

// Deve ver:
// Token: pk.eyJ1I... (começando com pk.)
// Dados: 22154
```

#### **Dados carregam 2x**
```typescript
// React Query configurado corretamente?
// Ver: src/shared/providers/QueryProvider.tsx

// Deve ter:
refetchOnWindowFocus: false,
refetchOnMount: false,
```

#### **Performance ruim**
```typescript
// Clustering ativado?
// Ver: src/modules/WebMapaCompleto.tsx

// Deve ter:
<MapView showClusters={true} />
```

#### **Erros TypeScript**
```bash
# Limpar cache e rebuildar
rm -rf node_modules
rm package-lock.json
npm install
npm run type-check
```

---

## 📊 RELATÓRIO DE TESTES

### **Template de Relatório**

```markdown
# Relatório de Testes - SIVEPI V2
Data: [DATA]
Versão: [VERSÃO]
Testado por: [NOME]

## Ambiente
- SO: Windows/Mac/Linux
- Navegador: Chrome/Firefox/Safari [VERSÃO]
- Resolução: [WxH]

## Resultados

### Performance
- Lighthouse Score: [X]/100
- FCP: [X]s
- LCP: [X]s
- Carregamento Mapa: [X]s

### Funcionalidade
- Dashboard: ✅/❌
- WebMapa: ✅/❌
- Panorama: ✅/❌
- Vigilância: ✅/❌

### Acessibilidade
- Navegação Teclado: ✅/❌
- Screen Reader: ✅/❌
- Contraste: ✅/❌

## Bugs Encontrados
1. [Descrição do bug]
   - Severidade: Alta/Média/Baixa
   - Passos para reproduzir:
   - Screenshot/Log:

## Recomendações
- [Lista de melhorias sugeridas]
```

---

## 🚀 PRÓXIMOS PASSOS

Após validação manual bem-sucedida:

1. **Testes Automatizados** (opcional, futuro)
   - Configurar Vitest
   - Unit tests para utils/hooks
   - Integration tests para módulos

2. **CI/CD**
   - GitHub Actions para rodar testes
   - Build automático
   - Deploy automático

3. **Monitoring**
   - Sentry para error tracking
   - Analytics para uso
   - Performance monitoring

---

## 📚 RECURSOS

- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [React Testing Library](https://testing-library.com/react)

---

**Última Atualização**: 2025-10-30  
**Versão**: 1.0.0
