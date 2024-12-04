import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import Orcamentos from './pages/Orcamentos';
import { Clientes } from './pages/Clientes';
import { Relatorios } from './pages/Relatorios';
import { Financeiro } from './pages/Financeiro';
import { Vendas } from './pages/Vendas';
import { Estoque } from './pages/Estoque';
import { Produtos } from './pages/Produtos';
import { Producao } from './pages/Producao';
import { CadastrosGerais } from './pages/CadastrosGerais';
import { Offset } from './pages/Offset';
import { WhatsApp } from './pages/WhatsApp';
import { FormularioOrcamento } from './components/orcamentos/FormularioOrcamento';
import { Notificacoes } from './components/Notificacoes';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, ShoppingCart, Package, Users, FileText, Printer, MessageSquare, Database, Box } from 'lucide-react';
import { MixLaserLogo } from './assets/mix-laser-logo';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {/* Sidebar */}
          <aside className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-gradient-to-b from-[#14132A] via-[#1E1C3A] to-[#14132A] hover:bg-gradient-to-b hover:from-[#1a1836] hover:via-[#2d1e1e] hover:to-[#1a1836] dark:from-black dark:via-[#1a1010] dark:to-black text-white group overflow-x-hidden">
            <div className="p-4 flex justify-center items-center">
              <div className="w-14 group-hover:w-56 transition-all duration-300 transform group-hover:scale-110">
                <MixLaserLogo />
              </div>
            </div>
            <nav className="mt-8">
              <Link to="/" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Box className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dashboard</span>
              </Link>
              <Link to="/financeiro" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <DollarSign className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Financeiro</span>
              </Link>
              <Link to="/vendas" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Vendas</span>
              </Link>
              <Link to="/estoque" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Package className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Estoque</span>
              </Link>
              <Link to="/cadastros" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Database className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cadastros Gerais</span>
              </Link>
              <Link to="/produtos" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Box className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Produtos</span>
              </Link>
              <Link to="/orcamentos" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <FileText className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Orçamentos</span>
              </Link>
              <Link to="/clientes" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Users className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Clientes</span>
              </Link>
              <Link to="/producao" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Printer className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Produção</span>
              </Link>
              <Link to="/whatsapp" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <MessageSquare className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">WhatsApp</span>
              </Link>
              <Link to="/offset" className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d1e1e] hover:text-white transition-colors duration-200">
                <Printer className="h-5 w-5" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Offset</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex justify-between items-center px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Mix Sistema</h1>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <Notificacoes />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Orçamento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Novo Orçamento</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do novo orçamento abaixo.
                        </DialogDescription>
                      </DialogHeader>
                      <FormularioOrcamento />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <div className="container mx-auto px-6 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/financeiro" element={<Financeiro />} />
                  <Route path="/vendas" element={<Vendas />} />
                  <Route path="/estoque" element={<Estoque />} />
                  <Route path="/cadastros" element={<CadastrosGerais />} />
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/orcamentos" element={<Orcamentos />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/producao" element={<Producao />} />
                  <Route path="/whatsapp" element={<WhatsApp />} />
                  <Route path="/offset" element={<Offset />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
