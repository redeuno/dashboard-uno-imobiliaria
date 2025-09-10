/**
 * 🔌 PROXY API IMOBZI - Solução CORS
 * 
 * Backend proxy para contornar limitações CORS
 * Deploy: Vercel Functions / Netlify Functions
 */

// ===== CONFIGURAÇÃO =====
const IMOBZI_API_BASE = 'https://api.imobzi.app/v1';
const IMOBZI_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoiMjAyNS0wOS0xMFQxNTo0Nzo0Ni4wMjIzNzZaIiwiaXNfdGhpcmRfcGFydHlfYWNjZXNzIjp0cnVlLCJ0aGlyZF9wYXJ0eV9hcHBfaWQiOjUzNjA4MDA3MjA0ODY0MDB9.SYFuWb_CKwQNfb2b-SbcWhOhvcG5Qzni7cQaRM5SNdw';

// ===== HEADERS CORS =====
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// ===== FUNÇÃO PRINCIPAL =====
export default async function handler(req, res) {
  // Tratar OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Adicionar headers CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { endpoint } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ 
        error: 'Endpoint não especificado',
        usage: '/api/proxy?endpoint=users'
      });
    }

    console.log(`🔍 Proxy request: ${endpoint}`);

    // Fazer requisição para Imobzi
    const response = await fetch(`${IMOBZI_API_BASE}/${endpoint}`, {
      method: req.method,
      headers: {
        'X-Imobzi-Secret': IMOBZI_SECRET,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Proxy success: ${endpoint} - ${Array.isArray(data) ? data.length : 'object'} records`);
    
    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      endpoint
    });

  } catch (error) {
    console.error(`❌ Proxy error:`, error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      fallback: getFallbackData(req.query.endpoint)
    });
  }
}

// ===== DADOS FALLBACK =====
function getFallbackData(endpoint) {
  const fallbackData = {
    'users': [
      { db_id: '1', fullname: 'Daiana Ferrarezi', function: 'Corretora', email: 'daygui2323@gmail.com' },
      { db_id: '2', fullname: 'Mario Otavio', function: 'Diretor', email: 'otavio@corretoraideal.com.br' },
      { db_id: '3', fullname: 'Yan Caliel', function: 'Corretor', email: 'yan.caliel@redeuno.com.br' }
    ],
    'contacts': [
      { contact_id: '1', fullname: 'João Silva', media_source: 'Website', created_at: '2025-09-01' },
      { contact_id: '2', fullname: 'Maria Santos', media_source: 'Facebook', created_at: '2025-09-02' }
    ],
    'deals': {
      total_deals: 52,
      total_values: 2350000,
      '4584666827849728': { stage_name: 'Oportunidades', count: 1000 },
      '6005926736691200': { stage_name: 'Qualificação e Interesse', count: 300 },
      '5381346821144576': { stage_name: 'Visita / Apresentação', count: 50 },
      '4677659379367936': { stage_name: 'Fechamento', count: 2 }
    },
    'properties': [
      { property_id: '1', sale_value: 500000, status: 'available', city: 'Campo Grande' },
      { property_id: '2', sale_value: 300000, status: 'available', city: 'Campo Grande' }
    ]
  };

  return fallbackData[endpoint] || [];
}

