# Mapeamento de Dados Simulados para Métricas Imobiliárias

Este documento detalha como os dados simulados, baseados na estrutura da API Imobzi documentada anteriormente, serão utilizados para calcular as métricas imobiliárias definidas no prompt original. O objetivo é garantir que a estrutura dos dados simulados seja fiel à realidade da API, permitindo uma transição suave para dados reais no futuro.

## 📊 Métricas Alvo e Mapeamento de Dados Simulados

### 1. CAC (Custo de Aquisição de Cliente)

**Fórmula:** `CAC = (Custos de Marketing + Custos de Vendas) / Número de Clientes Adquiridos`

**Mapeamento de Dados Simulados:**

*   **Custos de Marketing:** Serão simulados a partir do endpoint `/financial/transactions` (transações de despesa com `category` = "Marketing" ou "Publicidade") e `/media-sources-report` (campo `cost`).
*   **Custos de Vendas:** Serão simulados a partir do endpoint `/financial/commissions` (campo `amount`) e `/financial/transactions` (transações de despesa com `category` = "Vendas" ou "Salários").
*   **Número de Clientes Adquiridos:** Será simulado a partir do endpoint `/deals` (negócios com `status` = "won" e `contact_id` único que represente um novo cliente) e `/contacts` (contatos criados em um determinado período).

**Endpoints Simulados Relevantes:**
*   `/financial/transactions`
*   `/financial/commissions`
*   `/media-sources-report`
*   `/deals`
*   `/contacts`

### 2. CPL (Custo Por Lead)

**Fórmula:** `CPL = Investimento total em marketing / Número de leads gerados`

**Mapeamento de Dados Simulados:**

*   **Investimento total em marketing:** Será simulado a partir do endpoint `/financial/transactions` (transações de despesa com `category` = "Marketing" ou "Publicidade") e `/media-sources-report` (campo `cost`).
*   **Número de leads gerados:** Será simulado a partir do endpoint `/contacts` (contatos com `type` = "person" ou "lead" criados em um determinado período) e `/media-sources-report` (campo `total_leads`).

**Endpoints Simulados Relevantes:**
*   `/financial/transactions`
*   `/media-sources-report`
*   `/contacts`

### 3. ROI (Retorno sobre Investimento)

**Fórmula para corretoras:** `ROI = (Comissões totais - Despesas totais) / Despesas totais × 100`

**Mapeamento de Dados Simulados:**

*   **Comissões totais:** Serão simuladas a partir do endpoint `/financial/commissions` (campo `amount`) e `/reports/deals-done` (campo `commission_value`).
*   **Despesas totais:** Serão simuladas a partir do endpoint `/financial/transactions` (transações de despesa).

**Endpoints Simulados Relevantes:**
*   `/financial/commissions`
*   `/reports/deals-done`
*   `/financial/transactions`

### 4. VGV Real (Volume Geral de Vendas)

**Fórmula:** `VGV Real = Soma de todas as vendas concluídas no período`

**Mapeamento de Dados Simulados:**

*   **Vendas concluídas:** Serão simuladas a partir do endpoint `/deals` (negócios com `status` = "won") e `/reports/deals-done` (campo `value`).

**Endpoints Simulados Relevantes:**
*   `/deals`
*   `/reports/deals-done`

### 5. VGV de Comissão

**Fórmula:** `VGV Comissão = Soma das comissões de vendas concluídas`

**Mapeamento de Dados Simulados:**

*   **Comissões de vendas concluídas:** Serão simuladas a partir do endpoint `/financial/commissions` (campo `amount` para comissões pagas ou relacionadas a `deals` com `status` = "won") e `/reports/deals-done` (campo `commission_value`).

**Endpoints Simulados Relevantes:**
*   `/financial/commissions`
*   `/reports/deals-done`

### 6. Performance por Corretor

**Mapeamento de Dados Simulados:**

*   **Dados do corretor:** Serão simulados a partir do endpoint `/users` (campos `fullname`, `db_id`).
*   **Negócios por corretor:** Serão simulados a partir do endpoint `/deals` (filtrando por `broker_id` ou `agent_id`) e `/users/ranking` (campos `total_deals_won`, `total_value_won`).
*   **Comissões por corretor:** Serão simuladas a partir do endpoint `/financial/commissions` (filtrando por `user_id`) e `/user-billing` (campos `total_commission`).

**Endpoints Simulados Relevantes:**
*   `/users`
*   `/deals`
*   `/users/ranking`
*   `/financial/commissions`
*   `/user-billing`

### 7. Conversão por Mídia/Canal

**Mapeamento de Dados Simulados:**

*   **Origem dos leads/contatos:** Será simulada a partir do endpoint `/contacts` (campo `source`) e `/media-sources-report` (campo `media_source_name`).
*   **Leads gerados por canal:** Será simulado a partir do endpoint `/media-sources-report` (campo `total_leads`).
*   **Leads convertidos por canal:** Será simulado a partir do endpoint `/media-sources-report` (campo `converted_leads`) e cruzando dados de `/contacts` com `source` e `/deals` com `status` = "won".

**Endpoints Simulados Relevantes:**
*   `/contacts`
*   `/media-sources-report`
*   `/deals`

## Estrutura Geral dos Dados Simulados

Para cada endpoint, os dados simulados seguirão a estrutura JSON definida no documento `imobzi_api_endpoints.md`. Isso garantirá que os campos necessários para os cálculos das métricas estejam presentes e com tipos de dados consistentes.

## Próximos Passos

Com este mapeamento detalhado, o próximo passo será a criação das funções de cálculo das métricas, utilizando a lógica definida acima e os dados simulados. Em seguida, desenvolveremos o dashboard React para visualizar essas métricas.

