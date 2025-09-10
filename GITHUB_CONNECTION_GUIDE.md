# 🔗 Guia Completo: Conectar com GitHub

## 📋 Métodos de Conexão

### Método 1: Personal Access Token (Recomendado)

#### Passo 1: Criar Personal Access Token
1. Vá para [GitHub.com](https://github.com)
2. Clique na sua foto de perfil → **Settings**
3. No menu lateral, clique em **Developer settings**
4. Clique em **Personal access tokens** → **Tokens (classic)**
5. Clique em **Generate new token** → **Generate new token (classic)**
6. Configure o token:
   - **Note**: `Dashboard Uno - Sandbox Access`
   - **Expiration**: 30 days (ou conforme preferir)
   - **Scopes**: Marque as seguintes opções:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages)
     - ✅ `delete:packages` (Delete packages)
7. Clique em **Generate token**
8. **IMPORTANTE**: Copie o token gerado (começa com `ghp_`)

#### Passo 2: Usar o Token no Sandbox
```bash
# Método A: Via GitHub CLI
gh auth login --with-token
# Cole seu token quando solicitado

# Método B: Via Git diretamente
git remote add origin https://ghp_SEU_TOKEN@github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git
```

### Método 2: GitHub CLI Interativo

```bash
# Inicia processo interativo
gh auth login

# Siga as opções:
# 1. GitHub.com
# 2. HTTPS
# 3. Yes (authenticate Git)
# 4. Login with a web browser
# 5. Copie o código e abra o link no navegador
```

### Método 3: SSH (Avançado)

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu_email@exemplo.com"

# Adicionar ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key
```

## 🚀 Criando o Repositório

### Opção A: Via GitHub CLI (após autenticação)

```bash
# Criar repositório
gh repo create dashboard-uno-imobiliaria --public --description "Dashboard de métricas imobiliárias com integração API Imobzi"

# Fazer push
git remote add origin https://github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git
git branch -M main
git push -u origin main
```

### Opção B: Via Web Interface

1. **Criar repositório no GitHub**:
   - Vá para [github.com/new](https://github.com/new)
   - Nome: `dashboard-uno-imobiliaria`
   - Descrição: `Dashboard de métricas imobiliárias com integração API Imobzi`
   - Público ou Privado (sua escolha)
   - **NÃO** marque "Add a README file"

2. **Conectar repositório local**:
```bash
git remote add origin https://github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git
git branch -M main
git push -u origin main
```

## 🔧 Comandos Práticos

### Verificar Status da Conexão
```bash
# Verificar autenticação GitHub CLI
gh auth status

# Verificar configuração Git
git config --list | grep user
git remote -v
```

### Configurar Git (se necessário)
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu_email@exemplo.com"
```

### Fazer Push do Projeto
```bash
# Verificar status
git status

# Adicionar arquivos (se necessário)
git add .

# Fazer commit (se necessário)
git commit -m "🚀 Dashboard Uno - Complete project"

# Fazer push
git push origin main
```

## 🔐 Configurar Secrets para Deploy

Após criar o repositório, configure as secrets:

1. **Vá para o repositório no GitHub**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Clique em "New repository secret"**
4. **Adicione as seguintes secrets**:

```
Nome: VITE_IMOBZI_API_URL
Valor: https://api.imobzi.com/v1

Nome: VITE_IMOBZI_API_KEY
Valor: sua_chave_api_aqui

Nome: VITE_IMOBZI_CLIENT_ID
Valor: seu_client_id_aqui

Nome: VITE_IMOBZI_CLIENT_SECRET
Valor: seu_client_secret_aqui
```

## 🚀 Deploy Automático

### Vercel
1. Conecte sua conta GitHub no [Vercel](https://vercel.com)
2. Importe o repositório `dashboard-uno-imobiliaria`
3. Configure as variáveis de ambiente (mesmas das secrets)
4. Deploy automático a cada push!

### Netlify
1. Conecte sua conta GitHub no [Netlify](https://netlify.com)
2. Importe o repositório
3. Configure:
   - **Build command**: `cd src && npm install && npm run build`
   - **Publish directory**: `src/dist`
4. Configure as variáveis de ambiente
5. Deploy automático!

## 🔍 Troubleshooting

### Erro: "Permission denied"
```bash
# Verificar autenticação
gh auth status

# Re-autenticar se necessário
gh auth logout
gh auth login --with-token
```

### Erro: "Repository not found"
```bash
# Verificar URL do repositório
git remote -v

# Corrigir URL se necessário
git remote set-url origin https://github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git
```

### Erro: "Authentication failed"
```bash
# Para HTTPS com token
git remote set-url origin https://ghp_SEU_TOKEN@github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git

# Para SSH
git remote set-url origin git@github.com:SEU_USUARIO/dashboard-uno-imobiliaria.git
```

## 📋 Checklist de Conexão

- [ ] Personal Access Token criado
- [ ] GitHub CLI autenticado (`gh auth status`)
- [ ] Git configurado (nome e email)
- [ ] Repositório criado no GitHub
- [ ] Remote origin configurado
- [ ] Push realizado com sucesso
- [ ] Secrets configuradas (para deploy)
- [ ] Deploy configurado (Vercel/Netlify)

## 🎯 Comandos Resumidos

```bash
# 1. Autenticar (escolha um método)
gh auth login --with-token  # Cole seu token

# 2. Criar repositório
gh repo create dashboard-uno-imobiliaria --public

# 3. Configurar remote
git remote add origin https://github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git

# 4. Fazer push
git branch -M main
git push -u origin main

# 5. Verificar
gh repo view dashboard-uno-imobiliaria --web
```

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. **Verifique a autenticação**: `gh auth status`
2. **Verifique o repositório**: `git remote -v`
3. **Tente re-autenticar**: `gh auth logout && gh auth login`
4. **Use o método de token**: Mais confiável no sandbox

---

**Após conectar, o Dashboard Uno estará no GitHub e pronto para deploy! 🚀**

