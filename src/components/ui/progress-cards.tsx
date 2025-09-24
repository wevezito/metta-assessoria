"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Goals } from "@/lib/hooks/use-goals";

interface ProgressCardsProps {
  goals: Goals;
  currentRevenue: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export function ProgressCards({ goals, currentRevenue, period }: ProgressCardsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getGoalData = () => {
    switch (period) {
      case 'daily':
        return {
          current: currentRevenue,
          goal: goals.daily,
          label: 'Meta Diária',
          progress: (currentRevenue / goals.daily) * 100
        };
      case 'weekly':
        return {
          current: currentRevenue,
          goal: goals.weekly,
          label: 'Meta Semanal',
          progress: (currentRevenue / goals.weekly) * 100
        };
      case 'monthly':
        return {
          current: currentRevenue,
          goal: goals.commercial,
          label: 'Meta Comercial',
          progress: (currentRevenue / goals.commercial) * 100
        };
    }
  };

  const goalData = getGoalData();

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h4 className="text-white font-semibold">{goalData.label}</h4>
          <p className="text-gray-300 text-sm">
            {formatCurrency(goalData.current)} de {formatCurrency(goalData.goal)}
          </p>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(goalData.progress, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-end">
            <span className="text-primary font-semibold">
              {goalData.progress.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
