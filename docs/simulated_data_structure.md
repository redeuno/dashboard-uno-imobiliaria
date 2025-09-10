# Estrutura de Dados Simulados para KPIs Gerenciais e por Corretor

Esta seção detalha a estrutura de dados simulados que será utilizada para alimentar o dashboard expandido, incorporando os novos KPIs gerenciais e individuais por corretor, metas e acompanhamento de atividades. A estrutura foi projetada para ser compatível com a API Imobzi, facilitando a transição para dados reais no futuro.

## 1. Dados Gerenciais (Visão da Empresa)

### 1.1. `company_performance.json`

Representa o desempenho geral da empresa ao longo do tempo, com foco em VGV, Comissões, CAC, CPL e ROI.

```json
[
  {
    "period": "2025-01",
    "vgv_total": 1500000.00,
    "total_commissions": 75000.00,
    "cac": 3000.00,
    "cpl": 5.00,
    "roi": 1200.00,
    "total_leads": 1200,
    "new_clients": 25,
    "deals_won": 20
  },
  {
    "period": "2025-02",
    "vgv_total": 1800000.00,
    "total_commissions": 90000.00,
    "cac": 2800.00,
    "cpl": 4.80,
    "roi": 1500.00,
    "total_leads": 1500,
    "new_clients": 32,
    "deals_won": 28
  },
  {
    "period": "2025-03",
    "vgv_total": 1700000.00,
    "total_commissions": 85000.00,
    "cac": 3100.00,
    "cpl": 5.10,
    "roi": 1350.00,
    "total_leads": 1300,
    "new_clients": 28,
    "deals_won": 25
  },
  {
    "period": "2025-04",
    "vgv_total": 2000000.00,
    "total_commissions": 100000.00,
    "cac": 2700.00,
    "cpl": 4.50,
    "roi": 1600.00,
    "total_leads": 1800,
    "new_clients": 38,
    "deals_won": 35
  },
  {
    "period": "2025-05",
    "vgv_total": 1900000.00,
    "total_commissions": 95000.00,
    "cac": 2900.00,
    "cpl": 4.90,
    "roi": 1450.00,
    "total_leads": 1600,
    "new_clients": 35,
    "deals_won": 30
  },
  {
    "period": "2025-06",
    "vgv_total": 2200000.00,
    "total_commissions": 110000.00,
    "cac": 2600.00,
    "cpl": 4.30,
    "roi": 1700.00,
    "total_leads": 2000,
    "new_clients": 42,
    "deals_won": 40
  },
  {
    "period": "2025-07",
    "vgv_total": 2100000.00,
    "total_commissions": 105000.00,
    "cac": 2850.00,
    "cpl": 4.70,
    "roi": 1550.00,
    "total_leads": 1900,
    "new_clients": 40,
    "deals_won": 38
  },
  {
    "period": "2025-08",
    "vgv_total": 2300000.00,
    "total_commissions": 115000.00,
    "cac": 2550.00,
    "cpl": 4.20,
    "roi": 1800.00,
    "total_leads": 2100,
    "new_clients": 45,
    "deals_won": 42
  },
  {
    "period": "2025-09",
    "vgv_total": 2400000.00,
    "total_commissions": 120000.00,
    "cac": 2400.00,
    "cpl": 4.00,
    "roi": 1900.00,
    "total_leads": 2200,
    "new_clients": 48,
    "deals_won": 45
  }
]
```

### 1.2. `company_goals.json`

Define as metas anuais, semestrais, trimestrais e mensais para os principais KPIs gerenciais.

```json
[
  {
    "year": 2025,
    "annual_vgv_goal": 25000000.00,
    "annual_commissions_goal": 1250000.00,
    "annual_new_clients_goal": 500,
    "semesters": [
      {
        "semester": 1,
        "vgv_goal": 12000000.00,
        "commissions_goal": 600000.00,
        "new_clients_goal": 240
      },
      {
        "semester": 2,
        "vgv_goal": 13000000.00,
        "commissions_goal": 650000.00,
        "new_clients_goal": 260
      }
    ],
    "quarters": [
      {
        "quarter": 1,
        "vgv_goal": 6000000.00,
        "commissions_goal": 300000.00,
        "new_clients_goal": 120
      },
      {
        "quarter": 2,
        "vgv_goal": 6000000.00,
        "commissions_goal": 300000.00,
        "new_clients_goal": 120
      },
      {
        "quarter": 3,
        "vgv_goal": 6500000.00,
        "commissions_goal": 325000.00,
        "new_clients_goal": 130
      },
      {
        "quarter": 4,
        "vgv_goal": 6500000.00,
        "commissions_goal": 325000.00,
        "new_clients_goal": 130
      }
    ],
    "months": [
      {
        "month": 1,
        "vgv_goal": 2000000.00,
        "commissions_goal": 100000.00,
        "new_clients_goal": 40
      },
      {
        "month": 2,
        "vgv_goal": 2000000.00,
        "commissions_goal": 100000.00,
        "new_clients_goal": 40
      },
      {
        "month": 3,
        "vgv_goal": 2000000.00,
        "commissions_goal": 100000.00,
        "new_clients_goal": 40
      },
      {
        "month": 4,
        "vgv_goal": 2000000.00,
        "commissions_goal": 100000.00,
        "new_clients_goal": 40
      },
      {
        "month": 5,
        "vgv_goal": 2000000.00,
        "commissions_goal": 100000.00,
        "new_clients_goal": 40
      },
      {
        "month": 6,
        "vgv_goal": 2000000.00,
        "commissions_goal": 100000.00,
        "new_clients_goal": 40
      },
      {
        "month": 7,
        "vgv_goal": 2100000.00,
        "commissions_goal": 105000.00,
        "new_clients_goal": 42
      },
      {
        "month": 8,
        "vgv_goal": 2200000.00,
        "commissions_goal": 110000.00,
        "new_clients_goal": 44
      },
      {
        "month": 9,
        "vgv_goal": 2300000.00,
        "commissions_goal": 115000.00,
        "new_clients_goal": 46
      },
      {
        "month": 10,
        "vgv_goal": 2400000.00,
        "commissions_goal": 120000.00,
        "new_clients_goal": 48
      },
      {
        "month": 11,
        "vgv_goal": 2500000.00,
        "commissions_goal": 125000.00,
        "new_clients_goal": 50
      },
      {
        "month": 12,
        "vgv_goal": 2500000.00,
        "commissions_goal": 125000.00,
        "new_clients_goal": 50
      }
    ]
  }
]
```

## 2. Dados por Corretor (Visão Individual)

### 2.1. `brokers.json`

Informações básicas dos corretores, incluindo seus IDs para mapeamento.

```json
[
  {
    "db_id": "user_id_1",
    "fullname": "Corretor A",
    "email": "corretorA@imobzi.com"
  },
  {
    "db_id": "user_id_2",
    "fullname": "Corretor B",
    "email": "corretorB@imobzi.com"
  },
  {
    "db_id": "user_id_3",
    "fullname": "Corretor C",
    "email": "corretorC@imobzi.com"
  }
]
```

### 2.2. `broker_performance.json`

Desempenho individual de cada corretor ao longo do tempo, incluindo VGV, comissões, negócios ganhos e leads atribuídos.

```json
[
  {
    "broker_id": "user_id_1",
    "period": "2025-08",
    "vgv_total": 700000.00,
    "total_commissions": 35000.00,
    "deals_won": 2,
    "leads_attributed": 500
  },
  {
    "broker_id": "user_id_1",
    "period": "2025-09",
    "vgv_total": 800000.00,
    "total_commissions": 40000.00,
    "deals_won": 3,
    "leads_attributed": 600
  },
  {
    "broker_id": "user_id_2",
    "period": "2025-08",
    "vgv_total": 0.00,
    "total_commissions": 0.00,
    "deals_won": 0,
    "leads_attributed": 300
  },
  {
    "broker_id": "user_id_2",
    "period": "2025-09",
    "vgv_total": 100000.00,
    "total_commissions": 5000.00,
    "deals_won": 1,
    "leads_attributed": 350
  },
  {
    "broker_id": "user_id_3",
    "period": "2025-08",
    "vgv_total": 500000.00,
    "total_commissions": 25000.00,
    "deals_won": 1,
    "leads_attributed": 200
  },
  {
    "broker_id": "user_id_3",
    "period": "2025-09",
    "vgv_total": 600000.00,
    "total_commissions": 30000.00,
    "deals_won": 2,
    "leads_attributed": 250
  }
]
```

### 2.3. `broker_goals.json`

Define as metas mensais e semanais para cada corretor, incluindo VGV, comissões, negócios ganhos e atividades.

```json
[
  {
    "broker_id": "user_id_1",
    "year": 2025,
    "month": 9,
    "monthly_vgv_goal": 750000.00,
    "monthly_commissions_goal": 37500.00,
    "monthly_deals_won_goal": 3,
    "weekly_activity_goals": [
      {
        "week": 1,
        "calls_goal": 50,
        "visits_goal": 5,
        "proposals_goal": 3,
        "owners_contacted_goal": 10,
        "buyers_contacted_goal": 15
      },
      {
        "week": 2,
        "calls_goal": 50,
        "visits_goal": 5,
        "proposals_goal": 3,
        "owners_contacted_goal": 10,
        "buyers_contacted_goal": 15
      },
      {
        "week": 3,
        "calls_goal": 50,
        "visits_goal": 5,
        "proposals_goal": 3,
        "owners_contacted_goal": 10,
        "buyers_contacted_goal": 15
      },
      {
        "week": 4,
        "calls_goal": 50,
        "visits_goal": 5,
        "proposals_goal": 3,
        "owners_contacted_goal": 10,
        "buyers_contacted_goal": 15
      }
    ]
  },
  {
    "broker_id": "user_id_2",
    "year": 2025,
    "month": 9,
    "monthly_vgv_goal": 500000.00,
    "monthly_commissions_goal": 25000.00,
    "monthly_deals_won_goal": 2,
    "weekly_activity_goals": [
      {
        "week": 1,
        "calls_goal": 40,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 8,
        "buyers_contacted_goal": 12
      },
      {
        "week": 2,
        "calls_goal": 40,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 8,
        "buyers_contacted_goal": 12
      },
      {
        "week": 3,
        "calls_goal": 40,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 8,
        "buyers_contacted_goal": 12
      },
      {
        "week": 4,
        "calls_goal": 40,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 8,
        "buyers_contacted_goal": 12
      }
    ]
  },
  {
    "broker_id": "user_id_3",
    "year": 2025,
    "month": 9,
    "monthly_vgv_goal": 600000.00,
    "monthly_commissions_goal": 30000.00,
    "monthly_deals_won_goal": 2,
    "weekly_activity_goals": [
      {
        "week": 1,
        "calls_goal": 45,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 9,
        "buyers_contacted_goal": 13
      },
      {
        "week": 2,
        "calls_goal": 45,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 9,
        "buyers_contacted_goal": 13
      },
      {
        "week": 3,
        "calls_goal": 45,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 9,
        "buyers_contacted_goal": 13
      },
      {
        "week": 4,
        "calls_goal": 45,
        "visits_goal": 4,
        "proposals_goal": 2,
        "owners_contacted_goal": 9,
        "buyers_contacted_goal": 13
      }
    ]
  }
]
```

### 2.4. `broker_activities.json`

Registra as atividades diárias/semanais realizadas por cada corretor.

```json
[
  {
    "broker_id": "user_id_1",
    "date": "2025-09-01",
    "calls_made": 45,
    "visits_made": 4,
    "proposals_sent": 2,
    "owners_contacted": 8,
    "buyers_contacted": 12
  },
  {
    "broker_id": "user_id_1",
    "date": "2025-09-02",
    "calls_made": 55,
    "visits_made": 6,
    "proposals_sent": 3,
    "owners_contacted": 12,
    "buyers_contacted": 18
  },
  {
    "broker_id": "user_id_2",
    "date": "2025-09-01",
    "calls_made": 30,
    "visits_made": 2,
    "proposals_sent": 1,
    "owners_contacted": 5,
    "buyers_contacted": 8
  },
  {
    "broker_id": "user_id_2",
    "date": "2025-09-02",
    "calls_made": 35,
    "visits_made": 3,
    "proposals_sent": 1,
    "owners_contacted": 6,
    "buyers_contacted": 10
  },
  {
    "broker_id": "user_id_3",
    "date": "2025-09-01",
    "calls_made": 40,
    "visits_made": 3,
    "proposals_sent": 2,
    "owners_contacted": 7,
    "buyers_contacted": 10
  },
  {
    "broker_id": "user_id_3",
    "date": "2025-09-02",
    "calls_made": 48,
    "visits_made": 4,
    "proposals_sent": 2,
    "owners_contacted": 9,
    "buyers_contacted": 14
  }
]
```

## 3. Mapeamento para Endpoints da API Imobzi

Para garantir a compatibilidade futura com a API Imobzi, a estrutura de dados simulados foi baseada nos endpoints existentes e na documentação fornecida. Abaixo, um resumo de como os dados simulados se relacionam com os endpoints da API:

- **`company_performance.json`:** Combina dados de `/deals` (para VGV, comissões, negócios ganhos), `/financial/transactions` (para custos de marketing/vendas), `/contacts` (para leads e novos clientes) e `/media-sources-report` (para CPL).
- **`company_goals.json`:** Não possui um endpoint direto na API Imobzi. Representa dados de metas que seriam configurados externamente ou em um módulo de gestão de metas.
- **`brokers.json`:** Corresponde ao endpoint `/users` (filtrando por `function` = 'Broker').
- **`broker_performance.json`:** Combina dados de `/deals` (filtrando por `broker_id` para VGV, comissões, negócios ganhos) e `/contacts` (para leads atribuídos, se houver campo de atribuição).
- **`broker_goals.json`:** Não possui um endpoint direto na API Imobzi. Representa metas individuais que seriam configuradas externamente.
- **`broker_activities.json`:** Corresponde parcialmente ao endpoint `/calendar` (para visitas, propostas, etc.). Atividades como 'ligações feitas', 'proprietários contatados' e 'compradores contatados' podem não ter um mapeamento direto na API e podem exigir inferência ou integração com sistemas de telefonia/CRM externos.

## 4. Próximos Passos

Com esta estrutura de dados simulados definida, o próximo passo é atualizar as funções de cálculo de métricas para processar esses novos dados e gerar os KPIs gerenciais e individuais. Em seguida, a interface do dashboard será projetada e desenvolvida para exibir essas novas métricas e funcionalidades de metas e acompanhamento de atividades.

