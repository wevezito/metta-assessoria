# Sistema de Gestão - Metta Assessoria

Sistema interno de gestão comercial e operacional desenvolvido para a Metta Assessoria de Marketing.

## 🚀 Funcionalidades

### Área Comercial
- **CRM com Kanban**: Funil de vendas completo (Qualificação → Contato → Reunião → Proposta → Venda)
- **Gestão de Leads**: Cadastro manual, origem do lead, lead scoring automático (A/B/C)
- **Performance da Equipe**: Metas, ranking, comissões por meta
- **Dashboard de Vendas**: CAC, ROAS, ticket médio, performance de anúncios

### Área Operacional
- **Gestão de Clientes**: Cadastro, planos, contratos, status, meses ativo
- **Onboarding**: Checklist automático com tarefas padrão
- **Tarefas da Equipe**: Sistema de kanban pessoal por colaborador
- **Controle de Tempo**: Cronômetro, ranking de horas trabalhadas
- **Dashboard Colaborador**: Metas + tarefas + horas + desempenho

### Outras Áreas
- Tráfego pago (métricas e relatórios)
- Financeiro (pagamentos, planos, lucro líquido)
- Jurídico (status de contratos)
- Sucesso do cliente (NPS, feedbacks)
- Design (galeria de arquivos)
- Criação de conteúdo (linha editorial)
- Marketing interno (tráfego, social media, upsells)

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 com TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── comercial/         # Área comercial
│   ├── operacional/       # Área operacional
│   └── relatorios/        # Relatórios
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── comercial/        # Componentes específicos da área comercial
│   ├── operacional/      # Componentes específicos da área operacional
│   └── shared/           # Componentes compartilhados
├── lib/                  # Utilitários e configurações
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Funções utilitárias
│   └── mock-data.ts      # Dados de exemplo
└── globals.css           # Estilos globais
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd sistema

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Acesse
- **Local**: http://localhost:3000
- **Dashboard Principal**: http://localhost:3000
- **Área Comercial**: http://localhost:3000/comercial
- **Área Operacional**: http://localhost:3000/operacional

## 📊 Dados de Exemplo

O sistema inclui dados mock para demonstração:
- **Usuários**: 5 colaboradores com diferentes papéis
- **Leads**: 4 leads em diferentes estágios do funil
- **Clientes**: 3 clientes ativos com diferentes planos
- **Tarefas**: Tarefas de onboarding e operacionais
- **Metas**: Metas de vendas para SDR e Closer

## 🎯 Próximos Passos

### Fase 1 (Atual)
- ✅ Dashboard principal
- ✅ Área comercial com funil kanban
- ✅ Área operacional com gestão de clientes
- ✅ Sistema de tipos TypeScript
- ✅ Dados mock para demonstração

### Fase 2 (Próxima)
- [ ] Sistema de autenticação e login
- [ ] Banco de dados real (PostgreSQL/SQLite)
- [ ] API routes para CRUD
- [ ] Sistema de notificações em tempo real
- [ ] Upload de arquivos

### Fase 3 (Futura)
- [ ] Relatórios avançados com gráficos
- [ ] Integração com APIs externas
- [ ] Sistema de backup automático
- [ ] App mobile (React Native)
- [ ] Analytics avançado

## 👥 Equipe

- **Desenvolvedor**: Kauan Santos
- **Empresa**: Metta Assessoria
- **Contato**: kauan@mettaassessoria.com

## 📝 Licença

Este projeto é de uso interno da Metta Assessoria.

---

**Desenvolvido com ❤️ para otimizar a gestão da Metta Assessoria**
