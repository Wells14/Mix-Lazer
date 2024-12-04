import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Folder, Palette, Package, Truck, X, CheckCircle, Timer } from 'lucide-react';

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
  return (
    <div className="space-y-6">
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
