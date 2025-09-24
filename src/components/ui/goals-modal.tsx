"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { Goals } from "@/lib/hooks/use-goals";

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goals;
  onSave: (goals: Goals) => void;
}

export function GoalsModal({ isOpen, onClose, goals, onSave }: GoalsModalProps) {
  const [formGoals, setFormGoals] = useState<Goals>(goals);

  const handleSave = () => {
    onSave(formGoals);
    onClose();
  };

  const handleInputChange = (type: keyof Goals, value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    setFormGoals(prev => ({ ...prev, [type]: numericValue }));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatInputValue = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5" />
            Editar Metas
          </DialogTitle>
          <DialogDescription>
            Defina suas metas financeiras para acompanhar o desempenho
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meta Comercial */}
          <div className="space-y-2">
            <Label htmlFor="commercial">Meta Comercial (Mensal)</Label>
            <Input
              id="commercial"
              value={formatInputValue(formGoals.commercial)}
              onChange={(e) => handleInputChange('commercial', e.target.value)}
              className="text-white bg-gray-800 border-gray-600"
            />
            <p className="text-sm text-gray-400">
              Atual: {formatCurrency(goals.commercial)}
            </p>
          </div>

          {/* Meta Semanal */}
          <div className="space-y-2">
            <Label htmlFor="weekly">Meta Semanal</Label>
            <Input
              id="weekly"
              value={formatInputValue(formGoals.weekly)}
              onChange={(e) => handleInputChange('weekly', e.target.value)}
              className="text-white bg-gray-800 border-gray-600"
            />
            <p className="text-sm text-gray-400">
              Atual: {formatCurrency(goals.weekly)}
            </p>
          </div>

          {/* Meta Diária */}
          <div className="space-y-2">
            <Label htmlFor="daily">Meta Diária</Label>
            <Input
              id="daily"
              value={formatInputValue(formGoals.daily)}
              onChange={(e) => handleInputChange('daily', e.target.value)}
              className="text-white bg-gray-800 border-gray-600"
            />
            <p className="text-sm text-gray-400">
              Atual: {formatCurrency(goals.daily)}
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
