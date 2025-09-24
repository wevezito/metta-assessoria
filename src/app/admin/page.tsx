"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search,
  Settings,
  Shield,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2
} from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { USER_PERMISSIONS } from "@/lib/types";
import { User, UserRole, Permission } from "@/lib/types";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("usuarios");
  
  const { user: currentUser } = useAuth();

  const roleLabels = {
    admin: 'Administrador',
    manager: 'Gerente',
    sdr: 'SDR',
    closer: 'Closer',
    designer: 'Designer',
    copywriter: 'Copywriter',
    traffic_manager: 'Traffic Manager'
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-purple-100 text-purple-800',
    sdr: 'bg-blue-100 text-blue-800',
    closer: 'bg-green-100 text-green-800',
    designer: 'bg-yellow-100 text-yellow-800',
    copywriter: 'bg-pink-100 text-pink-800',
    traffic_manager: 'bg-indigo-100 text-indigo-800'
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || '',
      role: userData.role || 'sdr',
      avatar: userData.avatar,
      createdAt: new Date(),
      isActive: true,
      permissions: [...(USER_PERMISSIONS as any).sdr],
    };
    
    setUsers(prev => [...prev, newUser]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, ...updates, permissions: user.permissions }
        : user
    ));
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Você não pode deletar seu próprio usuário!');
      return;
    }
    
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Gerencie usuários e configurações do sistema</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo usuário
                  </DialogDescription>
                </DialogHeader>
                <CreateUserForm onSubmit={handleCreateUser} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="permissoes">Permissões</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            {/* Usuários Tab */}
            <TabsContent value="usuarios" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Gestão de Usuários</CardTitle>
                      <CardDescription>
                        Gerencie todos os usuários do sistema
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar usuários..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Login</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={roleColors[user.role]} variant="secondary">
                              {roleLabels[user.role]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.isActive ? "default" : "secondary"}
                              className={user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {user.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {user.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissões Tab */}
            <TabsContent value="permissoes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(USER_PERMISSIONS).map(([role, permissions]) => (
                  <Card key={role}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        {roleLabels[role as UserRole]}
                      </CardTitle>
                      <CardDescription>
                        Permissões específicas para este papel
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(permissions as any).map((permission: any) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{permission.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Configurações Tab */}
            <TabsContent value="configuracoes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Configurações do Sistema
                  </CardTitle>
                  <CardDescription>
                    Configurações gerais da Metta Assessoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input id="companyName" defaultValue="Metta Assessoria" />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Email de Contato</Label>
                      <Input id="companyEmail" defaultValue="contato@mettaassessoria.com" />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select defaultValue="america/sao_paulo">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america/sao_paulo">São Paulo (GMT-3)</SelectItem>
                          <SelectItem value="america/recife">Recife (GMT-3)</SelectItem>
                          <SelectItem value="america/manaus">Manaus (GMT-4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Salvar Configurações</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit User Dialog */}
          {selectedUser && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Usuário</DialogTitle>
                  <DialogDescription>
                    {selectedUser.name} - {selectedUser.email}
                  </DialogDescription>
                </DialogHeader>
                <EditUserForm 
                  user={selectedUser} 
                  onSubmit={(updates) => handleUpdateUser(selectedUser.id, updates)} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
    </ProtectedRoute>
  );
}

// Componente para criar usuário
function CreateUserForm({ onSubmit }: { onSubmit: (userData: Partial<User>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sdr' as UserRole,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Papel</Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sdr">SDR</SelectItem>
              <SelectItem value="closer">Closer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="copywriter">Copywriter</SelectItem>
              <SelectItem value="traffic_manager">Traffic Manager</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit">Criar Usuário</Button>
      </div>
    </form>
  );
}

// Componente para editar usuário
function EditUserForm({ user, onSubmit }: { user: User; onSubmit: (updates: Partial<User>) => void }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editName">Nome</Label>
          <Input
            id="editName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="editEmail">Email</Label>
          <Input
            id="editEmail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editRole">Papel</Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sdr">SDR</SelectItem>
              <SelectItem value="closer">Closer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="copywriter">Copywriter</SelectItem>
              <SelectItem value="traffic_manager">Traffic Manager</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="editStatus">Status</Label>
          <Select value={formData.isActive ? 'ativo' : 'inativo'} onValueChange={(value) => setFormData({ ...formData, isActive: value === 'ativo' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
}
