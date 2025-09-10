# Análise de KPIs Gerenciais e por Corretor com Base na API Imobzi

Esta análise visa identificar como os endpoints da API Imobzi podem ser utilizados para construir um dashboard de metas e KPIs mais abrangente, com visões gerenciais e individuais por corretor. O foco é mapear os dados disponíveis para as métricas solicitadas pelo usuário, incluindo metas anuais, semestrais, trimestrais, mensais e atividades diárias/semanais dos corretores.

## 1. KPIs Gerenciais (Visão da Empresa)

Para a visão gerencial, o objetivo é acompanhar o progresso da empresa em relação a metas de vendas, faturamento, aquisição de clientes e eficiência operacional em diferentes períodos (anual, semestral, trimestral, mensal).

### Métricas e Endpoints Relevantes:

#### 1.1. VGV Total (Volume Geral de Vendas)
- **Descrição:** Soma do valor de todos os negócios fechados no período.
- **Endpoint Principal:** `/deals` (filtrar por `status` = 'won' e `closed_at` dentro do período).
- **Dados Necessários:** `value` (do negócio), `closed_at` (data de fechamento).
- **Granularidade:** Anual, Semestral, Trimestral, Mensal.

#### 1.2. Total de Comissões Geradas
- **Descrição:** Soma das comissões de todos os negócios fechados no período.
- **Endpoint Principal:** `/deals` (filtrar por `status` = 'won' e `closed_at` dentro do período).
- **Dados Necessários:** `commission_value` (do negócio, se disponível no `/deals`, ou calcular com base no `value` e taxa de comissão).
- **Endpoint Secundário:** `/financial/commissions` (para detalhes de comissões, se necessário).
- **Dados Necessários (Secundário):** `amount` (da comissão), `due_date` ou `payment_date`.
- **Granularidade:** Anual, Semestral, Trimestral, Mensal.

#### 1.3. Número de Negócios Fechados (Ganhos)
- **Descrição:** Contagem de negócios com `status` = 'won' no período.
- **Endpoint Principal:** `/deals` (filtrar por `status` = 'won' e `closed_at` dentro do período).
- **Dados Necessários:** `db_id` (para contagem).
- **Granularidade:** Anual, Semestral, Trimestral, Mensal.

#### 1.4. CAC (Custo de Aquisição de Cliente)
- **Descrição:** Custo médio para adquirir um novo cliente.
- **Endpoint Principal:** `/financial/transactions` (para despesas de marketing e vendas).
- **Dados Necessários:** `amount` (de transações de despesa), `category` (para filtrar 'Marketing', 'Vendas').
- **Endpoint Secundário:** `/contacts` (para número de clientes adquiridos - pode ser complexo definir 'cliente adquirido' via API, talvez `deals` com `status` = 'won' e `contact_id`).
- **Granularidade:** Mensal, Trimestral.

#### 1.5. CPL (Custo Por Lead)
- **Descrição:** Custo médio para gerar um lead.
- **Endpoint Principal:** `/media-sources-report` (para custo e total de leads).
- **Dados Necessários:** `cost`, `total_leads`.
- **Granularidade:** Mensal.

#### 1.6. ROI (Retorno sobre Investimento)
- **Descrição:** Retorno financeiro sobre os investimentos.
- **Cálculo:** Baseado em Comissões (receitas) e Despesas (marketing/vendas).
- **Endpoints:** `/deals` (para comissões), `/financial/transactions` (para despesas).
- **Granularidade:** Mensal, Trimestral.

#### 1.7. Total de Leads Gerados
- **Descrição:** Contagem de novos leads no período.
- **Endpoint Principal:** `/contacts` (filtrar por `created_at` dentro do período).
- **Dados Necessários:** `db_id` (para contagem), `created_at`.
- **Granularidade:** Mensal, Semanal.

#### 1.8. Taxa de Conversão de Leads para Negócios
- **Descrição:** Percentual de leads que se tornaram negócios.
- **Endpoints:** `/contacts` (para total de leads), `/deals` (para negócios criados a partir de leads).
- **Dados Necessários:** `contact_id` (para rastrear a origem do negócio).
- **Granularidade:** Mensal.

#### 1.9. Número de Imóveis Ativos
- **Descrição:** Contagem de imóveis com status 'available' ou similar.
- **Endpoint Principal:** `/properties` (filtrar por `status`).
- **Dados Necessários:** `db_id` (para contagem), `status`.
- **Granularidade:** Diária, Semanal, Mensal.

#### 1.10. Funil de Vendas (Visão Geral)
- **Descrição:** Distribuição de negócios por etapa do funil.
- **Endpoint Principal:** `/pipelines` (para estágios e contagem de negócios por estágio).
- **Dados Necessários:** `stages.deals_count`, `stages.name`.
- **Granularidade:** Diária, Semanal.

## 2. KPIs por Corretor (Visão Individual e Metas)

Para a visão individual do corretor, o foco é no acompanhamento de suas metas pessoais, atividades diárias e semanais, e sua contribuição para as metas da empresa.

### Métricas e Endpoints Relevantes:

#### 2.1. Metas de VGV e Comissões (por Corretor)
- **Descrição:** Comparação do VGV e Comissões reais com as metas definidas.
- **Endpoints:** `/deals` (filtrar por `broker_id`, `status` = 'won', `closed_at`).
- **Dados Necessários:** `value`, `commission_value`, `broker_id`.
- **Dados Externos (Metas):** As metas (`target_vgv`, `target_commission`) precisarão ser definidas externamente (simuladas ou fornecidas pelo usuário), pois não são diretamente da API Imobzi.
- **Granularidade:** Mensal, Semanal.

#### 2.2. Número de Negócios Fechados (por Corretor)
- **Descrição:** Contagem de negócios com `status` = 'won' atribuídos ao corretor.
- **Endpoint Principal:** `/deals` (filtrar por `broker_id`, `status` = 'won', `closed_at`).
- **Dados Necessários:** `db_id` (para contagem), `broker_id`.
- **Granularidade:** Mensal, Semanal.

#### 2.3. Total de Leads Atribuídos (por Corretor)
- **Descrição:** Contagem de leads atribuídos a um corretor.
- **Endpoint Principal:** `/contacts` (pode ser necessário um campo `assigned_to_user_id` ou similar, se disponível).
- **Dados Necessários:** `db_id` (para contagem), `assigned_to_user_id` (se existir).
- **Granularidade:** Mensal, Semanal.

#### 2.4. Atividades Diárias/Semanais (Ligações, Visitas, Propostas)
- **Descrição:** Acompanhamento de atividades chave que levam à meta.
- **Endpoint Principal:** `/calendar` (para eventos agendados).
- **Dados Necessários:** `title` (para identificar tipo de atividade), `start`, `end`, `user_id`.
- **Granularidade:** Diária, Semanal.
- **Desafio:** A API Imobzi pode não ter um endpoint específico para 'ligações realizadas' ou 'proprietários contatados' de forma granular. Isso pode exigir inferência de outros dados ou simulação mais aprofundada.

#### 2.5. Funil de Vendas Individual (por Corretor)
- **Descrição:** Distribuição dos negócios de um corretor por etapa do funil.
- **Endpoints:** `/deals` (filtrar por `broker_id`), `/pipelines` (para estágios).
- **Dados Necessários:** `stage_id`, `pipeline_id`, `broker_id`.
- **Granularidade:** Diária, Semanal.

#### 2.6. Ranking de Corretores
- **Descrição:** Comparação da performance dos corretores.
- **Endpoint Principal:** `/users/ranking` (se disponível e funcional).
- **Dados Necessários:** `total_deals_won`, `total_value_won`, `user_id`.
- **Granularidade:** Mensal.

## 3. Dados Necessários para Simulação (Além dos Dados da API)

Para implementar as metas e o acompanhamento de atividades, precisaremos simular ou receber do usuário os seguintes dados que não são diretamente extraíveis da API Imobzi:

- **Metas Anuais/Semestrais/Trimestrais/Mensais:** Para VGV, Comissões, Número de Negócios, Leads, etc., por empresa e por corretor.
- **Definição de Atividades:** Quais atividades diárias/semanais serão rastreadas (ex: 


número de ligações, número de visitas, número de propostas enviadas, número de proprietários contatados, número de compradores contatados).
- **Custos de Marketing e Vendas:** Valores detalhados para o cálculo de CAC e CPL, se a granularidade da API não for suficiente.

## 4. Mapa de Metas e KPIs (Proposta de Estrutura)

Para construir um ambiente agressivo de metas e acompanhamento, o dashboard pode ser estruturado da seguinte forma:

### Visão Gerencial (Dashboard Principal)
- **KPIs de Alto Nível:** VGV Total, Comissões Totais, ROI, CAC, CPL, Total de Leads.
- **Gráficos de Tendência:** Evolução mensal/trimestral dos KPIs.
- **Progresso de Metas da Empresa:** Gráficos de barra ou velocímetros mostrando o % de atingimento das metas anuais/semestrais/trimestrais/mensais para os KPIs chave.
- **Funil de Vendas Geral:** Visão do funil de vendas da empresa, com contagem de negócios por etapa.

### Visão por Corretor (Abas Individuais)
- **Seleção de Corretor:** Um dropdown para selecionar o corretor.
- **KPIs Individuais:** VGV do Corretor, Comissões do Corretor, Negócios Fechados do Corretor.
- **Progresso de Metas do Corretor:** Gráficos de barra ou velocímetros mostrando o % de atingimento das metas mensais/semanais do corretor.
- **Atividades Diárias/Semanais:**
    - **Contadores:** Número de ligações realizadas, visitas agendadas, propostas enviadas, proprietários contatados, compradores contatados.
    - **Progresso:** Comparação das atividades realizadas com as metas diárias/semanais para cada tipo de atividade.
    - **Gráficos de Produtividade:** Evolução das atividades ao longo da semana/mês.
- **Funil de Vendas Individual:** Visão do funil de vendas do corretor, com contagem de negócios por etapa.
- **Insights Personalizados:** Mensagens motivacionais e sugestões de foco com base na performance do corretor.

## 5. Próximos Passos

Com esta análise aprofundada, os próximos passos serão:

1.  **Definir a estrutura de dados simulados:** Criar um conjunto de dados simulados que inclua todos os novos KPIs e atividades, garantindo que a estrutura seja compatível com a API Imobzi para futura integração.
2.  **Atualizar as funções de cálculo de métricas:** Adaptar o script `metric_calculations.py` para processar os novos dados simulados e calcular os KPIs gerenciais e individuais.
3.  **Projetar e desenvolver a nova interface do dashboard:** Implementar as novas visões gerenciais e por corretor, incluindo os gráficos e componentes necessários.
4.  **Integrar e testar:** Conectar as funções de cálculo ao dashboard e realizar testes abrangentes.
5.  **Atualizar o deploy:** Publicar a nova versão do dashboard.
6.  **Entregar o relatório:** Finalizar o relatório detalhado com o mapa de metas e KPIs.

Esta abordagem permitirá construir um dashboard robusto e estratégico, mesmo com a necessidade de simulação de dados no momento. A estrutura será flexível para receber dados reais da API Imobzi no futuro.

