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
  Filter,
  CheckCircle,
  Calendar,
  Building,
  Phone,
  Mail,
  Edit,
  Trash2
} from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { Client, ContractStatus } from "@/lib/types";

export default function OperacionalPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'todos' || client.contractStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Funções para gerenciar clientes
  const createClient = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: clientData.name || '',
      email: clientData.email || '',
      phone: clientData.phone || '',
      company: clientData.company || '',
      plan: clientData.plan || '',
      contractStatus: 'pendente',
      activeMonths: 0,
      monthlyValue: clientData.monthlyValue || 0,
      createdAt: new Date(),
      lastContact: new Date(),
      notes: clientData.notes || '',
    };
    setClients(prev => [...prev, newClient]);
    setIsCreateDialogOpen(false);
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client =>
      client.id === clientId
        ? { ...client, ...updates }
        : client
    ));
    setIsEditDialogOpen(false);
    setSelectedClient(null);
  };

  const deleteClient = (clientId: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  // Funções auxiliares
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Área Operacional</h1>
            <p className="text-gray-600">Gestão de clientes, contratos e onboarding</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo cliente ao sistema
                </DialogDescription>
              </DialogHeader>
              <CreateClientForm onSubmit={createClient} />
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
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status do Contrato</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("todos");
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => {
                setSelectedClient(client);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => deleteClient(client.id)}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))}
        </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do cliente
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <EditClientForm
              client={selectedClient}
              onSubmit={(updates) => updateClient(selectedClient.id, updates)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente do Card de Cliente
function ClientCard({ 
  client, 
  onEdit, 
  onDelete, 
  getStatusColor, 
  getStatusLabel, 
  formatCurrency, 
  formatDate 
}: {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: ContractStatus) => string;
  getStatusLabel: (status: ContractStatus) => string;
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-medium line-clamp-2">
              {client.name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(client.contractStatus)}>
                {getStatusLabel(client.contractStatus)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {client.plan}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {client.email}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {client.phone}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2" />
            {client.company}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(client.createdAt)}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            {client.activeMonths} meses ativo
          </div>
          
          <div className="flex items-center text-sm font-medium text-gray-900">
            <span className="mr-2">Valor Mensal:</span>
            {formatCurrency(client.monthlyValue)}
          </div>
          
          {client.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">{client.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Formulário de Criação de Cliente
function CreateClientForm({ onSubmit }: { onSubmit: (data: Partial<Client>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    plan: '',
    monthlyValue: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthlyValue: formData.monthlyValue ? parseInt(formData.monthlyValue) : 0,
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      plan: '',
      monthlyValue: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Telefone</Label>
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
          required
        />
      </div>
      
      <div>
        <Label htmlFor="plan">Plano</Label>
        <Input
          id="plan"
          value={formData.plan}
          onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="monthlyValue">Valor Mensal</Label>
        <Input
          id="monthlyValue"
          type="number"
          value={formData.monthlyValue}
          onChange={(e) => setFormData(prev => ({ ...prev, monthlyValue: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>
      
      <Button type="submit" className="w-full">
        Criar Cliente
      </Button>
    </form>
  );
}

// Formulário de Edição de Cliente
function EditClientForm({ 
  client, 
  onSubmit 
}: { 
  client: Client; 
  onSubmit: (data: Partial<Client>) => void 
}) {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    plan: client.plan,
    monthlyValue: client.monthlyValue.toString(),
    notes: client.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthlyValue: parseInt(formData.monthlyValue),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Telefone</Label>
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
          required
        />
      </div>
      
      <div>
        <Label htmlFor="plan">Plano</Label>
        <Input
          id="plan"
          value={formData.plan}
          onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="monthlyValue">Valor Mensal</Label>
        <Input
          id="monthlyValue"
          type="number"
          value={formData.monthlyValue}
          onChange={(e) => setFormData(prev => ({ ...prev, monthlyValue: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>
      
      <Button type="submit" className="w-full">
        Atualizar Cliente
      </Button>
    </form>
  );
}
