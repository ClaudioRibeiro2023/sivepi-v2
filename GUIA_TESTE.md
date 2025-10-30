# 🧪 GUIA DE TESTES - SIVEPI V2

> **Como testar todas as funcionalidades implementadas**

---

## 🎯 CHECKLIST DE TESTES

### ✅ **TESTE 1: Navegação Básica**

Acesse: http://localhost:3000

**Teste cada link do menu lateral**:
- [ ] Dashboard - Deve mostrar cards com estatísticas
- [ ] WebMapa - Deve carregar mapa (pode estar sem dados ainda)
- [ ] Panorama - Deve mostrar estrutura básica
- [ ] Vigilância - Deve mostrar estrutura básica
- [ ] Resposta - Deve mostrar estrutura básica
- [ ] Relatórios - Deve mostrar estrutura básica
- [ ] Configurações - Deve mostrar estrutura básica
- [ ] Design System - Deve mostrar componentes

**Validação**:
- ✅ Link ativo fica azul (#0087A8)
- ✅ Transição suave entre páginas
- ✅ Nenhum erro no console (exceto warning do React Router)

---

### ✅ **TESTE 2: Dashboard Principal**

Acesse: http://localhost:3000/dashboard

**Verificar cards**:
- [ ] "Total de Registros" mostra número correto (~22.154)
- [ ] "Ovitrampas Ativas" mostra número (~549)
- [ ] "Bairros Monitorados" mostra número (~145)
- [ ] "Total de Ovos" mostra número grande (~724.411)

**Validação**:
- ✅ Números aparecem formatados
- ✅ Cards têm bordas coloridas (azul, verde, amarelo, laranja)
- ✅ Texto "Bem-vindo ao SIVEPI" aparece

---

### ✅ **TESTE 3: Design System**

Acesse: http://localhost:3000/design-system

**Verificar componentes**:

#### Buttons
- [ ] Botão "Primary" - Azul (#0087A8)
- [ ] Botão "Secondary" - Cinza
- [ ] Botão "Ghost" - Transparente
- [ ] Botão "Danger" - Vermelho
- [ ] Tamanhos: Small, Medium, Large
- [ ] Estados: Loading (spinner), Disabled (opaco)
- [ ] Full Width funciona

#### Badges
- [ ] Badge padrão - Cinza
- [ ] Badge Success/Low - Verde
- [ ] Badge Warning/Medium - Amarelo
- [ ] Badge High - Laranja
- [ ] Badge Danger/Critical - Vermelho
- [ ] Badge Info - Azul
- [ ] Tamanhos: Small, Medium, Large

#### Cards
- [ ] Card com padding Small
- [ ] Card com padding Medium (padrão)
- [ ] Card com padding Large
- [ ] Cards têm sombra e borda

#### Inputs
- [ ] Input com label funciona
- [ ] Input com helper text aparece
- [ ] Input com erro mostra vermelho
- [ ] Input full width ocupa largura total

#### Paleta de Cores
- [ ] Primary: #0087A8 (Azul SIVEPI)
- [ ] Secondary: #262832 (Preto sidebar)
- [ ] Risk Low: Verde
- [ ] Risk Medium: Amarelo
- [ ] Risk High: Laranja
- [ ] Risk Critical: Vermelho

**Validação**:
- ✅ Todos componentes renderizam
- ✅ Cores corretas
- ✅ Interações funcionam (hover, click)
- ✅ Tipografia legível

---

### ✅ **TESTE 4: Performance**

**No Console do Navegador (F12)**:

1. Abra a aba "Network"
2. Recarregue a página (Ctrl+R)
3. Verifique:
   - [ ] CSV carrega em <1s
   - [ ] Página carrega em <2s
   - [ ] Log: "✅ CSV carregado: XXX registros válidos"

**No Console (aba Console)**:
- [ ] Deve aparecer log de dados carregados
- [ ] Sem erros em vermelho (warnings em amarelo são OK)

**Teste de navegação**:
1. Navegue entre páginas rapidamente
2. Verifique:
   - [ ] Transições são instantâneas
   - [ ] Sem lag ou travamentos
   - [ ] Dados não recarregam (cache funcionando)

---

### ✅ **TESTE 5: Responsividade**

**Redimensionar janela**:
1. Abra DevTools (F12)
2. Ative modo responsivo (Ctrl+Shift+M)
3. Teste tamanhos:
   - [ ] Desktop (1920px) - Tudo visível
   - [ ] Tablet (768px) - Layout adapta
   - [ ] Mobile (375px) - Sidebar deve ter scroll

**Validação**:
- ✅ Conteúdo não quebra
- ✅ Textos legíveis
- ✅ Botões clicáveis

---

### ✅ **TESTE 6: Data Layer**

**Abrir Console (F12)**:

Cole este código:
```javascript
// Testar hook de dados
console.log('Testando Data Layer...');
```

**No React DevTools** (se instalado):
1. Procurar por "AppProvider"
2. Ver state.data
3. Verificar:
   - [ ] Array com 22k+ registros
   - [ ] Campos: latitude, longitude, quantidade_ovos, etc

---

### ✅ **TESTE 7: Dark Mode (se implementado)**

- [ ] Tema escuro funciona
- [ ] Cores adaptam corretamente
- [ ] Contraste adequado

---

## 🐛 PROBLEMAS COMUNS

### **Página em branco**
**Solução**: Verificar console (F12) para erros

### **Dados não aparecem**
**Solução**: 
1. Verificar se CSV está em `public/data/banco_dados_aedes.csv`
2. Verificar console para erros de carregamento

### **Navegação não funciona**
**Solução**: Limpar cache (Ctrl+Shift+R)

### **Estilos quebrados**
**Solução**: 
```bash
npm run dev
# Reiniciar servidor
```

---

## 📊 RESULTADO ESPERADO

Após todos os testes:
- ✅ 8 rotas funcionando
- ✅ Design System completo e funcional
- ✅ Dados carregando corretamente
- ✅ Performance adequada
- ✅ Sem erros críticos

---

## 🎯 PRÓXIMO PASSO

Depois de testar, podemos:
1. Implementar features faltantes (WebMapa completo, Vigilância, etc)
2. Adicionar mais funcionalidades
3. Melhorar design/UX

---

**Teste concluído?** Reporte qualquer problema encontrado!
