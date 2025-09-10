# 🚀 Instruções de Deploy - Dashboard Uno

## 📋 Deploy Automático no Vercel (Recomendado)

### Passo 1: Conectar com Vercel
1. **Acesse**: [vercel.com/new](https://vercel.com/new)
2. **Clique em**: "Continue with GitHub"
3. **Faça login** com sua conta GitHub (redeuno)
4. **Autorize** o Vercel a acessar seus repositórios

### Passo 2: Importar Repositório
1. **Procure por**: `dashboard-uno-imobiliaria`
2. **Clique em**: "Import"
3. **Configure o projeto**:
   - **Project Name**: `dashboard-uno-imobiliaria`
   - **Framework Preset**: Vite
   - **Root Directory**: `src`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Passo 3: Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

```
VITE_IMOBZI_API_URL = https://api.imobzi.com/v1
VITE_IMOBZI_API_KEY = sua_chave_api_aqui
VITE_IMOBZI_CLIENT_ID = seu_client_id_aqui
VITE_IMOBZI_CLIENT_SECRET = seu_client_secret_aqui
```

### Passo 4: Deploy
1. **Clique em**: "Deploy"
2. **Aguarde**: O build será feito automaticamente
3. **Acesse**: Sua URL será algo como `dashboard-uno-imobiliaria.vercel.app`

---

## 📋 Deploy Alternativo no Netlify

### Passo 1: Conectar com Netlify
1. **Acesse**: [netlify.com](https://netlify.com)
2. **Clique em**: "New site from Git"
3. **Conecte** com GitHub
4. **Selecione**: `redeuno/dashboard-uno-imobiliaria`

### Passo 2: Configurar Build
```
Build command: cd src && npm install && npm run build
Publish directory: src/dist
```

### Passo 3: Variáveis de Ambiente
Em "Site settings" → "Environment variables":
```
VITE_IMOBZI_API_URL = https://api.imobzi.com/v1
VITE_IMOBZI_API_KEY = sua_chave_api_aqui
VITE_IMOBZI_CLIENT_ID = seu_client_id_aqui
VITE_IMOBZI_CLIENT_SECRET = seu_client_secret_aqui
```

---

## 🔧 Deploy Manual (Servidor Próprio)

### Passo 1: Build Local
```bash
cd src
npm install
npm run build
```

### Passo 2: Upload
1. **Faça upload** da pasta `src/dist/` para seu servidor
2. **Configure** o servidor web (Apache/Nginx)
3. **Configure** redirecionamento para SPA

### Exemplo Nginx:
```nginx
server {
    listen 80;
    server_name dashboard.unorede.com.br;
    root /var/www/dashboard-uno/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔄 Integração API Imobzi

### Opção 1: Dados Reais (Produção)
1. **Obtenha credenciais** da Imobzi
2. **Configure** as variáveis de ambiente
3. **Substitua** `App.jsx` por `App-with-api.jsx`:
```bash
cd src/src
mv App.jsx App-original.jsx
mv App-with-api.jsx App.jsx
```

### Opção 2: Dados Simulados (Demonstração)
- O dashboard já funciona com dados simulados
- Perfeito para demonstrações e testes
- Todos os recursos funcionam normalmente

---

## 📊 Monitoramento e Manutenção

### Logs de Deploy
- **Vercel**: Dashboard → Project → Functions → View Logs
- **Netlify**: Site dashboard → Deploys → Deploy log

### Atualizações Automáticas
- **Cada push** no GitHub = novo deploy automático
- **Branch main** = produção
- **Outras branches** = preview deployments

### Performance
- **Vercel**: Analytics automático
- **Netlify**: Analytics disponível
- **Core Web Vitals**: Monitoramento automático

---

## 🔐 Configuração de Domínio Personalizado

### Vercel
1. **Project Settings** → **Domains**
2. **Add Domain**: `dashboard.unorede.com.br`
3. **Configure DNS** conforme instruções

### Netlify
1. **Site Settings** → **Domain management**
2. **Add custom domain**
3. **Configure DNS** records

---

## 🆘 Troubleshooting

### Build Falha
```bash
# Verificar dependências
cd src && npm install

# Testar build local
npm run build

# Verificar logs no Vercel/Netlify
```

### API não Conecta
1. **Verificar** variáveis de ambiente
2. **Testar** credenciais da API
3. **Verificar** CORS settings

### Performance Lenta
1. **Otimizar** imagens
2. **Verificar** bundle size
3. **Implementar** lazy loading

---

## 📋 Checklist de Deploy

- [ ] Repositório no GitHub funcionando
- [ ] Vercel/Netlify conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build realizado com sucesso
- [ ] Dashboard acessível via URL
- [ ] API Imobzi configurada (opcional)
- [ ] Domínio personalizado (opcional)
- [ ] Monitoramento ativo
- [ ] Equipe treinada no uso

---

## 🎯 URLs Importantes

- **Repositório**: https://github.com/redeuno/dashboard-uno-imobiliaria
- **Deploy Vercel**: `dashboard-uno-imobiliaria.vercel.app` (após deploy)
- **Deploy Netlify**: `dashboard-uno-imobiliaria.netlify.app` (após deploy)
- **Documentação**: Veja arquivos na pasta `docs/`

---

## 🏆 Resultado Final

Após o deploy, você terá:

✅ **Dashboard online** e funcionando  
✅ **Deploy automático** a cada atualização  
✅ **Performance otimizada** para produção  
✅ **Responsivo** para mobile e desktop  
✅ **Integração API** pronta para ativar  
✅ **Sistema completo** de métricas imobiliárias  

**Dashboard Uno pronto para transformar a gestão da Uno Rede Imobiliária!** 🏠📊

