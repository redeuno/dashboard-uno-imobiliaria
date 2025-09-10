# 🔌 Integração API Imobzi

Este diretório contém toda a documentação e arquivos necessários para integrar o Dashboard Uno com a API da Imobzi.

## 📋 Visão Geral

A integração com a API Imobzi permite que o dashboard acesse dados reais de:
- Leads e prospects
- Negócios e vendas
- Performance dos corretores
- Métricas consolidadas

## 🔑 Configuração

### 1. Credenciais
Crie um arquivo `.env` na raiz do projeto com:

```env
# API Imobzi
VITE_IMOBZI_API_URL=https://api.imobzi.com/v1
VITE_IMOBZI_API_KEY=sua_chave_api_aqui
VITE_IMOBZI_CLIENT_ID=seu_client_id
VITE_IMOBZI_CLIENT_SECRET=seu_client_secret

# Configurações do Dashboard
VITE_UPDATE_INTERVAL=900000  # 15 minutos em ms
VITE_CACHE_DURATION=300000   # 5 minutos em ms
```

### 2. Autenticação
A API Imobzi utiliza OAuth 2.0. O processo de autenticação é:

1. **Client Credentials Grant** para aplicações server-to-server
2. **Authorization Code Grant** para aplicações com usuários

## 📡 Endpoints Utilizados

### Leads
```javascript
GET /leads
GET /leads/{id}
GET /leads/metrics
```

### Negócios
```javascript
GET /deals
GET /deals/{id}
GET /deals/metrics
```

### Corretores
```javascript
GET /brokers
GET /brokers/{id}
GET /brokers/{id}/metrics
```

### Métricas
```javascript
GET /metrics/company
GET /metrics/funnel
GET /metrics/performance
```

## 🔧 Implementação

### 1. Cliente API
Crie um cliente para a API Imobzi:

```javascript
// src/services/imobziApi.js
class ImobziAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_IMOBZI_API_URL;
    this.apiKey = import.meta.env.VITE_IMOBZI_API_KEY;
    this.clientId = import.meta.env.VITE_IMOBZI_CLIENT_ID;
  }

  async authenticate() {
    // Implementar autenticação OAuth 2.0
  }

  async get(endpoint, params = {}) {
    // Implementar requisições GET
  }

  async post(endpoint, data) {
    // Implementar requisições POST
  }
}
```

### 2. Serviços de Dados
Substitua os dados simulados por chamadas reais:

```javascript
// src/services/dataService.js
import { ImobziAPI } from './imobziApi';

export class DataService {
  constructor() {
    this.api = new ImobziAPI();
  }

  async getCompanyMetrics(period = 'current_month') {
    const response = await this.api.get('/metrics/company', { period });
    return this.transformCompanyData(response.data);
  }

  async getBrokerMetrics(brokerId, period = 'current_month') {
    const response = await this.api.get(`/brokers/${brokerId}/metrics`, { period });
    return this.transformBrokerData(response.data);
  }

  async getFunnelData(period = 'current_month') {
    const response = await this.api.get('/metrics/funnel', { period });
    return this.transformFunnelData(response.data);
  }
}
```

### 3. Transformação de Dados
Mapeie os dados da API para o formato do dashboard:

```javascript
// src/services/dataTransform.js
export const transformCompanyData = (apiData) => {
  return {
    vgvTotal: apiData.total_sales_value,
    commissions: apiData.total_commissions,
    totalLeads: apiData.total_leads,
    closedDeals: apiData.closed_deals,
    cac: apiData.customer_acquisition_cost,
    roi: apiData.return_on_investment,
    newClients: apiData.new_clients
  };
};

export const transformBrokerData = (apiData) => {
  return apiData.map(broker => ({
    id: broker.id,
    name: broker.name,
    vgv: broker.sales_value,
    deals: broker.closed_deals,
    calls: broker.total_calls,
    visits: broker.total_visits,
    email: broker.email,
    phone: broker.phone
  }));
};
```

## 🔄 Atualização Automática

### Implementação
```javascript
// src/hooks/useAutoUpdate.js
import { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';

export const useAutoUpdate = (interval = 15 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const dataService = new DataService();

  useEffect(() => {
    const updateData = async () => {
      try {
        const newData = await dataService.getCompanyMetrics();
        setData(newData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    };

    // Atualização inicial
    updateData();

    // Configurar intervalo
    const intervalId = setInterval(updateData, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return { data, lastUpdated };
};
```

## 🛡️ Tratamento de Erros

### Implementação Robusta
```javascript
// src/services/errorHandler.js
export class APIErrorHandler {
  static handle(error) {
    if (error.response) {
      // Erro de resposta da API
      switch (error.response.status) {
        case 401:
          return 'Credenciais inválidas. Verifique sua API key.';
        case 403:
          return 'Acesso negado. Verifique suas permissões.';
        case 429:
          return 'Muitas requisições. Tente novamente em alguns minutos.';
        case 500:
          return 'Erro interno do servidor. Tente novamente mais tarde.';
        default:
          return `Erro da API: ${error.response.status}`;
      }
    } else if (error.request) {
      // Erro de rede
      return 'Erro de conexão. Verifique sua internet.';
    } else {
      // Erro de configuração
      return 'Erro de configuração. Contate o suporte.';
    }
  }
}
```

## 📊 Cache e Performance

### Estratégia de Cache
```javascript
// src/services/cacheService.js
export class CacheService {
  constructor(duration = 5 * 60 * 1000) { // 5 minutos
    this.cache = new Map();
    this.duration = duration;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.duration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}
```

## 🧪 Testes

### Testes de Integração
```javascript
// src/tests/api.test.js
import { DataService } from '../services/dataService';

describe('Integração API Imobzi', () => {
  let dataService;

  beforeEach(() => {
    dataService = new DataService();
  });

  test('deve buscar métricas da empresa', async () => {
    const metrics = await dataService.getCompanyMetrics();
    expect(metrics).toHaveProperty('vgvTotal');
    expect(metrics).toHaveProperty('commissions');
  });

  test('deve buscar dados dos corretores', async () => {
    const brokers = await dataService.getBrokerMetrics();
    expect(Array.isArray(brokers)).toBe(true);
  });
});
```

## 📝 Logs e Monitoramento

### Sistema de Logs
```javascript
// src/services/logger.js
export class Logger {
  static info(message, data = {}) {
    console.log(`[INFO] ${message}`, data);
  }

  static error(message, error = {}) {
    console.error(`[ERROR] ${message}`, error);
    // Enviar para serviço de monitoramento
  }

  static warn(message, data = {}) {
    console.warn(`[WARN] ${message}`, data);
  }
}
```

## 🚀 Deploy com API

### Variáveis de Ambiente
Configure as variáveis no seu ambiente de produção:

```bash
# Vercel
vercel env add VITE_IMOBZI_API_KEY

# Netlify
netlify env:set VITE_IMOBZI_API_KEY "sua_chave"

# Docker
docker run -e VITE_IMOBZI_API_KEY="sua_chave" dashboard-uno
```

## 📞 Suporte

Para dúvidas sobre a integração:
- **Documentação Imobzi**: [docs.imobzi.com](https://docs.imobzi.com)
- **Suporte Técnico**: suporte@imobzi.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/dashboard-uno/issues)

---

**Integração desenvolvida para máxima performance e confiabilidade** 🚀

