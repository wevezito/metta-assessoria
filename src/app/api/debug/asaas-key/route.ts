import { NextResponse } from 'next/server';
import { ASAAS_CONFIG } from '@/lib/asaas-config';

export async function GET() {
  try {
    const apiKey = ASAAS_CONFIG.API_KEY;
    const baseURL = ASAAS_CONFIG.BASE_URL;
    const walletId = ASAAS_CONFIG.WALLET_ID;

    if (!apiKey || !walletId) {
      return NextResponse.json({
        success: false,
        message: 'ASAAS_API_KEY ou ASAAS_WALLET_ID não configurados.',
      }, { status: 400 });
    }

    // Teste 1: Verificar se a API Key tem formato correto
    const apiKeyInfo = {
      length: apiKey.length,
      startsWith: apiKey.substring(0, 10),
      endsWith: apiKey.substring(apiKey.length - 10),
      hasSpaces: apiKey.includes(' '),
      hasNewlines: apiKey.includes('\n'),
    };

    // Teste 2: Tentar fazer uma chamada simples para /customers (endpoint mais básico)
    const testUrl = `${baseURL}/customers`;
    
    console.log('🧪 Testando API Key do Asaas...');
    console.log('📊 Informações da API Key:', apiKeyInfo);
    console.log('🌐 URL de teste:', testUrl);
    console.log('🔑 API Key (primeiros 20 chars):', apiKey.substring(0, 20) + '...');

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      // timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    });

    const responseData = await response.text();
    
    return NextResponse.json({
      success: true,
      apiKeyInfo,
      testUrl,
      responseStatus: response.status,
      responseStatusText: response.statusText,
      responseHeaders: Object.fromEntries(response.headers.entries()),
      responseData: responseData.substring(0, 500), // Primeiros 500 chars
      message: 'Teste de API Key concluído',
    });

  } catch (error: any) {
    console.error('❌ Erro no teste de API Key:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Erro no teste de API Key',
    }, { status: 500 });
  }
}
