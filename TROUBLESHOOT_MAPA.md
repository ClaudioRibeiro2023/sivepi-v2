# 🗺️ TROUBLESHOOTING - MAPA NÃO APARECE

## 🔍 PROBLEMA

O WebMapa carrega a sidebar mas a área do mapa fica preta/vazia.

---

## ✅ SOLUÇÕES (Tente em Ordem)

### **1. LIMPAR CACHE DO NAVEGADOR** ⭐ (Mais Comum)

O navegador pode estar usando o token antigo em cache.

#### **Chrome/Edge**:
```
1. Ctrl + Shift + Delete
2. Marcar "Imagens e arquivos em cache"
3. Período: "Última hora"
4. Limpar dados
```

#### **OU Hard Refresh**:
```
Windows: Ctrl + Shift + R ou Ctrl + F5
Mac: Cmd + Shift + R
```

#### **OU Aba Anônima** (Teste Rápido):
```
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
```

Depois acesse: `https://sivepi.netlify.app/webmapa`

---

### **2. VERIFICAR SE NETLIFY REDEPLOY ACONTECEU**

O token foi atualizado no Netlify, mas precisa de redeploy:

1. Acesse: https://app.netlify.com/
2. Site **sivepi** → **Deploys**
3. Verifique se há um deploy **após** você ter atualizado o token
4. Se NÃO houver:
   - Clique **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Aguarde 2-3 minutos
   - Teste novamente

---

### **3. VERIFICAR TOKEN NO CONSOLE DO NAVEGADOR**

Abra o DevTools (F12) e vá na aba **Console**:

#### **Procure por**:
- ✅ `✓ Carregados 22154 registros do CSV` (dados OK)
- ❌ Erros vermelhos do Mapbox
- ❌ `401` ou `403` errors

#### **Erros Comuns**:

**Erro 401** (Token inválido):
```
Failed to load resource: the server responded with a status of 401
you may have provided an invalid Mapbox access token
```
**Solução**: Token não foi atualizado. Refaça deploy no Netlify.

**Erro 403** (Token sem permissões):
```
Failed to load resource: the server responded with a status of 403
```
**Solução**: Token precisa de URL restrictions corretas no Mapbox.

**CSS não carrega**:
```
Failed to load mapbox-gl.css
```
**Solução**: Problema de build. Fazer redeploy.

---

### **4. VERIFICAR SE TOKEN ESTÁ CORRETO**

No console do navegador, digite:
```javascript
console.log(import.meta.env.VITE_MAPBOX_TOKEN)
```

**Deve mostrar**:
```
pk.eyJ1IjoiYWVyb2Nsb3VkIiwiYSI6ImNtaGRmeG51czAybGEyaXBpbnBnbXJ4YTUifQ.fytNZZh4RwFzBakOysr6-A
```

**Se mostrar**:
- `undefined` → Token não foi configurado corretamente no Netlify
- Token diferente → Netlify não fez redeploy
- Token `sk.` → PERIGO! Usar token público `pk.`

---

### **5. VERIFICAR URL RESTRICTIONS NO MAPBOX**

1. Acesse: https://account.mapbox.com/access-tokens/
2. Clique no token **sivepi** ou **aerocloud**
3. Verifique **URL restrictions**:

**Deve conter**:
```
https://sivepi.netlify.app/*
http://localhost:*
```

**Se não tiver**:
1. Clique em **"Edit"**
2. Adicione as URLs acima
3. Salve
4. Aguarde 1-2 minutos (propagação)
5. Hard refresh no navegador

---

### **6. TESTAR LOCALMENTE**

Para verificar se o problema é no Netlify ou no código:

```bash
# No terminal, na pasta do projeto:
npm run dev
```

Acesse: `http://localhost:3001/webmapa`

**Se funcionar localmente mas não no Netlify**:
- Problema: Deploy do Netlify
- Solução: Trigger deploy novamente

**Se não funcionar localmente também**:
- Problema: Código ou token
- Solução: Verificar `.env.local` e token

---

## 🔧 CHECKLIST COMPLETO

Execute em ordem:

- [ ] **1. Hard refresh** (Ctrl + Shift + R)
- [ ] **2. Aba anônima** (teste rápido)
- [ ] **3. Verificar console** (F12 → Console)
- [ ] **4. Verificar Network** (F12 → Network → procurar `mapbox`)
- [ ] **5. Conferir se Netlify fez redeploy após atualizar token**
- [ ] **6. Se necessário, trigger deploy manual no Netlify**
- [ ] **7. Aguardar 2-3 min após deploy**
- [ ] **8. Hard refresh novamente**
- [ ] **9. Testar em outro navegador**
- [ ] **10. Verificar URL restrictions no Mapbox**

---

## 🎯 RESUMO RÁPIDO

### **99% dos casos**:
```
1. Hard refresh (Ctrl + Shift + R)
2. OU aba anônima
3. OU aguardar Netlify fazer redeploy
```

### **Se nada funcionar**:
```
1. Netlify → Trigger deploy (clear cache)
2. Aguardar 3 minutos
3. Hard refresh
```

---

## 📞 DEBUG AVANÇADO

Se nada acima resolver, execute no console do navegador:

```javascript
// Verificar token
console.log('Token:', import.meta.env.VITE_MAPBOX_TOKEN);

// Verificar se mapbox-gl está carregado
console.log('Mapbox:', window.mapboxgl);

// Verificar dados
console.log('Dados carregados:', localStorage.getItem('ovitrapData'));
```

Copie o output e me envie para análise.

---

## ✅ SOLUÇÃO DEFINITIVA

**Se você já**:
1. ✅ Atualizou token no Netlify
2. ✅ Fez redeploy (clear cache)
3. ✅ Aguardou 3 minutos
4. ✅ Fez hard refresh

**E ainda não funciona**:

Pode ser problema de **CSS do Mapbox não carregando**.

**Solução**: Vou criar um commit que força o import do CSS do Mapbox.

Me avise se chegou a este ponto!

---

**Data**: 2025-10-30  
**Versão**: 2.1.0
