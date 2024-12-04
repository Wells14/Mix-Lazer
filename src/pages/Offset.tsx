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

const trabalhosOffset = [
  {
    id: '1',
    cliente: 'Empresa ABC',
    produto: 'Panfletos A5 4/4',
    quantidade: '10.000',
    prazo: '2024-01-22',
    status: 'pre_impressao',
    progresso: 30,
  },
  {
    id: '2',
    cliente: 'Loja XYZ',
    produto: 'Cartão de Visita 4/4',
    quantidade: '1.000',
    prazo: '2024-01-21',
    status: 'impressao',
    progresso: 60,
  },
  {
    id: '3',
    cliente: 'Restaurante 123',
    produto: 'Cardápios A4 4/4',
    quantidade: '500',
    prazo: '2024-01-23',
    status: 'acabamento',
    progresso: 85,
  },
];

export function Offset() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Offset</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Pré-Impressão</h3>
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm text-gray-500">Trabalhos em arte/CTP</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Impressão</h3>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm text-gray-500">Na máquina offset</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Acabamento</h3>
          <p className="text-3xl font-bold">4</p>
          <p className="text-sm text-gray-500">Em finalização</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Finalizados</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-500">Hoje</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trabalhos em Andamento</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trabalhosOffset.map((trabalho) => (
              <TableRow key={trabalho.id}>
                <TableCell>{trabalho.id}</TableCell>
                <TableCell>{trabalho.cliente}</TableCell>
                <TableCell>{trabalho.produto}</TableCell>
                <TableCell>{trabalho.quantidade}</TableCell>
                <TableCell>{new Date(trabalho.prazo).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      trabalho.status === 'pre_impressao'
                        ? 'secondary'
                        : trabalho.status === 'impressao'
                        ? 'default'
                        : 'success'
                    }
                  >
                    {trabalho.status === 'pre_impressao'
                      ? 'Pré-Impressão'
                      : trabalho.status === 'impressao'
                      ? 'Impressão'
                      : 'Acabamento'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-[100px]">
                    <Progress value={trabalho.progresso} className="h-2" />
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
