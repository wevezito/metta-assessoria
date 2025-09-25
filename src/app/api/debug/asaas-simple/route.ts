import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Teste simples Asaas - Iniciando...');
    
    const apiKey = process.env.ASAAS_API_KEY;
    const walletId = process.env.ASAAS_WALLET_ID;
    
    console.log('📋 Configurações:');
    console.log('API Key (primeiros 20 chars):', apiKey ? apiKey.substring(0, 20) + '...' : 'Não configurada');
    console.log('Wallet ID:', walletId);
    
    if (!apiKey || !walletId) {
      return NextResponse.json({
        success: false,
        error: 'Variáveis de ambiente não configuradas'
      });
    }
    
    // Fazer chamada direta para a API do Asaas
    console.log('📡 Fazendo chamada direta para API Asaas...');
    
    const response = await fetch('https://api.asaas.com/v3/payments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      // Adicionar timeout
      signal: AbortSignal.timeout(10000)
    });
    
    console.log('📊 Resposta da API:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('Data (primeiros 500 chars):', data.substring(0, 500));
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        data: data,
        message: 'API retornou erro'
      });
    }
    
    return NextResponse.json({
      success: true,
      status: response.status,
      data: data.substring(0, 1000), // Primeiros 1000 caracteres
      message: 'Chamada para API Asaas bem-sucedida'
    });
    
  } catch (error) {
    console.error('❌ Erro no teste simples:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      message: 'Erro na chamada para API Asaas'
    }, { status: 500 });
  }
}
