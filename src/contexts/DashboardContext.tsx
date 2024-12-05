import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardContextData {
  faturamentoMensal: number;
  clientesAtivos: number;
  pedidosEmAberto: number;
  prazoMedio: number;
  pedidosRecentes: Array<{
    id: string;
    cliente: string;
    produto: string;
    valor: number;
    status: string;
  }>;
  atualizarDados: () => void;
}

const DashboardContext = createContext<DashboardContextData>({} as DashboardContextData);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = useState({
    faturamentoMensal: 0,
    clientesAtivos: 0,
    pedidosEmAberto: 0,
    prazoMedio: 0,
    pedidosRecentes: []
  });

  const atualizarDados = async () => {
    // Aqui você pode adicionar a lógica para buscar dados do backend
    // Por enquanto, vamos usar dados mockados
    setDados({
      faturamentoMensal: 100000,
      clientesAtivos: 50,
      pedidosEmAberto: 20,
      prazoMedio: 30,
      pedidosRecentes: [
        {
          id: '001',
          cliente: 'João Silva',
          produto: 'Banner 3x2m',
          valor: 450.00,
          status: 'Em Produção'
        },
        {
          id: '002',
          cliente: 'Maria Santos',
          produto: 'Adesivos 10x10cm',
          valor: 280.00,
          status: 'Aguardando'
        },
        {
          id: '003',
          cliente: 'Pedro Costa',
          produto: 'Faixa 5m',
          valor: 650.00,
          status: 'Concluído'
        }
      ]
    });
  };

  useEffect(() => {
    atualizarDados();
  }, []);

  return (
    <DashboardContext.Provider value={{ ...dados, atualizarDados }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
