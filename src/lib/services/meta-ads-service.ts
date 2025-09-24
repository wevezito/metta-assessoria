import axios from 'axios';
import { META_ADS_CONFIG, MetaAdsMetrics, MetaAdsCampaign } from '../meta-ads-config';

class MetaAdsService {
  private baseURL: string;
  private accessToken: string;
  private adAccountId: string;

  constructor() {
    this.baseURL = META_ADS_CONFIG.BASE_URL;
    this.accessToken = META_ADS_CONFIG.ACCESS_TOKEN;
    this.adAccountId = META_ADS_CONFIG.AD_ACCOUNT_ID;
  }

  // Validar datas para evitar erros na API
  private validateDates(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    // Não permitir datas futuras
    if (start > now || end > now) {
      return false;
    }
    
    // Data de início deve ser menor ou igual à data de fim (permitir mesmo dia)
    if (start > end) {
      return false;
    }
    return true;
  }

  // Obter métricas da conta (agregadas)
  async getAccountMetrics(
    startDate: string,
    endDate: string
  ): Promise<MetaAdsMetrics[]> {
    return this.withRetry(async () => {
      if (!this.accessToken || !this.adAccountId) {
        throw new Error('Configuração do Meta Ads não encontrada');
      }

      // Validar datas
      if (!this.validateDates(startDate, endDate)) {
        throw new Error('Datas inválidas fornecidas');
      }

      const params = {
        access_token: META_ADS_CONFIG.ACCESS_TOKEN,
        fields: 'spend,impressions,clicks,actions,date_start,date_stop',
        time_range: JSON.stringify({
          since: startDate,
          until: endDate
        }),
        limit: 100
      };

      console.log('Fazendo requisição para:', `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${this.adAccountId}/insights`);
      console.log('Parâmetros:', params);

      const response = await axios.get(
        `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${this.adAccountId}/insights`,
        { params }
      );

      console.log('Resposta da API:', response.data);

      // Se não há dados para o período, retornar array vazio
      if (!response.data.data || response.data.data.length === 0) {
        console.log('Nenhum dado encontrado para o período:', startDate, 'até', endDate);
        return [];
      }

      // Processar dados para calcular métricas
      const metrics = this.processMetricsData(response.data.data);
      return metrics;
    });
  }

  // Obter métricas de campanhas específicas (para detalhamento)
  async getCampaignMetrics(
    startDate: string,
    endDate: string,
    campaignId?: string
  ): Promise<MetaAdsMetrics[]> {
    return this.withRetry(async () => {
      if (!this.accessToken || !this.adAccountId) {
        throw new Error('Configuração do Meta Ads não encontrada');
      }

      const endpoint = campaignId 
        ? `/${campaignId}/insights`
        : `/${this.adAccountId}/insights`;

      const params = {
        access_token: this.accessToken,
        fields: 'spend,impressions,clicks,actions,date_start,date_stop',
        time_range: JSON.stringify({
          since: startDate,
          until: endDate
        }),
        limit: 100
      };

      const response = await axios.get(`${this.baseURL}/${META_ADS_CONFIG.API_VERSION}${endpoint}`, {
        params
      });

      // Processar dados para calcular métricas
      const metrics = this.processMetricsData(response.data.data);
      return metrics;
    });
  }

  // Obter lista de campanhas com gasto no período específico
  async getCampaigns(
    startDate?: string,
    endDate?: string
  ): Promise<MetaAdsCampaign[]> {
    try {
      if (!this.accessToken || !this.adAccountId) {
        throw new Error('Configuração do Meta Ads não encontrada');
      }

      // Se não foram fornecidas datas, usar período padrão (últimos 30 dias)
      if (!startDate || !endDate) {
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
      }

      const params = {
        access_token: this.accessToken,
        fields: 'id,name,status,objective,insights{spend,impressions,clicks,actions}',
        limit: 100
      };

      const response = await axios.get(
        `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${this.adAccountId}/campaigns`,
        { params }
      );

      // Processar campanhas e filtrar apenas as que tiveram gasto no período
      const campaigns = this.processCampaignsData(response.data.data);
      
      // Filtrar apenas campanhas com gasto > 0 no período
      const campaignsWithSpend = campaigns.filter(campaign => campaign.spend > 0);
      
      console.log(`Total de campanhas: ${campaigns.length}, Campanhas com gasto: ${campaignsWithSpend.length}`);
      
      return campaignsWithSpend;
    } catch (error) {
      console.error('Erro ao obter campanhas do Meta Ads:', error);
      throw error;
    }
  }

  // Obter campanhas com insights específicos do período
  async getCampaignsWithInsights(
    startDate: string,
    endDate: string
  ): Promise<MetaAdsCampaign[]> {
    try {
      if (!this.accessToken || !this.adAccountId) {
        throw new Error('Configuração do Meta Ads não encontrada');
      }

      const params = {
        access_token: this.accessToken,
        fields: 'id,name,status,objective,insights{spend,impressions,clicks,actions}',
        limit: 100
      };

      const response = await axios.get(
        `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${this.adAccountId}/campaigns`,
        { params }
      );

      // Para cada campanha, buscar insights específicos do período
      const campaignsWithInsights = await Promise.all(
        response.data.data.map(async (campaign: any) => {
          try {
            // Buscar insights específicos da campanha para o período
            const campaignInsights = await this.getCampaignInsights(campaign.id, startDate, endDate);
            
            return {
              id: campaign.id,
              name: campaign.name,
              status: campaign.status,
              objective: campaign.objective,
              spend: campaignInsights.spend,
              impressions: campaignInsights.impressions,
              clicks: campaignInsights.clicks,
              leads: campaignInsights.leads
            };
          } catch (error) {
            console.log(`Erro ao buscar insights da campanha ${campaign.id}:`, error);
            // Retornar campanha com valores zerados se houver erro
            return {
              id: campaign.id,
              name: campaign.name,
              status: campaign.status,
              objective: campaign.objective,
              spend: 0,
              impressions: 0,
              clicks: 0,
              leads: 0
            };
          }
        })
      );

      return campaignsWithInsights;
    } catch (error) {
      console.error('Erro ao obter campanhas com insights:', error);
      throw error;
    }
  }

  // Obter insights específicos de uma campanha para um período
  private async getCampaignInsights(
    campaignId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    spend: number;
    impressions: number;
    clicks: number;
    leads: number;
  }> {
    try {
      const params = {
        access_token: this.accessToken,
        fields: 'spend,impressions,clicks,actions',
        time_range: JSON.stringify({
          since: startDate,
          until: endDate
        }),
        limit: 100
      };

      const response = await axios.get(
        `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${campaignId}/insights`,
        { params }
      );

      if (!response.data.data || response.data.data.length === 0) {
        return { spend: 0, impressions: 0, clicks: 0, leads: 0 };
      }

      // Agregar dados de todos os dias do período
      const aggregated = response.data.data.reduce((acc: any, day: any) => ({
        spend: acc.spend + parseFloat(day.spend || 0),
        impressions: acc.impressions + parseInt(day.impressions || 0),
        clicks: acc.clicks + parseInt(day.clicks || 0),
        actions: [...(acc.actions || []), ...(day.actions || [])]
      }), { spend: 0, impressions: 0, clicks: 0, actions: [] });

      return {
        spend: aggregated.spend,
        impressions: aggregated.impressions,
        clicks: aggregated.clicks,
        leads: this.extractLeadsFromActions(aggregated.actions)
      };
    } catch (error) {
      console.error(`Erro ao buscar insights da campanha ${campaignId}:`, error);
      return { spend: 0, impressions: 0, clicks: 0, leads: 0 };
    }
  }

  // Obter métricas em tempo real da CONTA INTEIRA (últimas 24h)
  async getRealTimeMetrics(): Promise<MetaAdsMetrics> {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const metrics = await this.withRetry(() => this.getAccountMetrics(startDate, endDate));
      
      // Somar métricas de todos os dias
      return this.aggregateMetrics(metrics);

    } catch (error) {
      console.error('Erro ao obter métricas em tempo real:', error);
      throw error;
    }
  }

  // Obter resumo total da conta (todas as campanhas)
  async getAccountSummary(
    startDate: string,
    endDate: string
  ): Promise<{
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalLeads: number;
    averageCPC: number;
    averageCPM: number;
    averageCTR: number;
    campaignCount: number;
  }> {
    try {
      // Buscar campanhas com insights do período específico
      const campaigns: MetaAdsCampaign[] = await this.withRetry(() => this.getCampaignsWithInsights(startDate, endDate));
      
      // Filtrar apenas campanhas com gasto > 0
      const activeCampaigns = campaigns.filter((campaign: MetaAdsCampaign) => campaign.spend > 0);
      
      // Calcular totais
      const totalSpend = activeCampaigns.reduce((sum: number, campaign: MetaAdsCampaign) => sum + campaign.spend, 0);
      const totalImpressions = activeCampaigns.reduce((sum: number, campaign: MetaAdsCampaign) => sum + campaign.impressions, 0);
      const totalClicks = activeCampaigns.reduce((sum: number, campaign: MetaAdsCampaign) => sum + campaign.clicks, 0);
      const totalLeads = activeCampaigns.reduce((sum: number, campaign: MetaAdsCampaign) => sum + campaign.leads, 0);
      
      // Calcular médias
      const averageCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
      const averageCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
      const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      console.log(`Resumo do período ${startDate} até ${endDate}:`);
      console.log(`- Total gasto: R$ ${totalSpend.toFixed(2)}`);
      console.log(`- Campanhas ativas: ${activeCampaigns.length}`);
      console.log(`- Total impressões: ${totalImpressions}`);
      console.log(`- Total cliques: ${totalClicks}`);
      
      return {
        totalSpend,
        totalImpressions,
        totalClicks,
        totalLeads,
        averageCPC,
        averageCPM,
        averageCTR,
        campaignCount: activeCampaigns.length
      };

    } catch (error) {
      console.error('Erro ao obter resumo da conta:', error);
      throw error;
    }
  }

  // Processar dados brutos da API
  private processMetricsData(rawData: any[]): MetaAdsMetrics[] {
    return rawData.map(item => {
      // Extrair ações (leads) dos dados
      const actions = item.actions || [];
      const leads = actions.find((action: any) => 
        action.action_type === 'lead' || 
        action.action_type === 'offsite_conversion' ||
        action.action_type === 'purchase' ||
        action.action_type === 'complete_registration'
      )?.value || 0;

      return {
        spend: parseFloat(item.spend) || 0,
        impressions: parseInt(item.impressions) || 0,
        clicks: parseInt(item.clicks) || 0,
        leads: parseInt(leads) || 0,
        cpc: item.clicks > 0 ? parseFloat(item.spend) / parseInt(item.clicks) : 0,
        cpm: item.impressions > 0 ? (parseFloat(item.spend) / parseInt(item.impressions)) * 1000 : 0,
        ctr: item.impressions > 0 ? (parseInt(item.clicks) / parseInt(item.impressions)) * 100 : 0,
        date_start: item.date_start,
        date_stop: item.date_stop
      };
    });
  }

  // Processar dados de campanhas
  private processCampaignsData(rawData: any[]): MetaAdsCampaign[] {
    return rawData.map(campaign => {
      const insights = campaign.insights?.data?.[0] || {};
      
      // Se não há insights, retornar campanha com valores zerados
      if (!insights.spend) {
        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          objective: campaign.objective,
          spend: 0,
          impressions: 0,
          clicks: 0,
          leads: 0
        };
      }
      
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        objective: campaign.objective,
        spend: parseFloat(insights.spend) || 0,
        impressions: parseInt(insights.impressions) || 0,
        clicks: parseInt(insights.clicks) || 0,
        leads: this.extractLeadsFromActions(insights.actions || [])
      };
    });
  }

  // Extrair leads das ações (mais tipos de conversão)
  private extractLeadsFromActions(actions: any[]): number {
    const leadActions = actions.filter(action => 
      action.action_type === 'lead' || 
      action.action_type === 'offsite_conversion' ||
      action.action_type === 'purchase' ||
      action.action_type === 'complete_registration'
    );
    
    return leadActions.reduce((sum, action) => sum + parseInt(action.value || 0), 0);
  }

  // Agregar métricas de múltiplos dias
  private aggregateMetrics(metrics: MetaAdsMetrics[]): MetaAdsMetrics {
    return metrics.reduce((acc, metric) => ({
      spend: acc.spend + metric.spend,
      impressions: acc.impressions + metric.impressions,
      clicks: acc.clicks + metric.clicks,
      leads: acc.leads + metric.leads,
      cpc: 0, // Será recalculado
      cpm: 0, // Será recalculado
      ctr: 0, // Será recalculado
      date_start: metrics[0]?.date_start || '',
      date_stop: metrics[metrics.length - 1]?.date_stop || ''
    }), {
      spend: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      date_start: '',
      date_stop: ''
    });
  }

  // Testar conexão com a API (método simples)
  async testConnection(): Promise<boolean> {
    try {
      if (!this.accessToken || !this.adAccountId) {
        console.log('Configuração incompleta:', { 
          hasToken: !!this.accessToken, 
          hasAccountId: !!this.adAccountId 
        });
        return false;
      }

      const params = {
        access_token: this.accessToken,
        fields: 'id,name,account_status'
      };

      console.log('Testando conexão com Meta Ads...');
      console.log('URL:', `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${this.adAccountId}`);
      console.log('Token:', `${this.accessToken.substring(0, 10)}...`);

      const response = await axios.get(
        `${this.baseURL}/${META_ADS_CONFIG.API_VERSION}/${this.adAccountId}`,
        { params }
      );

      if (response.data && response.data.account_status === 1) {
        console.log('✅ Conexão bem-sucedida!');
        console.log('Resposta:', response.data);
        return true;
      } else {
        console.log('❌ Status da conta inválido:', response.data);
        return false;
      }

    } catch (error) {
      console.log('❌ Erro ao testar conexão com Meta Ads:');
      if (axios.isAxiosError(error)) {
        console.log('Status:', error.response?.status);
        console.log('Erro:', error.response?.data);
        console.log('URL tentada:', error.config?.url);
        console.log('Parâmetros:', error.config?.params);
      }
      return false;
    }
  }

  // Método com retry automático para operações que falham
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Se for erro de conexão, tentar reconectar
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          console.log(`Tentativa ${attempt}/${maxRetries} falhou, tentando reconectar...`);
          
          // Testar conexão antes de tentar novamente
          const isConnected = await this.testConnection();
          if (!isConnected) {
            console.log('Falha na reconexão, aguardando antes da próxima tentativa...');
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
            continue;
          }
        }
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        console.log(`Tentativa ${attempt}/${maxRetries} falhou, aguardando ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

export const metaAdsService = new MetaAdsService();
