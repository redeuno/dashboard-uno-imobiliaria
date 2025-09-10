# 🔌 Guia Completo de Integração API Imobzi

Este guia detalha como integrar o Dashboard Uno com a API da Imobzi, substituindo os dados simulados por dados reais.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Autenticação](#autenticação)
4. [Implementação Passo a Passo](#implementação-passo-a-passo)
5. [Testes](#testes)
6. [Deploy com API](#deploy-com-api)
7. [Monitoramento](#monitoramento)
8. [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Credenciais Necessárias
- **API Key** da Imobzi
- **Client ID** da aplicação
- **Client Secret** da aplicação
- **URL base** da API (geralmente `https://api.imobzi.com/v1`)

### Permissões Necessárias
- Leitura de leads
- Leitura de negócios
- Leitura de métricas
- Leitura de dados de corretores

## ⚙️ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure suas credenciais:

```env
VITE_IMOBZI_API_URL=https://api.imobzi.com/v1
VITE_IMOBZI_API_KEY=sua_chave_api_aqui
VITE_IMOBZI_CLIENT_ID=seu_client_id_aqui
VITE_IMOBZI_CLIENT_SECRET=seu_client_secret_aqui
```

### 2. Instalar Dependências Adicionais

```bash
npm install axios date-fns lodash
```

## 🔐 Autenticação

### OAuth 2.0 Flow

A API Imobzi utiliza OAuth 2.0 com Client Credentials Grant:

```javascript
// Exemplo de autenticação
const authenticate = async () => {
  const response = await fetch('https://api.imobzi.com/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.VITE_IMOBZI_CLIENT_ID,
      client_secret: process.env.VITE_IMOBZI_CLIENT_SECRET,
    }),
  });
  
  const { access_token } = await response.json();
  return access_token;
};
```

## 🔄 Implementação Passo a Passo

### Passo 1: Substituir Dados Simulados

#### Antes (dados simulados):
```javascript
// src/App.jsx - ANTES
const [filteredData, setFilteredData] = useState(simulatedData);
```

#### Depois (dados reais):
```javascript
// src/App.jsx - DEPOIS
import { useImobziData } from './api/imobzi-integration';

const { data: companyData, loading, error } = useImobziData('company-metrics', {
  period: selectedPeriod
}, {
  autoUpdate: true,
  updateInterval: 15 * 60 * 1000
});
```

### Passo 2: Atualizar Componentes

#### Dashboard Principal:
```javascript
// src/components/Dashboard.jsx
function Dashboard() {
  const { data, loading, error, lastUpdated } = useImobziData('company-metrics');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="dashboard">
      <KPICards data={data} />
      <ProgressCharts data={data} />
      <FunnelChart data={data.funnel} />
      <LastUpdated time={lastUpdated} />
    </div>
  );
}
```

#### Performance por Corretor:
```javascript
// src/components/BrokerPerformance.jsx
function BrokerPerformance({ brokerId }) {
  const { data: brokerData } = useImobziData('broker-metrics', {
    brokerId,
    period: selectedPeriod
  });
  
  return (
    <div className="broker-performance">
      <BrokerKPIs data={brokerData} />
      <ActivityGoals data={brokerData} />
    </div>
  );
}
```

### Passo 3: Implementar Cache Inteligente

```javascript
// src/services/cacheService.js
class CacheService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
```

### Passo 4: Tratamento de Erros

```javascript
// src/components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Ops! Algo deu errado</h2>
          <p>Erro na conexão com a API Imobzi</p>
          <button onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## 🧪 Testes

### Teste de Conexão

```javascript
// src/tests/api-connection.test.js
import { ImobziAPI } from '../api/imobzi-integration';

describe('Conexão API Imobzi', () => {
  let api;
  
  beforeEach(() => {
    api = new ImobziAPI();
  });
  
  test('deve autenticar com sucesso', async () => {
    const result = await api.authenticate();
    expect(result).toBe(true);
    expect(api.accessToken).toBeTruthy();
  });
  
  test('deve buscar métricas da empresa', async () => {
    await api.authenticate();
    const data = await api.get('/metrics/company');
    expect(data).toHaveProperty('total_sales_value');
  });
});
```

### Teste de Integração

```bash
# Executar testes
npm test

# Teste específico da API
npm test -- --grep "API"
```

## 🚀 Deploy com API

### Configuração de Produção

#### Vercel:
```bash
# Configurar variáveis de ambiente
vercel env add VITE_IMOBZI_API_KEY
vercel env add VITE_IMOBZI_CLIENT_ID
vercel env add VITE_IMOBZI_CLIENT_SECRET

# Deploy
vercel --prod
```

#### Netlify:
```bash
# Configurar variáveis
netlify env:set VITE_IMOBZI_API_KEY "sua_chave"
netlify env:set VITE_IMOBZI_CLIENT_ID "seu_client_id"

# Deploy
netlify deploy --prod --dir=dist
```

#### Docker:
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Monitoramento

### Logs de API

```javascript
// src/services/logger.js
class APILogger {
  static log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console[level](logEntry);
    
    // Enviar para serviço de monitoramento
    if (level === 'error') {
      this.sendToMonitoring(logEntry);
    }
  }
  
  static sendToMonitoring(logEntry) {
    // Integração com Sentry, LogRocket, etc.
    if (window.Sentry) {
      window.Sentry.captureException(new Error(logEntry.message), {
        extra: logEntry.data
      });
    }
  }
}
```

### Health Check

```javascript
// src/services/healthCheck.js
export const healthCheck = async () => {
  try {
    const api = new ImobziAPI();
    await api.authenticate();
    
    const response = await api.get('/health');
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      apiStatus: response.status
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro 401 - Unauthorized
```
Solução: Verificar credenciais no .env
- API Key válida
- Client ID correto
- Client Secret correto
```

#### 2. Erro 429 - Rate Limit
```
Solução: Implementar retry com backoff
- Reduzir frequência de requisições
- Implementar cache mais agressivo
- Usar exponential backoff
```

#### 3. Erro de CORS
```
Solução: Configurar proxy ou usar servidor
- Adicionar proxy no vite.config.js
- Usar servidor backend como proxy
- Configurar CORS no servidor Imobzi
```

#### 4. Dados não atualizando
```
Solução: Verificar cache e intervalos
- Limpar cache manualmente
- Verificar intervalo de atualização
- Verificar se useEffect está funcionando
```

### Debug Mode

```javascript
// Habilitar debug no .env
VITE_DEBUG_MODE=true

// No código
if (import.meta.env.VITE_DEBUG_MODE) {
  console.log('Debug: API Response', data);
}
```

### Ferramentas de Debug

1. **Network Tab**: Verificar requisições HTTP
2. **Console**: Logs de erro e debug
3. **React DevTools**: Estado dos componentes
4. **Redux DevTools**: Se usando Redux

## 📞 Suporte

### Contatos
- **Suporte Imobzi**: suporte@imobzi.com
- **Documentação**: [docs.imobzi.com](https://docs.imobzi.com)
- **Status da API**: [status.imobzi.com](https://status.imobzi.com)

### Recursos Úteis
- [Postman Collection](api/postman-collection.json)
- [Swagger/OpenAPI](api/swagger.yaml)
- [Exemplos de Código](api/examples/)

---

## ✅ Checklist de Integração

- [ ] Credenciais configuradas no .env
- [ ] Autenticação OAuth funcionando
- [ ] Endpoints de dados implementados
- [ ] Cache configurado
- [ ] Tratamento de erros implementado
- [ ] Testes de integração passando
- [ ] Monitoramento configurado
- [ ] Deploy em produção realizado
- [ ] Documentação atualizada
- [ ] Equipe treinada

**Integração completa = Dashboard Uno com dados reais da Imobzi! 🚀**

