# Variáveis de Ambiente para Deploy no Vercel

## 🔧 Configurações do Asaas

| Variável | Valor |
|----------|-------|
| `ASAAS_API_KEY` | `$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRkZWJlZTEwLWQyNTQtNDQwYS1iNzdhLTk3NDIyMzBkZTdiNjo6JGFhY2hfYWI3Yzk2OTgtYWI2Ny00YTRjLTkwZTItMmUzMThlYTgyMzgx` |
| `ASAAS_WALLET_ID` | `a082779d-a766-4606-b6c8-8840f4d9f635` |
| `ASAAS_ENVIRONMENT` | `production` |

## 🔧 Configurações do Meta Ads

| Variável | Valor |
|----------|-------|
| `META_APP_ID` | `2000834190790367` |
| `META_APP_SECRET` | `5ca4295a23c7093704e0325bef355c8e` |
| `META_ACCESS_TOKEN` | `EAAcbv4MyTt8BPUZCFMssghDutYfjHx5MzTJZCR5YUEo7G8zlVt32V6LKXKpyyhihBTNMS65YyDQqIBMwutfGTXDjs4nDYt0zMO25bfU7jN95JKiwRYrEZCwavyTBasLWVJmEAs7y4Cz7xybdOn7oKVkkCbzRn0zipovcI8Yz51CrtLPYbnAVZBk906ntog5e5RZBE` |
| `META_AD_ACCOUNT_ID` | `act_1379383149812170` |
| `META_BUSINESS_MANAGER_ID` | `118173437273453` |

## 📋 Como Configurar no Vercel

1. **Acesse seu projeto** no Vercel
2. **Vá em**: Settings → Environment Variables
3. **Adicione cada variável** da tabela acima
4. **Marque**: "Production", "Preview" e "Development"
5. **Clique**: "Save"

## ⚠️ Importante

- **Nunca commite** as chaves de API no código
- **Use variáveis de ambiente** em produção
- **Mantenha as chaves seguras** e não as compartilhe
