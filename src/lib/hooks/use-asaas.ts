import { useState, useCallback, useEffect } from 'react';
import { AsaasMetrics } from '../asaas-config';

interface AsaasState {
  connected: boolean;
  loading: boolean;
  error: string | null;
  metrics: AsaasMetrics | null;
  financialSummary: any | null;
  lastSync: string | null;
}

interface DailySalesData {
  date: string;
  sales: number;
}

interface UseAsaasReturn extends AsaasState {
  testConnection: () => Promise<void>;
  fetchMetrics: (startDate: string, endDate: string) => Promise<void>;
  fetchAsaasMetrics: (startDate: string, endDate: string) => Promise<AsaasMetrics | null>;
  fetchFinancialSummary: (startDate: string, endDate: string) => Promise<void>;
  fetchDailySales: (year: number, month: number) => Promise<DailySalesData[]>;
  syncData: (startDate: string, endDate: string) => Promise<void>;
  clearError: () => void;
}

export function useAsaas(): UseAsaasReturn {
  const [state, setState] = useState<AsaasState>({
    connected: false,
    loading: false,
    error: null,
    metrics: null,
    financialSummary: null,
    lastSync: null
  });

  // Função genérica para fazer requisições à API
  const apiRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> => {
    try {
      const response = await fetch(`/api/asaas${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Erro na requisição para API do Asaas:', error);
      throw error;
    }
  }, []);

  // Testar conexão
  const testConnection = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await apiRequest('?action=test');
      
      setState(prev => ({
        ...prev,
        connected: data.connected,
        loading: false,
        error: data.connected ? null : 'Falha na conexão com Asaas'
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        connected: false,
        loading: false,
        error: error.message || 'Erro ao testar conexão'
      }));
    }
  }, [apiRequest]);

  // Buscar métricas
  const fetchMetrics = useCallback(async (startDate: string, endDate: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await apiRequest(`?action=metrics&startDate=${startDate}&endDate=${endDate}`);
      
      setState(prev => ({
        ...prev,
        metrics: data.data,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao buscar métricas'
      }));
    }
  }, [apiRequest]);

  // Buscar métricas e retornar dados diretamente
  const fetchAsaasMetrics = useCallback(async (startDate: string, endDate: string): Promise<AsaasMetrics | null> => {
    try {
      const data = await apiRequest(`?action=metrics&startDate=${startDate}&endDate=${endDate}`);
      return data.data;
    } catch (error: any) {
      console.error('Erro ao buscar métricas do Asaas:', error);
      return null;
    }
  }, [apiRequest]);

  // Buscar vendas diárias do mês com dados reais do Asaas
  const fetchDailySales = useCallback(async (year: number, month: number): Promise<DailySalesData[]> => {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Último dia do mês
      
      console.log(`🔍 Buscando dados reais do Asaas para ${year}-${month} (${startDate} até ${endDate})`);
      
      // Buscar dados detalhados do Asaas para o mês
      const data = await apiRequest(`?action=payments&startDate=${startDate}&endDate=${endDate}`);
      
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.log('📊 Nenhum pagamento encontrado no Asaas para este período');
        // Retornar array vazio em vez de dados de exemplo
        return [];
      }

      console.log(`📊 Encontrados ${data.data.length} pagamentos no Asaas`);

      // Processar os dados reais do Asaas - apenas valor total
      const dailyData = new Map<string, number>();
      
      data.data.forEach((payment: any) => {
        const date = payment.date || payment.createdDate || payment.dueDate;
        const dateStr = new Date(date).toISOString().split('T')[0];
        const amount = payment.value || payment.amount || 0;
        
        if (!dailyData.has(dateStr)) {
          dailyData.set(dateStr, 0);
        }
        
        dailyData.set(dateStr, dailyData.get(dateStr)! + amount);
      });

      // Converter para o formato esperado pelo gráfico
      const result: DailySalesData[] = [];
      const daysInMonth = new Date(year, month, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = date.toISOString().split('T')[0];
        const totalSales = dailyData.get(dateStr) || 0;
        
        result.push({
          date: dateStr,
          sales: totalSales
        });
      }
      
      console.log(`✅ Processados ${result.length} dias com dados do Asaas`);
      return result;
    } catch (error: any) {
      console.error('❌ Erro ao buscar vendas diárias:', error);
      // Retornar array vazio em caso de erro
      return [];
    }
  }, [apiRequest]);


  // Buscar resumo financeiro
  const fetchFinancialSummary = useCallback(async (startDate: string, endDate: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await apiRequest(`?action=financial-summary&startDate=${startDate}&endDate=${endDate}`);
      
      setState(prev => ({
        ...prev,
        financialSummary: data.data,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao buscar resumo financeiro'
      }));
    }
  }, [apiRequest]);

  // Sincronizar dados
  const syncData = useCallback(async (startDate: string, endDate: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await apiRequest('?action=sync', {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate })
      });
      
      setState(prev => ({
        ...prev,
        metrics: data.data.metrics,
        financialSummary: data.data.financialSummary,
        lastSync: data.data.syncedAt,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao sincronizar dados'
      }));
    }
  }, [apiRequest]);

  // Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Testar conexão automaticamente ao montar o hook
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    ...state,
    testConnection,
    fetchMetrics,
    fetchAsaasMetrics,
    fetchFinancialSummary,
    fetchDailySales,
    syncData,
    clearError
  };
}

