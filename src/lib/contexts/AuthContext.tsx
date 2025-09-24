"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContext as AuthContextType } from '../types';
import { mockUsers } from '../mock-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('metta_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          localStorage.removeItem('metta_user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuário nos dados mock
      const foundUser = mockUsers.find((u: User) => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remover senha do objeto antes de salvar
        const { password: removedPassword, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        if (typeof window !== 'undefined') {
          localStorage.setItem('metta_user', JSON.stringify(userWithoutPassword));
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('metta_user');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
