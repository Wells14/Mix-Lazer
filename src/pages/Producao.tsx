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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const pedidosProducao = [
  {
    id: '1',
    cliente: 'João Silva',
    produto: 'Banner 2x1m',
    prazo: '2024-01-20',
    status: 'arte',
    progresso: 25,
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    produto: 'Adesivos 10x10cm (100un)',
    prazo: '2024-01-18',
    status: 'producao',
    progresso: 75,
  },
  {
    id: '3',
    cliente: 'Pedro Oliveira',
    produto: 'Cartão de Visita (1000un)',
    prazo: '2024-01-19',
    status: 'finalizado',
    progresso: 100,
  },
];

export function Producao() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Produção</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Em Arte</h3>
          <p className="text-3xl font-bold">5</p>
          <p className="text-sm text-gray-500">Pedidos em criação</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Em Produção</h3>
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm text-gray-500">Pedidos sendo produzidos</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Finalizados Hoje</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500">Pedidos concluídos</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Atrasados</h3>
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-500">Pedidos com atraso</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Pedidos em Produção</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidosProducao.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.cliente}</TableCell>
                <TableCell>{pedido.produto}</TableCell>
                <TableCell>{new Date(pedido.prazo).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      pedido.status === 'arte'
                        ? 'secondary'
                        : pedido.status === 'producao'
                        ? 'default'
                        : 'success'
                    }
                  >
                    {pedido.status === 'arte'
                      ? 'Arte'
                      : pedido.status === 'producao'
                      ? 'Produção'
                      : 'Finalizado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-[100px]">
                    <Progress value={pedido.progresso} className="h-2" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
