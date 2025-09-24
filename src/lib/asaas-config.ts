// Configuração para integração com Asaas - Metta Assessoria
export const ASAAS_CONFIG = {
  // API Key do Asaas (produção)
  API_KEY: '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRkZWJlZTEwLWQyNTQtNDQwYS1iNzdhLTk3NDIyMzBkZTdiNjo6JGFhY2hfYWI3Yzk2OTgtYWI2Ny00YTRjLTkwZTItMmUzMThlYTgyMzgx',
  
  // Ambiente (produção)
  ENVIRONMENT: 'production',
  
  // Base URL da API (produção)
  BASE_URL: 'https://api.asaas.com/v3',
  
  // Wallet ID da Metta
  WALLET_ID: 'a082779d-a766-4606-b6c8-8840f4d9f635',
  
  // Webhook Secret (será configurado depois)
  WEBHOOK_SECRET: process.env.ASAAS_WEBHOOK_SECRET || 'webhook_secret_sera_configurado_depois',
  
  // Timeout das requisições (em ms)
  TIMEOUT: 30000,
};

export interface AsaasPayment {
  id: string;
  customer: string;
  subscription?: string;
  installment?: string;
  installmentNumber?: number;
  installmentCount?: number;
  paymentLink?: string;
  value: number;
  netValue: number;
  originalValue?: number;
  interestValue?: number;
  description?: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  status: 'PENDING' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED' | 'RECEIVED_IN_CASH' | 'CANCELED' | 'RECEIVED_WITH_OVERDUE' | 'REFUND_REQUESTED' | 'REFUND_IN_PROCESSING' | 'REFUND_IN_PROCESSING_CANCELLED';
  dueDate: string;
  originalDueDate?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentDescription?: string;
  externalReference?: string;
  discount?: {
    value: number;
    dueDateLimitDays: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
  interest?: {
    value: number;
  };
  fine?: {
    value: number;
  };
  postalService: boolean;
  object: 'payment';
  dateCreated: string;
  dateUpdated: string;
}

export interface AsaasSubscription {
  id: string;
  customer: string;
  value: number;
  nextDueDate: string;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'YEARLY';
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OVERDUE' | 'CANCELLED';
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  endDate?: string;
  maxPayments?: number;
  fine?: {
    value: number;
  };
  interest?: {
    value: number;
  };
  split?: Array<{
    walletId: string;
    fixedValue?: number;
    percentualValue?: number;
    totalFixedValue?: number;
    totalPercentualValue?: number;
  }>;
  object: 'subscription';
  dateCreated: string;
  dateUpdated: string;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  cpfCnpj?: string;
  personType?: 'FISICA' | 'JURIDICA';
  deleted: boolean;
  additionalEmails?: string;
  externalReference?: string;
  notificationDisabled: boolean;
  observations?: string;
  object: 'customer';
  dateCreated: string;
  dateUpdated: string;
}

export interface AsaasMetrics {
  totalSales: number;
  totalPayments: number;
  confirmedPayments: number;
  pendingPayments: number;
  overduePayments: number;
  cancelledPayments: number;
  averageTicket: number;
  conversionRate: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

// Função para validar configuração
export function validateAsaasConfig(): boolean {
  return !!(
    ASAAS_CONFIG.API_KEY &&
    ASAAS_CONFIG.API_KEY !== 'sua_api_key_aqui' &&
    ASAAS_CONFIG.ENVIRONMENT &&
    ASAAS_CONFIG.WALLET_ID
  );
}
