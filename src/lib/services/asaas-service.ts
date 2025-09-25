import axios, { AxiosInstance } from 'axios';
import { 
  ASAAS_CONFIG, 
  AsaasPayment, 
  AsaasSubscription, 
  AsaasCustomer, 
  AsaasMetrics 
} from '../asaas-config';

export class AsaasService {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = ASAAS_CONFIG.API_KEY;
    this.baseURL = ASAAS_CONFIG.BASE_URL;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: ASAAS_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.apiKey
      }
    });

    // Interceptor para logs
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 Asaas API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Asaas API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ Asaas API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Asaas API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Testar conexão com a API
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testando conexão com Asaas...');
      console.log('API Key:', this.apiKey ? 'Configurada' : 'Não configurada');
      console.log('API Key (primeiros 20 chars):', this.apiKey ? this.apiKey.substring(0, 20) + '...' : 'Não configurada');
      console.log('Wallet ID:', ASAAS_CONFIG.WALLET_ID);
      console.log('Base URL:', this.baseURL);
      
      // Primeiro, testar uma chamada simples para verificar se a API está respondendo
      console.log('📡 Fazendo chamada para /payments...');
      const response = await this.api.get('/payments', {
        params: { 
          limit: 1,
          walletId: ASAAS_CONFIG.WALLET_ID
        }
      });

      console.log('✅ Resposta recebida:');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.log('Total de pagamentos encontrados:', response.data.totalCount || 0);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao conectar com Asaas:');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('Full error:', error);
      return false;
    }
  }

  // Obter pagamentos por período
  async getPayments(
    startDate: string,
    endDate: string,
    status?: string
  ): Promise<AsaasPayment[]> {
    try {
      // A API do Asaas pode não aceitar filtros de data diretamente
      // Vamos buscar todos os pagamentos e filtrar localmente
      const params: any = {
        limit: 1000, // Aumentar limite para pegar mais dados
        walletId: ASAAS_CONFIG.WALLET_ID // Filtrar apenas pagamentos da wallet da Metta
      };

      if (status) {
        params.status = status;
      }

      console.log(`🚀 Asaas API Request: GET /payments`);
      console.log(`📅 Filtro de data: ${startDate} até ${endDate}`);
      console.log(`🔑 Parâmetros:`, params);

      const response = await this.api.get('/payments', { params });
      
      console.log(`✅ Asaas API Response: ${response.status} /payments`);
      console.log(`📊 Dados retornados: ${response.data.data?.length || 0} pagamentos`);
      
      // Filtrar localmente por data
      let filteredPayments = response.data.data || [];
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filteredPayments = filteredPayments.filter((payment: any) => {
          const paymentDate = new Date(payment.dueDate || payment.dateCreated || payment.createdDate);
          return paymentDate >= start && paymentDate <= end;
        });
        
        console.log(`🔍 Pagamentos filtrados por data: ${filteredPayments.length} de ${response.data.data?.length || 0}`);
      }
      
      return filteredPayments;
    } catch (error: any) {
      console.error('Erro ao obter pagamentos do Asaas:', error.response?.data || error.message);
      throw error;
    }
  }

  // Obter assinaturas por período
  async getSubscriptions(
    startDate: string,
    endDate: string,
    status?: string
  ): Promise<AsaasSubscription[]> {
    try {
      // A API do Asaas pode não aceitar filtros de data diretamente
      // Vamos buscar todas as assinaturas e filtrar localmente
      const params: any = {
        limit: 1000, // Aumentar limite para pegar mais dados
        walletId: ASAAS_CONFIG.WALLET_ID // Filtrar apenas assinaturas da wallet da Metta
      };

      if (status) {
        params.status = status;
      }

      console.log(`🚀 Asaas API Request: GET /subscriptions`);
      console.log(`📅 Filtro de data: ${startDate} até ${endDate}`);
      console.log(`🔑 Parâmetros:`, params);

      const response = await this.api.get('/subscriptions', { params });
      
      console.log(`✅ Asaas API Response: ${response.status} /subscriptions`);
      console.log(`📊 Dados retornados: ${response.data.data?.length || 0} assinaturas`);
      
      // Filtrar localmente por data
      let filteredSubscriptions = response.data.data || [];
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filteredSubscriptions = filteredSubscriptions.filter((subscription: any) => {
          const subscriptionDate = new Date(subscription.dateCreated || subscription.createdDate || subscription.startDate);
          return subscriptionDate >= start && subscriptionDate <= end;
        });
        
        console.log(`🔍 Assinaturas filtradas por data: ${filteredSubscriptions.length} de ${response.data.data?.length || 0}`);
      }
      
      return filteredSubscriptions;
    } catch (error: any) {
      console.error('Erro ao obter assinaturas do Asaas:', error.response?.data || error.message);
      throw error;
    }
  }

  // Obter clientes
  async getCustomers(limit: number = 100): Promise<AsaasCustomer[]> {
    try {
      const response = await this.api.get('/customers', {
        params: { 
          limit,
          walletId: ASAAS_CONFIG.WALLET_ID // Filtrar apenas clientes da wallet da Metta
        }
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao obter clientes do Asaas:', error.response?.data || error.message);
      throw error;
    }
  }

  // Obter métricas consolidadas por período
  async getMetrics(
    startDate: string,
    endDate: string
  ): Promise<AsaasMetrics> {
    try {
      console.log(`📊 Buscando métricas do Asaas: ${startDate} até ${endDate}`);

      // Buscar pagamentos e assinaturas em paralelo
      const [payments, subscriptions] = await Promise.all([
        this.getPayments(startDate, endDate),
        this.getSubscriptions(startDate, endDate)
      ]);

      // Calcular métricas dos pagamentos
      const totalPayments = payments.length;
      const confirmedPayments = payments.filter(p => 
        ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(p.status)
      ).length;
      const pendingPayments = payments.filter(p => 
        ['PENDING'].includes(p.status)
      ).length;
      const overduePayments = payments.filter(p => 
        ['OVERDUE', 'RECEIVED_WITH_OVERDUE'].includes(p.status)
      ).length;
      const cancelledPayments = payments.filter(p => 
        ['CANCELED', 'REFUNDED', 'REFUND_REQUESTED'].includes(p.status)
      ).length;

      // Calcular valores
      const confirmedPaymentsData = payments.filter(p => 
        ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(p.status)
      );
      const totalSales = confirmedPaymentsData.reduce((sum, p) => sum + p.value, 0);
      const averageTicket = confirmedPayments > 0 ? totalSales / confirmedPayments : 0;
      const conversionRate = totalPayments > 0 ? (confirmedPayments / totalPayments) * 100 : 0;

      // Calcular métricas das assinaturas
      const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE');
      const subscriptionRevenue = activeSubscriptions.reduce((sum, s) => sum + s.value, 0);

      console.log(`📈 Métricas calculadas:`);
      console.log(`- Total de pagamentos: ${totalPayments}`);
      console.log(`- Pagamentos confirmados: ${confirmedPayments}`);
      console.log(`- Total de vendas: R$ ${totalSales.toFixed(2)}`);
      console.log(`- Ticket médio: R$ ${averageTicket.toFixed(2)}`);
      console.log(`- Taxa de conversão: ${conversionRate.toFixed(1)}%`);

      return {
        totalSales: totalSales + subscriptionRevenue,
        totalPayments,
        confirmedPayments,
        pendingPayments,
        overduePayments,
        cancelledPayments,
        averageTicket,
        conversionRate,
        period: { startDate, endDate }
      };

    } catch (error: any) {
      console.error('Erro ao obter métricas do Asaas:', error.response?.data || error.message);
      throw error;
    }
  }

  // Obter resumo financeiro
  async getFinancialSummary(
    startDate: string,
    endDate: string
  ): Promise<{
    totalRevenue: number;
    totalPayments: number;
    confirmedRevenue: number;
    pendingRevenue: number;
    overdueRevenue: number;
    averageTicket: number;
    conversionRate: number;
    period: { startDate: string; endDate: string };
  }> {
    try {
      const metrics = await this.getMetrics(startDate, endDate);
      
      // Buscar pagamentos para calcular receitas por status
      const payments = await this.getPayments(startDate, endDate);
      
      const confirmedRevenue = payments
        .filter(p => ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(p.status))
        .reduce((sum, p) => sum + p.value, 0);
      
      const pendingRevenue = payments
        .filter(p => ['PENDING'].includes(p.status))
        .reduce((sum, p) => sum + p.value, 0);
      
      const overdueRevenue = payments
        .filter(p => ['OVERDUE', 'RECEIVED_WITH_OVERDUE'].includes(p.status))
        .reduce((sum, p) => sum + p.value, 0);

      return {
        totalRevenue: metrics.totalSales,
        totalPayments: metrics.totalPayments,
        confirmedRevenue,
        pendingRevenue,
        overdueRevenue,
        averageTicket: metrics.averageTicket,
        conversionRate: metrics.conversionRate,
        period: { startDate, endDate }
      };

    } catch (error: any) {
      console.error('Erro ao obter resumo financeiro do Asaas:', error.response?.data || error.message);
      throw error;
    }
  }

  // Validar webhook
  validateWebhook(payload: any, signature: string): boolean {
    // Implementar validação do webhook se necessário
    // Por enquanto, retorna true para desenvolvimento
    return true;
  }
}
