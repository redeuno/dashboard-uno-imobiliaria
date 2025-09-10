# Análise e Mapeamento de Dados para Métricas Imobiliárias (Atualizado)

Com base nos resultados da descoberta da API Imobzi, a seguir está a análise de como cada métrica de negócio pode ser calculada e quais dados estão disponíveis ou ausentes.

## Endpoints Funcionais e Dados Disponíveis:

*   `/banks`: 198 registros. Campos disponíveis: `code`, `db_id`, `logo_url`, `name`.
*   `/contacts`: 0 registros. Não há dados de contato disponíveis para mapeamento.
*   `/contracts`: 0 registros. Não há dados de contratos disponíveis para mapeamento.
*   `/deals`: 0 registros. Não há dados de negócios disponíveis para mapeamento.
*   `/deals-rotations`: 0 registros. Não há dados de rotações de negócios disponíveis para mapeamento.
*   `/documents`: 0 registros. Não há dados de documentos disponíveis para mapeamento.
*   `/invoices`: 0 registros. Não há dados de faturas disponíveis para mapeamento.
*   `/neighborhoods`: 0 registros. Não há dados de bairros disponíveis para mapeamento.
*   `/notifications`: 0 registros. Não há dados de notificações disponíveis para mapeamento.
*   `/properties?smart_list=all&show_map=false`: 0 registros. Não há dados de imóveis disponíveis para mapeamento, mesmo com os parâmetros.
*   `/property-adverts`: 0 registros. Não há dados de anúncios de imóveis disponíveis para mapeamento.
*   `/property-features`: 0 registros. Não há dados de características de imóveis disponíveis para mapeamento.
*   `/property-types`: 27 registros. Campos disponíveis: `active`, `db_id`, `default`, `finality`, `type`.
*   `/reports`: 0 registros. Não há dados de relatórios disponíveis para mapeamento.
*   `/users`: 15 registros. Campos disponíveis: `database`, `db_id`, `fullname`, `function`, `profile_image_url`, `active`, `email`, `phones`.
*   `/user-billing`: 4 registros. Campos disponíveis: `new_deals`, `total_commission`, `total_rent`, `total_sale`, `month`, `year`.

## Endpoints com Falha (Erro 400/401/500):

*   `/calendar`: Erro 400 - "Missing params to get calendar list". Requer parâmetros.
*   `/calendar-types`: Erro 401 - "Not authorized".
*   `/contacts-tags`: Erro 400 - "Invoice not found, or invalid token: contacts-tags".
*   `/contact-bank`: Erro 400 - "Invoice not found, or invalid token: contact-bank".
*   `/contracts`: Erro 500 - "Internal Server Error".
*   `/credit-financing-analysis`: Erro 400 - "Invoice not found, or invalid token: credit-financing-analysis".
*   `/deal-lost-reasons`: Erro 400 - "Invoice not found, or invalid token: deal-lost-reasons".
*   `/deals-filters`: Erro 400 - "Invoice not found, or invalid token: deals-filters".
*   `/fields-deal`: Erro 400 - "Invoice not found, or invalid token: fields-deal".
*   `/fields-contact`: Erro 400 - "Invoice not found, or invalid token: fields-contact".
*   `/fields-organization`: Erro 400 - "Invoice not found, or invalid token: fields-organization".
*   `/fields-property`: Erro 400 - "Invoice not found, or invalid token: fields-property".
*   `/financial-accounts`: Erro 400 - "Invoice not found, or invalid token: financial-accounts".
*   `/financial-tags`: Erro 400 - "Invoice not found, or invalid token: financial-tags".
*   `/financial-categories`: Erro 400 - "Invoice not found, or invalid token: financial-categories".
*   `/financial-commissions`: Erro 400 - "Invoice not found, or invalid token: financial-commissions".
*   `/financial-landlord-account-onlending`: Erro 400 - "Invoice not found, or invalid token: financial-landlord-account-onlending".
*   `/financial-landlord-accounts`: Erro 400 - "Invoice not found, or invalid token: financial-landlord-accounts".
*   `/financial-landlord-account-transactions`: Erro 400 - "Invoice not found, or invalid token: financial-landlord-account-transactions".
*   `/financial-transactions`: Erro 400 - "Invoice not found, or invalid token: financial-transactions".
*   `/invoice-send-notification`: Erro 400 - "Invoice not found, or invalid token: invoice-send-notification".
*   `/lease`: Erro 400 - "Invoice not found, or invalid token: lease".
*   `/media-source`: Erro 400 - "Invoice not found, or invalid token: media-source".
*   `/nota-fiscal`: Erro 400 - "Invoice not found, or invalid token: nota-fiscal".
*   `/pipeline`: Erro 400 - "Invoice not found, or invalid token: pipeline".
*   `/pipeline-group`: Erro 400 - "Invoice not found, or invalid token: pipeline-group".
*   `/property`: Erro 400 - "Invoice not found, or invalid token: property".
*   `/property-adverts`: Erro 500 - "Internal Server Error".
*   `/property-photo`: Erro 400 - "Invoice not found, or invalid token: property-photo".
*   `/property-reserves`: Erro 401 - "Not authorized".
*   `/site-highlights`: Erro 400 - "Invoice not found, or invalid token: site-highlights".
*   `/teams`: Erro 400 - "Invoice not found, or invalid token: teams".
*   `/timelines`: Erro 400 - "Invoice not found, or invalid token: timelines".
*   `/utils`: Erro 400 - "Invoice not found, or invalid token: utils".
*   `/webhook`: Erro 400 - "Invoice not found, or invalid token: webhook".

## Mapeamento para Métricas Alvo:

### 📊 1. CAC (Custo de Aquisição de Cliente)
**Fórmula**: `(Custos Marketing + Custos Vendas) / Clientes Adquiridos`
**Campos necessários**:
*   Custos de campanhas (endpoint `/financial` ou `/media-sources`): **`/financial` falhou**. `/media-source` (que agora é `/media-source` e falhou) não possui informações de custo. O endpoint `/user-billing` possui `total_commission`, `total_rent`, `total_sale`, mas não `Custos Marketing` ou `Custos Vendas`.
*   Comissões pagas (endpoint `/commissions`): **`/financial-commissions` falhou**.
*   Deals ganhos (endpoint `/deals` com status="won" ou similar): **`/deals` retornou 0 registros**.

**Status**: **Não é possível calcular o CAC** com os dados atualmente disponíveis. Os endpoints críticos para custos e deals estão inacessíveis ou vazios.

### 📊 2. CPL (Custo Por Lead) 
**Fórmula**: `Custo da Campanha / Número de Leads`
**Campos necessários**:
*   Total de leads (endpoint `/contacts` ou `/leads`): **`/contacts` retornou 0 registros**.
*   Origem/fonte do lead (campo `source`, `media`, `origin`): Não disponível em `/contacts` (0 registros). `/media-source` falhou.
*   Custo por fonte (endpoint `/media-sources`): `/media-source` falhou e não possui informações de custo.

**Status**: **Não é possível calcular o CPL** com os dados atualmente disponíveis. Não há dados de leads nem informações de custo por fonte.

### 📊 3. VGV Real
**Fórmula**: `Soma dos valores de todos os deals ganhos`
**Campos necessários**:
*   Deals com status ganho (endpoint `/deals`): **`/deals` retornou 0 registros**.
*   Valor do negócio (campo `value`, `amount`, `price`): Não disponível em `/deals` (0 registros).
*   Data de fechamento (campo `closed_date`, `won_date`): Não disponível em `/deals` (0 registros).

**Status**: **Não é possível calcular o VGV Real** com os dados atualmente disponíveis. Não há dados de deals.

### 📊 4. VGV de Comissão
**Fórmula**: `Soma de todas as comissões dos deals`
**Campos necessários**:
*   Comissões (endpoint `/commissions`): **`/financial-commissions` falhou**.
*   Valor da comissão (campo `commission_amount`, `value`): Não disponível.
*   Status pago (campo `status`, `paid`): Não disponível.

**Status**: **Não é possível calcular o VGV de Comissão** com os dados atualmente disponíveis. O endpoint de comissões está inacessível.

### 📊 5. Performance por Corretor
**Métricas**: `Deals totais, taxa conversão, comissão total`
**Campos necessários**:
*   Deals por corretor (endpoint `/deals` filtrado por `agent_id`, `broker_id`): **`/deals` retornou 0 registros**.
*   Comissões por corretor (endpoint `/commissions`): **`/financial-commissions` falhou**.
*   Dados do corretor (endpoint `/users`): **Disponível**. Campos: `db_id`, `fullname`, `email`, `phones`.

**Status**: **Parcialmente possível**. Podemos listar os corretores (`/users`), mas não podemos calcular deals totais, taxa de conversão ou comissão total devido à falta de dados de `/deals` e `/financial-commissions`.

### 📊 6. Conversão por Mídia
**Fórmula**: `(Leads Convertidos / Total Leads) × 100`
**Campos necessários**:
*   Leads por fonte (endpoint `/contacts` com `source`): **`/contacts` retornou 0 registros**.
*   Conversões por fonte (deals originados de cada mídia): **`/deals` retornou 0 registros**.

**Status**: **Não é possível calcular a Conversão por Mídia** com os dados atualmente disponíveis. Não há dados de leads ou deals.

## Conclusão do Mapeamento (Atualizado):

Após testar todos os endpoints listados na documentação, incluindo o `/properties` com os parâmetros `smart_list=all&show_map=false`, e utilizando o token JWT no cabeçalho `X-Imobzi-Secret` com o `base_url` `https://api.imobzi.app/v1`, a situação permanece desafiadora. A maioria das métricas alvo **não pode ser calculada** devido à ausência de dados nos endpoints críticos (`/contacts`, `/deals`, `/properties`, `/reports`, etc. que retornaram 0 registros) e à falha de acesso a muitos outros endpoints (`/commissions`, `/financial`, `/lease`, `/media-source`, etc.).

O endpoint `/user-billing` retornou alguns dados (`new_deals`, `total_commission`, `total_rent`, `total_sale`), mas estes não são suficientes para calcular as métricas conforme as fórmulas fornecidas no prompt original.

Para prosseguir com o desenvolvimento do dashboard, as opções são:

1.  **Investigar os erros 400/401/500 e a ausência de dados:** Isso pode envolver a verificação de permissões do token para cada endpoint, ou a garantia de que a conta Imobzi de teste contenha dados nos endpoints necessários para as métricas.
2.  **Simular dados:** Podemos desenvolver o dashboard com dados simulados para todas as métricas, focando na estrutura e visualização, mas com a ressalva de que os dados não são reais. Esta seria a abordagem mais rápida para entregar um dashboard funcional, mas com dados fictícios.

Estou aguardando sua orientação sobre como devemos prosseguir. Por favor, me diga qual opção você prefere, ou se há alguma outra abordagem que você gostaria de tentar.

