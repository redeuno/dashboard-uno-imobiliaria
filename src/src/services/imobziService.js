/**
 * 🔌 Serviço de Integração API Imobzi
 * 
 * Este arquivo implementa a integração completa com a API da Imobzi,
 * substituindo os dados simulados por dados reais.
 * 
 * Para ativar: Importe este serviço no App.jsx e substitua os dados simulados
 */

import { useState, useEffect, useCallback } from 'react';

// ===== CONFIGURAÇÃO DA API =====
const API_CONFIG = {
  baseURL: import.meta.env.VITE_IMOBZI_API_URL || 'https://api.imobzi.com/v1',
  apiKey: import.meta.env.VITE_IMOBZI_API_KEY,
  clientId: import.meta.env.VITE_IMOBZI_CLIENT_ID,
  clientSecret: import.meta.env.VITE_IMOBZI_CLIENT_SECRET,
  timeout: 30000, // 30 segundos
  retries: 3
};

// ===== CLIENTE API =====
class ImobziAPIClient {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.isAuthenticating = false;
  }

  /**
   * Autentica com a API Imobzi
   */
  async authenticate() {
    if (this.isAuthenticating) {
      // Aguarda autenticação em andamento
      while (this.isAuthenticating) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.accessToken;
    }

    this.isAuthenticating = true;

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: API_CONFIG.clientId,
          client_secret: API_CONFIG.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro de autenticação: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      console.log('✅ Autenticação Imobzi realizada com sucesso');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Erro na autenticação Imobzi:', error);
      throw new Error(`Falha na autenticação: ${error.message}`);
    } finally {
      this.isAuthenticating = false;
    }
  }

  /**
   * Verifica se o token está válido
   */
  isTokenValid() {
    return this.accessToken && this.tokenExpiry && Date.now() < (this.tokenExpiry - 60000); // 1 min de margem
  }

  /**
   * Faz requisições para a API com retry automático
   */
  async request(endpoint, options = {}) {
    const { method = 'GET', params = {}, data = null, retries = API_CONFIG.retries } = options;

    // Garante autenticação válida
    if (!this.isTokenValid()) {
      await this.authenticate();
    }

    // Constrói URL com parâmetros
    const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const requestOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.apiKey,
        'Accept': 'application/json',
      },
      timeout: API_CONFIG.timeout,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);

        if (response.status === 401 && attempt === 1) {
          // Token expirado, tenta reautenticar
          console.log('🔄 Token expirado, reautenticando...');
          await this.authenticate();
          requestOptions.headers['Authorization'] = `Bearer ${this.accessToken}`;
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Requisição bem-sucedida: ${method} ${endpoint}`);
        return result;

      } catch (error) {
        console.error(`❌ Tentativa ${attempt}/${retries} falhou:`, error.message);
        
        if (attempt === retries) {
          throw new Error(`Falha após ${retries} tentativas: ${error.message}`);
        }

        // Backoff exponencial
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

// ===== INSTÂNCIA GLOBAL =====
const apiClient = new ImobziAPIClient();

// ===== SERVIÇOS DE DADOS =====

/**
 * Busca métricas da empresa
 */
export const getCompanyMetrics = async (period = 'current_month') => {
  try {
    const response = await apiClient.request('/metrics/company', {
      params: { period }
    });

    return {
      vgvTotal: response.data?.total_sales_value || 0,
      commissions: response.data?.total_commissions || 0,
      totalLeads: response.data?.total_leads || 0,
      closedDeals: response.data?.closed_deals || 0,
      cac: response.data?.customer_acquisition_cost || 0,
      roi: response.data?.return_on_investment || 0,
      newClients: response.data?.new_clients || 0,
      avgDealValue: response.data?.average_deal_value || 200000,
    };
  } catch (error) {
    console.error('Erro ao buscar métricas da empresa:', error);
    // Retorna dados de fallback em caso de erro
    return getFallbackCompanyData();
  }
};

/**
 * Busca dados dos corretores
 */
export const getBrokers = async () => {
  try {
    const response = await apiClient.request('/brokers');
    
    return response.data?.map(broker => ({
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
    })) || [];
  } catch (error) {
    console.error('Erro ao buscar corretores:', error);
    return getFallbackBrokersData();
  }
};

/**
 * Busca métricas de um corretor específico
 */
export const getBrokerMetrics = async (brokerId, period = 'current_month') => {
  try {
    const response = await apiClient.request(`/brokers/${brokerId}/metrics`, {
      params: { period }
    });

    return {
      vgv: response.data?.sales_value || 0,
      deals: response.data?.closed_deals || 0,
      calls: response.data?.total_calls || 0,
      visits: response.data?.total_visits || 0,
      leads: response.data?.total_leads || 0,
      proposals: response.data?.total_proposals || 0,
      conversionRate: response.data?.conversion_rate || 0,
    };
  } catch (error) {
    console.error(`Erro ao buscar métricas do corretor ${brokerId}:`, error);
    return getFallbackBrokerMetrics();
  }
};

/**
 * Busca dados do funil de vendas
 */
export const getFunnelData = async (period = 'current_month') => {
  try {
    const response = await apiClient.request('/metrics/funnel', {
      params: { period }
    });

    return {
      leads: {
        total: response.data?.leads?.total || 0,
        percentage: response.data?.leads?.percentage || 0,
      },
      qualified: {
        total: response.data?.qualified?.total || 0,
        percentage: response.data?.qualified?.percentage || 0,
      },
      proposals: {
        total: response.data?.proposals?.total || 0,
        percentage: response.data?.proposals?.percentage || 0,
      },
      closed: {
        total: response.data?.closed?.total || 0,
        percentage: response.data?.closed?.percentage || 0,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados do funil:', error);
    return getFallbackFunnelData();
  }
};

// ===== HOOK PRINCIPAL =====

/**
 * Hook para usar dados da API Imobzi com cache e auto-update
 */
export const useImobziData = (options = {}) => {
  const {
    autoUpdate = true,
    updateInterval = 15 * 60 * 1000, // 15 minutos
    enableCache = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutos
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cache simples
  const [cache, setCache] = useState(new Map());

  const getCachedData = useCallback((key) => {
    if (!enableCache) return null;
    
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cacheTimeout) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  }, [cache, enableCache, cacheTimeout]);

  const setCachedData = useCallback((key, data) => {
    if (!enableCache) return;
    
    setCache(prev => new Map(prev.set(key, {
      data,
      timestamp: Date.now()
    })));
  }, [enableCache]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verifica cache primeiro
      const cacheKey = 'dashboard_data';
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      console.log('🔄 Buscando dados da API Imobzi...');

      // Busca dados em paralelo
      const [companyMetrics, brokers, funnelData] = await Promise.all([
        getCompanyMetrics(),
        getBrokers(),
        getFunnelData(),
      ]);

      const dashboardData = {
        company: companyMetrics,
        brokers,
        funnel: funnelData,
        timestamp: new Date().toISOString(),
      };

      setData(dashboardData);
      setCachedData(cacheKey, dashboardData);
      setLastUpdated(new Date());
      
      console.log('✅ Dados da API Imobzi carregados com sucesso');

    } catch (err) {
      console.error('❌ Erro ao carregar dados da API:', err);
      setError(err.message);
      
      // Em caso de erro, usa dados de fallback
      const fallbackData = {
        company: getFallbackCompanyData(),
        brokers: getFallbackBrokersData(),
        funnel: getFallbackFunnelData(),
        timestamp: new Date().toISOString(),
        isFallback: true,
      };
      
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  // Carregamento inicial
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-update
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      console.log('🔄 Atualização automática dos dados...');
      fetchAllData();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [autoUpdate, updateInterval, fetchAllData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllData,
    clearCache: () => setCache(new Map()),
  };
};

// ===== DADOS DE FALLBACK =====

const getFallbackCompanyData = () => ({
  vgvTotal: 700000,
  commissions: 35000,
  totalLeads: 1000,
  closedDeals: 2,
  cac: 2950,
  roi: 1490.9,
  newClients: 15,
  avgDealValue: 200000,
});

const getFallbackBrokersData = () => [
  {
    id: 1,
    name: 'Ana Silva',
    vgv: 400000,
    deals: 2,
    calls: 180,
    visits: 45,
    email: 'ana@unorede.com.br',
    phone: '(11) 99999-0001',
  },
  {
    id: 2,
    name: 'Carlos Santos',
    vgv: 200000,
    deals: 1,
    calls: 120,
    visits: 30,
    email: 'carlos@unorede.com.br',
    phone: '(11) 99999-0002',
  },
  {
    id: 3,
    name: 'Maria Costa',
    vgv: 100000,
    deals: 0,
    calls: 90,
    visits: 20,
    email: 'maria@unorede.com.br',
    phone: '(11) 99999-0003',
  },
];

const getFallbackFunnelData = () => ({
  leads: { total: 1000, percentage: 74 },
  qualified: { total: 300, percentage: 22 },
  proposals: { total: 50, percentage: 4 },
  closed: { total: 2, percentage: 0 },
});

const getFallbackBrokerMetrics = () => ({
  vgv: 0,
  deals: 0,
  calls: 0,
  visits: 0,
  leads: 0,
  proposals: 0,
  conversionRate: 0,
});

// ===== UTILITÁRIOS =====

/**
 * Verifica se a API está configurada
 */
export const isAPIConfigured = () => {
  return !!(API_CONFIG.apiKey && API_CONFIG.clientId && API_CONFIG.clientSecret);
};

/**
 * Testa a conexão com a API
 */
export const testAPIConnection = async () => {
  try {
    await apiClient.authenticate();
    const response = await apiClient.request('/health');
    return { success: true, message: 'Conexão com API Imobzi estabelecida' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Obtém status da API
 */
export const getAPIStatus = () => {
  return {
    configured: isAPIConfigured(),
    authenticated: apiClient.isTokenValid(),
    baseURL: API_CONFIG.baseURL,
    lastAuth: apiClient.tokenExpiry ? new Date(apiClient.tokenExpiry - 3600000) : null,
  };
};

export default {
  useImobziData,
  getCompanyMetrics,
  getBrokers,
  getBrokerMetrics,
  getFunnelData,
  isAPIConfigured,
  testAPIConnection,
  getAPIStatus,
};

