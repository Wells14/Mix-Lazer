import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const produtos = [
  {
    id: '1',
    nome: 'Banner 440g',
    categoria: 'Comunicação Visual',
    preco: 45.00,
    unidade: 'm²',
    status: 'ativo',
  },
  {
    id: '2',
    nome: 'Adesivo Brilho',
    categoria: 'Comunicação Visual',
    preco: 35.00,
    unidade: 'm²',
    status: 'ativo',
  },
  {
    id: '3',
    nome: 'Cartão de Visita',
    categoria: 'Impressão Digital',
    preco: 90.00,
    unidade: '1000un',
    status: 'ativo',
  },
  {
    id: '4',
    nome: 'Panfleto A5',
    categoria: 'Offset',
    preco: 280.00,
    unidade: '1000un',
    status: 'inativo',
  },
];

export function Produtos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Produtos</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total de Produtos</h3>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm text-gray-500">Em 8 categorias</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Produtos Ativos</h3>
          <p className="text-3xl font-bold text-green-600">38</p>
          <p className="text-sm text-gray-500">84% do total</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Mais Vendidos</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500">Produtos em destaque</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Sem Estoque</h3>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-gray-500">Necessitam reposição</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Lista de Produtos</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(produto.preco)}
                </TableCell>
                <TableCell>{produto.unidade}</TableCell>
                <TableCell>
                  <Badge
                    variant={produto.status === 'ativo' ? 'success' : 'secondary'}
                  >
                    {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
