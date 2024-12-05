import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { CustomerSupport } from './CustomerSupport';
import {
  LayoutGrid,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
  { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const MenuItem = ({ icon: Icon, label, path }: typeof menuItems[0]) => {
    const isActive = location.pathname === path;
    return (
      <Link to={path}>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </Link>
    );
  };

  const MenuContent = () => (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <MenuItem key={item.path} {...item} />
      ))}
      <Button variant="ghost" className="w-full justify-start text-red-500">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mt-6">
                <MenuContent />
              </div>
            </SheetContent>
          </Sheet>
          <div className="ml-4 md:ml-0 font-bold text-xl">Dashboardly</div>
          <div className="ml-auto flex items-center space-x-4">
            <NotificationBell />
            {/* Adicione outros elementos do header aqui */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - visível apenas em telas médias e grandes */}
        <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white fixed">
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <MenuContent />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 md:ml-64">
          {children}
        </main>
      </div>
      <CustomerSupport />
    </div>
  );
}
