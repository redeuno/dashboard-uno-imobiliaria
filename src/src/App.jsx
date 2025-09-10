import React, { useState, useEffect } from 'react';
import './App.css';
import { SimpleBarChart, SimplePieChart, SimpleLineChart } from './components/SimpleChart';

// Dados simulados com taxas de conversão
const conversionRates = {
  leadToQualified: 0.3, // 30% dos leads se tornam qualificados
  qualifiedToProposal: 0.167, // 16.7% dos qualificados recebem propostas
  proposalToClosed: 0.4, // 40% das propostas são fechadas
  callsPerLead: 5, // 5 ligações por lead
  visitsPerProposal: 2, // 2 visitas por proposta
  avgDealValue: 350000 // Valor médio por negócio
};

const simulatedData = {
  company: {
    vgvTotal: 700000,
    commissions: 35000,
    cac: 2950,
    roi: 1490.9,
    totalLeads: 1000,
    newClients: 15,
    closedDeals: 2,
    monthlyGoals: {
      vgv: 833333,
      deals: 17,
      leads: 417
    },
    annualGoals: {
      vgv: 10000000,
      deals: 200,
      leads: 5000
    }
  },
  brokers: [
    {
      id: 1,
      name: 'Ana Silva',
      vgv: 400000,
      deals: 2,
      calls: 180,
      visits: 45,
      goals: {
        vgv: 400000,
        deals: 8,
        calls: 200,
        visits: 50
      }
    },
    {
      id: 2,
      name: 'Carlos Santos',
      vgv: 200000,
      deals: 1,
      calls: 120,
      visits: 30,
      goals: {
        vgv: 300000,
        deals: 6,
        calls: 150,
        visits: 40
      }
    },
    {
      id: 3,
      name: 'Maria Costa',
      vgv: 100000,
      deals: 0,
      calls: 90,
      visits: 20,
      goals: {
        vgv: 200000,
        deals: 4,
        calls: 100,
        visits: 30
      }
    }
  ]
};

// Função para calcular metas de atividade automaticamente
const calculateActivityGoals = (vgvGoal) => {
  const dealsNeeded = Math.ceil(vgvGoal / conversionRates.avgDealValue);
  const proposalsNeeded = Math.ceil(dealsNeeded / conversionRates.proposalToClosed);
  const qualifiedNeeded = Math.ceil(proposalsNeeded / conversionRates.qualifiedToProposal);
  const leadsNeeded = Math.ceil(qualifiedNeeded / conversionRates.leadToQualified);
  const callsNeeded = Math.ceil(leadsNeeded * conversionRates.callsPerLead);
  const visitsNeeded = Math.ceil(proposalsNeeded * conversionRates.visitsPerProposal);
  
  return {
    deals: dealsNeeded,
    calls: callsNeeded,
    visits: visitsNeeded,
    leads: leadsNeeded
  };
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBroker, setSelectedBroker] = useState(simulatedData.brokers[0]);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filteredData, setFilteredData] = useState(simulatedData);
  const [goals, setGoals] = useState({
    company: {
      annualVgv: 10000000,
      monthlyVgv: 833333
    },
    brokers: simulatedData.brokers.reduce((acc, broker) => ({
      ...acc,
      [broker.id]: {
        vgv: broker.goals.vgv,
        deals: broker.goals.deals,
        calls: broker.goals.calls,
        visits: broker.goals.visits
      }
    }), {})
  });

  // Atualização automática a cada 15 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Aqui você faria a chamada real para a API
      console.log('Atualizando dados...', new Date());
    }, 15 * 60 * 1000); // 15 minutos

    return () => clearInterval(interval);
  }, []);

  // Função para aplicar filtros
  const applyPeriodFilter = (period) => {
    setSelectedPeriod(period);
    
    // Simulação de filtro - aqui você faria a chamada real para a API
    let multiplier = 1;
    switch(period) {
      case 'last_month':
        multiplier = 0.8;
        break;
      case 'last_3_months':
        multiplier = 2.5;
        break;
      default:
        multiplier = 1;
    }
    
    const newData = {
      ...simulatedData,
      company: {
        ...simulatedData.company,
        vgvTotal: Math.round(simulatedData.company.vgvTotal * multiplier),
        commissions: Math.round(simulatedData.company.commissions * multiplier),
        totalLeads: Math.round(simulatedData.company.totalLeads * multiplier),
        closedDeals: Math.round(simulatedData.company.closedDeals * multiplier),
        cac: Math.round(simulatedData.company.cac * multiplier),
        roi: parseFloat((simulatedData.company.roi * multiplier).toFixed(1)),
        newClients: Math.round(simulatedData.company.newClients * multiplier)
      },
      brokers: simulatedData.brokers.map(broker => ({
        ...broker,
        vgv: Math.round(broker.vgv * multiplier),
        deals: Math.round(broker.deals * multiplier),
        calls: Math.round(broker.calls * multiplier),
        visits: Math.round(broker.visits * multiplier)
      }))
    };
    
    setFilteredData(newData);
    
    // Forçar re-render atualizando o selectedBroker se necessário
    if (selectedBroker) {
      const updatedBroker = newData.brokers.find(b => b.id === selectedBroker.id);
      if (updatedBroker) {
        setSelectedBroker(updatedBroker);
      }
    }
    
    console.log('Filtro aplicado:', period, 'Multiplier:', multiplier, 'Novos dados:', newData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  // Dados para gráficos
  const monthlyProgressData = [
    { name: 'VGV', atual: filteredData.company.vgvTotal, meta: filteredData.company.monthlyGoals.vgv },
    { name: 'Negócios', atual: filteredData.company.closedDeals, meta: filteredData.company.monthlyGoals.deals },
    { name: 'Leads', atual: filteredData.company.totalLeads, meta: filteredData.company.monthlyGoals.leads }
  ];

  const funnelData = [
    { name: 'Leads', value: filteredData.company.totalLeads, color: '#ff6b35' },
    { name: 'Qualificados', value: Math.round(filteredData.company.totalLeads * 0.3), color: '#f7931e' },
    { name: 'Propostas', value: Math.round(filteredData.company.totalLeads * 0.05), color: '#ffd23f' },
    { name: 'Fechados', value: filteredData.company.closedDeals, color: '#06d6a0' }
  ];

  const brokerPerformanceData = filteredData.brokers.map(broker => ({
    name: broker.name.split(' ')[0], // Só o primeiro nome para mobile
    vgv: broker.vgv,
    deals: broker.deals
  }));

  const updateGoals = (newGoals) => {
    setGoals(newGoals);
    setShowGoalsModal(false);
  };

  // Modal de Configuração de Metas
  const GoalsModal = () => {
    const [tempGoals, setTempGoals] = useState(goals);

    const handleVgvChange = (brokerId, vgvValue) => {
      const activityGoals = calculateActivityGoals(vgvValue);
      setTempGoals(prev => ({
        ...prev,
        brokers: {
          ...prev.brokers,
          [brokerId]: {
            ...prev.brokers[brokerId],
            vgv: vgvValue,
            deals: activityGoals.deals,
            calls: activityGoals.calls,
            visits: activityGoals.visits
          }
        }
      }));
    };

    if (!showGoalsModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">⚙️ Configurar Metas</h2>
          
          <div className="space-y-6">
            {/* Metas da Empresa */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Metas da Empresa</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">VGV Anual</label>
                  <input
                    type="number"
                    value={tempGoals.company.annualVgv}
                    onChange={(e) => setTempGoals(prev => ({
                      ...prev,
                      company: { ...prev.company, annualVgv: parseInt(e.target.value) }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">VGV Mensal</label>
                  <input
                    type="number"
                    value={tempGoals.company.monthlyVgv}
                    onChange={(e) => setTempGoals(prev => ({
                      ...prev,
                      company: { ...prev.company, monthlyVgv: parseInt(e.target.value) }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Metas dos Corretores */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Metas dos Corretores</h3>
              <p className="text-sm text-gray-600 mb-3">💡 Ao inserir o VGV, as metas de atividades são calculadas automaticamente com base nas taxas de conversão.</p>
              {simulatedData.brokers.map(broker => (
                <div key={broker.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">{broker.name}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">VGV Mensal</label>
                      <input
                        type="number"
                        value={tempGoals.brokers[broker.id]?.vgv || 0}
                        onChange={(e) => handleVgvChange(broker.id, parseInt(e.target.value))}
                        className="w-full p-2 border border-orange-300 rounded text-xs focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Negócios</label>
                      <input
                        type="number"
                        value={tempGoals.brokers[broker.id]?.deals || 0}
                        readOnly
                        className="w-full p-2 border border-gray-200 rounded text-xs bg-green-50"
                        title="Calculado automaticamente"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Ligações</label>
                      <input
                        type="number"
                        value={tempGoals.brokers[broker.id]?.calls || 0}
                        readOnly
                        className="w-full p-2 border border-gray-200 rounded text-xs bg-blue-50"
                        title="Calculado automaticamente"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Visitas</label>
                      <input
                        type="number"
                        value={tempGoals.brokers[broker.id]?.visits || 0}
                        readOnly
                        className="w-full p-2 border border-gray-200 rounded text-xs bg-purple-50"
                        title="Calculado automaticamente"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <button
              onClick={() => setShowGoalsModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={() => updateGoals(tempGoals)}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
            >
              Salvar Metas
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-3 sm:space-y-0">
            {/* Logo e Título */}
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Uno" className="h-8 w-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-orange-600">Dashboard Uno</h1>
                <p className="text-xs sm:text-sm text-gray-600">Métricas Imobiliárias</p>
              </div>
            </div>
            
            {/* Controles */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <select
                value={selectedPeriod}
                onChange={(e) => applyPeriodFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="current_month">Mês Atual</option>
                <option value="last_month">Mês Passado</option>
                <option value="last_3_months">Últimos 3 Meses</option>
              </select>
              
              <button
                onClick={() => setShowGoalsModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <span>⚙️</span>
                <span>Configurar Metas</span>
              </button>
              
              <div className="text-xs text-gray-500 text-center sm:text-left">
                Atualizado: {formatDateTime(lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: '📊 Visão Geral', color: 'orange' },
              { id: 'goals', label: '🎯 Metas Empresa', color: 'purple' },
              { id: 'brokers', label: '👥 Corretores', color: 'blue' },
              { id: 'gamification', label: '🏆 Gamificação', color: 'pink' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* VGV Total */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">VGV Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredData.company.vgvTotal)}</p>
                    <p className="text-xs text-gray-500">Meta: {formatCurrency(filteredData.company.monthlyGoals.vgv)}</p>
                  </div>
                  <div className="text-orange-500 text-2xl">💰</div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(filteredData.company.vgvTotal, filteredData.company.monthlyGoals.vgv))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`${getProgressColor(filteredData.company.vgvTotal, filteredData.company.monthlyGoals.vgv)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${getProgressPercentage(filteredData.company.vgvTotal, filteredData.company.monthlyGoals.vgv)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Comissões */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Comissões</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredData.company.commissions)}</p>
                    <p className="text-xs text-gray-500">5.0% do VGV</p>
                  </div>
                  <div className="text-green-500 text-2xl">💵</div>
                </div>
              </div>

              {/* CAC */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">CAC</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredData.company.cac)}</p>
                    <p className="text-xs text-gray-500">Custo por Cliente</p>
                  </div>
                  <div className="text-red-500 text-2xl">📊</div>
                </div>
              </div>

              {/* ROI */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredData.company.roi}%</p>
                    <p className="text-xs text-gray-500">Retorno sobre Investimento</p>
                  </div>
                  <div className="text-blue-500 text-2xl">📈</div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progresso das Metas */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <SimpleBarChart data={monthlyProgressData} title="Progresso das Metas Mensais" />
              </div>

              {/* Funil de Vendas */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <SimplePieChart data={funnelData} title="Funil de Vendas" />
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance da Empresa */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-orange-600 mb-4">Performance da Empresa</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Negócios Ganhos:</span>
                    <span className="font-semibold">{filteredData.company.closedDeals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Novos Clientes:</span>
                    <span className="font-semibold">{filteredData.company.newClients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Leads:</span>
                    <span className="font-semibold">{filteredData.company.totalLeads}</span>
                  </div>
                </div>
              </div>

              {/* Ranking de Corretores */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-orange-600 mb-4">Ranking de Corretores</h3>
                <div className="space-y-3">
                  {filteredData.brokers
                    .sort((a, b) => b.vgv - a.vgv)
                    .map((broker, index) => (
                    <div key={broker.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <span className="font-medium">{broker.name}</span>
                      </div>
                      <span className="font-semibold text-orange-600">{formatCurrency(broker.vgv)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Metas da Empresa</h2>
              <p className="text-gray-600">Acompanhe o progresso das metas anuais e mensais</p>
            </div>

            {/* Metas Anuais */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-red-600 mb-4">🎯 Metas Anuais 2025</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">VGV Anual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredData.company.annualGoals.vgv)}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span>84.0% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Negócios Anuais</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.company.annualGoals.deals}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span>12.0% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leads Anuais</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.company.annualGoals.leads}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span>240.0% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metas Mensais */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-orange-600 mb-4">📅 Metas Mensais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">VGV Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredData.company.monthlyGoals.vgv)}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span>84.0% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Negócios Mensais</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.company.monthlyGoals.deals}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span>11.8% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '11.8%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leads Mensais</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.company.monthlyGoals.leads}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span>239.8% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brokers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Performance por Corretor</h2>
                <p className="text-gray-600">Acompanhe o desempenho individual e metas</p>
              </div>
              <select
                value={selectedBroker.id}
                onChange={(e) => setSelectedBroker(filteredData.brokers.find(b => b.id === parseInt(e.target.value)))}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filteredData.brokers.map(broker => (
                  <option key={broker.id} value={broker.id}>{broker.name}</option>
                ))}
              </select>
            </div>

            {/* KPIs do Corretor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">VGV</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedBroker.vgv)}</p>
                    <p className="text-xs text-gray-500">Meta: {formatCurrency(selectedBroker.goals.vgv)}</p>
                  </div>
                  <div className="text-orange-500 text-xl">💰</div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(selectedBroker.vgv, selectedBroker.goals.vgv))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`${getProgressColor(selectedBroker.vgv, selectedBroker.goals.vgv)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${getProgressPercentage(selectedBroker.vgv, selectedBroker.goals.vgv)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Negócios</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedBroker.deals}</p>
                    <p className="text-xs text-gray-500">Meta: {selectedBroker.goals.deals}</p>
                  </div>
                  <div className="text-green-500 text-xl">🎯</div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(selectedBroker.deals, selectedBroker.goals.deals))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`${getProgressColor(selectedBroker.deals, selectedBroker.goals.deals)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${getProgressPercentage(selectedBroker.deals, selectedBroker.goals.deals)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Ligações</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedBroker.calls}</p>
                    <p className="text-xs text-gray-500">Meta: {selectedBroker.goals.calls}</p>
                  </div>
                  <div className="text-blue-500 text-xl">📞</div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(selectedBroker.calls, selectedBroker.goals.calls))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`${getProgressColor(selectedBroker.calls, selectedBroker.goals.calls)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${getProgressPercentage(selectedBroker.calls, selectedBroker.goals.calls)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Visitas</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedBroker.visits}</p>
                    <p className="text-xs text-gray-500">Meta: {selectedBroker.goals.visits}</p>
                  </div>
                  <div className="text-purple-500 text-xl">🏠</div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(selectedBroker.visits, selectedBroker.goals.visits))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`${getProgressColor(selectedBroker.visits, selectedBroker.goals.visits)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${getProgressPercentage(selectedBroker.visits, selectedBroker.goals.visits)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atividades Diárias */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">📋 Atividades Diárias - {selectedBroker.name}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Para atingir a meta mensal:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ligações por dia:</span>
                      <span className="font-semibold">7 ligações</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitas por semana:</span>
                      <span className="font-semibold">13 visitas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Negócios por semana:</span>
                      <span className="font-semibold">2 negócios</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VGV por semana:</span>
                      <span className="font-semibold">{formatCurrency(100000)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Progresso atual:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>VGV:</span>
                      <span className={`font-semibold ${getProgressPercentage(selectedBroker.vgv, selectedBroker.goals.vgv) >= 100 ? 'text-green-600' : getProgressPercentage(selectedBroker.vgv, selectedBroker.goals.vgv) >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {Math.round(getProgressPercentage(selectedBroker.vgv, selectedBroker.goals.vgv))}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Negócios:</span>
                      <span className={`font-semibold ${getProgressPercentage(selectedBroker.deals, selectedBroker.goals.deals) >= 100 ? 'text-green-600' : getProgressPercentage(selectedBroker.deals, selectedBroker.goals.deals) >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {Math.round(getProgressPercentage(selectedBroker.deals, selectedBroker.goals.deals))}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ligações:</span>
                      <span className={`font-semibold ${getProgressPercentage(selectedBroker.calls, selectedBroker.goals.calls) >= 100 ? 'text-green-600' : getProgressPercentage(selectedBroker.calls, selectedBroker.goals.calls) >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {Math.round(getProgressPercentage(selectedBroker.calls, selectedBroker.goals.calls))}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitas:</span>
                      <span className={`font-semibold ${getProgressPercentage(selectedBroker.visits, selectedBroker.goals.visits) >= 100 ? 'text-green-600' : getProgressPercentage(selectedBroker.visits, selectedBroker.goals.visits) >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {Math.round(getProgressPercentage(selectedBroker.visits, selectedBroker.goals.visits))}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Comparativa */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <SimpleLineChart data={brokerPerformanceData} title="Performance dos Corretores" />
            </div>
          </div>
        )}

        {activeTab === 'gamification' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Gamificação</h2>
              <p className="text-gray-600">Badges, conquistas e rankings</p>
            </div>

            {/* Badges */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-pink-600 mb-4">🏆 Badges e Conquistas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-4xl mb-2">🥇</div>
                  <h4 className="font-semibold text-yellow-800">Top Performer</h4>
                  <p className="text-sm text-yellow-600">Maior VGV do mês</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-4xl mb-2">📞</div>
                  <h4 className="font-semibold text-blue-800">Call Master</h4>
                  <p className="text-sm text-blue-600">100+ ligações no mês</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-semibold text-green-800">Goal Crusher</h4>
                  <p className="text-sm text-green-600">Meta mensal atingida</p>
                </div>
              </div>
            </div>

            {/* Ranking Geral */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-pink-600 mb-4">🏅 Ranking Geral</h3>
              <div className="space-y-4">
                {filteredData.brokers
                  .sort((a, b) => b.vgv - a.vgv)
                  .map((broker, index) => (
                  <div key={broker.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <div>
                        <h4 className="font-semibold">{broker.name}</h4>
                        <p className="text-sm text-gray-600">{broker.deals} negócios • {broker.calls} ligações</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-orange-600">{formatCurrency(broker.vgv)}</p>
                      <p className="text-sm text-gray-500">Pontuação: {broker.vgv / 1000 + broker.deals * 100}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Configuração de Metas */}
      <GoalsModal />
    </div>
  );
};

export default Dashboard;
