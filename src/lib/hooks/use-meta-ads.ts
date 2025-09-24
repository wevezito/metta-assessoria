import { useState, useEffect, useCallback } from 'react';
import { MetaAdsMetrics, MetaAdsCampaign } from '../meta-ads-config';

interface AccountSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  averageCPC: number;
  averageCPM: number;
  averageCTR: number;
  campaignCount: number;
}

interface UseMetaAdsReturn {
  // Dados
  accountMetrics: MetaAdsMetrics[];
  campaigns: MetaAdsCampaign[];
  realtimeMetrics: MetaAdsMetrics | null;
  accountSummary: AccountSummary | null;
  
  // Estados
  loading: boolean;
  error: string | null;
  connected: boolean;
  
  // Funções
  fetchAccountMetrics: (startDate: string, endDate: string) => Promise<void>;
  fetchCampaigns: (startDate?: string, endDate?: string) => Promise<void>;
  fetchRealtimeMetrics: () => Promise<void>;
  fetchAccountSummary: (startDate: string, endDate: string) => Promise<void>;
  testConnection: () => Promise<void>;
  syncData: () => Promise<void>;
  
  // Utilitários
  totalSpend: number;
  totalLeads: number;
  averageCPC: number;
  averageCPM: number;
  averageCTR: number;
  totalImpressions: number;
  totalClicks: number;
  campaignCount: number;
}

export function useMetaAds(): UseMetaAdsReturn {
  const [accountMetrics, setAccountMetrics] = useState<MetaAdsMetrics[]>([]);
  const [campaigns, setCampaigns] = useState<MetaAdsCampaign[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<MetaAdsMetrics | null>(null);
  const [accountSummary, setAccountSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Função genérica para fazer requisições à API
  const apiRequest = useCallback(async (endpoint: string, params?: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      const response = await fetch(`/api/meta-ads${queryString}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar métricas da CONTA INTEIRA por período
  const fetchAccountMetrics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const params: Record<string, string> = {
        action: 'account-metrics',
        startDate,
        endDate
      };
      
      const data = await apiRequest('', params);
      setAccountMetrics(data.data);
    } catch (err) {
      console.error('Erro ao buscar métricas da conta:', err);
    }
  }, [apiRequest]);

  // Buscar campanhas
  const fetchCampaigns = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      // Se não foram fornecidas datas, usar período padrão
      if (!startDate || !endDate) {
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
      }
      
      const data = await apiRequest('', { 
        action: 'campaigns',
        startDate,
        endDate
      });
      setCampaigns(data.data);
    } catch (err) {
      console.error('Erro ao buscar campanhas:', err);
    }
  }, [apiRequest]);

  // Buscar métricas em tempo real
  const fetchRealtimeMetrics = useCallback(async () => {
    try {
      const data = await apiRequest('', { action: 'realtime' });
      setRealtimeMetrics(data.data);
    } catch (err) {
      console.error('Erro ao buscar métricas em tempo real:', err);
    }
  }, [apiRequest]);

  // Buscar resumo da conta
  const fetchAccountSummary = useCallback(async (startDate: string, endDate: string) => {
    try {
      const data = await apiRequest('', { 
        action: 'account-summary',
        startDate,
        endDate
      });
      setAccountSummary(data.data);
    } catch (err) {
      console.error('Erro ao buscar resumo da conta:', err);
    }
  }, [apiRequest]);

  // Testar conexão
  const testConnection = useCallback(async () => {
    try {
      const data = await apiRequest('', { action: 'test' });
      setConnected(data.connected);
    } catch (err) {
      setConnected(false);
      console.error('Erro ao testar conexão:', err);
    }
  }, [apiRequest]);

  // Sincronizar dados
  const syncData = useCallback(async () => {
    try {
      // Usar período padrão para sincronização
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const data = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'sync',
          data: { startDate, endDate }
        }),
      });
      
      const response = await data.json();
      
      if (response.success) {
        setAccountMetrics(response.data.accountMetrics);
        setCampaigns(response.data.campaigns);
      }
    } catch (err) {
      console.error('Erro ao sincronizar dados:', err);
    }
  }, []);

  // Calcular métricas agregadas da conta
  const totalSpend = accountMetrics.reduce((sum, metric) => sum + metric.spend, 0);
  const totalLeads = accountMetrics.reduce((sum, metric) => sum + metric.leads, 0);
  const totalImpressions = accountMetrics.reduce((sum, metric) => sum + metric.impressions, 0);
  const totalClicks = accountMetrics.reduce((sum, metric) => sum + metric.clicks, 0);
  
  const averageCPC = totalClicks > 0 
    ? totalSpend / totalClicks 
    : 0;
  
  const averageCPM = totalImpressions > 0 
    ? (totalSpend / totalImpressions) * 1000 
    : 0;
  
  const averageCTR = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;

  const campaignCount = campaigns.length;

  // Buscar dados ao montar o hook
  useEffect(() => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    fetchAccountMetrics(startDate, endDate);
    fetchCampaigns(startDate, endDate);
    fetchRealtimeMetrics();
  }, [fetchAccountMetrics, fetchCampaigns, fetchRealtimeMetrics]);

  // Testar conexão ao montar o hook
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    // Dados
    accountMetrics,
    campaigns,
    realtimeMetrics,
    accountSummary,
    
    // Estados
    loading,
    error,
    connected,
    
    // Funções
    fetchAccountMetrics,
    fetchCampaigns,
    fetchRealtimeMetrics,
    fetchAccountSummary,
    testConnection,
    syncData,
    
    // Utilitários
    totalSpend,
    totalLeads,
    averageCPC,
    averageCPM,
    averageCTR,
    totalImpressions,
    totalClicks,
    campaignCount,
  };
}
