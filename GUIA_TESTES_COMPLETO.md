# 🧪 GUIA DE TESTES COMPLETO - SIVEPI V2

> **Checklist sistemático** para validar todas as funcionalidades

**Servidor**: http://localhost:3001  
**Status**: ✅ Rodando  
**Data**: 2025-10-30

---

## 🎯 CHECKLIST GERAL

### **Antes de Começar**:
- ✅ Servidor rodando (http://localhost:3001)
- ⬜ Console do navegador aberto (F12)
- ⬜ Sem erros no console
- ⬜ Performance tab aberta (opcional)

---

## 📋 TESTES POR MÓDULO

### **1. DASHBOARD** (`/dashboard`) ⬜

**URL**: http://localhost:3001/dashboard

#### **Checklist**:
- ⬜ Página carrega em <2 segundos
- ⬜ **FilterPanel** aparece no topo
- ⬜ **4 cards principais** renderizam:
  - ⬜ IPO com mini gráfico sparkline
  - ⬜ Total de Ovos com mini gráfico
  - ⬜ Ovitrampas Positivas
  - ⬜ Total de Ovitrampas

#### **Cards de Indicadores**:
- ⬜ **4 cards de indicadores** aparecem:
  - ⬜ IB (Índice de Breteau)
  - ⬜ IDO (Densidade de Ovos)
  - ⬜ Mediana
  - ⬜ Desvio Padrão
- ⬜ Valores são números válidos
- ⬜ Badges de risco com cores corretas

#### **Análise de Tendência**:
- ⬜ Gráfico de tendência aparece
- ⬜ Linha renderiza corretamente
- ⬜ Card mostra: "Tendência: [crescente/decrescente/estável]"
- ⬜ Percentual de variação aparece

#### **Sistema de Alertas**:
- ⬜ Se IPO > 10%, alerta "IPO CRÍTICO" aparece
- ⬜ Alertas têm botão "Ver Detalhes"
- ⬜ Badges de prioridade corretos

#### **Top 3 Áreas Críticas**:
- ⬜ 3 cards de bairros aparecem
- ⬜ Ordenados por quantidade de ovos
- ⬜ Badges de risco corretos
- ⬜ Estatísticas por bairro

#### **Quick Actions**:
- ⬜ 3 botões grandes aparecem
- ⬜ Clique em "Ver Mapa" → navega para `/webmapa`
- ⬜ Clique em "Panorama" → navega para `/panorama`
- ⬜ Clique em "Vigilância" → navega para `/vigilancia`

#### **Filtros**:
- ⬜ Selecionar **Ano** → dados atualizam
- ⬜ Selecionar **Mês** → dados atualizam
- ⬜ Selecionar **Bairro** → dados atualizam
- ⬜ Badge mostra "X filtros ativos"
- ⬜ "Limpar Filtros" → reseta tudo

**Status Dashboard**: ⬜ PASSOU / ⬜ FALHOU

---

### **2. WEBMAPA** (`/webmapa`) ⬜

**URL**: http://localhost:3001/webmapa

#### **Checklist**:
- ⬜ Página carrega em <3 segundos
- ⬜ **Mapa Mapbox** renderiza corretamente
- ⬜ Mapa está centralizado em Montes Claros
- ⬜ Zoom está em nível adequado

#### **Markers e Clustering**:
- ⬜ **Clusters** aparecem (números em círculos)
- ⬜ Cores dos clusters corretas:
  - ⬜ Verde (baixo risco)
  - ⬜ Amarelo (médio)
  - ⬜ Laranja (alto)
  - ⬜ Vermelho (crítico)
- ⬜ Zoom in → clusters se expandem
- ⬜ Zoom out → markers se agrupam
- ⬜ Performance fluida (60 FPS)

#### **Sidebar**:
- ⬜ Sidebar aparece à direita
- ⬜ Botão "Recolher/Expandir" funciona
- ⬜ **Estatísticas** aparecem:
  - ⬜ Total de ovitrampas
  - ⬜ Ovitrampas positivas
  - ⬜ IPO (%)
  - ⬜ Total de ovos
- ⬜ **Legenda** com 4 níveis de risco

#### **Heatmap**:
- ⬜ Toggle "Heatmap" aparece
- ⬜ Clicar → mapa de calor aparece
- ⬜ Cores adequadas (verde → amarelo → vermelho)
- ⬜ Clicar novamente → heatmap desaparece

#### **Filtros**:
- ⬜ FilterPanel funciona
- ⬜ Filtrar por ano → markers atualizam
- ⬜ Filtrar por bairro → zoom no bairro
- ⬜ Estatísticas da sidebar atualizam

#### **Interatividade**:
- ⬜ Clicar em cluster → zoom in
- ⬜ Clicar em marker → popup aparece com dados
- ⬜ Arrastar mapa → funciona
- ⬜ Scroll para zoom → funciona

**Status WebMapa**: ⬜ PASSOU / ⬜ FALHOU

---

### **3. PANORAMA** (`/panorama`) ⬜

**URL**: http://localhost:3001/panorama

#### **Checklist**:
- ⬜ Página carrega em <2 segundos
- ⬜ **3 gráficos** aparecem

#### **Gráfico 1: IPO por Mês**:
- ⬜ Gráfico de linha aparece
- ⬜ Dados renderizados corretamente
- ⬜ Eixo X com meses
- ⬜ Eixo Y com valores de IPO
- ⬜ Tooltip ao passar mouse
- ⬜ Linha de referência (10%) aparece

#### **Gráfico 2: Total de Ovos**:
- ⬜ Gráfico de barras aparece
- ⬜ Barras com cores adequadas
- ⬜ Tooltip funciona
- ⬜ Dados corretos

#### **Gráfico 3: Distribuição por Bairro**:
- ⬜ Gráfico renderiza
- ⬜ Top bairros aparecem
- ⬜ Ordenação correta
- ⬜ Tooltip detalhado

#### **Filtros**:
- ⬜ Filtrar → todos gráficos atualizam
- ⬜ Performance mantida

**Status Panorama**: ⬜ PASSOU / ⬜ FALHOU

---

### **4. VIGILÂNCIA** (`/vigilancia`) ⬜

**URL**: http://localhost:3001/vigilancia

#### **Checklist**:
- ⬜ Página carrega em <2 segundos

#### **Cards de Indicadores**:
- ⬜ **IPO** card aparece com valor correto
- ⬜ **IB** card com valor
- ⬜ **IDO** card com valor
- ⬜ **IR** card com valor
- ⬜ Badges de risco corretos (baixo/médio/alto/crítico)
- ⬜ Ícones apropriados

#### **Tabela de Bairros**:
- ⬜ Tabela renderiza
- ⬜ Colunas: Bairro, Ovitrampas, Positivas, IPO, Ovos, Risco
- ⬜ Dados preenchidos corretamente
- ⬜ Badges de risco coloridos
- ⬜ Clicar em header → ordena coluna
- ⬜ Scroll funciona se muitos bairros

#### **Sistema de Alertas**:
- ⬜ Alertas aparecem para bairros críticos
- ⬜ Cores corretas (vermelho para crítico)
- ⬜ Mensagens claras

#### **Filtros**:
- ⬜ Filtrar → tabela atualiza
- ⬜ Indicadores recalculados

**Status Vigilância**: ⬜ PASSOU / ⬜ FALHOU

---

### **5. QUALIDADE** (`/qualidade`) ⬜

**URL**: http://localhost:3001/qualidade

#### **Checklist**:
- ⬜ Página carrega em <2 segundos

#### **Score Geral**:
- ⬜ Card com score 0-100% aparece
- ⬜ Barra de progresso colorida
- ⬜ Badge de qualidade (Excelente/Boa/Regular/Ruim)

#### **Métricas de Qualidade**:
- ⬜ 3 cards de métricas:
  - ⬜ Registros completos
  - ⬜ Registros incompletos
  - ⬜ Campos com problemas
- ⬜ Valores numéricos corretos

#### **Campos Faltantes**:
- ⬜ Lista de campos aparece
- ⬜ Ordenada por quantidade faltante
- ⬜ Percentuais corretos
- ⬜ Barras de progresso

#### **Detecção de Anomalias**:
- ⬜ Card de anomalias aparece
- ⬜ Lista de problemas detectados:
  - ⬜ Coordenadas inválidas
  - ⬜ Quantidade anômala
  - ⬜ Datas futuras
  - ⬜ Semanas inválidas
- ⬜ Badges de severidade corretos
- ⬜ Contadores de anomalias

#### **Score por Bairro**:
- ⬜ Top 10 piores bairros listados
- ⬜ Scores individuais
- ⬜ Barras de progresso
- ⬜ Cores adequadas

#### **Recomendações**:
- ⬜ Card de recomendações aparece
- ⬜ Lista com ações sugeridas
- ⬜ Baseadas nos problemas encontrados

**Status Qualidade**: ⬜ PASSOU / ⬜ FALHOU

---

### **6. ANÁLISE SAZONAL** (`/sazonal`) ⬜

**URL**: http://localhost:3001/sazonal

#### **Checklist**:
- ⬜ Página carrega em <2 segundos

#### **Cards Indicadores Sazonais**:
- ⬜ **Pico Sazonal** card:
  - ⬜ Mês identificado
  - ⬜ Média de ovos
  - ⬜ Badge vermelho
- ⬜ **Menor Infestação** card:
  - ⬜ Mês identificado
  - ⬜ Badge verde
- ⬜ **Índice de Sazonalidade** card:
  - ⬜ Percentual calculado
  - ⬜ Classificação (alta/moderada/baixa)

#### **Gráfico de Padrão Mensal**:
- ⬜ Gráfico de linha aparece
- ⬜ 12 meses no eixo X
- ⬜ Duas linhas:
  - ⬜ Média de ovos (laranja)
  - ⬜ IPO % (vermelha)
- ⬜ Linha de referência (média anual)
- ⬜ Tooltip detalhado

#### **Distribuição por Mês (Boxplot)**:
- ⬜ Gráfico de barras aparece
- ⬜ Barras representam mediana
- ⬜ Tooltip mostra min/max/Q1/Q3

#### **Padrão Semanal**:
- ⬜ Gráfico de semanas epidemiológicas
- ⬜ 52 semanas no eixo X
- ⬜ Linha de tendência

#### **Interpretação**:
- ⬜ Card de interpretação aparece
- ⬜ Texto em português claro
- ⬜ Menciona pico e vale
- ⬜ Dá recomendações operacionais

**Status Sazonal**: ⬜ PASSOU / ⬜ FALHOU

---

### **7. RESPOSTA OPERACIONAL** (`/resposta`) ⬜

**URL**: http://localhost:3001/resposta

#### **Checklist**:
- ⬜ Página carrega em <2 segundos

#### **Estatísticas Operacionais**:
- ⬜ 4 cards de stats aparecem:
  - ⬜ Total de equipes
  - ⬜ Equipes em campo
  - ⬜ Itens de inventário
  - ⬜ Áreas críticas

#### **Gestão de Equipes**:
- ⬜ Lista de equipes aparece
- ⬜ Cards de equipes com:
  - ⬜ Nome da equipe
  - ⬜ Status (Ativa/Em campo)
  - ⬜ Membros
  - ⬜ Área de atuação
  - ⬜ Última ação
- ⬜ Badges de status coloridos

#### **Controle de Inventário**:
- ⬜ Lista de itens aparece
- ⬜ Para cada item:
  - ⬜ Nome
  - ⬜ Quantidade
  - ⬜ Limite mínimo
  - ⬜ Barra de progresso
  - ⬜ Badge de alerta se estoque baixo
- ⬜ Cores corretas (verde/amarelo/vermelho)

#### **Áreas Prioritárias**:
- ⬜ Lista de áreas críticas
- ⬜ Cards com:
  - ⬜ Nome do bairro
  - ⬜ IPO
  - ⬜ Total de ovos
  - ⬜ Prioridade (Alta/Média/Baixa)
  - ⬜ Botão "Despachar Equipe"
- ⬜ Cores por prioridade

#### **Checklist de Intervenções**:
- ⬜ Lista de 6 ações padrão
- ⬜ Visual de checklist

**Status Resposta**: ⬜ PASSOU / ⬜ FALHOU

---

### **8. RELATÓRIOS** (`/relatorios`) ⬜

**URL**: http://localhost:3001/relatorios

#### **Checklist**:
- ⬜ Página carrega
- ⬜ Interface básica funcional
- ⬜ (Módulo pode estar em desenvolvimento)

**Status Relatórios**: ⬜ PASSOU / ⬜ FALHOU / ⬜ EM DEV

---

### **9. DESIGN SYSTEM** (`/design-system`) ⬜

**URL**: http://localhost:3001/design-system

#### **Checklist**:
- ⬜ Página carrega
- ⬜ Mostra componentes do Design System:
  - ⬜ Buttons (variantes)
  - ⬜ Cards
  - ⬜ Badges
  - ⬜ Inputs
- ⬜ Exemplos visuais

**Status Design System**: ⬜ PASSOU / ⬜ FALHOU

---

## 🎯 TESTES DE PERFORMANCE

### **Carregamento** ⬜
- ⬜ Dashboard: <2s
- ⬜ WebMapa: <3s
- ⬜ Outros módulos: <2s

### **Interatividade** ⬜
- ⬜ Filtros respondem em <100ms
- ⬜ Navegação instantânea
- ⬜ Gráficos renderizam rápido

### **Mapa** ⬜
- ⬜ 60 FPS durante navegação
- ⬜ Clustering instantâneo
- ⬜ Sem lag ao zoom

---

## 🌐 TESTES CROSS-BROWSER

### **Chrome** ⬜
- ⬜ Todas funcionalidades OK

### **Firefox** ⬜
- ⬜ Abrir em Firefox
- ⬜ Testar módulos principais
- ⬜ Verificar compatibilidade

### **Edge** ⬜
- ⬜ Abrir em Edge
- ⬜ Testar módulos principais

---

## 🔧 TESTES TÉCNICOS

### **Console** ⬜
- ⬜ Abrir DevTools (F12)
- ⬜ Aba Console:
  - ⬜ Sem erros vermelhos críticos
  - ⬜ Warnings aceitáveis (lint, etc)

### **Network** ⬜
- ⬜ Aba Network:
  - ⬜ CSV carrega em <500ms
  - ⬜ Sem requests falhando (404, 500)

### **Performance** ⬜
- ⬜ Aba Performance:
  - ⬜ FPS > 60
  - ⬜ Sem memory leaks visíveis

---

## 📊 TESTES DE DADOS

### **Validação** ⬜
- ⬜ IPO entre 0-100%
- ⬜ Quantidade de ovos ≥ 0
- ⬜ Datas válidas
- ⬜ Coordenadas dentro do range

### **Cálculos** ⬜
- ⬜ IPO = (positivas / total) × 100
- ⬜ Média calculada corretamente
- ⬜ Agregações por bairro corretas

---

## ✅ RESUMO FINAL

### **Módulos Testados**:
- ⬜ Dashboard
- ⬜ WebMapa
- ⬜ Panorama
- ⬜ Vigilância
- ⬜ Qualidade
- ⬜ Sazonal
- ⬜ Resposta
- ⬜ Relatórios
- ⬜ Design System

### **Performance**:
- ⬜ Carregamento OK
- ⬜ Interatividade OK
- ⬜ FPS OK

### **Compatibilidade**:
- ⬜ Chrome
- ⬜ Firefox
- ⬜ Edge

### **Dados**:
- ⬜ Validação OK
- ⬜ Cálculos OK

---

## 🎯 STATUS FINAL DOS TESTES

**Total de Checklist Items**: ~150+

**Passaram**: _____ / 150

**Falharam**: _____ / 150

**Taxa de Sucesso**: _____%

---

## 🐛 BUGS ENCONTRADOS

Liste aqui qualquer bug encontrado:

1. 
2. 
3. 

---

## 💡 MELHORIAS SUGERIDAS

Liste melhorias opcionais:

1. 
2. 
3. 

---

## ✅ CONCLUSÃO

**Sistema está**: ⬜ PRONTO PARA PRODUÇÃO / ⬜ NECESSITA AJUSTES

**Notas finais**:


---

**Testador**: _____________  
**Data**: 2025-10-30  
**Versão**: 2.0.0
