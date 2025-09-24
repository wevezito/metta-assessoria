import { NextRequest, NextResponse } from 'next/server';
import { metaAdsService } from '@/lib/services/meta-ads-service';
import { validateMetaAdsConfig } from '@/lib/meta-ads-config';

export async function GET(request: NextRequest) {
  try {
    // Validar configuração
    if (!validateMetaAdsConfig()) {
      return NextResponse.json(
        { error: 'Configuração do Meta Ads não encontrada' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const campaignId = searchParams.get('campaignId');

    switch (action) {
      case 'account-metrics':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        try {
          // Buscar métricas da CONTA INTEIRA
          const accountMetrics = await metaAdsService.getAccountMetrics(
            startDate,
            endDate
          );

          return NextResponse.json({ success: true, data: accountMetrics });
        } catch (error) {
          console.error('Erro ao buscar métricas da conta:', error);
          
          if (error instanceof Error && error.message.includes('Invalid OAuth access token')) {
            return NextResponse.json(
              { 
                error: 'Token do Meta Ads inválido ou expirado. Entre em contato com o administrador.',
                details: 'OAuth token inválido'
              },
              { status: 401 }
            );
          }
          
          return NextResponse.json(
            { 
              error: 'Erro ao buscar dados do Meta Ads',
              details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
          );
        }

      case 'metrics':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        try {
          const metrics = await metaAdsService.getCampaignMetrics(
            startDate,
            endDate,
            campaignId || undefined
          );

          return NextResponse.json({ success: true, data: metrics });
        } catch (error) {
          console.error('Erro ao buscar métricas:', error);
          return NextResponse.json(
            { 
              error: 'Erro ao buscar métricas de campanhas',
              details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
          );
        }

      case 'campaigns':
        // Buscar campanhas com gasto no período
        const campaignStartDate = searchParams.get('startDate');
        const campaignEndDate = searchParams.get('endDate');
        
        if (!campaignStartDate || !campaignEndDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias para campanhas' },
            { status: 400 }
          );
        }
        
        const campaigns = await metaAdsService.getCampaigns(campaignStartDate, campaignEndDate);
        return NextResponse.json({
          success: true,
          data: campaigns
        });

      case 'realtime':
        try {
          const realtimeMetrics = await metaAdsService.getRealTimeMetrics();
          return NextResponse.json({ success: true, data: realtimeMetrics });
        } catch (error) {
          console.error('Erro ao buscar métricas em tempo real:', error);
          return NextResponse.json(
            { 
              error: 'Erro ao buscar métricas em tempo real',
              details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
          );
        }

      case 'account-summary':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }

        try {
          // Buscar resumo completo da conta
          const accountSummary = await metaAdsService.getAccountSummary(
            startDate,
            endDate
          );

          return NextResponse.json({ success: true, data: accountSummary });
        } catch (error) {
          console.error('Erro ao buscar resumo da conta:', error);
          return NextResponse.json(
            { 
              error: 'Erro ao buscar resumo da conta',
              details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
          );
        }

      case 'test':
        try {
          const isConnected = await metaAdsService.testConnection();
          return NextResponse.json({ 
            success: true, 
            connected: isConnected,
            message: isConnected ? 'Conexão bem-sucedida' : 'Falha na conexão'
          });
        } catch (error) {
          console.error('Erro ao testar conexão:', error);
          return NextResponse.json(
            { 
              success: false,
              connected: false,
              error: 'Erro ao testar conexão',
              details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Ação não especificada' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Erro geral na API do Meta Ads:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'sync':
        // Sincronizar dados da CONTA INTEIRA
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const [accountMetrics, campaigns] = await Promise.all([
          metaAdsService.getAccountMetrics(startDate, endDate),
          metaAdsService.getCampaigns(startDate, endDate)
        ]);
        
        return NextResponse.json({
          success: true,
          data: {
            accountMetrics,
            campaigns,
            syncedAt: new Date().toISOString()
          }
        });

      case 'account-summary':
        if (!data?.startDate || !data?.endDate) {
          return NextResponse.json(
            { error: 'Datas de início e fim são obrigatórias' },
            { status: 400 }
          );
        }
        
        const accountSummary = await metaAdsService.getAccountSummary(
          data.startDate,
          data.endDate
        );
        
        return NextResponse.json({
          success: true,
          data: accountSummary
        });

      default:
        return NextResponse.json(
          { error: 'Ação não suportada' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Erro na API POST do Meta Ads:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
