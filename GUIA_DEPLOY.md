# 🚀 GUIA DE DEPLOY - SIVEPI V2

> **Deploy em produção** - Netlify, Vercel ou servidor próprio

**Versão**: 2.0.0  
**Data**: 2025-10-30

---

## 📋 PRÉ-REQUISITOS

Antes de fazer deploy, certifique-se de:
- ✅ Sistema testado localmente
- ✅ Todos os módulos funcionando
- ✅ Token Mapbox válido
- ✅ Dados CSV no lugar correto
- ✅ Build local funciona (`npm run build`)

---

## 🎯 OPÇÕES DE DEPLOY

### **Opção 1: Netlify** (Recomendado - Grátis)
- ✅ Deploy automático via Git
- ✅ HTTPS grátis
- ✅ CDN global
- ✅ Fácil configuração

### **Opção 2: Vercel** (Alternativa - Grátis)
- ✅ Deploy automático via Git
- ✅ HTTPS grátis
- ✅ Performance otimizada
- ✅ Analytics incluído

### **Opção 3: Servidor Próprio**
- ⚠️ Requer configuração manual
- ⚠️ Você gerencia servidor
- ✅ Controle total

---

## 🚀 DEPLOY NO NETLIFY (RECOMENDADO)

### **Passo 1: Criar Conta**
1. Acesse: https://www.netlify.com/
2. Clique em "Sign Up"
3. Use GitHub, GitLab ou email

### **Passo 2: Preparar Projeto**

```bash
# 1. Criar repositório Git (se ainda não tem)
git init
git add .
git commit -m "Deploy: SIVEPI V2"

# 2. Criar repositório no GitHub
# (via interface GitHub.com)

# 3. Push para GitHub
git remote add origin https://github.com/seu-usuario/sivepi-v2.git
git branch -M main
git push -u origin main
```

### **Passo 3: Conectar no Netlify**

1. No Netlify, clique em **"Add new site"** → **"Import an existing project"**
2. Escolha **GitHub**
3. Selecione o repositório **sivepi-v2**
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

### **Passo 4: Configurar Variáveis de Ambiente**

1. No Netlify, vá em **Site settings** → **Environment variables**
2. Adicione:
   ```
   VITE_MAPBOX_TOKEN = pk.eyJ1IjoibGl2aWFyYXVqb3NpbHZhIiwiYSI6ImNtM2czejQzYTBhNXQyaXB5cHhsajFjZjkifQ.YU_xkM6OfCEiQJb-xWQKEQ
   ```

### **Passo 5: Deploy**

1. Clique em **"Deploy site"**
2. Aguarde ~2-3 minutos
3. ✅ Site estará no ar em: `https://seu-site.netlify.app`

### **Passo 6: Customizar Domínio (Opcional)**

1. Vá em **Domain settings**
2. Clique em **"Add custom domain"**
3. Configure DNS conforme instruções
4. Exemplo: `sivepi.montesclaros.mg.gov.br`

---

## 🚀 DEPLOY NO VERCEL (ALTERNATIVA)

### **Passo 1: Criar Conta**
1. Acesse: https://vercel.com/
2. Clique em "Sign Up"
3. Use GitHub

### **Passo 2: Import Projeto**

1. Clique em **"Add New..."** → **"Project"**
2. Import repositório do GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### **Passo 3: Variáveis de Ambiente**

1. Na aba **Environment Variables**
2. Adicione:
   ```
   VITE_MAPBOX_TOKEN = pk.eyJ1IjoibGl2aWFyYXVqb3NpbHZhIiwiYSI6ImNtM2czejQzYTBhNXQyaXB5cHhsajFjZjkifQ.YU_xkM6OfCEiQJb-xWQKEQ
   ```

### **Passo 4: Deploy**

1. Clique em **"Deploy"**
2. Aguarde ~2 minutos
3. ✅ Site estará no ar em: `https://seu-site.vercel.app`

---

## 🖥️ DEPLOY EM SERVIDOR PRÓPRIO

### **Requisitos**:
- Node.js 18+
- Nginx ou Apache
- HTTPS configurado
- Domínio próprio

### **Passo 1: Build Local**

```bash
# 1. Instalar dependências
npm install

# 2. Build para produção
npm run build

# 3. Testar build localmente
npm run preview
```

### **Passo 2: Upload para Servidor**

```bash
# Via SCP/SFTP
scp -r dist/* usuario@servidor:/var/www/sivepi/

# Ou via Git
git clone https://github.com/seu-usuario/sivepi-v2.git
cd sivepi-v2
npm install
npm run build
```

### **Passo 3: Configurar Nginx**

```nginx
server {
    listen 80;
    server_name sivepi.dominio.com.br;
    root /var/www/sivepi/dist;
    index index.html;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sivepi.dominio.com.br;
    root /var/www/sivepi/dist;
    index index.html;

    # SSL
    ssl_certificate /etc/ssl/certs/sivepi.crt;
    ssl_certificate_key /etc/ssl/private/sivepi.key;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer" always;
}
```

### **Passo 4: Reiniciar Nginx**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 CONFIGURAÇÕES PÓS-DEPLOY

### **1. Verificar Funcionamento**

Teste todas as rotas:
- ✅ `https://seu-site.com/dashboard`
- ✅ `https://seu-site.com/webmapa`
- ✅ `https://seu-site.com/panorama`
- ✅ `https://seu-site.com/vigilancia`
- ✅ `https://seu-site.com/qualidade`
- ✅ `https://seu-site.com/sazonal`
- ✅ `https://seu-site.com/resposta`

### **2. Configurar Analytics (Opcional)**

#### **Google Analytics**:
```typescript
// Em src/main.tsx ou App.tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

#### **Netlify Analytics**:
1. No Netlify, vá em **Analytics**
2. Clique em **"Enable Analytics"**
3. Painel de analytics disponível

### **3. Monitoramento**

#### **Uptime Monitoring**:
- Use: UptimeRobot, Pingdom, ou StatusCake
- Configure alertas por email

#### **Error Tracking**:
- Use: Sentry
- Integre para capturar erros

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🔒 SEGURANÇA

### **Checklist de Segurança**:
- ✅ HTTPS habilitado
- ✅ Headers de segurança configurados
- ✅ Token Mapbox protegido (variável de ambiente)
- ✅ CSP (Content Security Policy) configurado
- ✅ Sem dados sensíveis no código
- ✅ Dependências atualizadas

### **Headers de Segurança** (já configurados):
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: interest-cohort=()
```

---

## 📊 PERFORMANCE

### **Otimizações Aplicadas**:
- ✅ Code splitting (lazy loading)
- ✅ Gzip/Brotli compression
- ✅ Cache de assets estáticos
- ✅ CDN para distribuição
- ✅ Minificação de CSS/JS
- ✅ Tree shaking

### **Métricas Esperadas**:
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3s
- **Lighthouse Score**: 90+

---

## 🔄 CI/CD (Deploy Automático)

### **Netlify/Vercel**:
- ✅ Deploy automático a cada push no GitHub
- ✅ Preview para branches
- ✅ Rollback fácil

### **GitHub Actions** (para servidor próprio):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_MAPBOX_TOKEN: ${{ secrets.MAPBOX_TOKEN }}
          
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v2
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/sivepi/dist
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Build falha**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Problema: Mapa não aparece em produção**
- Verificar se variável `VITE_MAPBOX_TOKEN` está configurada
- Token deve começar com `pk.`
- Verificar console do navegador

### **Problema: Rotas retornam 404**
- Verificar configuração de rewrites (netlify.toml / vercel.json)
- Nginx precisa do `try_files` configurado

### **Problema: Assets não carregam**
- Verificar se `base` no `vite.config.ts` está correto
- Para subpasta: `base: '/subpasta/'`

---

## 📞 SUPORTE

### **Recursos**:
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

### **Contato**:
- Email: suporte@sivepi.gov.br
- Documentação: Ver `README_FINAL.md`

---

## ✅ CHECKLIST FINAL

Antes de considerar deploy completo:

- ⬜ Build local funciona
- ⬜ Testes passaram
- ⬜ Token Mapbox configurado
- ⬜ Deploy realizado
- ⬜ HTTPS funcionando
- ⬜ Todas rotas acessíveis
- ⬜ Dados carregam corretamente
- ⬜ Mapa renderiza
- ⬜ Performance adequada
- ⬜ Sem erros no console
- ⬜ Analytics configurado (opcional)
- ⬜ Monitoramento ativo (opcional)

---

## 🎉 DEPLOY COMPLETO!

**Sistema em produção**: ✅

**URL de Produção**: `https://_____.netlify.app`

**Próximos passos**:
1. Compartilhar URL com equipe
2. Treinar usuários
3. Monitorar uso
4. Coletar feedback
5. Iterar melhorias

---

**Versão**: 2.0.0  
**Status**: ✅ Production  
**Data**: 2025-10-30

🚀 **Sistema SIVEPI V2 no ar!**
