# 📤 Instruções para Upload no GitHub

## 🚀 Como fazer upload do Dashboard Uno para o GitHub

### Opção 1: Via GitHub Web Interface (Mais Fácil)

1. **Acesse o GitHub**: Vá para [github.com](https://github.com)
2. **Crie um novo repositório**:
   - Clique em "New repository"
   - Nome: `dashboard-uno-imobiliaria`
   - Descrição: `Dashboard de métricas imobiliárias com integração API Imobzi`
   - Marque como **Público** ou **Privado** conforme preferir
   - **NÃO** inicialize com README (já temos um)

3. **Upload dos arquivos**:
   - Na página do repositório criado, clique em "uploading an existing file"
   - Arraste toda a pasta `/home/ubuntu/dashboard-uno-clean/` para o GitHub
   - Ou use "choose your files" e selecione todos os arquivos

4. **Commit inicial**:
   - Título: `🚀 Dashboard Uno - Complete structure with Imobzi API integration`
   - Descrição: `Initial commit with full dashboard structure and API integration`
   - Clique em "Commit changes"

### Opção 2: Via Git Command Line

```bash
# No terminal, dentro da pasta dashboard-uno-clean:
git remote add origin https://github.com/SEU_USUARIO/dashboard-uno-imobiliaria.git
git branch -M main
git push -u origin main
```

## 🔐 Configurar Secrets para API Imobzi

Após o upload, configure as variáveis de ambiente:

1. **Vá para Settings** do repositório
2. **Clique em "Secrets and variables" > "Actions"**
3. **Adicione as seguintes secrets**:

```
VITE_IMOBZI_API_URL = https://api.imobzi.com/v1
VITE_IMOBZI_API_KEY = sua_chave_api_aqui
VITE_IMOBZI_CLIENT_ID = seu_client_id_aqui
VITE_IMOBZI_CLIENT_SECRET = seu_client_secret_aqui
```

## 🚀 Deploy Automático

### Vercel (Recomendado)

1. **Conecte com Vercel**:
   - Vá para [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Importe o repositório `dashboard-uno-imobiliaria`

2. **Configure as variáveis**:
   - Na dashboard do Vercel, vá em "Settings" > "Environment Variables"
   - Adicione as mesmas variáveis da API Imobzi

3. **Deploy**:
   - O Vercel fará deploy automático
   - Cada push no GitHub = novo deploy automático

### Netlify

1. **Conecte com Netlify**:
   - Vá para [netlify.com](https://netlify.com)
   - Conecte sua conta GitHub
   - Importe o repositório

2. **Configure build**:
   - Build command: `cd src && npm install && npm run build`
   - Publish directory: `src/dist`

3. **Configure variáveis**:
   - Site settings > Environment variables
   - Adicione as variáveis da API Imobzi

## 🔄 Integração API Imobzi

### Passo 1: Obter Credenciais

Entre em contato com a Imobzi para obter:
- API Key
- Client ID  
- Client Secret
- URL da API (geralmente `https://api.imobzi.com/v1`)

### Passo 2: Configurar no Ambiente

**Desenvolvimento local:**
```bash
# Copie .env.example para .env
cp .env.example .env

# Configure suas credenciais no .env
VITE_IMOBZI_API_URL=https://api.imobzi.com/v1
VITE_IMOBZI_API_KEY=sua_chave_aqui
VITE_IMOBZI_CLIENT_ID=seu_client_id
VITE_IMOBZI_CLIENT_SECRET=seu_client_secret
```

**Produção:**
Configure as mesmas variáveis no Vercel/Netlify

### Passo 3: Ativar Integração

No arquivo `src/src/App.jsx`, substitua:

```javascript
// ANTES (dados simulados)
const [filteredData, setFilteredData] = useState(simulatedData);

// DEPOIS (dados reais da API)
import { useImobziData } from '../api/imobzi-integration';

const { data: companyData, loading, error } = useImobziData('company-metrics', {
  period: selectedPeriod
}, {
  autoUpdate: true,
  updateInterval: 15 * 60 * 1000 // 15 minutos
});
```

### Passo 4: Testar Integração

```bash
# No diretório src/
npm install
npm run dev

# Verificar no console se a API está conectando
# Verificar se os dados estão sendo atualizados
```

## 📋 Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Código fonte enviado
- [ ] Secrets configuradas
- [ ] Deploy no Vercel/Netlify realizado
- [ ] Credenciais da API Imobzi obtidas
- [ ] Variáveis de ambiente configuradas
- [ ] Integração API testada
- [ ] Dashboard funcionando com dados reais
- [ ] Atualizações automáticas funcionando
- [ ] Responsividade mobile testada

## 🆘 Suporte

Se precisar de ajuda:

1. **Documentação completa**: Veja `INTEGRATION_GUIDE.md`
2. **Código de integração**: Veja `api/imobzi-integration.js`
3. **Issues**: Crie issues no GitHub para problemas
4. **Imobzi**: Contate suporte@imobzi.com para credenciais

## 🎯 Resultado Final

Após seguir estas instruções, você terá:

✅ **Dashboard no GitHub** com código organizado  
✅ **Deploy automático** funcionando  
✅ **API Imobzi integrada** com dados reais  
✅ **Atualizações automáticas** a cada 15 minutos  
✅ **Sistema completo** pronto para produção  

**URL do repositório será**: `https://github.com/SEU_USUARIO/dashboard-uno-imobiliaria`  
**URL do dashboard será**: `https://dashboard-uno-imobiliaria.vercel.app` (ou similar)

---

**Dashboard Uno pronto para transformar a gestão da Uno Rede Imobiliária!** 🏠📊

