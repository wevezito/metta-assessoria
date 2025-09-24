# 🔗 Configuração da Integração com Meta Ads

## 📋 Pré-requisitos

Para integrar com o Meta Ads, você precisa de:

1. **Meta Business Account** (conta empresarial)
2. **App do Facebook** criado em [developers.facebook.com](https://developers.facebook.com/)
3. **Access Token** de longa duração
4. **Ad Account ID** da conta de anúncios

## 🚀 Passo a Passo

### 1. Criar App do Facebook

1. Acesse [developers.facebook.com](https://developers.facebook.com/)
2. Clique em "Meus Apps" → "Criar App"
3. Selecione "Business" como tipo de app
4. Preencha as informações básicas
5. Anote o **App ID** e **App Secret**

### 2. Configurar Permissões

No seu app, adicione as seguintes permissões:

- `ads_read` - Para ler dados de anúncios
- `ads_management` - Para gerenciar campanhas
- `business_management` - Para acessar contas empresariais

### 3. Gerar Access Token

1. No app, vá para "Ferramentas" → "Graph API Explorer"
2. Selecione seu app e as permissões necessárias
3. Clique em "Gerar Access Token"
4. **IMPORTANTE**: Use um token de longa duração (60 dias)

### 4. Obter Ad Account ID

1. No Facebook Ads Manager, vá para Configurações da Conta
2. O ID da conta aparece no formato: `act_XXXXXXXXXX`
3. Anote este ID

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Meta Ads Configuration
NEXT_PUBLIC_FACEBOOK_APP_ID=seu_app_id_aqui
FACEBOOK_APP_SECRET=seu_app_secret_aqui
FACEBOOK_ACCESS_TOKEN=seu_access_token_aqui
FACEBOOK_AD_ACCOUNT_ID=act_seu_ad_account_id_aqui
FACEBOOK_CAMPAIGN_ID=seu_campaign_id_aqui
```

## 🔧 Configuração do Sistema

### Permissões do App

O app precisa ter acesso a:

- **Conta de Anúncios**: Para ler métricas e campanhas
- **Página do Facebook**: Para gerenciar anúncios
- **Pixel de Conversão**: Para rastrear leads (opcional)

### Configuração de Webhooks (Opcional)

Para dados em tempo real, configure webhooks:

1. No app, vá para "Webhooks"
2. Adicione endpoint para eventos de anúncios
3. Configure eventos: `ad_account.update`, `campaign.update`

## 📊 Métricas Disponíveis

A integração fornece:

- **Investimento total** em anúncios
- **Número de leads** gerados
- **CPC, CPM, CTR** médios
- **Impressões e cliques**
- **Status das campanhas**
- **Dados por período** (dia, semana, mês)

## 🚨 Troubleshooting

### Erro: "Configuração do Meta Ads não encontrada"

- Verifique se o arquivo `.env.local` existe
- Confirme se todas as variáveis estão preenchidas
- Reinicie o servidor após alterar variáveis

### Erro: "Access Token inválido"

- O token pode ter expirado
- Verifique se tem as permissões corretas
- Gere um novo token de longa duração

### Erro: "Ad Account não encontrada"

- Verifique o formato do ID: deve começar com `act_`
- Confirme se o token tem acesso à conta
- Verifique se a conta está ativa

## 🔄 Atualização de Dados

Os dados são atualizados:

- **Automaticamente**: Ao carregar a página
- **Manual**: Botão "Sincronizar"
- **Por período**: Ao mudar filtros de data
- **Tempo real**: A cada 24h

## 📱 Uso no Sistema

### Hook Personalizado

```typescript
import { useMetaAds } from '@/lib/hooks/use-meta-ads';

const { 
  metrics, 
  campaigns, 
  loading, 
  error, 
  connected,
  syncData 
} = useMetaAds();
```

### API Routes

```typescript
// Buscar métricas
GET /api/meta-ads?action=metrics&startDate=2024-01-01&endDate=2024-01-31

// Listar campanhas
GET /api/meta-ads?action=campaigns

// Testar conexão
GET /api/meta-ads?action=test

// Sincronizar dados
POST /api/meta-ads
Body: { "action": "sync" }
```

## 🔒 Segurança

- **NUNCA** exponha o App Secret no frontend
- Use apenas `NEXT_PUBLIC_FACEBOOK_APP_ID` no cliente
- Mantenha tokens em variáveis de ambiente
- Revogue tokens não utilizados
- Monitore uso da API regularmente

## 📞 Suporte

Para problemas com a API do Meta:

1. [Documentação da API](https://developers.facebook.com/docs/marketing-api/)
2. [Fórum de Desenvolvedores](https://developers.facebook.com/community/)
3. [Status da API](https://developers.facebook.com/status/)

---

**⚠️ Importante**: Esta integração requer aprovação do Facebook para uso em produção. Teste primeiro em ambiente de desenvolvimento.
