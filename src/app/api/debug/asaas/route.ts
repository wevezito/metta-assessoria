import { NextResponse } from 'next/server';
import { AsaasService } from '@/lib/services/asaas-service';
import { validateAsaasConfig } from '@/lib/asaas-config';

export async function GET() {
  try {
    console.log('🔍 Debug Asaas - Iniciando teste...');
    
    // Verificar configuração
    const isConfigValid = validateAsaasConfig();
    console.log('✅ Configuração válida:', isConfigValid);
    
    if (!isConfigValid) {
      return NextResponse.json({
        success: false,
        error: 'Configuração inválida',
        step: 'config_validation'
      });
    }

    // Testar conexão
    const asaasService = new AsaasService();
    console.log('🧪 Testando conexão...');
    
    const isConnected = await asaasService.testConnection();
    console.log('✅ Resultado da conexão:', isConnected);
    
    return NextResponse.json({
      success: true,
      configValid: isConfigValid,
      connectionTest: isConnected,
      message: 'Teste de conexão Asaas concluído'
    });
    
  } catch (error) {
    console.error('❌ Erro no debug Asaas:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      step: 'connection_test'
    }, { status: 500 });
  }
}
