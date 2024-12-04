import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dadosFinanceiros = [
  { mes: 'Jan', receitas: 4000, despesas: 2400 },
  { mes: 'Fev', receitas: 3000, despesas: 1398 },
  { mes: 'Mar', receitas: 2000, despesas: 9800 },
  { mes: 'Abr', receitas: 2780, despesas: 3908 },
  { mes: 'Mai', receitas: 1890, despesas: 4800 },
  { mes: 'Jun', receitas: 2390, despesas: 3800 },
];

export function Financeiro() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Financeiro</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Receitas</h3>
          <p className="text-3xl font-bold text-green-600">R$ 15.460,00</p>
          <p className="text-sm text-gray-500">+12% em relação ao mês anterior</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Despesas</h3>
          <p className="text-3xl font-bold text-red-600">R$ 8.920,00</p>
          <p className="text-sm text-gray-500">-5% em relação ao mês anterior</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Lucro</h3>
          <p className="text-3xl font-bold text-blue-600">R$ 6.540,00</p>
          <p className="text-sm text-gray-500">+18% em relação ao mês anterior</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Receitas x Despesas</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosFinanceiros}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
