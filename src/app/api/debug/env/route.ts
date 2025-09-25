import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mostrar apenas se as variáveis estão configuradas (não os valores reais)
    const envCheck = {
      ASAAS_API_KEY: process.env.ASAAS_API_KEY ? 'Configurada' : 'Não configurada',
      ASAAS_WALLET_ID: process.env.ASAAS_WALLET_ID ? 'Configurada' : 'Não configurada',
      ASAAS_ENVIRONMENT: process.env.ASAAS_ENVIRONMENT ? 'Configurada' : 'Não configurada',
      NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Verificação de variáveis de ambiente'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao verificar variáveis',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
