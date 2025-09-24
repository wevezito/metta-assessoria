"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailySalesData {
  date: string;
  sales: number;
}

interface DailySalesChartProps {
  data: DailySalesData[];
  loading?: boolean;
}

export function DailySalesChart({ data, loading }: DailySalesChartProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Tooltip personalizado simplificado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">
            {formatDate(label)}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-white text-sm font-semibold">
              Vendas: {formatCurrency(data.sales)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="w-1 h-6 bg-primary rounded"></div>
            Vendas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-400">Carregando dados...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se não há dados, mostrar mensagem
  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="w-1 h-6 bg-primary rounded"></div>
            Vendas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col items-center justify-center space-y-2">
            <div className="text-muted-foreground text-center">
              Nenhuma venda encontrada no Asaas para este período
            </div>
            <div className="text-sm text-gray-500 text-center">
              Os dados serão exibidos automaticamente quando houver pagamentos no Asaas
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="w-1 h-6 bg-primary rounded"></div>
          Vendas Diárias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0056e7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0056e7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={formatDate}
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: 'transparent' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#0056e7" 
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={{ fill: '#0056e7', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0056e7', strokeWidth: 2, fill: '#1f2937' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
