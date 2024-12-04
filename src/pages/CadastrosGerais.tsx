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

const categorias = [
  {
    id: '1',
    nome: 'Impressão Digital',
    descricao: 'Serviços de impressão em pequeno formato',
    itens: 15,
  },
  {
    id: '2',
    nome: 'Comunicação Visual',
    descricao: 'Banners, faixadas e placas',
    itens: 25,
  },
  {
    id: '3',
    nome: 'Offset',
    descricao: 'Impressão offset em grande tiragem',
    itens: 10,
  },
];

const fornecedores = [
  {
    id: '1',
    nome: 'Fornecedor A',
    tipo: 'Materiais',
    contato: '(11) 98765-4321',
    cidade: 'São Paulo',
  },
  {
    id: '2',
    nome: 'Fornecedor B',
    tipo: 'Insumos',
    contato: '(11) 98765-4322',
    cidade: 'Guarulhos',
  },
  {
    id: '3',
    nome: 'Fornecedor C',
    tipo: 'Equipamentos',
    contato: '(11) 98765-4323',
    cidade: 'Osasco',
  },
];

export function CadastrosGerais() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Cadastros Gerais</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Categorias</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500">Categorias cadastradas</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Fornecedores</h3>
          <p className="text-3xl font-bold">28</p>
          <p className="text-sm text-gray-500">Fornecedores ativos</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Funcionários</h3>
          <p className="text-3xl font-bold">15</p>
          <p className="text-sm text-gray-500">Colaboradores</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Categorias</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Itens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.nome}</TableCell>
                  <TableCell>{categoria.descricao}</TableCell>
                  <TableCell>{categoria.itens}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Fornecedores</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>{fornecedor.id}</TableCell>
                  <TableCell>{fornecedor.nome}</TableCell>
                  <TableCell>{fornecedor.tipo}</TableCell>
                  <TableCell>{fornecedor.contato}</TableCell>
                  <TableCell>{fornecedor.cidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
