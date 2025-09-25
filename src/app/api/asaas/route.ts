import { NextRequest, NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas-service';
import { validateAsaasConfig } from '@/lib/asaas-config';

const asaasService = new AsaasService();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Asaas - Verificando configuração...');
    
    // Verificar se a configuração está válida
    const isConfigValid = validateAsaasConfig();
    console.log('✅ Configuração válida:', isConfigValid);
    
    if (!isConfigValid) {
      console.error('❌ Configuração do Asaas inválida');
      return NextResponse.json(
        { error: 'Configuração do Asaas não encontrada' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'test':
        // Testar conexão
        console.log('🧪 API Asaas - Iniciando teste de conexão...');
        const isConnected = await asaasService.testConnection();
        console.log('✅ API Asaas - Resultado do teste:', isConnected);
        
        return NextResponse.json({
          success: isConnected,
          connected: isConnected,
          message: isConnected ? 'Conexão bem-sucedida!' : 'Falha na conexão'
        });

      case 'metrics':
        // Buscar métricas por período
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        const metrics = await asaasService.getMetrics(startDate, endDate);
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'financial-summary':
        // Buscar resumo financeiro por período
        const summaryStartDate = searchParams.get('startDate');
        const summaryEndDate = searchParams.get('endDate');
        
        if (!summaryStartDate || !summaryEndDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        const summary = await asaasService.getFinancialSummary(summaryStartDate, summaryEndDate);
        return NextResponse.json({
          success: true,
          data: summary
        });

      case 'payments':
        // Buscar pagamentos por período
        const paymentsStartDate = searchParams.get('startDate');
        const paymentsEndDate = searchParams.get('endDate');
        const status = searchParams.get('status');
        
        if (!paymentsStartDate || !paymentsEndDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        const payments = await asaasService.getPayments(paymentsStartDate, paymentsEndDate, status || undefined);
        return NextResponse.json({
          success: true,
          data: payments
        });

      case 'subscriptions':
        // Buscar assinaturas por período
        const subscriptionsStartDate = searchParams.get('startDate');
        const subscriptionsEndDate = searchParams.get('endDate');
        const subscriptionStatus = searchParams.get('status');
        
        if (!subscriptionsStartDate || !subscriptionsEndDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        const subscriptions = await asaasService.getSubscriptions(subscriptionsStartDate, subscriptionsEndDate, subscriptionStatus || undefined);
        return NextResponse.json({
          success: true,
          data: subscriptions
        });

      case 'customers':
        // Buscar clientes
        const limit = searchParams.get('limit');
        const customers = await asaasService.getCustomers(limit ? parseInt(limit) : 100);
        return NextResponse.json({
          success: true,
          data: customers
        });

      default:
        return NextResponse.json(
          { error: 'Ação não especificada' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Erro na API do Asaas:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message || 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se a configuração está válida
    if (!validateAsaasConfig()) {
      return NextResponse.json(
        { error: 'Configuração do Asaas não encontrada' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'sync':
        // Sincronizar dados por período
        const body = await request.json();
        const { startDate, endDate } = body;
        
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        // Buscar métricas e resumo financeiro em paralelo
        const [metrics, financialSummary] = await Promise.all([
          asaasService.getMetrics(startDate, endDate),
          asaasService.getFinancialSummary(startDate, endDate)
        ]);

        return NextResponse.json({
          success: true,
          data: {
            metrics,
            financialSummary,
            syncedAt: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          { error: 'Ação não especificada' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Erro na API POST do Asaas:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message || 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

