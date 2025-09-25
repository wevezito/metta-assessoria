"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";
import { useAsaas } from "@/lib/hooks/use-asaas";
import { useMetaAds } from "@/lib/hooks/use-meta-ads";

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("mes");
  const [isLoading, setIsLoading] = useState(false);

  // Hooks para as integrações
  const {
    connected: asaasConnected,
    metrics: asaasMetrics,
    fetchMetrics: fetchAsaasMetrics
  } = useAsaas();

  const {
    connected: metaAdsConnected,
    accountMetrics: metaAdsMetrics,
    fetchAccountMetrics: fetchMetaAdsMetrics,
    totalSpend,
    totalImpressions,
    totalClicks,
    averageCTR
  } = useMetaAds();

  // Buscar dados ao mudar o período
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { startDate, endDate } = getDateRange(selectedPeriod);
        
        if (asaasConnected) {
          await fetchAsaasMetrics(startDate, endDate);
        }
        
        if (metaAdsConnected) {
          await fetchMetaAdsMetrics(startDate, endDate);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, asaasConnected, metaAdsConnected, fetchAsaasMetrics, fetchMetaAdsMetrics]);

  const getDateRange = (period: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date();

    switch (period) {
      case "semana":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "mes":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "trimestre":
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        break;
      case "ano":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Analytics</h1>
          <p className="text-gray-600">Métricas, performance e insights do negócio</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Status das Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${asaasConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">Asaas</span>
              </div>
              <Badge variant={asaasConnected ? "default" : "destructive"}>
                {asaasConnected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${metaAdsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">Meta Ads</span>
              </div>
              <Badge variant={metaAdsConnected ? "default" : "destructive"}>
                {metaAdsConnected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="financeiro" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
        </TabsList>

        {/* Relatório Financeiro */}
        <TabsContent value="financeiro" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : asaasMetrics ? formatCurrency(asaasMetrics.totalSales) : 'R$ 0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de vendas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : asaasMetrics ? formatNumber(asaasMetrics.totalPayments) : '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {isLoading ? '...' : asaasMetrics ? formatCurrency(asaasMetrics.averageTicket) : 'R$ 0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor médio por pagamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversão</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {isLoading ? '...' : asaasMetrics ? `${asaasMetrics.conversionRate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxa de conversão
                </p>
              </CardContent>
            </Card>
          </div>

          {asaasMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro Detalhado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Métricas de Vendas</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total de Vendas:</span>
                        <span className="font-medium">{formatCurrency(asaasMetrics.totalSales)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pagamentos Confirmados:</span>
                        <span className="font-medium">{formatNumber(asaasMetrics.confirmedPayments)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ticket Médio:</span>
                        <span className="font-medium">{formatCurrency(asaasMetrics.averageTicket)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxa de Conversão:</span>
                        <span className="font-medium">{asaasMetrics.conversionRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Período:</span>
                        <span className="font-medium">
                          {new Intl.DateTimeFormat('pt-BR').format(new Date(getDateRange(selectedPeriod).startDate))} - {new Intl.DateTimeFormat('pt-BR').format(new Date(getDateRange(selectedPeriod).endDate))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Relatório de Marketing */}
        <TabsContent value="marketing" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {isLoading ? '...' : formatCurrency(totalSpend)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total investido
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressões</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : formatNumber(totalImpressions)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de impressões
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cliques</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : formatNumber(totalClicks)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de cliques
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CTR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {isLoading ? '...' : `${averageCTR.toFixed(2)}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxa de cliques
                </p>
              </CardContent>
            </Card>
          </div>

          {metaAdsMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Performance dos Anúncios</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Investimento Total:</span>
                        <span className="font-medium">{formatCurrency(totalSpend)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Impressões:</span>
                        <span className="font-medium">{formatNumber(totalImpressions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cliques:</span>
                        <span className="font-medium">{formatNumber(totalClicks)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Métricas de Eficiência</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">CTR:</span>
                        <span className="font-medium">{averageCTR.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">CPC Médio:</span>
                        <span className="font-medium">
                          {totalClicks > 0 ? formatCurrency(totalSpend / totalClicks) : 'R$ 0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">CPM:</span>
                        <span className="font-medium">
                          {totalImpressions > 0 ? formatCurrency((totalSpend / totalImpressions) * 1000) : 'R$ 0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Relatório Operacional */}
        <TabsContent value="operacional" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : (asaasMetrics && totalSpend > 0) 
                    ? `${((asaasMetrics.totalSales - totalSpend) / totalSpend * 100).toFixed(1)}%`
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Retorno sobre investimento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CAC</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : (asaasMetrics && asaasMetrics.totalPayments > 0)
                    ? formatCurrency(totalSpend / asaasMetrics.totalPayments)
                    : 'R$ 0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Custo de aquisição
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LTV/CAC</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {isLoading ? '...' : (asaasMetrics && totalSpend > 0 && asaasMetrics.totalPayments > 0)
                    ? (asaasMetrics.averageTicket / (totalSpend / asaasMetrics.totalPayments)).toFixed(1)
                    : '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Relação LTV/CAC
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Operacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Eficiência de Marketing</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Investimento em Marketing:</span>
                        <span className="font-medium">
                          {isLoading ? '...' : formatCurrency(totalSpend)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Receita Gerada:</span>
                        <span className="font-medium">
                          {isLoading ? '...' : asaasMetrics ? formatCurrency(asaasMetrics.totalSales) : 'R$ 0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ROI:</span>
                        <span className="font-medium">
                          {isLoading ? '...' : (asaasMetrics && totalSpend > 0) 
                            ? `${((asaasMetrics.totalSales - totalSpend) / totalSpend * 100).toFixed(1)}%`
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Métricas de Conversão</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cliques:</span>
                        <span className="font-medium">
                          {isLoading ? '...' : formatNumber(totalClicks)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pagamentos:</span>
                        <span className="font-medium">
                          {isLoading ? '...' : asaasMetrics ? formatNumber(asaasMetrics.totalPayments) : '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxa de Conversão:</span>
                        <span className="font-medium">
                          {isLoading ? '...' : (asaasMetrics && totalClicks > 0)
                            ? `${(asaasMetrics.totalPayments / totalClicks * 100).toFixed(2)}%`
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
