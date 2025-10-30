# 🐛 DEBUG DO MAPA - PASSO A PASSO

## 🔍 Verificar Console do Navegador

1. **Abra o navegador** em: http://localhost:3000/mapa

2. **Abra o Console** (F12 ou Ctrl+Shift+I)

3. **Procure pelos logs** que começam com 🗺️:

### **Logs Esperados:**

```
🗺️ MapaInterativoNovo - Total de registros: 22156
🗺️ Primeiros 3 registros: [...]
🗺️ Registros com coordenadas: 22156
🗺️ MapView - Dados recebidos: 22156
🗺️ MapView - Dados processados (com coordenadas): 22156
🗺️ MapView - Primeira coordenada: { lat: -16.660921, lng: -43.851722, ovos: 44 }
```

---

## ✅ CENÁRIO 1: Dados aparecem no console

Se você vê os logs acima, mas NÃO vê markers no mapa:

**Problema**: Markers não renderizando

**Solução**:
1. Verifique se `showClusters` está `false` no console
2. Se for `true`, clique no botão "Clusters" para desativar
3. Os markers devem aparecer

---

## ❌ CENÁRIO 2: "Total de registros: 0"

Se você vê `Total de registros: 0`:

**Problema**: CSV não carregando

**Causas possíveis**:

### A) Caminho do CSV errado

Verifique se o arquivo existe em:
- ✅ `public/data/banco_dados_aedes.csv`
- ❌ `01 - Dados/banco_dados_aedes_montes_claros_normalizado.csv`

**Solução**:
```bash
# Copiar CSV para o local correto
copy "01 - Dados\banco_dados_aedes_montes_claros_normalizado.csv" "public\data\banco_dados_aedes.csv"
```

### B) Erro no console

Procure por erros em vermelho no console:
- `Failed to fetch`
- `404 Not Found`
- `CORS error`

**Solução**: Me envie o erro exato

---

## 🔧 CENÁRIO 3: Dados carregam mas coordenadas = 0

Se você vê:
```
🗺️ Registros com coordenadas: 0
```

**Problema**: CSV sem latitude/longitude

**Solução**: Verificar formato do CSV

---

## 📊 CENÁRIO 4: Mapa não carrega (branco)

**Problema**: Token Mapbox inválido

**Solução**:
1. Verifique `.env.local`:
```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiYWVyb2Nsb3VkIiwiYSI6ImNtaGNqeTViZjJkMmQya29hd2o5cDZlOTUifQ.JWQRym8CVKRL08w2gGvnUg
```

2. Reinicie o servidor:
```bash
Ctrl+C
npm run dev
```

---

## 🎯 O QUE REPORTAR

Me envie:

1. **Screenshot do console** (F12)
2. **Os números dos logs**:
   - Total de registros: ?
   - Registros com coordenadas: ?
3. **O que você vê**:
   - [ ] Mapa carrega (ruas aparecem)
   - [ ] Markers aparecem
   - [ ] Nada aparece
4. **Erros** (se houver, em vermelho no console)

---

## 🚀 TESTE RÁPIDO

Execute esta verificação no Console do navegador:

```javascript
// Cole isso no console (F12)
console.log('TEST:', {
  token: import.meta.env.VITE_MAPBOX_TOKEN?.substring(0, 20),
  mapboxLoaded: typeof mapboxgl !== 'undefined'
});
```

Resultado esperado:
```
TEST: { token: "pk.eyJ1IjoiYWVyb2Nsb3V", mapboxLoaded: true }
```

---

**Aguardando seu feedback para continuar o debug! 🔍**
