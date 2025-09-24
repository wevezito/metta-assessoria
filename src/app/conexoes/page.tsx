"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  DollarSign,
  Megaphone,
  Wifi,
  AlertCircle
} from "lucide-react";
import { useAsaas } from "@/lib/hooks/use-asaas";
import { useMetaAds } from "@/lib/hooks/use-meta-ads";

export default function ConexoesPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Hooks para as integrações
  const {
    connected: asaasConnected,
    loading: asaasLoading,
    error: asaasError,
    testConnection: testAsaasConnection,
    fetchMetrics: fetchAsaasMetrics
  } = useAsaas();

  const {
    connected: metaAdsConnected,
    loading: metaAdsLoading,
    error: metaAdsError,
    testConnection: testMetaAdsConnection,
    fetchAccountMetrics: fetchMetaAdsMetrics
  } = useMetaAds();

  // Função para testar todas as conexões
  const testAllConnections = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        testAsaasConnection(),
        testMetaAdsConnection()
      ]);
    } catch (error) {
      console.error("Erro ao testar conexões:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Função para sincronizar dados de todas as integrações
  const syncAllData = async () => {
    setIsRefreshing(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await Promise.all([
        fetchAsaasMetrics(startDate, endDate),
        fetchMetaAdsMetrics(startDate, endDate)
      ]);
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conexões e Integrações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todas as integrações do sistema e monitore o status das conexões
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={testAllConnections}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Testar Todas
          </Button>
          <Button
            onClick={syncAllData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Sincronizar Dados
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Status Geral das Integrações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {asaasConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">Asaas</span>
              </div>
              <Badge variant={asaasConnected ? "default" : "destructive"}>
                {asaasConnected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {metaAdsConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">Meta Ads</span>
              </div>
              <Badge variant={metaAdsConnected ? "default" : "destructive"}>
                {metaAdsConnected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integração Asaas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Integração Asaas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Sistema de pagamentos e faturamento
              </p>
              <p className="text-xs text-gray-500">
                Gerencia pagamentos, assinaturas e métricas financeiras
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={testAsaasConnection}
                disabled={asaasLoading}
                variant="outline"
                size="sm"
              >
                {asaasLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Testar Conexão"
                )}
              </Button>
              <Button
                onClick={() => fetchAsaasMetrics()}
                disabled={asaasLoading}
                size="sm"
              >
                Sincronizar
              </Button>
            </div>
          </div>
          
          {asaasError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                Erro: {asaasError}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integração Meta Ads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            Integração Meta Ads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Anúncios e campanhas do Facebook/Instagram
              </p>
              <p className="text-xs text-gray-500">
                Monitora performance de campanhas e métricas de anúncios
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={testMetaAdsConnection}
                disabled={metaAdsLoading}
                variant="outline"
                size="sm"
              >
                {metaAdsLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Testar Conexão"
                )}
              </Button>
              <Button
                onClick={() => fetchMetaAdsMetrics()}
                disabled={metaAdsLoading}
                size="sm"
              >
                Sincronizar
              </Button>
            </div>
          </div>
          
          {metaAdsError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                Erro: {metaAdsError}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações Avançadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Webhook Asaas</p>
                <p className="text-sm text-gray-600">
                  Configurar notificações em tempo real
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Sincronização Automática</p>
                <p className="text-sm text-gray-600">
                  Configurar intervalos de sincronização
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Logs de Integração</p>
                <p className="text-sm text-gray-600">
                  Visualizar histórico de sincronizações
                </p>
              </div>
              <Button variant="outline" size="sm">
                Visualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
