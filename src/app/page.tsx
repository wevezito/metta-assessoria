"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Target,
  Settings
} from "lucide-react";
import { useAsaas } from "@/lib/hooks/use-asaas";
import { useMetaAds } from "@/lib/hooks/use-meta-ads";
import { useGoals, Goals } from "@/lib/hooks/use-goals";
import { GoalsModal } from "@/components/ui/goals-modal";
import { ProgressCards } from "@/components/ui/progress-cards";
import { DailySalesChart } from "@/components/ui/daily-sales-chart";

export default function Dashboard() {
  // Estados locais
  const [selectedPeriod, setSelectedPeriod] = useState<string>("mes");
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [dailySalesData, setDailySalesData] = useState<Array<{date: string, sales: number}>>([]);
  const [dailySalesLoading, setDailySalesLoading] = useState<boolean>(false);

  // Hooks
  const {
    connected: asaasConnected,
    loading: asaasLoading,
    metrics: asaasMetrics,
    fetchMetrics,
    fetchAsaasMetrics,
    fetchDailySales,
    testConnection: testAsaasConnection
  } = useAsaas();

  const {
    connected: metaAdsConnected,
    loading: metaAdsLoading,
    totalSpend: metaAdsSpend,
    fetchAccountMetrics: fetchMetaAdsMetrics
  } = useMetaAds();

  const { goals, setGoals } = useGoals();


  // Função para calcular datas baseado no período selecionado
  const getDateRange = (period: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case "hoje":
        start = new Date(today);
        end = new Date(today);
        break;
      case "semana":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Domingo
        end = new Date(today);
        end.setDate(today.getDate() - today.getDay() + 6); // Sábado
        break;
      case "mes":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "trimestre":
        const currentMonth = today.getMonth();
        const startMonth = Math.floor(currentMonth / 3) * 3;
        start = new Date(today.getFullYear(), startMonth, 1);
        end = new Date(today.getFullYear(), startMonth + 3, 0);
        break;
      case "ano":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  // Buscar dados quando o período mudar
  useEffect(() => {
    const { startDate, endDate } = getDateRange(selectedPeriod);
    fetchMetrics(startDate, endDate);
    fetchMetaAdsMetrics(startDate, endDate);
  }, [selectedPeriod, fetchMetrics, fetchMetaAdsMetrics]);

  // Buscar dados diários, semanais e mensais separadamente
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Buscar dados do dia atual
    fetchAsaasMetrics(todayStr, todayStr).then((result) => {
      if (result && result.totalSales) {
        setDailyRevenue(result.totalSales);
      }
    });

    // Buscar dados da semana atual (domingo até hoje)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
    const endOfWeek = new Date(today); // Hoje
    
    const startWeekStr = startOfWeek.toISOString().split('T')[0];
    const endWeekStr = endOfWeek.toISOString().split('T')[0];
    
    fetchAsaasMetrics(startWeekStr, endWeekStr).then((result) => {
      if (result && result.totalSales) {
        setWeeklyRevenue(result.totalSales);
      }
    });

    // Buscar dados do mês atual (1º dia do mês até hoje)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today); // Hoje
    
    const startMonthStr = startOfMonth.toISOString().split('T')[0];
    const endMonthStr = endOfMonth.toISOString().split('T')[0];
    
    fetchAsaasMetrics(startMonthStr, endMonthStr).then((result) => {
      if (result && result.totalSales) {
        setMonthlyRevenue(result.totalSales);
      }
    });
  }, [fetchAsaasMetrics]);

  // Buscar dados diários do mês atual para o gráfico
  useEffect(() => {
    const fetchCurrentMonthDailySales = async () => {
      setDailySalesLoading(true);
      try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // getMonth() retorna 0-11
        
        console.log(`Buscando dados para ${currentYear}-${currentMonth}`);
        const data = await fetchDailySales(currentYear, currentMonth);
        
        if (data && data.length > 0) {
          console.log('✅ Dados reais encontrados:', data.length, 'dias com vendas');
          setDailySalesData(data);
        } else {
          console.log('📊 Nenhuma venda encontrada no Asaas para este período');
          setDailySalesData([]);
        }
      } catch (error) {
        console.error('Erro ao buscar vendas diárias:', error);
        setDailySalesData([]);
      } finally {
        setDailySalesLoading(false);
      }
    };

    fetchCurrentMonthDailySales();
  }, [fetchDailySales]);


  // Calcular métricas baseadas no período selecionado
  const getMetrics = () => {
    if (!asaasMetrics || asaasLoading) {
      return {
        totalSales: 0,
        totalPayments: 0,
        averageTicket: 0,
        conversionRate: 0
      };
    }

    return {
      totalSales: asaasMetrics.totalSales,
      totalPayments: asaasMetrics.confirmedPayments,
      averageTicket: asaasMetrics.averageTicket,
      conversionRate: asaasMetrics.conversionRate
    };
  };

  const metrics = getMetrics();

  // Calcular ROAS (Return on Ad Spend)
  const calculateROAS = () => {
    if (!metaAdsSpend || metaAdsSpend === 0) return 0;
    return metrics.totalSales / metaAdsSpend;
  };

  const roas = calculateROAS();

  // Função para salvar metas
  const handleSaveGoals = (newGoals: Goals) => {
    setGoals(newGoals);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral das métricas e performance do negócio
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Seletor de Período */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Mês Atual</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Ano Atual</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Editar Metas */}
          <Button
            variant="outline"
            onClick={() => setIsGoalsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Editar Metas
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {asaasLoading ? '...' : metrics.totalSales.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Vendas do período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {asaasLoading ? '...' : metrics.totalPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamentos confirmados no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações adicionais do Asaas */}
      {asaasConnected && asaasMetrics && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Ticket Médio</div>
                <div className="text-xl font-bold text-white">
                  {metrics.averageTicket.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Valor Gasto em Anúncios</div>
                <div className="text-xl font-bold text-white">
                  {metaAdsLoading ? '...' : (metaAdsSpend || 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">ROAS</div>
                <div className="text-xl font-bold text-white">
                  {metaAdsLoading ? '...' : `${roas.toFixed(2)}x`}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Barras de Progresso das Metas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Progresso das Metas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressCards 
            goals={goals} 
            currentRevenue={dailyRevenue} 
            period="daily" 
          />
          <ProgressCards 
            goals={goals} 
            currentRevenue={weeklyRevenue} 
            period="weekly" 
          />
          <ProgressCards 
            goals={goals} 
            currentRevenue={monthlyRevenue} 
            period="monthly" 
          />
        </div>
      </div>

      {/* Gráfico de Vendas Diárias */}
      <div className="space-y-4">
        <DailySalesChart 
          data={dailySalesData} 
          loading={dailySalesLoading} 
        />
      </div>

      {/* Modal de Editar Metas */}
      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        goals={goals}
        onSave={handleSaveGoals}
      />
    </div>
  );
}

