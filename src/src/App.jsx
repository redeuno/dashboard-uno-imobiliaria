/**
 * 🏠 Dashboard Uno - Versão com Integração API Imobzi
 * 
 * Esta é a versão do App.jsx que utiliza dados reais da API Imobzi
 * em vez de dados simulados.
 * 
 * Para ativar: Renomeie este arquivo para App.jsx (substitua o atual)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SimpleBarChart, SimplePieChart, SimpleLineChart } from './components/SimpleChart';
import { useImobziData, calculateMetrics, useApiStatus } from './services/imobziService';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Phone, 
  Calendar,
  Trophy,
  Star,
  Award,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import './App.css';

function App() {
  // ===== ESTADO DA API =====
  const { 
    data: apiData, 
    loading: apiLoading, 
    error: apiError, 
    lastUpdated,
    refetch: refetchData,
    clearCache 
  } = useImobziData({
    autoUpdate: true,
    updateInterval: 15 * 60 * 1000, // 15 minutos
    enableCache: true
  });

  // ===== ESTADO LOCAL =====
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedBroker, setSelectedBroker] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [goals, setGoals] = useState({
    annual: { vgv: 10000000, deals: 50 },
    monthly: { vgv: 833333, deals: 4 }
  });

  // ===== STATUS DA API =====
  const apiStatus = getAPIStatus();
  const isConfigured = isAPIConfigured();

  // ===== DADOS PROCESSADOS =====
  const processedData = useMemo(() => {
    if (!apiData) return null;

    const { company, brokers, funnel } = apiData;

    // Aplica multiplicador baseado no período selecionado
    const periodMultiplier = {
      'current_month': 1,
      'last_month': 0.85,
      'last_3_months': 2.1
    }[selectedPeriod] || 1;

    return {
      company: {
        ...company,
        vgvTotal: Math.round(company.vgvTotal * periodMultiplier),
        commissions: Math.round(company.commissions * periodMultiplier),
        totalLeads: Math.round(company.totalLeads * periodMultiplier),
        closedDeals: Math.round(company.closedDeals * periodMultiplier),
        newClients: Math.round(company.newClients * periodMultiplier),
      },
      brokers: brokers.map(broker => ({
        ...broker,
        vgv: Math.round(broker.vgv * periodMultiplier),
        deals: Math.round(broker.deals * periodMultiplier),
        calls: Math.round(broker.calls * periodMultiplier),
        visits: Math.round(broker.visits * periodMultiplier),
      })),
      funnel: {
        ...funnel,
        leads: { ...funnel.leads, total: Math.round(funnel.leads.total * periodMultiplier) },
        qualified: { ...funnel.qualified, total: Math.round(funnel.qualified.total * periodMultiplier) },
        proposals: { ...funnel.proposals, total: Math.round(funnel.proposals.total * periodMultiplier) },
        closed: { ...funnel.closed, total: Math.round(funnel.closed.total * periodMultiplier) },
      }
    };
  }, [apiData, selectedPeriod]);

  // ===== CÁLCULOS DE METAS =====
  const calculateGoals = useMemo(() => {
    if (!processedData) return { daily: {}, monthly: {} };

    const { company, funnel } = processedData;
    const daysInMonth = 30;
    const workingDays = 22;

    // Taxas de conversão do funil
    const conversionRates = {
      leadToQualified: funnel.qualified.total / funnel.leads.total || 0.3,
      qualifiedToProposal: funnel.proposals.total / funnel.qualified.total || 0.17,
      proposalToClosed: funnel.closed.total / funnel.proposals.total || 0.04
    };

    // Metas mensais
    const monthlyVGVGoal = goals.monthly.vgv;
    const monthlyDealsGoal = goals.monthly.deals;

    // Cálculo de atividades necessárias
    const avgDealValue = company.avgDealValue || 200000;
    const dealsNeeded = Math.ceil(monthlyVGVGoal / avgDealValue);
    const proposalsNeeded = Math.ceil(dealsNeeded / conversionRates.proposalToClosed);
    const qualifiedNeeded = Math.ceil(proposalsNeeded / conversionRates.qualifiedToProposal);
    const leadsNeeded = Math.ceil(qualifiedNeeded / conversionRates.leadToQualified);

    return {
      monthly: {
        vgv: monthlyVGVGoal,
        deals: monthlyDealsGoal,
        proposals: proposalsNeeded,
        qualified: qualifiedNeeded,
        leads: leadsNeeded,
        calls: leadsNeeded * 3, // 3 ligações por lead
        visits: Math.ceil(proposalsNeeded * 0.8) // 80% das propostas geram visitas
      },
      daily: {
        vgv: Math.ceil(monthlyVGVGoal / workingDays),
        deals: Math.ceil(monthlyDealsGoal / workingDays),
        proposals: Math.ceil(proposalsNeeded / workingDays),
        qualified: Math.ceil(qualifiedNeeded / workingDays),
        leads: Math.ceil(leadsNeeded / workingDays),
        calls: Math.ceil((leadsNeeded * 3) / workingDays),
        visits: Math.ceil((proposalsNeeded * 0.8) / workingDays)
      }
    };
  }, [processedData, goals]);

  // ===== SISTEMA DE GAMIFICAÇÃO =====
  const gamificationData = useMemo(() => {
    if (!processedData) return { badges: [], ranking: [], totalPoints: 0 };

    const { company, brokers } = processedData;
    const badges = [];
    let totalPoints = 0;

    // Badges da empresa
    if (company.vgvTotal >= goals.monthly.vgv) {
      badges.push({ id: 'goal_crusher', name: 'Goal Crusher', icon: '🎯', description: 'Meta mensal atingida!' });
      totalPoints += 100;
    }

    if (company.closedDeals >= goals.monthly.deals) {
      badges.push({ id: 'deal_master', name: 'Deal Master', icon: '💼', description: 'Meta de negócios atingida!' });
      totalPoints += 100;
    }

    // Ranking de corretores
    const ranking = brokers
      .map(broker => ({
        ...broker,
        points: (broker.vgv / 1000) + (broker.deals * 50) + (broker.calls * 2)
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);

    return { badges, ranking, totalPoints };
  }, [processedData, goals]);

  // ===== COMPONENTE DE STATUS DA API =====
  const APIStatusIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      {isConfigured ? (
        apiStatus.authenticated ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-green-600">API Conectada</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-600">Conectando...</span>
          </>
        )
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-red-600">API não configurada</span>
        </>
      )}
      {lastUpdated && (
        <span className="text-gray-500">
          • Atualizado: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  );

  // ===== LOADING E ERROR STATES =====
  if (apiLoading && !processedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#FF6B35]" />
          <h2 className="text-xl font-semibold mb-2">Carregando Dashboard</h2>
          <p className="text-gray-600">Conectando com a API Imobzi...</p>
          <APIStatusIndicator />
        </div>
      </div>
    );
  }

  if (apiError && !processedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Erro na Conexão</h2>
          <p className="text-gray-600 mb-4">{apiError}</p>
          <Button onClick={refetchData} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          <div className="mt-4">
            <APIStatusIndicator />
          </div>
        </div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold mb-2">Dados Indisponíveis</h2>
          <p className="text-gray-600">Não foi possível carregar os dados do dashboard.</p>
        </div>
      </div>
    );
  }

  const { company, brokers, funnel } = processedData;

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Uno Rede Imobiliária" 
                className="h-8 w-auto mr-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Uno</h1>
                <p className="text-sm text-gray-500">Métricas Imobiliárias</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <APIStatusIndicator />
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Mês Atual</SelectItem>
                  <SelectItem value="last_month">Mês Passado</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={refetchData}
                variant="outline" 
                size="sm"
                disabled={apiLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${apiLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>

              <Dialog open={isGoalsModalOpen} onOpenChange={setIsGoalsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar Metas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuração de Metas</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="annual-vgv">Meta Anual VGV (R$)</Label>
                      <Input
                        id="annual-vgv"
                        type="number"
                        value={goals.annual.vgv}
                        onChange={(e) => setGoals(prev => ({
                          ...prev,
                          annual: { ...prev.annual, vgv: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthly-vgv">Meta Mensal VGV (R$)</Label>
                      <Input
                        id="monthly-vgv"
                        type="number"
                        value={goals.monthly.vgv}
                        onChange={(e) => setGoals(prev => ({
                          ...prev,
                          monthly: { ...prev.monthly, vgv: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthly-deals">Meta Mensal Negócios</Label>
                      <Input
                        id="monthly-deals"
                        type="number"
                        value={goals.monthly.deals}
                        onChange={(e) => setGoals(prev => ({
                          ...prev,
                          monthly: { ...prev.monthly, deals: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <Button 
                      onClick={() => setIsGoalsModalOpen(false)}
                      className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]"
                    >
                      Salvar Metas
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Indicador de dados de fallback */}
      {apiData?.isFallback && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Usando dados de demonstração. Configure a API Imobzi para dados reais.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="goals">Metas Empresa</TabsTrigger>
            <TabsTrigger value="brokers">Corretores</TabsTrigger>
            <TabsTrigger value="gamification">Gamificação</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">VGV Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {company.vgvTotal.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Meta: R$ {goals.monthly.vgv.toLocaleString()}
                  </p>
                  <Progress 
                    value={(company.vgvTotal / goals.monthly.vgv) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comissões</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {company.commissions.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5% do VGV
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CAC</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {company.cac.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Custo por cliente
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {company.roi.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Retorno sobre investimento
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Funil de Vendas */}
            <Card>
              <CardHeader>
                <CardTitle>Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart 
                  data={[
                    { name: 'Leads', value: funnel.leads.total, percentage: funnel.leads.percentage },
                    { name: 'Qualificados', value: funnel.qualified.total, percentage: funnel.qualified.percentage },
                    { name: 'Propostas', value: funnel.proposals.total, percentage: funnel.proposals.percentage },
                    { name: 'Fechados', value: funnel.closed.total, percentage: funnel.closed.percentage },
                  ]}
                  type="funnel"
                />
              </CardContent>
            </Card>

            {/* Ranking de Corretores */}
            <Card>
              <CardHeader>
                <CardTitle>Top Corretores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brokers.slice(0, 3).map((broker, index) => (
                    <div key={broker.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{broker.name}</p>
                          <p className="text-sm text-gray-500">{broker.deals} negócios</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {broker.vgv.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{broker.calls} ligações</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metas Empresa */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividades Diárias Necessárias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(calculateGoals.daily).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <Badge variant="outline">{value}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas Mensais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(calculateGoals.monthly).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <Badge variant="outline">
                        {key === 'vgv' ? `R$ ${value.toLocaleString()}` : value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Corretores */}
          <TabsContent value="brokers" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecionar corretor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os corretores</SelectItem>
                  {brokers.map(broker => (
                    <SelectItem key={broker.id} value={broker.id.toString()}>
                      {broker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBroker === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brokers.map(broker => (
                  <Card key={broker.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{broker.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>VGV:</span>
                        <span className="font-bold">R$ {broker.vgv.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Negócios:</span>
                        <span className="font-bold">{broker.deals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ligações:</span>
                        <span className="font-bold">{broker.calls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visitas:</span>
                        <span className="font-bold">{broker.visits}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detalhes do corretor selecionado */}
                {(() => {
                  const broker = brokers.find(b => b.id.toString() === selectedBroker);
                  if (!broker) return null;

                  return (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>{broker.name} - Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#FF6B35]">
                                R$ {broker.vgv.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">VGV</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#FF6B35]">
                                {broker.deals}
                              </div>
                              <div className="text-sm text-gray-500">Negócios</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Ligações:</span>
                              <span className="font-bold">{broker.calls}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Visitas:</span>
                              <span className="font-bold">{broker.visits}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Email:</span>
                              <span className="text-sm">{broker.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Telefone:</span>
                              <span className="text-sm">{broker.phone}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Atividades Diárias Necessárias</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(calculateGoals.daily).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <Badge variant="outline">{Math.ceil(value / brokers.length)}</Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </div>
            )}
          </TabsContent>

          {/* Gamificação */}
          <TabsContent value="gamification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Badges Conquistados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {gamificationData.badges.length > 0 ? (
                    <div className="space-y-3">
                      {gamificationData.badges.map(badge => (
                        <div key={badge.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <div className="font-bold">{badge.name}</div>
                            <div className="text-sm text-gray-600">{badge.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum badge conquistado ainda</p>
                      <p className="text-sm">Continue trabalhando para desbloquear conquistas!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#FF6B35]" />
                    Ranking de Pontuação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gamificationData.ranking.map((broker, index) => (
                      <div key={broker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{broker.name}</div>
                            <div className="text-sm text-gray-500">
                              {broker.deals} negócios • {broker.calls} ligações
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#FF6B35]">
                            {Math.round(broker.points)} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sistema de Pontuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1 pt</div>
                    <div className="text-sm text-blue-800">por R$ 1.000 em VGV</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">50 pts</div>
                    <div className="text-sm text-green-800">por negócio fechado</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2 pts</div>
                    <div className="text-sm text-purple-800">por ligação realizada</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;

