# Documentação dos Endpoints da API Imobzi (Dados Simulados)

Esta documentação detalha os endpoints da API Imobzi relevantes para o cálculo das métricas imobiliárias, com foco na estrutura dos dados esperados e nos parâmetros de consulta. Esta informação servirá como base para a simulação de dados, garantindo que o dashboard possa ser facilmente adaptado para dados reais no futuro.

**Base URL da API:** `https://api.imobzi.app/v1`

**Autenticação:** `X-Imobzi-Secret` com um token JWT.

## Endpoints e Estrutura de Dados Esperada

### 1. Pipelines (Funis)

**Endpoint:** `/pipelines`

**Descrição:** Retorna a lista de funis e suas etapas, indicando onde os negócios estão estagnados ou em qual etapa se encontram. Pode ser necessário o `pipeline_group_id` para filtrar.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "pipeline_id_1",
    "name": "Funil de Vendas Imóveis",
    "stages": [
      {
        "db_id": "stage_id_1_1",
        "name": "Qualificação de Lead",
        "deals_count": 150
      },
      {
        "db_id": "stage_id_1_2",
        "name": "Visita Agendada",
        "deals_count": 80
      },
      {
        "db_id": "stage_id_1_3",
        "name": "Proposta Enviada",
        "deals_count": 40
      },
      {
        "db_id": "stage_id_1_4",
        "name": "Negociação",
        "deals_count": 20
      },
      {
        "db_id": "stage_id_1_5",
        "name": "Fechado/Ganho",
        "deals_count": 10
      }
    ]
  },
  {
    "db_id": "pipeline_id_2",
    "name": "Funil de Locação",
    "stages": [
      {
        "db_id": "stage_id_2_1",
        "name": "Contato Inicial",
        "deals_count": 100
      },
      {
        "db_id": "stage_id_2_2",
        "name": "Visita ao Imóvel",
        "deals_count": 60
      },
      {
        "db_id": "stage_id_2_3",
        "name": "Análise de Crédito",
        "deals_count": 30
      },
      {
        "db_id": "stage_id_2_4",
        "name": "Contrato Assinado",
        "deals_count": 15
      }
    ]
  }
]
```

### 2. Pipeline Groups

**Endpoint:** `/pipeline-groups`

**Descrição:** Fornece informações sobre os grupos de pipelines, importante para a listagem e organização dos funis.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "group_id_1",
    "name": "Vendas",
    "pipelines": [
      "pipeline_id_1"
    ]
  },
  {
    "db_id": "group_id_2",
    "name": "Locações",
    "pipelines": [
      "pipeline_id_2"
    ]
  }
]
```

### 3. Properties (Imóveis)

**Endpoint:** `/properties`

**Descrição:** Lista os imóveis disponíveis. Pode ser filtrado por diversos parâmetros para saber os ativos e no site.

**Parâmetros de Consulta Comuns:**

*   `cursor`: String (Cursor para paginação)
*   `all_brokers`: String (Todos os corretores)
*   `clear_notifications`: String (Limpar notificações)
*   `smart_list`: String (Lista inteligente, com várias opções como `all`, `available`, `site_publish`, `rent`, `sale`, etc.)
*   `namespace`: String (Namespace)
*   `order`: String (Ordem)
*   `limit`: Integer (Limite de resultados, de 1 a 50, padrão 10)
*   `show_map`: Boolean (Mostrar no mapa)
*   `show_network`: Boolean (Mostrar na rede)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "property_id_1",
    "code": "IMO001",
    "address": "Rua Exemplo, 123",
    "city": "Cidade Exemplo",
    "state": "Estado Exemplo",
    "price_sale": 500000.00,
    "price_rent": 2500.00,
    "status": "available",
    "finality": "sale",
    "photos": [
      "url_foto_1.jpg",
      "url_foto_2.jpg"
    ],
    "owner_id": "user_id_1"
  },
  {
    "db_id": "property_id_2",
    "code": "IMO002",
    "address": "Avenida Teste, 456",
    "city": "Cidade Exemplo",
    "state": "Estado Exemplo",
    "price_sale": 0.00,
    "price_rent": 3000.00,
    "status": "rented",
    "finality": "rent",
    "photos": [
      "url_foto_3.jpg"
    ],
    "owner_id": "user_id_2"
  }
]
```

### 4. Property Deals Match

**Endpoint:** `/property/{property_id}/deals-match`

**Descrição:** Retorna os negócios (deals) que correspondem ao perfil de um imóvel específico.

**Parâmetros de Caminho:**

*   `property_id`: ID do imóvel (integer ou string)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "deal_id": "deal_id_1",
    "deal_name": "Negócio Imóvel A",
    "stage": "Proposta Enviada",
    "contact_id": "contact_id_1",
    "value": 480000.00
  },
  {
    "deal_id": "deal_id_2",
    "deal_name": "Negócio Imóvel B",
    "stage": "Negociação",
    "contact_id": "contact_id_2",
    "value": 2800.00
  }
]
```

### 5. Reports Properties

**Endpoint:** `/reports/properties`

**Descrição:** Relatórios de imóveis que dependem de um `report_name` e podem ser filtrados por `all_brokers`.

**Parâmetros de Consulta:**

*   `all_brokers`: String (Todos os corretores)
*   `report_name`: String (Nome do relatório, **obrigatório**)

**Estrutura de Dados Esperada (Exemplo Simulado - para `report_name` = "Imóveis Ativos"):**

```json
[
  {
    "property_id": "property_id_1",
    "code": "IMO001",
    "status": "available",
    "days_on_market": 90,
    "broker_id": "user_id_1"
  },
  {
    "property_id": "property_id_3",
    "code": "IMO003",
    "status": "available",
    "days_on_market": 45,
    "broker_id": "user_id_2"
  }
]
```

### 6. Property Reserves

**Endpoint:** `/property-reserves`

**Descrição:** Informações sobre imóveis reservados. Depende de queries como `deal_id`, `property_id`, `contact_id`, `contact_type`.

**Parâmetros de Consulta:**

*   `deal_id`: String (ID do Negócio)
*   `property_id`: ID do Imóvel (integer ou string)
*   `contact_id`: ID do Contato (integer ou string)
*   `contact_type`: String (Tipo de contato: `person`, `organization`, `undefined`)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "reserve_id": "reserve_id_1",
    "property_id": "property_id_1",
    "deal_id": "deal_id_1",
    "contact_id": "contact_id_1",
    "reserve_date": "2025-08-15",
    "status": "active"
  }
]
```

### 7. Reports Deals Done

**Endpoint:** `/reports/deals-done`

**Descrição:** Relatório de negócios concluídos.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "deal_id": "deal_id_ganho_1",
    "deal_name": "Venda Apartamento Centro",
    "value": 500000.00,
    "close_date": "2025-08-20",
    "broker_id": "user_id_1",
    "commission_value": 25000.00
  },
  {
    "deal_id": "deal_id_ganho_2",
    "deal_name": "Locação Casa Praia",
    "value": 3000.00,
    "close_date": "2025-08-25",
    "broker_id": "user_id_2",
    "commission_value": 300.00
  }
]
```

### 8. Users (Usuários/Corretores)

**Endpoint:** `/users`

**Descrição:** Lista de usuários, incluindo corretores. O `db_id` é importante para relacionar com imóveis, negócios e comissões.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "user_id_1",
    "fullname": "Corretor A",
    "email": "corretorA@imobzi.com",
    "function": "Broker",
    "active": true,
    "profile_image_url": "url_imagem_corretorA.jpg"
  },
  {
    "db_id": "user_id_2",
    "fullname": "Corretor B",
    "email": "corretorB@imobzi.com",
    "function": "Broker",
    "active": true,
    "profile_image_url": "url_imagem_corretorB.jpg"
  },
  {
    "db_id": "user_id_3",
    "fullname": "Gerente C",
    "email": "gerenteC@imobzi.com",
    "function": "Manager",
    "active": true,
    "profile_image_url": "url_imagem_gerenteC.jpg"
  }
]
```

### 9. User Ranking

**Endpoint:** `/users/ranking`

**Descrição:** Ranking de corretores. Requer parâmetros de consulta como `year`, `month`, `deal_interest`.

**Parâmetros de Consulta:**

*   `year`: Ano (integer ou string)
*   `month`: Mês (integer ou string)
*   `deal_interest`: String (Interesse do negócio)

**Estrutura de Dados Esperada (Exemplo Simulado - para `year`=2025, `month`=8):**

```json
[
  {
    "user_id": "user_id_1",
    "fullname": "Corretor A",
    "total_deals_won": 10,
    "total_value_won": 1000000.00,
    "rank": 1
  },
  {
    "user_id": "user_id_2",
    "fullname": "Corretor B",
    "total_deals_won": 7,
    "total_value_won": 750000.00,
    "rank": 2
  }
]
```

### 10. User Billing

**Endpoint:** `/user-billing`

**Descrição:** Informações de faturamento por usuário. Requer `pipeline_group_id` e `all_users`.

**Parâmetros de Consulta:**

*   `pipeline_group_id`: Integer (ID do Grupo de Pipeline)
*   `all_users`: Boolean (Todos os usuários)

**Estrutura de Dados Esperada (Exemplo Simulado - para `pipeline_group_id`=1, `all_users`=true):**

```json
[
  {
    "user_id": "user_id_1",
    "month": 8,
    "year": 2025,
    "new_deals": 5,
    "total_commission": 25000.00,
    "total_rent": 0.00,
    "total_sale": 500000.00
  },
  {
    "user_id": "user_id_2",
    "month": 8,
    "year": 2025,
    "new_deals": 3,
    "total_commission": 15000.00,
    "total_rent": 3000.00,
    "total_sale": 0.00
  }
]
```

### 11. Deals (Negócios)

**Endpoint:** `/deals`

**Descrição:** Lista os negócios (oportunidades) dentro dos pipelines.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "deal_id_1",
    "name": "Venda Apartamento Centro",
    "status": "won",
    "stage_id": "stage_id_1_5",
    "pipeline_id": "pipeline_id_1",
    "value": 500000.00,
    "broker_id": "user_id_1",
    "contact_id": "contact_id_1",
    "created_at": "2025-07-01T10:00:00Z",
    "closed_at": "2025-08-20T15:30:00Z",
    "source": "Website"
  },
  {
    "db_id": "deal_id_3",
    "name": "Locação Casa Praia",
    "status": "lost",
    "stage_id": "stage_id_2_2",
    "pipeline_id": "pipeline_id_2",
    "value": 3000.00,
    "broker_id": "user_id_2",
    "contact_id": "contact_id_3",
    "created_at": "2025-07-10T11:00:00Z",
    "closed_at": null,
    "source": "Indicação"
  }
]
```

### 12. Deals Search

**Endpoint:** `/deals/search`

**Descrição:** Permite buscar negócios com filtros.

**Estrutura de Dados Esperada (Exemplo Simulado - similar a `/deals`):**

```json
[
  {
    "db_id": "deal_id_1",
    "name": "Venda Apartamento Centro",
    "status": "won",
    "stage_id": "stage_id_1_5",
    "pipeline_id": "pipeline_id_1",
    "value": 500000.00,
    "broker_id": "user_id_1",
    "contact_id": "contact_id_1",
    "created_at": "2025-07-01T10:00:00Z",
    "closed_at": "2025-08-20T15:30:00Z",
    "source": "Website"
  }
]
```

### 13. Deal Lost Reason

**Endpoint:** `/deal/lost-reason`

**Descrição:** Retorna os motivos de perda de negócios.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "lost_reason_id_1",
    "name": "Preço muito alto"
  },
  {
    "db_id": "lost_reason_id_2",
    "name": "Concorrência"
  }
]
```

### 14. Financial Categories

**Endpoint:** `/financial/categories`

**Descrição:** Categorias financeiras que indicam custos (ex: marketing, FaceAds, Google).

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "category_id_1",
    "name": "Marketing",
    "type": "expense"
  },
  {
    "db_id": "category_id_2",
    "name": "Vendas",
    "type": "expense"
  },
  {
    "db_id": "category_id_3",
    "name": "Aluguel",
    "type": "revenue"
  }
]
```

### 15. Commission Onlending

**Endpoint:** `/commission/onlending`

**Descrição:** Informações sobre comissões. Requer parâmetros de consulta para busca.

**Parâmetros de Consulta:**

*   `commission_id`: Integer (ID da Comissão)
*   `deal_id`: String (ID do Negócio)
*   `gross_receipt`: Boolean ou String (Recibo Bruto)
*   `commission_statement`: Boolean (Extrato de Comissão)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "commission_id_1",
    "deal_id": "deal_id_ganho_1",
    "user_id": "user_id_1",
    "amount": 25000.00,
    "status": "paid",
    "due_date": "2025-09-01"
  }
]
```

### 16. Financial Transactions

**Endpoint:** `/financial/transactions`

**Descrição:** Todas as transações financeiras (pagamentos e recebimentos). Requer diversos parâmetros de consulta.

**Parâmetros de Consulta:**

*   `filter_type`: String (Tipo de filtro)
*   `search_text`: String (Texto de busca)
*   `start_at`: String (Data de início, formato YYYY-MM-DD)
*   `end_at`: String (Data de fim, formato YYYY-MM-DD)
*   `contact_type`: String (Tipo de contato)
*   `contact_id`: ID do Contato (integer ou string)
*   `user_id`: String (ID do Usuário)
*   `account_id`: ID da Conta (integer ou string)
*   `page`: Página (integer ou string)
*   `status`: String (Status)
*   `tags`: Array de strings (Tags)
*   `conciliation_type`: String (Tipo de conciliação)
*   `repeat_type`: String (Tipo de repetição)
*   `category`: Array de strings (Categoria)
*   `subcategory`: Array de strings (Subcategoria)
*   `sort_by`: String (Ordenar por)
*   `order_by`: String (Ordem: `asc` ou `desc`)
*   `from_contact`: Boolean (Do contato, padrão `false`)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "transaction_id_1",
    "type": "revenue",
    "category": "Aluguel",
    "amount": 2500.00,
    "due_date": "2025-09-05",
    "status": "paid",
    "contact_id": "contact_id_4",
    "deal_id": "deal_id_locacao_1"
  },
  {
    "db_id": "transaction_id_2",
    "type": "expense",
    "category": "Marketing",
    "amount": 500.00,
    "due_date": "2025-09-01",
    "status": "paid",
    "contact_id": null,
    "deal_id": null
  }
]
```

### 17. Financial Category by ID

**Endpoint:** `/financial/category/{category_id}`

**Descrição:** Retorna uma categoria financeira específica.

**Parâmetros de Caminho:**

*   `category_id`: ID da Categoria (integer ou string)

**Estrutura de Dados Esperada (Exemplo Simulado - para `category_id` = "category_id_1"):**

```json
{
  "db_id": "category_id_1",
  "name": "Marketing",
  "type": "expense"
}
```

### 18. Financial Landlord Account Individual Onlending

**Endpoint:** `/financial/landlord/account/individual-onlending/{landlord_transaction_id}`

**Descrição:** Detalhes de repasse individual para proprietários.

**Parâmetros de Caminho:**

*   `landlord_transaction_id`: ID da Transação do Proprietário (integer ou string)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
{
  "db_id": "onlending_id_1",
  "landlord_transaction_id": "landlord_trans_id_1",
  "amount": 2000.00,
  "status": "paid",
  "payment_date": "2025-09-10"
}
```

### 19. Financial Landlord Account Transactions

**Endpoint:** `/financial/landlord/account/{landlord_account_id}/transactions`

**Descrição:** Transações de uma conta de proprietário específica.

**Parâmetros de Caminho:**

*   `landlord_account_id`: ID da Conta do Proprietário (integer ou string)

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "landlord_trans_id_1",
    "account_id": "landlord_account_id_1",
    "type": "revenue",
    "amount": 2500.00,
    "date": "2025-09-05"
  }
]
```

### 20. Financial Landlord Account Transaction by ID

**Endpoint:** `/financial/landlord/account/{landlord_account_id}/transaction/{landlord_transaction_id}`

**Descrição:** Uma transação específica de uma conta de proprietário.

**Parâmetros de Caminho:**

*   `landlord_account_id`: ID da Conta do Proprietário (integer ou string)
*   `landlord_transaction_id`: ID da Transação do Proprietário (integer ou string)

**Estrutura de Dados Esperada (Exemplo Simulado - similar a `/financial/landlord/account/{landlord_account_id}/transactions`):**

```json
{
  "db_id": "landlord_trans_id_1",
  "account_id": "landlord_account_id_1",
  "type": "revenue",
  "amount": 2500.00,
  "date": "2025-09-05"
}
```

### 21. Invoices

**Endpoint:** `/invoices`

**Descrição:** Todas as faturas emitidas para inquilinos e serviços.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "invoice_id_1",
    "type": "rent",
    "amount": 2500.00,
    "due_date": "2025-09-01",
    "status": "paid",
    "contact_id": "contact_id_4"
  },
  {
    "db_id": "invoice_id_2",
    "type": "service",
    "amount": 150.00,
    "due_date": "2025-09-10",
    "status": "pending",
    "contact_id": "contact_id_5"
  }
]
```

### 22. Leases

**Endpoint:** `/leases`

**Descrição:** Contratos de locação. Contém IDs específicos de contrato, contato, deal, invoice, transações, etc.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "lease_id_1",
    "property_id": "property_id_2",
    "contact_id": "contact_id_4",
    "deal_id": "deal_id_locacao_1",
    "start_date": "2025-09-01",
    "end_date": "2026-08-31",
    "rent_amount": 3000.00,
    "status": "active"
  }
]
```

### 23. Media Sources

**Endpoint:** `/media-sources`

**Descrição:** Tipos, características, etc., dos imóveis. (Nota: A descrição original do usuário parece se referir a características de imóveis, mas o nome do endpoint sugere fontes de mídia/origem. Vou manter a interpretação do nome do endpoint para a simulação).

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "media_source_id_1",
    "name": "Website",
    "type": "online"
  },
  {
    "db_id": "media_source_id_2",
    "name": "Indicação",
    "type": "offline"
  },
  {
    "db_id": "media_source_id_3",
    "name": "Facebook Ads",
    "type": "paid_online"
  }
]
```

### 24. Media Sources Report

**Endpoint:** `/media-sources-report`

**Descrição:** Relatório dos canais de onde os contatos/leads entraram, importante para entender CPL e CAC.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "media_source_id": "media_source_id_1",
    "media_source_name": "Website",
    "total_leads": 500,
    "converted_leads": 50,
    "cost": 1000.00
  },
  {
    "media_source_id": "media_source_id_3",
    "media_source_name": "Facebook Ads",
    "total_leads": 300,
    "converted_leads": 30,
    "cost": 1500.00
  }
]
```

## Próximos Passos

Com esta documentação organizada, o próximo passo será criar as funções de cálculo das métricas e, em seguida, desenvolver o dashboard React, utilizando a estrutura de dados simulada aqui definida. O objetivo é garantir que o dashboard seja funcional e que a transição para dados reais seja o mais fluida possível quando o acesso direto à API for estabelecido.



### 25. Contacts and Leads

**Endpoint:** `/contacts`

**Descrição:** Lista de contatos e leads. Importante para o cálculo de CPL e CAC.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "contact_id_1",
    "name": "Cliente A",
    "email": "clienteA@email.com",
    "phone": "+5511987654321",
    "type": "person",
    "created_at": "2025-08-01T10:00:00Z",
    "source": "Website"
  },
  {
    "db_id": "contact_id_2",
    "name": "Lead B",
    "email": "leadB@email.com",
    "phone": "+5511912345678",
    "type": "person",
    "created_at": "2025-08-05T11:00:00Z",
    "source": "Facebook Ads"
  }
]
```

### 26. Banks

**Endpoint:** `/banks`

**Descrição:** Lista de bancos.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "code": "001",
    "db_id": "bank_id_1",
    "logo_url": "url_logo_banco_1.png",
    "name": "Banco do Brasil"
  },
  {
    "code": "237",
    "db_id": "bank_id_2",
    "logo_url": "url_logo_banco_2.png",
    "name": "Bradesco"
  }
]
```

### 27. Calendar

**Endpoint:** `/calendar`

**Descrição:** Eventos do calendário. Requer parâmetros para obter a lista.

**Parâmetros de Consulta Comuns:**

*   `start_date`: Data de início (formato YYYY-MM-DD)
*   `end_date`: Data de fim (formato YYYY-MM-DD)
*   `user_id`: ID do usuário

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "event_id_1",
    "title": "Visita Imóvel IMO001",
    "start": "2025-09-15T10:00:00Z",
    "end": "2025-09-15T11:00:00Z",
    "user_id": "user_id_1",
    "contact_id": "contact_id_1"
  }
]
```

### 28. Calendar Types

**Endpoint:** `/calendar-types`

**Descrição:** Tipos de eventos do calendário.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "calendar_type_id_1",
    "name": "Visita",
    "color": "#FF0000"
  },
  {
    "db_id": "calendar_type_id_2",
    "name": "Reunião",
    "color": "#00FF00"
  }
]
```

### 29. Contacts Tags

**Endpoint:** `/contacts-tags`

**Descrição:** Tags associadas aos contatos.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "tag_id_1",
    "name": "Investidor"
  },
  {
    "db_id": "tag_id_2",
    "name": "Primeiro Imóvel"
  }
]
```

### 30. Contact Bank

**Endpoint:** `/contact-bank`

**Descrição:** Informações bancárias de contatos.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "contact_bank_id_1",
    "contact_id": "contact_id_1",
    "bank_id": "bank_id_1",
    "account_number": "12345-6",
    "agency_number": "7890"
  }
]
```

### 31. Contracts

**Endpoint:** `/contracts`

**Descrição:** Contratos em geral.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "contract_id_1",
    "type": "Venda",
    "deal_id": "deal_id_1",
    "start_date": "2025-08-20",
    "end_date": "2025-08-20",
    "value": 500000.00,
    "status": "active"
  }
]
```

### 32. Credit Financing Analysis

**Endpoint:** `/credit-financing-analysis`

**Descrição:** Análise de crédito e financiamento.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "credit_analysis_id_1",
    "contact_id": "contact_id_1",
    "status": "approved",
    "approved_amount": 400000.00,
    "analysis_date": "2025-08-10"
  }
]
```

### 33. Deals Rotations

**Endpoint:** `/deals-rotations`

**Descrição:** Rotações de negócios/leads.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "rotation_id_1",
    "deal_id": "deal_id_1",
    "user_id": "user_id_1",
    "rotation_date": "2025-07-05"
  }
]
```

### 34. Deals Filters

**Endpoint:** `/deals-filters`

**Descrição:** Filtros para negócios.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "filter_id_1",
    "name": "Meus Negócios Ativos",
    "criteria": {"status": "active", "user_id": "current_user"}
  }
]
```

### 35. Documents

**Endpoint:** `/documents`

**Descrição:** Documentos relacionados a negócios, propriedades, etc.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "document_id_1",
    "name": "Contrato de Venda IMO001",
    "type": "contract",
    "url": "url_documento_1.pdf",
    "deal_id": "deal_id_1"
  }
]
```

### 36. Fields Deal

**Endpoint:** `/fields-deal`

**Descrição:** Campos personalizados para negócios.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "field_deal_id_1",
    "name": "Origem do Lead",
    "type": "text",
    "options": []
  }
]
```

### 37. Fields Contact

**Endpoint:** `/fields-contact`

**Descrição:** Campos personalizados para contatos.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "field_contact_id_1",
    "name": "Profissão",
    "type": "text",
    "options": []
  }
]
```

### 38. Fields Organization

**Endpoint:** `/fields-organization`

**Descrição:** Campos personalizados para organizações.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "field_org_id_1",
    "name": "Setor",
    "type": "text",
    "options": []
  }
]
```

### 39. Fields Property

**Endpoint:** `/fields-property`

**Descrição:** Campos personalizados para imóveis.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "field_prop_id_1",
    "name": "Número de Quartos",
    "type": "number",
    "options": []
  }
]
```

### 40. Financial Accounts

**Endpoint:** `/financial-accounts`

**Descrição:** Contas financeiras.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "account_id_1",
    "name": "Conta Corrente Principal",
    "balance": 100000.00,
    "type": "checking"
  }
]
```

### 41. Financial Tags

**Endpoint:** `/financial-tags`

**Descrição:** Tags financeiras.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "financial_tag_id_1",
    "name": "Despesa Fixa"
  }
]
```

### 42. Financial Categories

**Endpoint:** `/financial-categories`

**Descrição:** Categorias financeiras.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "financial_category_id_1",
    "name": "Marketing",
    "type": "expense"
  }
]
```

### 43. Financial Commissions

**Endpoint:** `/financial-commissions`

**Descrição:** Comissões financeiras.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "commission_id_1",
    "deal_id": "deal_id_1",
    "user_id": "user_id_1",
    "amount": 25000.00,
    "status": "paid"
  }
]
```

### 44. Financial Landlord Account Onlending

**Endpoint:** `/financial-landlord-account-onlending`

**Descrição:** Repasses de contas de proprietários.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "landlord_onlending_id_1",
    "landlord_account_id": "landlord_account_id_1",
    "amount": 2000.00,
    "date": "2025-09-10"
  }
]
```

### 45. Financial Landlord Accounts

**Endpoint:** `/financial-landlord-accounts`

**Descrição:** Contas de proprietários.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "landlord_account_id_1",
    "contact_id": "contact_id_proprietario_1",
    "balance": 5000.00
  }
]
```

### 46. Financial Landlord Account Transactions

**Endpoint:** `/financial-landlord-account-transactions`

**Descrição:** Transações de contas de proprietários.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "landlord_trans_id_1",
    "landlord_account_id": "landlord_account_id_1",
    "type": "revenue",
    "amount": 2500.00,
    "date": "2025-09-05"
  }
]
```

### 47. Invoices Send Notification

**Endpoint:** `/invoice-send-notification`

**Descrição:** Envio de notificações de fatura.

**Estrutura de Dados Esperada (Exemplo Simulado - para POST):**

```json
{
  "message": "Notification sent successfully."
}
```

### 48. Nota Fiscal

**Endpoint:** `/nota-fiscal`

**Descrição:** Informações de nota fiscal.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "nota_fiscal_id_1",
    "invoice_id": "invoice_id_1",
    "amount": 2500.00,
    "issue_date": "2025-09-01",
    "status": "issued"
  }
]
```

### 49. Notifications

**Endpoint:** `/notifications`

**Descrição:** Notificações gerais.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "notification_id_1",
    "user_id": "user_id_1",
    "message": "Novo negócio adicionado ao funil.",
    "read": false,
    "created_at": "2025-09-12T10:00:00Z"
  }
]
```

### 50. Property Adverts

**Endpoint:** `/property-adverts`

**Descrição:** Anúncios de imóveis.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "advert_id_1",
    "property_id": "property_id_1",
    "platform": "Zap Imóveis",
    "status": "active",
    "url": "url_anuncio_1"
  }
]
```

### 51. Property Features

**Endpoint:** `/property-features`

**Descrição:** Características de imóveis.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "feature_id_1",
    "name": "Piscina",
    "type": "amenity"
  }
]
```

### 52. Property Photo

**Endpoint:** `/property-photo`

**Descrição:** Fotos de imóveis.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "photo_id_1",
    "property_id": "property_id_1",
    "url": "url_foto_imovel_1.jpg",
    "description": "Fachada"
  }
]
```

### 53. Property Types

**Endpoint:** `/property-types`

**Descrição:** Tipos de imóveis.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "property_type_id_1",
    "name": "Apartamento",
    "finality": "sale"
  }
]
```

### 54. Reports

**Endpoint:** `/reports`

**Descrição:** Relatórios gerais.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "report_id_1",
    "name": "Relatório de Vendas Mensal",
    "url": "url_relatorio_1.pdf"
  }
]
```

### 55. Site Highlights

**Endpoint:** `/site-highlights`

**Descrição:** Destaques do site.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "highlight_id_1",
    "property_id": "property_id_1",
    "title": "Imóvel em Destaque",
    "description": "Excelente oportunidade!"
  }
]
```

### 56. Teams

**Endpoint:** `/teams`

**Descrição:** Equipes.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "team_id_1",
    "name": "Equipe Vendas SP",
    "members": [
      "user_id_1",
      "user_id_2"
    ]
  }
]
```

### 57. Timelines

**Endpoint:** `/timelines`

**Descrição:** Linhas do tempo.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
[
  {
    "db_id": "timeline_id_1",
    "entity_type": "deal",
    "entity_id": "deal_id_1",
    "event": "Status alterado para Fechado/Ganho",
    "created_at": "2025-08-20T15:30:00Z"
  }
]
```

### 58. Utils

**Endpoint:** `/utils`

**Descrição:** Utilitários.

**Estrutura de Dados Esperada (Exemplo Simulado):**

```json
{
  "current_time": "2025-09-12T10:30:00Z"
}
```

### 59. Webhook

**Endpoint:** `/webhook`

**Descrição:** Webhooks.

**Estrutura de Dados Esperada (Exemplo Simulado - para POST):**

```json
{
  "message": "Webhook received successfully."
}
```

## Próximos Passos

Com esta documentação abrangente dos endpoints e suas estruturas de dados esperadas, o próximo passo será criar as funções de cálculo das métricas e, em seguida, desenvolver o dashboard React, utilizando a estrutura de dados simulada aqui definida. O objetivo é garantir que o dashboard seja funcional e que a transição para dados reais seja o mais fluida possível quando o acesso direto à API for estabelecido.

