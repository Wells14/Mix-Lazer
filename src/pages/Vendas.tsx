import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const vendasRecentes = [
  {
    id: '1',
    cliente: 'João Silva',
    produto: 'Banner 2x1m',
    valor: 150.00,
    status: 'Concluída',
    data: '2024-01-15',
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    produto: 'Adesivos 10x10cm (100un)',
    valor: 80.00,
    status: 'Em produção',
    data: '2024-01-14',
  },
  {
    id: '3',
    cliente: 'Pedro Oliveira',
    produto: 'Cartão de Visita (1000un)',
    valor: 120.00,
    status: 'Aguardando pagamento',
    data: '2024-01-13',
  },
];

export function Vendas() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Vendas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Vendas Hoje</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500">+2 em relação a ontem</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Faturamento Hoje</h3>
          <p className="text-3xl font-bold">R$ 1.250,00</p>
          <p className="text-sm text-gray-500">+15% em relação a ontem</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Ticket Médio</h3>
          <p className="text-3xl font-bold">R$ 104,16</p>
          <p className="text-sm text-gray-500">+5% em relação a ontem</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Taxa de Conversão</h3>
          <p className="text-3xl font-bold">68%</p>
          <p className="text-sm text-gray-500">+3% em relação a ontem</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Vendas Recentes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendasRecentes.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell>{venda.id}</TableCell>
                <TableCell>{venda.cliente}</TableCell>
                <TableCell>{venda.produto}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(venda.valor)}
                </TableCell>
                <TableCell>{venda.status}</TableCell>
                <TableCell>{new Date(venda.data).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
