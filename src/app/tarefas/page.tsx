"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Filter
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar integração Asaas',
    description: 'Configurar webhook e testar sincronização de pagamentos',
    status: 'done',
    priority: 'high',
    assignee: 'João Silva',
    dueDate: '2024-01-15',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Criar dashboard de métricas',
    description: 'Desenvolver dashboard com KPIs principais',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Maria Santos',
    dueDate: '2024-01-20',
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Revisar contratos pendentes',
    description: 'Analisar e aprovar contratos em análise',
    status: 'todo',
    priority: 'low',
    assignee: 'Pedro Costa',
    dueDate: '2024-01-25',
    createdAt: '2024-01-14'
  }
];

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'A Fazer';
      case 'in-progress': return 'Em Progresso';
      case 'done': return 'Concluído';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <CheckSquare className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'done': return <AlertCircle className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>
          <p className="text-gray-600">Kanban de tarefas e controle de produtividade</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Adicione uma nova tarefa ao sistema
              </DialogDescription>
            </DialogHeader>
            <CreateTaskForm onSubmit={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Label htmlFor="status-filter">Status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="priority-filter">Prioridade:</Label>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* A Fazer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">A Fazer</h3>
            <Badge variant="secondary">
              {filteredTasks.filter(task => task.status === 'todo').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {filteredTasks.filter(task => task.status === 'todo').map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
                getStatusIcon={getStatusIcon}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>

        {/* Em Progresso */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Em Progresso</h3>
            <Badge variant="secondary">
              {filteredTasks.filter(task => task.status === 'in-progress').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {filteredTasks.filter(task => task.status === 'in-progress').map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
                getStatusIcon={getStatusIcon}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>

        {/* Concluído */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Concluído</h3>
            <Badge variant="secondary">
              {filteredTasks.filter(task => task.status === 'done').length}
            </Badge>
          </div>
          <div className="space-y-3">
            {filteredTasks.filter(task => task.status === 'done').map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
                getStatusIcon={getStatusIcon}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente do Card de Tarefa
function TaskCard({ 
  task, 
  onStatusChange,
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getPriorityLabel,
  getStatusIcon,
  formatDate
}: {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatDate: (date: string) => string;
}) {
  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    switch (currentStatus) {
      case 'todo': return 'in-progress';
      case 'in-progress': return 'done';
      case 'done': return 'todo';
      default: return 'todo';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getPriorityColor(task.priority)}>
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-3">
            {task.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {task.assignee}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Vence: {formatDate(task.dueDate)}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
              className="text-xs"
            >
              {getNextStatus(task.status) === 'in-progress' && 'Iniciar'}
              {getNextStatus(task.status) === 'done' && 'Concluir'}
              {getNextStatus(task.status) === 'todo' && 'Reabrir'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para criar tarefa
function CreateTaskForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignee: '',
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para criar a tarefa
    console.log('Criando tarefa:', formData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Título da tarefa"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição da tarefa"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="assignee">Responsável</Label>
          <Input
            id="assignee"
            value={formData.assignee}
            onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
            placeholder="Nome do responsável"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="dueDate">Data de Vencimento</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>
      
      <Button type="submit" className="w-full">
        Criar Tarefa
      </Button>
    </form>
  );
}