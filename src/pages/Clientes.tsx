import React from 'react';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Mail, Phone } from 'lucide-react';

export function Clientes() {
  const { orcamentos } = useOrcamentosStore();

  // Agrupa orçamentos por cliente
  const clientesMap = orcamentos.reduce((acc, orc) => {
    const email = orc.cliente.email;
    if (!acc[email]) {
      acc[email] = {
        ...orc.cliente,
        totalOrcamentos: 0,
        valorTotal: 0,
        ultimoOrcamento: new Date(0),
      };
    }
    acc[email].totalOrcamentos++;
    acc[email].valorTotal += orc.valorTotal;
    const dataOrcamento = new Date(orc.data);
    if (dataOrcamento > acc[email].ultimoOrcamento) {
      acc[email].ultimoOrcamento = dataOrcamento;
    }
    return acc;
  }, {} as Record<string, any>);

  const clientes = Object.values(clientesMap);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-600 mt-1">
            Total: {clientes.length} clientes
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Total de Orçamentos</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Último Orçamento</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.email}>
                <TableCell>
                  <div className="font-medium">{cliente.nome}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      {cliente.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {cliente.telefone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{cliente.totalOrcamentos}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(cliente.valorTotal)}
                </TableCell>
                <TableCell>
                  {cliente.ultimoOrcamento.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
