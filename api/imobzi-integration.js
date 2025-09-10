/**
 * 🔌 Integração API Imobzi
 * 
 * Este arquivo contém toda a lógica para integrar o Dashboard Uno
 * com a API da Imobzi, substituindo os dados simulados por dados reais.
 * 
 * @author Dashboard Uno Team
 * @version 1.0.0
 */

// ===== CONFIGURAÇÃO DA API =====

class ImobziAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_IMOBZI_API_URL || 'https://api.imobzi.com/v1';
    this.apiKey = import.meta.env.VITE_IMOBZI_API_KEY;
    this.clientId = import.meta.env.VITE_IMOBZI_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_IMOBZI_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Autentica com a API Imobzi usando OAuth 2.0
   */
  async authenticate() {
    try {
      const response = await fetch(`${this.baseURL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro de autenticação: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      console.log('✅ Autenticação com Imobzi realizada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro na autenticação Imobzi:', error);
      throw error;
    }
  }

  /**
   * Verifica se o token está válido
   */
  isTokenValid() {
    return this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  /**
   * Realiza requisições GET para a API
   */
  async get(endpoint, params = {}) {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }

    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Erro na requisição GET ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza requisições POST para a API
   */
  async post(endpoint, data) {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Erro na requisição POST ${endpoint}:`, error);
      throw error;
    }
  }
}

// ===== SERVIÇO DE DADOS =====

class ImobziDataService {
  constructor() {
    this.api = new ImobziAPI();
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Busca dados do cache ou da API
   */
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.cacheDuration) {
      console.log(`📦 Dados do cache: ${key}`);
      return cached.data;
    }

    console.log(`🔄 Buscando dados da API: ${key}`);
    const data = await fetchFunction();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  /**
   * Busca métricas da empresa
   */
  async getCompanyMetrics(period = 'current_month') {
    return this.getCachedData(`company_metrics_${period}`, async () => {
      const response = await this.api.get('/metrics/company', { period });
      return this.transformCompanyData(response.data);
    });
  }

  /**
   * Busca dados dos corretores
   */
  async getBrokers() {
    return this.getCachedData('brokers', async () => {
      const response = await this.api.get('/brokers');
      return this.transformBrokerData(response.data);
    });
  }

  /**
   * Busca métricas de um corretor específico
   */
  async getBrokerMetrics(brokerId, period = 'current_month') {
    return this.getCachedData(`broker_metrics_${brokerId}_${period}`, async () => {
      const response = await this.api.get(`/brokers/${brokerId}/metrics`, { period });
      return this.transformBrokerMetrics(response.data);
    });
  }

  /**
   * Busca dados do funil de vendas
   */
  async getFunnelData(period = 'current_month') {
    return this.getCachedData(`funnel_${period}`, async () => {
      const response = await this.api.get('/metrics/funnel', { period });
      return this.transformFunnelData(response.data);
    });
  }

  /**
   * Busca leads
   */
  async getLeads(filters = {}) {
    const cacheKey = `leads_${JSON.stringify(filters)}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await this.api.get('/leads', filters);
      return this.transformLeadsData(response.data);
    });
  }

  /**
   * Busca negócios
   */
  async getDeals(filters = {}) {
    const cacheKey = `deals_${JSON.stringify(filters)}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await this.api.get('/deals', filters);
      return this.transformDealsData(response.data);
    });
  }

  // ===== TRANSFORMAÇÃO DE DADOS =====

  /**
   * Transforma dados da empresa da API para o formato do dashboard
   */
  transformCompanyData(apiData) {
    return {
      vgvTotal: apiData.total_sales_value || 0,
      commissions: apiData.total_commissions || 0,
      totalLeads: apiData.total_leads || 0,
      closedDeals: apiData.closed_deals || 0,
      cac: apiData.customer_acquisition_cost || 0,
      roi: apiData.return_on_investment || 0,
      newClients: apiData.new_clients || 0,
      avgDealValue: apiData.average_deal_value || 0,
      conversionRate: apiData.conversion_rate || 0,
    };
  }

  /**
   * Transforma dados dos corretores
   */
  transformBrokerData(apiData) {
    return apiData.map(broker => ({
      id: broker.id,
      name: broker.name || broker.full_name,
      vgv: broker.sales_value || 0,
      deals: broker.closed_deals || 0,
      calls: broker.total_calls || 0,
      visits: broker.total_visits || 0,
      email: broker.email,
      phone: broker.phone,
      avatar: broker.avatar_url,
      status: broker.status || 'active',
      joinDate: broker.created_at,
    }));
  }

  /**
   * Transforma métricas de corretor específico
   */
  transformBrokerMetrics(apiData) {
    return {
      vgv: apiData.sales_value || 0,
      deals: apiData.closed_deals || 0,
      calls: apiData.total_calls || 0,
      visits: apiData.total_visits || 0,
      leads: apiData.total_leads || 0,
      proposals: apiData.total_proposals || 0,
      conversionRate: apiData.conversion_rate || 0,
      avgDealValue: apiData.average_deal_value || 0,
    };
  }

  /**
   * Transforma dados do funil
   */
  transformFunnelData(apiData) {
    return {
      leads: {
        total: apiData.leads?.total || 0,
        percentage: apiData.leads?.percentage || 0,
      },
      qualified: {
        total: apiData.qualified?.total || 0,
        percentage: apiData.qualified?.percentage || 0,
      },
      proposals: {
        total: apiData.proposals?.total || 0,
        percentage: apiData.proposals?.percentage || 0,
      },
      closed: {
        total: apiData.closed?.total || 0,
        percentage: apiData.closed?.percentage || 0,
      },
    };
  }

  /**
   * Transforma dados de leads
   */
  transformLeadsData(apiData) {
    return apiData.map(lead => ({
      id: lead.id,
      name: lead.name || lead.contact_name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
      brokerId: lead.broker_id,
      value: lead.estimated_value || 0,
    }));
  }

  /**
   * Transforma dados de negócios
   */
  transformDealsData(apiData) {
    return apiData.map(deal => ({
      id: deal.id,
      title: deal.title || deal.name,
      value: deal.value || 0,
      status: deal.status,
      stage: deal.stage,
      brokerId: deal.broker_id,
      clientId: deal.client_id,
      propertyId: deal.property_id,
      createdAt: deal.created_at,
      closedAt: deal.closed_at,
      commission: deal.commission || 0,
    }));
  }

  /**
   * Limpa o cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache limpo');
  }
}

// ===== HOOK PARA REACT =====

/**
 * Hook personalizado para usar dados da API Imobzi
 */
export const useImobziData = (endpoint, params = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const dataService = useMemo(() => new ImobziDataService(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      switch (endpoint) {
        case 'company-metrics':
          result = await dataService.getCompanyMetrics(params.period);
          break;
        case 'brokers':
          result = await dataService.getBrokers();
          break;
        case 'broker-metrics':
          result = await dataService.getBrokerMetrics(params.brokerId, params.period);
          break;
        case 'funnel':
          result = await dataService.getFunnelData(params.period);
          break;
        case 'leads':
          result = await dataService.getLeads(params);
          break;
        case 'deals':
          result = await dataService.getDeals(params);
          break;
        default:
          throw new Error(`Endpoint não suportado: ${endpoint}`);
      }

      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error(`❌ Erro ao buscar dados ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, params, dataService]);

  useEffect(() => {
    fetchData();

    // Auto-update se especificado
    if (options.autoUpdate) {
      const interval = setInterval(fetchData, options.updateInterval || 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData, options.autoUpdate, options.updateInterval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
    clearCache: () => dataService.clearCache(),
  };
};

// ===== TRATAMENTO DE ERROS =====

export class ImobziErrorHandler {
  static handle(error) {
    const errorMap = {
      401: 'Credenciais inválidas. Verifique sua API key.',
      403: 'Acesso negado. Verifique suas permissões.',
      404: 'Recurso não encontrado.',
      429: 'Muitas requisições. Tente novamente em alguns minutos.',
      500: 'Erro interno do servidor. Tente novamente mais tarde.',
      502: 'Servidor indisponível. Tente novamente mais tarde.',
      503: 'Serviço temporariamente indisponível.',
    };

    if (error.response?.status) {
      return errorMap[error.response.status] || `Erro da API: ${error.response.status}`;
    }

    if (error.message?.includes('fetch')) {
      return 'Erro de conexão. Verifique sua internet.';
    }

    return error.message || 'Erro desconhecido.';
  }
}

// ===== EXPORTAÇÕES =====

export { ImobziAPI, ImobziDataService };
export default ImobziDataService;

// ===== EXEMPLO DE USO =====

/*
// No seu componente React:

import { useImobziData } from './api/imobzi-integration';

function Dashboard() {
  const { 
    data: companyData, 
    loading, 
    error, 
    lastUpdated 
  } = useImobziData('company-metrics', { period: 'current_month' }, { 
    autoUpdate: true,
    updateInterval: 15 * 60 * 1000 // 15 minutos
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>VGV Total: {companyData?.vgvTotal}</h1>
      <p>Última atualização: {lastUpdated?.toLocaleString()}</p>
    </div>
  );
}
*/

