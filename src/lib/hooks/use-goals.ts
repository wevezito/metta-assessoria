import { useState, useEffect } from 'react';

export interface Goals {
  commercial: number; // Meta comercial mensal
  weekly: number;     // Meta semanal
  daily: number;      // Meta diária
}

interface UseGoalsReturn {
  goals: Goals;
  setGoals: (goals: Goals) => void;
  updateGoal: (type: keyof Goals, value: number) => void;
}

const defaultGoals: Goals = {
  commercial: 20000,  // R$ 20.000 por mês
  weekly: 5000,       // R$ 5.000 por semana
  daily: 666          // R$ 666 por dia
};

export function useGoals(): UseGoalsReturn {
  const [goals, setGoalsState] = useState<Goals>(defaultGoals);

  // Carregar metas do localStorage ao inicializar
  useEffect(() => {
    const savedGoals = localStorage.getItem('dashboard-goals');
    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoalsState({ ...defaultGoals, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar metas do localStorage:', error);
      }
    }
  }, []);

  // Salvar metas no localStorage sempre que mudarem
  const setGoals = (newGoals: Goals) => {
    setGoalsState(newGoals);
    localStorage.setItem('dashboard-goals', JSON.stringify(newGoals));
  };

  // Atualizar uma meta específica
  const updateGoal = (type: keyof Goals, value: number) => {
    const newGoals = { ...goals, [type]: value };
    setGoals(newGoals);
  };

  return {
    goals,
    setGoals,
    updateGoal
  };
}
