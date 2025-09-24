// Configuração para integração com Meta Ads - Metta Assessoria
export const META_ADS_CONFIG = {
  // App ID do Facebook da Metta (novo app com permissões corretas)
  APP_ID: '2000834190790367',
  
  // App Secret da Metta
  APP_SECRET: '5ca4295a23c7093704e0325bef355c8e',
  
  // Access Token da Metta (novo token com permissões ads_management, ads_read, read_insights)
  ACCESS_TOKEN: 'EAAcbv4MyTt8BPUZCFMssghDutYfjHx5MzTJZCR5YUEo7G8zlVt32V6LKXKpyyhihBTNMS65YyDQqIBMwutfGTXDjs4nDYt0zMO25bfU7jN95JKiwRYrEZCwavyTBasLWVJmEAs7y4Cz7xybdOn7oKVkkCbzRn0zipovcI8Yz51CrtLPYbnAVZBk906ntog5e5RZBE',
  
  // ID da conta de anúncios da Metta (deve incluir o prefixo 'act_')
  AD_ACCOUNT_ID: 'act_1379383149812170',
  
  // ID da Business Manager da Metta
  BUSINESS_MANAGER_ID: '118173437273453',
  
  // Versão da API
  API_VERSION: 'v19.0',
  
  // Base URL da API
  BASE_URL: 'https://graph.facebook.com',
};

// Tipos para dados do Meta Ads
export interface MetaAdsMetrics {
  spend: number; // Valor investido
  impressions: number; // Impressões
  clicks: number; // Cliques
  leads: number; // Leads gerados (via pixel ou conversões)
  cpc: number; // Custo por clique
  cpm: number; // Custo por mil impressões
  ctr: number; // Taxa de clique
  date_start: string; // Data de início
  date_stop: string; // Data de fim
}

export interface MetaAdsCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
}

// Função para validar configuração
export function validateMetaAdsConfig(): boolean {
  return !!(
    META_ADS_CONFIG.APP_ID &&
    META_ADS_CONFIG.ACCESS_TOKEN &&
    META_ADS_CONFIG.AD_ACCOUNT_ID
  );
}
