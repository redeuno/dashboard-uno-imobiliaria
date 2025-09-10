# Análise Detalhada do Prompt: Descoberta da API Imobzi e Criação de Dashboard

O prompt fornecido é um documento abrangente e bem estruturado que detalha uma tarefa complexa envolvendo a integração com a API Imobzi e o desenvolvimento de um dashboard de métricas imobiliárias. Ele é dividido em fases claras, com requisitos específicos para cada etapa, incluindo um script Python pré-definido para a descoberta da API e exemplos de código para a estrutura do dashboard React.

## Estrutura Geral do Prompt

O prompt segue uma estrutura lógica, guiando o processo desde a configuração inicial da API até o deploy final do dashboard. As principais seções são:

1.  **Introdução**: Define o papel do agente como especialista em integração de APIs e desenvolvimento de dashboards, e a missão geral.
2.  **Configuração da API Imobzi**: Fornece os detalhes essenciais para acessar a API, como Base URL, Token de Acesso e Headers obrigatórios.
3.  **Fase 1: Descoberta e Teste da API**: Detalha os endpoints prioritários e secundários a serem testados e, crucialmente, inclui um script Python completo para realizar essa descoberta, com lógica para tratamento de sucesso, falha e extração de amostras de dados.
4.  **Fase 2: Mapeamento para Métricas de Negócio**: Lista as métricas-chave (CAC, CPL, VGV Real, VGV Comissão, Performance por Corretor, Conversão por Mídia) e especifica os campos necessários da API para o cálculo de cada uma.
5.  **Fase 3: Criação do Dashboard**: Descreve a estrutura visual do dashboard React, incluindo KPIs no cabeçalho, visualizações principais (gráficos e tabelas), filtros interativos e um exemplo de código para a funcionalidade de atualização automática.
6.  **Fase 4: Deploy e Configuração**: Aborda aspectos de infraestrutura e qualidade, como deploy automático, CORS, tratamento de erros, estados de carregamento, cache, responsividade mobile e funcionalidades extras.
7.  **Execução Imediata**: Apresenta um resumo sequencial das ações a serem tomadas, reforçando a ordem de execução e pontos importantes como o uso de dados reais da API e o respeito ao rate limiting.

## Componentes Chave e Requisitos

### 1. Acesso e Descoberta da API Imobzi

*   **Credenciais**: O prompt fornece explicitamente a `Base URL` e um `Token de Acesso` (embora este token deva ser tratado como sensível e possivelmente temporário, para fins de teste inicial é suficiente). Os `Headers` necessários também são detalhados.
*   **Endpoints**: Uma lista clara de 10 endpoints é fornecida, categorizados como `CRÍTICOS` e `SECUNDÁRIOS`, indicando a ordem de prioridade para o teste.
*   **Script Python**: O script fornecido é robusto, cobrindo:
    *   Requisições `GET` para cada endpoint.
    *   Tratamento de respostas `HTTP 200` e outros códigos de status.
    *   Extração do número de registros e dos campos disponíveis em cada endpoint (através de `sample_data.keys()`).
    *   Captura de erros de conexão e de API.
    *   Geração de um resumo final dos resultados da descoberta.

### 2. Cálculo de Métricas de Negócio

*   **Métricas Definidas**: Seis métricas imobiliárias são claramente definidas com suas fórmulas e os campos da API necessários para o cálculo. Isso indica a necessidade de uma fase de processamento de dados após a coleta da API.
*   **Dependência de Dados**: A capacidade de calcular essas métricas depende diretamente da estrutura de dados retornada pela API Imobzi. O script de descoberta é fundamental para validar a disponibilidade dos campos necessários.

### 3. Desenvolvimento do Dashboard React

*   **Estrutura Visual**: O prompt detalha os componentes visuais esperados: um `Header` com `KPICards`, `Visualizações Principais` (gráficos de barra, funil, linha, tabela, pizza) e `Filtros Interativos`.
*   **Tecnologia**: A escolha do React para o frontend é explícita, com exemplos de código JSX para a estrutura e JavaScript para a lógica de atualização.
*   **Atualização Automática**: A funcionalidade de refresh a cada 15 minutos é um requisito importante, com um `useEffect` e `setInterval` como base.

### 4. Deploy e Operacionalização

*   **Deploy Contínuo**: A necessidade de um 


deploy automático para URL pública permanente e a configuração de CORS indicam que o dashboard deve ser acessível publicamente e funcionar em um ambiente de produção.
*   **Qualidade e Robustez**: Requisitos como `Error handling`, `Loading states`, `Cache` e `Responsividade mobile` demonstram a preocupação com a experiência do usuário e a estabilidade da aplicação.

## Sequência de Execução e Considerações Importantes

O prompt enfatiza uma sequência de execução rigorosa:

1.  **Execução do script de descoberta da API**: Esta é a primeira e mais crítica etapa, pois os resultados guiarão todo o desenvolvimento subsequente.
2.  **Análise e mapeamento dos dados retornados**: Essencial para garantir que as métricas possam ser calculadas corretamente com os dados disponíveis.
3.  **Criação das funções de cálculo das métricas**: Lógica de negócio para transformar os dados brutos da API em KPIs significativos.
4.  **Desenvolvimento do dashboard React completo**: Implementação da interface do usuário com as visualizações e filtros.
5.  **Configuração de refresh automático**: Garantir que o dashboard exiba dados atualizados.
6.  **Deploy para URL pública**: Tornar o dashboard acessível.

### Pontos de Atenção:

*   **Dados Reais**: A instrução de usar 


apenas dados reais da API é crucial. Isso significa que não devo usar dados mockados para as métricas, mas sim os resultados da descoberta da API.
*   **Fallbacks para dados não disponíveis**: A necessidade de implementar fallbacks sugere que alguns endpoints ou campos podem não retornar dados consistentes, e a aplicação deve ser resiliente a isso.
*   **Rate Limiting**: A instrução de manter um `rate limiting` respeitoso (máx 1 req/segundo) é vital para não sobrecarregar a API da Imobzi e evitar bloqueios.

## Conclusão

O prompt é um guia completo para a tarefa, fornecendo todos os detalhes necessários para a execução. A abordagem faseada e a inclusão de um script de descoberta pré-definido simplificam o processo inicial. A principal tarefa será seguir as instruções passo a passo, garantindo que cada fase seja concluída com sucesso antes de prosseguir para a próxima, com foco na precisão dos dados e na robustez da implementação do dashboard.

