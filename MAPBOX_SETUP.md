# 🗺️ CONFIGURAÇÃO DO MAPBOX

## 📋 Passo a Passo

### 1. Criar Conta Gratuita

Acesse: https://account.mapbox.com/auth/signup/

- ✅ **Grátis** até 50.000 carregamentos/mês
- ✅ Sem cartão de crédito necessário
- ✅ Recursos completos

### 2. Obter Token de Acesso

Após login, acesse: https://account.mapbox.com/access-tokens/

1. Clique em **"Create a token"**
2. Nome sugerido: `SIVEPI-Montes-Claros`
3. Scopes necessários:
   - ✅ `styles:read`
   - ✅ `fonts:read`
   - ✅ `datasets:read`
   - ✅ `vision:read`

4. Copie o token (começa com `pk.`)

### 3. Configurar no Projeto

Abra o arquivo `.env.local` e cole seu token:

```env
VITE_MAPBOX_TOKEN=pk.seu_token_aqui_colado
```

**Exemplo**:
```env
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoic2l2ZXBpLW1jIiwiYSI6ImNsdG1jNHMwMTAwNGFqanMxcW9yNWFvZWQifQ.5Zy_example_token
```

### 4. Reiniciar Servidor

```bash
# Pare o servidor (Ctrl+C se estiver rodando)

# Inicie novamente
npm run dev
```

### 5. Testar

1. Acesse: http://localhost:3002/mapa
2. Deve ver o mapa de Montes Claros carregado
3. Markers de ovitrampas aparecerão no mapa

---

## ✅ Validação

Se configurado corretamente, você verá:
- ✅ Mapa de ruas de Montes Claros
- ✅ Markers coloridos (verde, amarelo, vermelho, roxo)
- ✅ Controles de zoom e navegação
- ✅ Popup ao clicar em markers

---

## ❌ Troubleshooting

### Erro: "Unauthorized" ou mapa não carrega

**Solução**:
1. Verifique se o token está no `.env.local`
2. Reinicie o servidor (`npm run dev`)
3. Limpe cache do navegador (Ctrl+Shift+R)

### Erro: "Token expirado"

**Solução**:
1. Acesse https://account.mapbox.com/access-tokens/
2. Gere um novo token
3. Substitua no `.env.local`

### Mapa carrega mas sem dados

**Solução**:
1. Verifique se o CSV foi carregado (console do navegador)
2. Veja se há registros com latitude/longitude válidas
3. Zoom out para ver todos os markers

---

## 📊 Limites do Plano Gratuito

- ✅ 50.000 carregamentos/mês
- ✅ Todos os estilos de mapa
- ✅ Geocoding (1.000/mês)
- ✅ Directions (500/mês)

Para SIVEPI Montes Claros: **mais que suficiente** ✅

---

## 🔐 Segurança

**Importante**:
- ❌ Nunca commite o `.env.local` no git
- ❌ Nunca exponha o token publicamente
- ✅ Use o arquivo `.env.local` (já está no .gitignore)
- ✅ Token com prefixo `pk.` é seguro para frontend

---

## 📚 Recursos

- Documentação: https://docs.mapbox.com/
- Exemplos: https://docs.mapbox.com/mapbox-gl-js/example/
- Suporte: https://support.mapbox.com/

---

**Token configurado?** Teste agora em: http://localhost:3002/mapa 🗺️
