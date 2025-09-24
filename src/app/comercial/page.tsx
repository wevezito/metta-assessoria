"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, DollarSign, Target, BarChart3, Calendar, Zap, Settings } from "lucide-react";
import Link from "next/link";
import { useMetaAds } from "@/lib/hooks/use-meta-ads";
import { useAsaas } from "@/lib/hooks/use-asaas";

export default function ComercialPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("mes");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  
  const {
    campaigns,
    loading: metaAdsLoading,
    error: metaAdsError,
    fetchAccountMetrics,
    fetchCampaigns,
    fetchRealtimeMetrics,
    syncData: syncMetaAdsData,
    totalSpend,
    totalLeads,
    averageCPC,
    averageCPM,
    averageCTR,
    totalImpressions,
    totalClicks,
    campaignCount
  } = useMetaAds();

  // Hook do Asaas
  const {
    loading: asaasLoading,
    error: asaasError,
    metrics: asaasMetrics,
    lastSync: asaasLastSync,
    fetchMetrics: fetchAsaasMetrics,
    fetchFinancialSummary: fetchAsaasFinancialSummary
  } = useAsaas();

  // Função para aplicar período personalizado
  const applyCustomPeriod = () => {
    if (customStartDate && customEndDate) {
      console.log(`📅 Aplicando período personalizado: ${customStartDate} até ${customEndDate}`);
      fetchDataForPeriod(customStartDate, customEndDate);
    }
  };

  // Função para limpar período personalizado
  const clearCustomPeriod = () => {
    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedPeriod("mes");
  };

  // Função para validar datas
  const validateDates = () => {
    if (!customStartDate || !customEndDate) return false;
    
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const now = new Date();
    
    // Não permitir datas futuras
    if (start > now || end > now) return false;
    
    // Data inicial deve ser menor que final
    if (start >= end) return false;
    
    return true;
  };

  // Inicializar datas personalizadas com valores padrão
  useEffect(() => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  }, []);

  // Função para buscar dados baseada no período atual
  const fetchDataForPeriod = (startDate: string, endDate: string) => {
    console.log(`🔄 Buscando dados para o período: ${startDate} até ${endDate}`);
    fetchAccountMetrics(startDate, endDate);
    fetchCampaigns();
    fetchRealtimeMetrics();
    fetchAsaasMetrics(startDate, endDate);
    fetchAsaasFinancialSummary(startDate, endDate);
  };

  // Buscar dados ao montar o componente
  useEffect(() => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    fetchDataForPeriod(startDate, endDate);
  }, []);

  // Buscar dados quando o período mudar
  useEffect(() => {
    if (selectedPeriod && selectedPeriod !== 'personalizado') {
      const endDate = new Date().toISOString().split('T')[0];
      let startDate: string;
      
      switch (selectedPeriod) {
        case 'dia':
          startDate = endDate;
          break;
        case 'semana':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'mes':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        default:
          return;
      }
      
      console.log(`📅 Período alterado para: ${selectedPeriod} (${startDate} até ${endDate})`);
      fetchDataForPeriod(startDate, endDate);
    }
  }, [selectedPeriod]);



  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Área Comercial</h1>
              <p className="text-gray-600">Gestão de vendas, leads e performance comercial</p>
            </div>
            <Link href="/conexoes">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Gerenciar Conexões
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtros de Data */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label htmlFor="period" className="text-sm font-medium">Período:</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Dia</SelectItem>
                  <SelectItem value="semana">Semana</SelectItem>
                  <SelectItem value="mes">Mês</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPeriod("personalizado")}
              className={selectedPeriod === "personalizado" ? "bg-blue-50 border-blue-300" : ""}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Período
            </Button>
          </div>

          {/* Filtros de Data Personalizados */}
          {selectedPeriod === "personalizado" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">De:</Label>
                  <input
                    type="date"
                    id="startDate"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-gray-500">até</div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">Até:</Label>
                  <input
                    type="date"
                    id="endDate"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <Button 
                  size="sm"
                  onClick={applyCustomPeriod}
                  disabled={!validateDates()}
                >
                  Aplicar
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={clearCustomPeriod}
                >
                  Limpar
                </Button>
              </div>
              
              {/* Mensagens de validação */}
              {customStartDate && customEndDate && !validateDates() && (
                <div className="mt-2 text-sm text-red-600">
                  {(() => {
                    const start = new Date(customStartDate);
                    const end = new Date(customEndDate);
                    const now = new Date();
                    
                    if (start > now || end > now) {
                      return "❌ Datas não podem ser futuras";
                    }
                    if (start >= end) {
                      return "❌ Data inicial deve ser menor que a data final";
                    }
                    return "";
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navegação Principal */}
        <Tabs defaultValue="crm" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="faturamento" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Faturamento
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="metas" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas
            </TabsTrigger>
          </TabsList>

          {/* CRM - Página separada */}
          <TabsContent value="crm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>CRM - Gestão de Leads</span>
                  <Link href="/comercial/crm">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Acessar CRM
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>
                  Sistema de gestão de leads com Kanban e qualificação automática por faturamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-red-500">Desqualificados</div>
                    <div className="text-xs text-gray-500">Faturamento até 20k</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm text-blue-500">MQL (Qualificados)</div>
                    <div className="text-xs text-gray-500">Faturamento acima de 20k</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1</div>
                    <div className="text-sm text-green-500">Reuniões Marcadas</div>
                    <div className="text-xs text-gray-500">Leads em fase de reunião</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faturamento */}
          <TabsContent value="faturamento" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Faturamento - Dados Reais do Asaas
                </CardTitle>
                <CardDescription>
                  Dados de vendas e faturamento em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                {asaasLoading ? (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    <p className="text-gray-500">Carregando dados do Asaas...</p>
                  </div>
                ) : asaasError ? (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 mx-auto mb-4 text-red-400 border-2 border-red-300 border-t-red-600 rounded-full"></div>
                    <p className="text-red-500 mb-4">Erro ao carregar dados: {asaasError}</p>
                    <Button onClick={() => {
                      if (customStartDate && customEndDate) {
                        fetchAsaasMetrics(customStartDate, customEndDate);
                      }
                    }} variant="outline">
                      Tentar Novamente
                    </Button>
                  </div>
                ) : asaasMetrics ? (
                  <>
                    {/* Métricas Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Total de Vendas</div>
                        <div className="text-2xl font-bold text-green-600">
                          R$ {asaasMetrics.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">Período selecionado</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Total de Pagamentos</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {asaasMetrics.totalPayments}
                        </div>
                        <div className="text-xs text-gray-500">Todos os status</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Pagamentos Confirmados</div>
                        <div className="text-2xl font-bold text-green-600">
                          {asaasMetrics.confirmedPayments}
                        </div>
                        <div className="text-xs text-gray-500">Recebidos e confirmados</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Ticket Médio</div>
                        <div className="text-2xl font-bold text-purple-600">
                          R$ {asaasMetrics.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">Baseado em vendas confirmadas</div>
                      </div>
                    </div>
                    
                    {/* Métricas Secundárias */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          R$ {asaasMetrics.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-green-500">Receita Total</div>
                        <div className="text-xs text-gray-500">Vendas confirmadas</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {asaasMetrics.conversionRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-blue-500">Taxa de Conversão</div>
                        <div className="text-xs text-gray-500">Pagamentos confirmados</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {asaasMetrics.pendingPayments + asaasMetrics.overduePayments}
                        </div>
                        <div className="text-sm text-orange-500">Pendentes + Vencidos</div>
                        <div className="text-xs text-gray-500">Aguardando pagamento</div>
                      </div>
                    </div>

                    {/* Status dos Pagamentos */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Status dos Pagamentos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{asaasMetrics.confirmedPayments}</div>
                          <div className="text-xs text-green-600">Confirmados</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-lg font-bold text-yellow-600">{asaasMetrics.pendingPayments}</div>
                          <div className="text-xs text-yellow-600">Pendentes</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">{asaasMetrics.overduePayments}</div>
                          <div className="text-xs text-red-600">Vencidos</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-600">{asaasMetrics.cancelledPayments}</div>
                          <div className="text-xs text-gray-600">Cancelados</div>
                        </div>
                      </div>
                    </div>

                    {/* Última Sincronização */}
                    {asaasLastSync && (
                      <div className="mt-4 text-center text-xs text-gray-500">
                        Última sincronização: {new Date(asaasLastSync).toLocaleString('pt-BR')}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Nenhum dado disponível</p>
                    <p className="text-xs text-gray-400">Configure o período e sincronize os dados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance de Anúncios */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance de Anúncios</CardTitle>
                <CardDescription>
                  Métricas de campanhas Meta Ads para marketing interno
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metaAdsLoading ? (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    <p className="text-gray-500">Carregando dados do Meta Ads...</p>
                  </div>
                ) : metaAdsError ? (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 mx-auto mb-4 text-red-400 border-2 border-red-300 border-t-red-600 rounded-full"></div>
                    <p className="text-red-500 mb-4">Erro ao carregar dados: {metaAdsError}</p>
                    <Button onClick={syncMetaAdsData} variant="outline">
                      Tentar Novamente
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          R$ {totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-purple-500">Total Investido</div>
                        <div className="text-xs text-gray-500">Meta Ads</div>
                      </div>

                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
                        <div className="text-sm text-blue-500">Total de Leads</div>
                        <div className="text-xs text-gray-500">Gerados via tráfego pago</div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          R$ {averageCPC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-green-500">CPC Médio</div>
                        <div className="text-xs text-gray-500">Custo por clique</div>
                      </div>
                    </div>

                    {/* Métricas adicionais */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          R$ {averageCPM.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-yellow-500">CPM Médio</div>
                        <div className="text-xs text-gray-500">Custo por mil impressões</div>
                      </div>

                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                          {averageCTR.toFixed(2)}%
                        </div>
                        <div className="text-sm text-indigo-500">CTR Médio</div>
                        <div className="text-xs text-gray-500">Taxa de clique</div>
                      </div>

                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">
                          {totalSpend > 0 && totalLeads > 0
                            ? `R$ ${(totalSpend / totalLeads).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : 'R$ 0,00'
                          }
                        </div>
                        <div className="text-sm text-pink-500">Investimento por Lead</div>
                        <div className="text-xs text-gray-500">CAC</div>
                      </div>
                    </div>

                    {/* Métricas de volume */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-teal-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-600">
                          {totalImpressions.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-sm text-teal-500">Total de Impressões</div>
                      </div>

                      <div className="text-center p-4 bg-cyan-50 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-600">
                          {totalClicks.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-sm text-cyan-500">Total de Cliques</div>
                      </div>

                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">
                          {campaignCount}
                        </div>
                        <div className="text-sm text-amber-500">Campanhas Ativas</div>
                      </div>
                    </div>

                    {/* Lista de campanhas */}
                    {campaigns.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Campanhas Ativas</h4>
                        <div className="space-y-2">
                          {campaigns.map(campaign => (
                            <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-sm text-gray-500">{campaign.objective}</div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div>
                                  <div className="font-medium">R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                  <div className="text-gray-500">Investido</div>
                                </div>
                                <div>
                                  <div className="font-medium">{campaign.leads}</div>
                                  <div className="text-gray-500">Leads</div>
                                </div>
                                <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                  {campaign.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meta Comercial */}
          <TabsContent value="metas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Meta Comercial</span>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Editar Metas
                  </Button>
                </CardTitle>
                <CardDescription>
                  Acompanhe metas e performance da equipe comercial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
                    <div className="text-sm text-blue-500">Total de Leads</div>
                    <div className="text-xs text-gray-500">Via Meta Ads</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">75</div>
                    <div className="text-sm text-green-500">Leads Qualificados</div>
                    <div className="text-xs text-gray-500">Faturamento &gt; 20k</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-purple-500">Reuniões Marcadas</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Metas da Equipe</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Meta Closer</div>
                      <div className="text-lg font-bold text-gray-900">R$ 50.000/mês</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Meta SDR</div>
                      <div className="text-lg font-bold text-gray-900">30 leads/mês</div>
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
