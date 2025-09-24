"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Filter, 
  Users, 
  Phone, 
  Mail, 
  Building, 
  Edit, 
  Trash2,
  ArrowLeft,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { mockUsers } from "@/lib/mock-data";

// Tipos para o CRM
interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'desqualificado' | 'mql' | 'contato' | 'reuniao';
  origin: 'whatsapp' | 'instagram' | 'referral' | 'google' | 'outros';
  revenue: number; // Faturamento em milhares
  assignedTo?: string;
  createdAt: Date;
  lastContact?: Date;
  notes?: string;
}

// Dados mock para o CRM
const mockCRMLeads: CRMLead[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '(11) 99999-9999',
    company: 'Empresa ABC',
    status: 'mql',
    origin: 'whatsapp',
    revenue: 45,
    assignedTo: '1',
    createdAt: new Date('2024-01-15'),
    lastContact: new Date('2024-01-20'),
    notes: 'Interessado em marketing digital'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@startup.com',
    phone: '(11) 88888-8888',
    company: 'Startup XYZ',
    status: 'contato',
    origin: 'instagram',
    revenue: 120,
    assignedTo: '2',
    createdAt: new Date('2024-01-10'),
    lastContact: new Date('2024-01-22'),
    notes: 'Precisa de estratégia de crescimento'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@consultoria.com',
    phone: '(11) 77777-7777',
    company: 'Consultoria DEF',
    status: 'reuniao',
    origin: 'referral',
    revenue: 80,
    assignedTo: '1',
    createdAt: new Date('2024-01-05'),
    lastContact: new Date('2024-01-23'),
    notes: 'Reunião agendada para próxima semana'
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@pequena.com',
    phone: '(11) 66666-6666',
    company: 'Pequena Empresa',
    status: 'desqualificado',
    origin: 'google',
    revenue: 15,
    createdAt: new Date('2024-01-18'),
    notes: 'Faturamento abaixo do mínimo'
  }
];

export default function CRMPage() {
  const [leads, setLeads] = useState<CRMLead[]>(mockCRMLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("todas");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesOrigin = !selectedOrigin || selectedOrigin === 'todas' || lead.origin === selectedOrigin;
    
    return matchesSearch && matchesOrigin;
  });

  // Agrupar leads por status
  const leadsByStatus = {
    desqualificado: filteredLeads.filter(lead => lead.status === 'desqualificado'),
    mql: filteredLeads.filter(lead => lead.status === 'mql'),
    contato: filteredLeads.filter(lead => lead.status === 'contato'),
    reuniao: filteredLeads.filter(lead => lead.status === 'reuniao'),
  };

  // Funções para gerenciar leads
  const createLead = (leadData: Partial<CRMLead>) => {
    const revenue = leadData.revenue || 0;
    let status: CRMLead['status'] = 'desqualificado';
    
    // Qualificação automática por faturamento
    if (revenue > 20) {
      status = 'mql';
    }

    const newLead: CRMLead = {
      id: Date.now().toString(),
      name: leadData.name || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      company: leadData.company || '',
      status,
      origin: leadData.origin || 'outros',
      revenue,
      assignedTo: leadData.assignedTo,
      createdAt: new Date(),
      notes: leadData.notes || '',
    };
    setLeads(prev => [...prev, newLead]);
    setIsCreateDialogOpen(false);
  };

  const updateLead = (leadId: string, updates: Partial<CRMLead>) => {
    setLeads(prev => prev.map(lead =>
      lead.id === leadId
        ? { ...lead, ...updates }
        : lead
    ));
    setIsEditDialogOpen(false);
    setSelectedLead(null);
  };

  const deleteLead = (leadId: string) => {
    if (confirm('Tem certeza que deseja deletar este lead?')) {
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
    }
  };

  const moveLead = (leadId: string, newStatus: CRMLead['status']) => {
    setLeads(prev => prev.map(lead =>
      lead.id === leadId
        ? { ...lead, status: newStatus }
        : lead
    ));
  };

  // Funções auxiliares
  const getStatusColor = (status: CRMLead['status']) => {
    switch (status) {
      case 'desqualificado': return 'bg-red-100 text-red-800';
      case 'mql': return 'bg-blue-100 text-blue-800';
      case 'contato': return 'bg-yellow-100 text-yellow-800';
      case 'reuniao': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: CRMLead['status']) => {
    switch (status) {
      case 'desqualificado': return 'Desqualificado';
      case 'mql': return 'MQL (Qualificado)';
      case 'contato': return 'Em Contato';
      case 'reuniao': return 'Reunião';
      default: return status;
    }
  };

  const getOriginLabel = (origin: CRMLead['origin']) => {
    switch (origin) {
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'referral': return 'Indicação';
      case 'google': return 'Google';
      case 'outros': return 'Outros';
      default: return origin;
    }
  };

  const getRevenueLabel = (revenue: number) => {
    if (revenue <= 20) return 'Até 20k';
    if (revenue <= 40) return '20k-40k';
    if (revenue <= 60) return '40k-60k';
    if (revenue <= 80) return '60k-80k';
    if (revenue <= 100) return '80k-100k';
    if (revenue <= 150) return '100k-150k';
    if (revenue <= 250) return '150k-250k';
    if (revenue <= 500) return '250k-500k';
    if (revenue <= 1000) return '500k-1M';
    return 'Acima de 1M';
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Não atribuído';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/comercial">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRM - Gestão de Leads</h1>
              <p className="text-gray-600">Sistema de qualificação automática por faturamento</p>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Lead</DialogTitle>
                <DialogDescription>
                  Adicione um novo lead ao CRM
                </DialogDescription>
              </DialogHeader>
              <CreateLeadForm onSubmit={createLead} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="origin">Origem</Label>
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as origens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as origens</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="referral">Indicação</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedOrigin("todas");
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desqualificados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-700">Desqualificados</h3>
              <Badge variant="secondary">{leadsByStatus.desqualificado.length}</Badge>
            </div>
            <div className="space-y-3">
              {leadsByStatus.desqualificado.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={() => {
                    setSelectedLead(lead);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={() => deleteLead(lead.id)}
                  onMove={(newStatus) => moveLead(lead.id, newStatus)}
                  getUserName={getUserName}
                  getStatusColor={getStatusColor}
                  getOriginLabel={getOriginLabel}
                  getStatusLabel={getStatusLabel}
                  getRevenueLabel={getRevenueLabel}
                />
              ))}
            </div>
          </div>

          {/* MQL (Qualificados) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-700">MQL (Qualificados)</h3>
              <Badge variant="secondary">{leadsByStatus.mql.length}</Badge>
            </div>
            <div className="space-y-3">
              {leadsByStatus.mql.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={() => {
                    setSelectedLead(lead);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={() => deleteLead(lead.id)}
                  onMove={(newStatus) => moveLead(lead.id, newStatus)}
                  getUserName={getUserName}
                  getStatusColor={getStatusColor}
                  getOriginLabel={getOriginLabel}
                  getStatusLabel={getStatusLabel}
                  getRevenueLabel={getRevenueLabel}
                />
              ))}
            </div>
          </div>

          {/* Em Contato */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-yellow-700">Em Contato</h3>
              <Badge variant="secondary">{leadsByStatus.contato.length}</Badge>
            </div>
            <div className="space-y-3">
              {leadsByStatus.contato.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={() => {
                    setSelectedLead(lead);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={() => deleteLead(lead.id)}
                  onMove={(newStatus) => moveLead(lead.id, newStatus)}
                  getUserName={getUserName}
                  getStatusColor={getStatusColor}
                  getOriginLabel={getOriginLabel}
                  getStatusLabel={getStatusLabel}
                  getRevenueLabel={getRevenueLabel}
                />
              ))}
            </div>
          </div>

          {/* Reunião */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-700">Reunião</h3>
              <Badge variant="secondary">{leadsByStatus.reuniao.length}</Badge>
            </div>
            <div className="space-y-3">
              {leadsByStatus.reuniao.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={() => {
                    setSelectedLead(lead);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={() => deleteLead(lead.id)}
                  onMove={(newStatus) => moveLead(lead.id, newStatus)}
                  getUserName={getUserName}
                  getStatusColor={getStatusColor}
                  getOriginLabel={getOriginLabel}
                  getStatusLabel={getStatusLabel}
                  getRevenueLabel={getRevenueLabel}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do lead
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <EditLeadForm
              lead={selectedLead}
              onSubmit={(updates) => updateLead(selectedLead.id, updates)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente LeadCard
function LeadCard({ 
  lead, 
  onEdit, 
  onDelete, 
  onMove, 
  getUserName, 
  getStatusColor, 
  getOriginLabel,
  getStatusLabel,
  getRevenueLabel
}: {
  lead: CRMLead;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: CRMLead['status']) => void;
  getUserName: (id: string) => string;
  getStatusColor: (status: CRMLead['status']) => string;
  getOriginLabel: (origin: CRMLead['origin']) => string;
  getStatusLabel: (status: CRMLead['status']) => string;
  getRevenueLabel: (revenue: number) => string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {lead.name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(lead.status)}>
                {getStatusLabel(lead.status)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getOriginLabel(lead.origin)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-500">
            <Mail className="h-3 w-3 mr-1" />
            {lead.email}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Phone className="h-3 w-3 mr-1" />
            {lead.phone}
          </div>
          
          {lead.company && (
            <div className="flex items-center text-xs text-gray-500">
              <Building className="h-3 w-3 mr-1" />
              {lead.company}
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            {getRevenueLabel(lead.revenue)}
          </div>
          
          {lead.assignedTo && (
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              {getUserName(lead.assignedTo)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Formulário de Criação de Lead
function CreateLeadForm({ onSubmit }: { onSubmit: (data: Partial<CRMLead>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    origin: 'outros' as CRMLead['origin'],
    revenue: '',
    assignedTo: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      revenue: formData.revenue ? parseInt(formData.revenue) : 0,
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      origin: 'outros',
      revenue: '',
      assignedTo: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome Completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="company">Empresa</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="origin">Origem</Label>
          <Select value={formData.origin} onValueChange={(value) => setFormData(prev => ({ ...prev, origin: value as CRMLead['origin'] }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="referral">Indicação</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="revenue">Faturamento (milhares)</Label>
          <Select value={formData.revenue} onValueChange={(value) => setFormData(prev => ({ ...prev, revenue: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Até 20k</SelectItem>
              <SelectItem value="30">20k-40k</SelectItem>
              <SelectItem value="50">40k-60k</SelectItem>
              <SelectItem value="70">60k-80k</SelectItem>
              <SelectItem value="90">80k-100k</SelectItem>
              <SelectItem value="125">100k-150k</SelectItem>
              <SelectItem value="200">150k-250k</SelectItem>
              <SelectItem value="375">250k-500k</SelectItem>
              <SelectItem value="750">500k-1M</SelectItem>
              <SelectItem value="1500">Acima de 1M</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="assignedTo">Responsável</Label>
        <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent>
            {mockUsers.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full">
        Criar Lead
      </Button>
    </form>
  );
}

// Formulário de Edição de Lead
function EditLeadForm({ lead, onSubmit }: { lead: CRMLead; onSubmit: (data: Partial<CRMLead>) => void }) {
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company || '',
    origin: lead.origin,
    status: lead.status,
    revenue: lead.revenue.toString(),
    assignedTo: lead.assignedTo || '',
    notes: lead.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      revenue: parseInt(formData.revenue),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Nome</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-phone">Telefone</Label>
        <Input
          id="edit-phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-company">Empresa</Label>
        <Input
          id="edit-company"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as CRMLead['status'] }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desqualificado">Desqualificado</SelectItem>
              <SelectItem value="mql">MQL (Qualificado)</SelectItem>
              <SelectItem value="contato">Em Contato</SelectItem>
              <SelectItem value="reuniao">Reunião</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="edit-origin">Origem</Label>
          <Select value={formData.origin} onValueChange={(value) => setFormData(prev => ({ ...prev, origin: value as CRMLead['origin'] }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="referral">Indicação</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-revenue">Faturamento (milhares)</Label>
          <Select value={formData.revenue} onValueChange={(value) => setFormData(prev => ({ ...prev, revenue: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Até 20k</SelectItem>
              <SelectItem value="30">20k-40k</SelectItem>
              <SelectItem value="50">40k-60k</SelectItem>
              <SelectItem value="70">60k-80k</SelectItem>
              <SelectItem value="90">80k-100k</SelectItem>
              <SelectItem value="125">100k-150k</SelectItem>
              <SelectItem value="200">150k-250k</SelectItem>
              <SelectItem value="375">250k-500k</SelectItem>
              <SelectItem value="750">500k-1M</SelectItem>
              <SelectItem value="1500">Acima de 1M</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="edit-assignedTo">Responsável</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="edit-notes">Observações</Label>
        <Textarea
          id="edit-notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full">
        Atualizar Lead
      </Button>
    </form>
  );
}
