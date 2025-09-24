// Tipos principais do sistema
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hash da senha
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
  permissions: Permission[];
  lastLogin?: Date;
}

export type UserRole = 'admin' | 'manager' | 'sdr' | 'closer' | 'designer' | 'copywriter' | 'traffic_manager';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string; // 'leads', 'clients', 'tasks', etc.
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Tipos para leads e vendas
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: LeadStatus;
  origin: LeadOrigin;
  score: LeadScore;
  assignedTo?: string;
  createdAt: Date;
  lastContact?: Date;
  notes?: string;
  value?: number;
}

export type LeadStatus = 'qualificacao' | 'contato' | 'reuniao' | 'proposta' | 'fechado' | 'perdido';
export type LeadOrigin = 'whatsapp' | 'instagram' | 'referral' | 'google' | 'outros';
export type LeadScore = 'A' | 'B' | 'C';

// Tipos para tarefas
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  clientId?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type TaskStatus = 'backlog' | 'em_andamento' | 'revisao' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';

// Tipos para clientes
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  contractStatus: ContractStatus;
  activeMonths: number;
  monthlyValue: number;
  createdAt: Date;
  lastContact?: Date;
  notes?: string;
}

export type ContractStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado';

// Tipos para métricas
export interface DashboardMetrics {
  activeLeads: number;
  monthlySales: string;
  activeClients: number;
  pendingTasks: number;
}

export interface PerformanceMetrics {
  userId: string;
  leadsQualified: number;
  meetingsScheduled: number;
  dealsClosed: number;
  revenue: number;
  tasksCompleted: number;
  hoursWorked: number;
}

// Sistema de permissões
export const USER_PERMISSIONS: Record<string, Permission[]> = {
  // Admin - Acesso total
  admin: [
    { id: '1', name: 'Gerenciar Usuários', description: 'Criar, editar e remover usuários', resource: 'users', action: 'manage' },
    { id: '2', name: 'Gerenciar Sistema', description: 'Configurações gerais do sistema', resource: 'system', action: 'manage' },
    { id: '3', name: 'Acesso Total', description: 'Acesso a todas as funcionalidades', resource: '*', action: 'manage' }
  ],
  // Manager - Acesso amplo
  manager: [
    { id: '4', name: 'Visualizar Relatórios', description: 'Acesso a todos os relatórios', resource: 'reports', action: 'read' },
    { id: '5', name: 'Gerenciar Equipe', description: 'Visualizar performance da equipe', resource: 'team', action: 'read' },
    { id: '6', name: 'Gestão de Clientes', description: 'Gerenciar clientes e contratos', resource: 'clients', action: 'manage' }
  ],
  // SDR - Foco em leads
  sdr: [
    { id: '7', name: 'Gerenciar Leads', description: 'Criar e qualificar leads', resource: 'leads', action: 'manage' },
    { id: '8', name: 'Dashboard Pessoal', description: 'Visualizar métricas pessoais', resource: 'personal', action: 'read' }
  ],
  // Closer - Foco em vendas
  closer: [
    { id: '9', name: 'Gerenciar Vendas', description: 'Acompanhar e fechar vendas', resource: 'sales', action: 'manage' },
    { id: '10', name: 'Dashboard Pessoal', description: 'Visualizar métricas pessoais', resource: 'personal', action: 'read' }
  ],
  // Designer - Foco em tarefas
  designer: [
    { id: '11', name: 'Gerenciar Tarefas', description: 'Visualizar e atualizar tarefas', resource: 'tasks', action: 'update' },
    { id: '12', name: 'Dashboard Pessoal', description: 'Visualizar métricas pessoais', resource: 'personal', action: 'read' }
  ],
  // Traffic Manager - Foco em campanhas
  traffic_manager: [
    { id: '13', name: 'Gerenciar Campanhas', description: 'Acompanhar performance de campanhas', resource: 'campaigns', action: 'manage' },
    { id: '14', name: 'Dashboard Pessoal', description: 'Visualizar métricas pessoais', resource: 'personal', action: 'read' }
  ]
};
