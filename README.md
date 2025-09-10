# 🏠 Dashboard Uno - Métricas Imobiliárias

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://github.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)](https://vitejs.dev/)

> Dashboard completo de métricas imobiliárias para a Uno Rede Imobiliária com integração à API Imobzi, sistema de gamificação e gestão de metas.

## 📊 Visão Geral

O Dashboard Uno é uma solução completa para acompanhamento de performance imobiliária, oferecendo:

- **KPIs em Tempo Real**: VGV, Comissões, CAC, ROI
- **Sistema de Metas**: Configuração e acompanhamento automático
- **Gamificação**: Badges, rankings e conquistas
- **Performance Individual**: Métricas por corretor
- **Mobile-First**: Design responsivo otimizado

## 🚀 Funcionalidades

### 📈 Dashboard Principal
- Visão geral dos KPIs da empresa
- Progresso das metas mensais
- Funil de vendas interativo
- Ranking de corretores

### 🎯 Sistema de Metas
- Configuração de metas anuais e mensais
- Cálculo automático de atividades baseado no funil
- Metas individuais por corretor
- Validação e persistência de dados

### 🏆 Gamificação
- **Top Performer**: Maior VGV do mês
- **Call Master**: 100+ ligações no mês  
- **Goal Crusher**: Meta mensal atingida
- Sistema de pontuação e ranking

### 👥 Performance por Corretor
- Seleção individual de corretor
- KPIs específicos com metas
- Atividades diárias necessárias
- Comparativo de performance

## 🛠️ Tecnologias

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build**: Otimizado para produção

## 📁 Estrutura do Projeto

```
dashboard-uno-github/
├── src/                    # Código fonte do dashboard
│   ├── src/               # Componentes React
│   ├── public/            # Assets públicos
│   └── dist/              # Build de produção
├── api/                   # Integração API Imobzi
├── docs/                  # Documentação completa
├── assets/                # Imagens e recursos
├── scripts/               # Scripts de deploy e build
└── README.md              # Este arquivo
```

## 🔧 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dashboard-uno.git

# Entre no diretório
cd dashboard-uno/src

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔌 Integração API Imobzi

### Configuração
1. Copie o arquivo `.env.example` para `.env`
2. Configure suas credenciais da API Imobzi:
```env
VITE_IMOBZI_API_URL=https://api.imobzi.com
VITE_IMOBZI_API_KEY=sua_chave_aqui
VITE_IMOBZI_CLIENT_ID=seu_client_id
```

### Endpoints Suportados
- `/leads` - Listagem de leads
- `/deals` - Negócios fechados
- `/brokers` - Dados dos corretores
- `/metrics` - Métricas consolidadas

Veja a documentação completa em [`docs/api-integration.md`](docs/api-integration.md)

## 📱 Deploy

### Deploy Automático
O projeto está configurado para deploy automático. Após o build:

```bash
npm run build
npm run deploy
```

### Deploy Manual
1. Execute `npm run build`
2. Faça upload da pasta `dist/` para seu servidor
3. Configure o servidor para servir arquivos estáticos

## 📊 Métricas e KPIs

### KPIs Principais
- **VGV Total**: Valor Geral de Vendas
- **Comissões**: Receita de comissões (5% do VGV)
- **CAC**: Custo de Aquisição por Cliente
- **ROI**: Retorno sobre Investimento

### Funil de Vendas
- **Leads**: Prospects iniciais
- **Qualificados**: Leads qualificados (30% conversão)
- **Propostas**: Propostas enviadas (17% conversão)
- **Fechados**: Negócios fechados (4% conversão)

## 🎮 Sistema de Gamificação

### Badges Disponíveis
- 🏆 **Top Performer**: Maior VGV do mês
- 📞 **Call Master**: 100+ ligações no mês
- 🎯 **Goal Crusher**: Meta mensal atingida

### Sistema de Pontuação
- Base: VGV realizado
- Bônus: Atividades extras
- Ranking: Ordenação automática

## 📋 Roadmap

### Próximas Funcionalidades
- [ ] Integração completa API Imobzi
- [ ] Sistema de notificações
- [ ] Relatórios em PDF
- [ ] Análise de tendências
- [ ] Dashboard administrativo
- [ ] Autenticação de usuários

### Melhorias Planejadas
- [ ] Cache de dados
- [ ] Offline support
- [ ] PWA (Progressive Web App)
- [ ] Temas personalizáveis
- [ ] Exportação de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@unorede.com.br
- **Documentação**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/dashboard-uno/issues)

## 🏢 Sobre a Uno Rede Imobiliária

A Uno Rede Imobiliária é uma empresa líder no mercado imobiliário, comprometida com a excelência no atendimento e resultados excepcionais para clientes e corretores.

---

**Desenvolvido com ❤️ para a Uno Rede Imobiliária**

