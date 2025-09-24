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

// Área Comercial
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  score: LeadScore;
  assignedTo?: string; // User ID
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
  nextAction?: Date;
  value?: number;
}

export type LeadSource = 'whatsapp' | 'instagram' | 'indicacao' | 'google' | 'facebook' | 'linkedin' | 'outro';
export type LeadStatus = 'qualificacao' | 'contato' | 'reuniao' | 'proposta' | 'venda' | 'perdido';
export type LeadScore = 'A' | 'B' | 'C';

export interface Sale {
  id: string;
  leadId: string;
  value: number;
  commission: number;
  sellerId: string;
  status: SaleStatus;
  closedAt: Date;
  createdAt: Date;
}

export type SaleStatus = 'pendente' | 'aprovada' | 'cancelada';

export interface SalesGoal {
  id: string;
  userId: string;
  month: number;
  year: number;
  target: number;
  achieved: number;
  type: 'leads' | 'sales' | 'value';
}

// Área Operacional
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: Plan;
  status: ClientStatus;
  contractStart: Date;
  contractEnd?: Date;
  monthsActive: number;
  assignedTeam: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  services: string[];
  duration: number; // em meses
}

export type ClientStatus = 'ativo' | 'inativo' | 'suspenso' | 'cancelado';

export interface OnboardingTask {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  category: OnboardingCategory;
}

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
export type OnboardingCategory = 'grupo' | 'briefing' | 'acessos' | 'conta_anuncio' | 'outros';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate?: Date;
  completedAt?: Date;
  timeSpent: number; // em minutos
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface TimeEntry {
  id: string;
  userId: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // em minutos
  description: string;
  isActive: boolean;
}

// Relatórios
export interface DashboardMetrics {
  totalLeads: number;
  activeLeads: number;
  monthlySales: number;
  activeClients: number;
  pendingTasks: number;
  teamProductivity: number;
}

export interface PerformanceMetrics {
  userId: string;
  userName: string;
  leadsQualified: number;
  salesClosed: number;
  totalValue: number;
  conversionRate: number;
  averageTicket: number;
  hoursWorked: number;
}

// Configurações
export interface SystemConfig {
  companyName: string;
  companyLogo?: string;
  defaultPlan: string;
  leadScoringRules: LeadScoringRule[];
  onboardingTemplates: OnboardingTemplate[];
}

export interface LeadScoringRule {
  criteria: string;
  points: number;
  condition: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<OnboardingTask, 'id' | 'clientId' | 'status' | 'assignedTo' | 'dueDate' | 'completedAt' | 'createdAt'>[];
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
