"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  ShoppingCart,
  Cog,
  CheckSquare,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Comercial",
    href: "/comercial",
    icon: ShoppingCart,
  },
  {
    name: "Operacional",
    href: "/operacional",
    icon: Cog,
  },
  {
    name: "Tarefas",
    href: "/tarefas",
    icon: CheckSquare,
  },
  {
    name: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Shield,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Redirecionar para login
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, redirecionar para login
      window.location.href = '/login';
    }
  };

  return (
    <div className={cn(
      "flex h-full flex-col bg-gray-900 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo e Botão de Recolhimento */}
      <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="relative h-12 w-auto">
              <Image
                src="/logo.png"
                alt="Metta Assessoria"
                width={120}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          if (isCollapsed) {
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "h-10 w-10 p-0",
                          isActive
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )}
                  title={item.name}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-2 text-sm font-medium",
                          isActive
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Botão de Logout - Parte inferior da sidebar */}
      <div className="border-t border-gray-700 p-3">
        {isCollapsed ? (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="h-10 w-10 p-0 text-gray-300 hover:bg-gray-800 hover:text-white"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        )}
      </div>
    </div>
  );
}
