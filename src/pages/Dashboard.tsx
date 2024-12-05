import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Folder, Palette, Package, Truck, X, CheckCircle, Timer, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';

const dadosPedidos = [
  { mes: 'Jan', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Fev', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Mar', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Abr', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Mai', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Jun', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Jul', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Ago', Offset: 0, 'Com. Visual': 2 },
  { mes: 'Set', Offset: 0, 'Com. Visual': 1 },
  { mes: 'Out', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Nov', Offset: 0, 'Com. Visual': 0 },
  { mes: 'Dez', Offset: 0, 'Com. Visual': 0 },
];

const dadosOrcamentos = [
  { mes: 'Jan', Offset: 0, Digital: 0 },
  { mes: 'Fev', Offset: 0, Digital: 0 },
  { mes: 'Mar', Offset: 0, Digital: 0 },
  { mes: 'Abr', Offset: 0, Digital: 0 },
  { mes: 'Mai', Offset: 0, Digital: 0 },
  { mes: 'Jun', Offset: 0, Digital: 0 },
  { mes: 'Jul', Offset: 0, Digital: 0 },
  { mes: 'Ago', Offset: 1, Digital: 0 },
  { mes: 'Set', Offset: 0, Digital: 0 },
  { mes: 'Out', Offset: 0, Digital: 1 },
  { mes: 'Nov', Offset: 0, Digital: 2 },
  { mes: 'Dez', Offset: 0, Digital: 0 },
];

export function Dashboard() {
  const { 
    faturamentoMensal, 
    clientesAtivos, 
    pedidosEmAberto, 
    prazoMedio, 
    pedidosRecentes 
  } = useDashboard();

  const handleCardClick = (metricName: string, value: number) => {
    // Track with Amplitude
    // amplitude.getInstance().logEvent('Metric Click', {
    //   metric: metricName,
    //   value
    // });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleCardClick('Faturamento Mensal', faturamentoMensal)}>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Faturamento Mensal</p>
              <h3 className="text-2xl font-bold">R$ {faturamentoMensal.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleCardClick('Clientes Ativos', clientesAtivos)}>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clientes Ativos</p>
              <h3 className="text-2xl font-bold">{clientesAtivos}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleCardClick('Pedidos em Aberto', pedidosEmAberto)}>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pedidos em Aberto</p>
              <h3 className="text-2xl font-bold">{pedidosEmAberto}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleCardClick('Prazo Médio', prazoMedio)}>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Timer className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Prazo Médio</p>
              <h3 className="text-2xl font-bold">{prazoMedio} dias</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Margem de Contribuição */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Margem Contribuição (mês)</h3>
          <div className="flex justify-center items-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">0,00</div>
                  <div className="text-sm text-gray-500">0.00%</div>
                </div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth="2"/>
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-green-500" strokeWidth="2" strokeDasharray="100 100" strokeDashoffset="75"/>
              </svg>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Alvo - R$ 50.000,00
          </div>
        </Card>

        {/* Gráfico de Pedidos */}
        <Card className="col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4">PEDIDOS</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosPedidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Offset" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="Com. Visual" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabela de Pedidos Recentes */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Pedidos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Cliente</th>
                <th className="text-left p-2">Produto</th>
                <th className="text-right p-2">Valor</th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidosRecentes.map((pedido) => (
                <tr key={pedido.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{pedido.id}</td>
                  <td className="p-2">{pedido.cliente}</td>
                  <td className="p-2">{pedido.produto}</td>
                  <td className="p-2 text-right">R$ {pedido.valor.toFixed(2)}</td>
                  <td className="p-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${pedido.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                        pedido.status === 'Em Produção' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {pedido.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-purple-100">
          <div className="flex flex-col items-center">
            <Folder className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">AGUARDANDO</div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-100">
          <div className="flex flex-col items-center">
            <Palette className="h-8 w-8 text-orange-600 mb-2" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-gray-600">ARTE</div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-100">
          <div className="flex flex-col items-center">
            <Package className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-gray-600">PRODUÇÃO</div>
          </div>
        </Card>

        <Card className="p-4 bg-green-100">
          <div className="flex flex-col items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-gray-600">FINALIZADO</div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-100">
          <div className="flex flex-col items-center">
            <Truck className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">EXPEDIÇÃO</div>
          </div>
        </Card>

        <Card className="p-4 bg-red-100">
          <div className="flex flex-col items-center">
            <X className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">CANCELADO</div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Orçamentos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">ORÇAMENTOS</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosOrcamentos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="Offset" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="Digital" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Status de Orçamentos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-purple-100">
          <div className="flex flex-col items-center">
            <Folder className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-gray-600">NOVO ORÇAMENTO</div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-100">
          <div className="flex flex-col items-center">
            <Timer className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">EM NEGOCIAÇÃO</div>
          </div>
        </Card>

        <Card className="p-4 bg-green-100">
          <div className="flex flex-col items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-gray-600">APROVADO</div>
          </div>
        </Card>

        <Card className="p-4 bg-red-100">
          <div className="flex flex-col items-center">
            <X className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">CANCELADO</div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        2024 - Calcme | Tecnologia
      </div>
    </div>
  );
}
