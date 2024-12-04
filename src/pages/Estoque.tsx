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

const produtosEstoque = [
  {
    id: '1',
    nome: 'Lona 440g',
    categoria: 'Materiais',
    quantidade: 150,
    unidade: 'm²',
    minimo: 50,
    status: 'ok',
  },
  {
    id: '2',
    nome: 'Adesivo Brilho',
    categoria: 'Materiais',
    quantidade: 30,
    unidade: 'm²',
    minimo: 40,
    status: 'baixo',
  },
  {
    id: '3',
    nome: 'Tinta Preta',
    categoria: 'Insumos',
    quantidade: 5,
    unidade: 'L',
    minimo: 10,
    status: 'critico',
  },
];

export function Estoque() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Estoque</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total de Itens</h3>
          <p className="text-3xl font-bold">185</p>
          <p className="text-sm text-gray-500">Em 15 categorias</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Itens Abaixo do Mínimo</h3>
          <p className="text-3xl font-bold text-yellow-600">8</p>
          <p className="text-sm text-gray-500">Necessitam reposição</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Itens em Falta</h3>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-gray-500">Compra urgente necessária</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Produtos em Estoque</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Mínimo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosEstoque.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>{produto.quantidade} {produto.unidade}</TableCell>
                <TableCell>{produto.minimo} {produto.unidade}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      produto.status === 'ok'
                        ? 'default'
                        : produto.status === 'baixo'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {produto.status === 'ok'
                      ? 'OK'
                      : produto.status === 'baixo'
                      ? 'Baixo'
                      : 'Crítico'}
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
