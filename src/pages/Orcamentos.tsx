import React, { useState } from 'react';
import { useOrcamentosStore } from '../stores/orcamentosStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from '../utils/format';
import type { Orcamento } from '../types/orcamento';
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react';

const Orcamentos: React.FC = () => {
  const { orcamentos, removerOrcamento } = useOrcamentosStore();
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [termoBusca, setTermoBusca] = useState('');

  const orcamentosFiltrados = orcamentos
    .filter(orcamento => 
      filtroStatus === 'todos' ? true : orcamento.status === filtroStatus
    )
    .filter(orcamento => {
      const termo = termoBusca.toLowerCase();
      return (
        orcamento.cliente.nome.toLowerCase().includes(termo) ||
        orcamento.cliente.email.toLowerCase().includes(termo) ||
        orcamento.id.toLowerCase().includes(termo)
      );
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalValor = orcamentosFiltrados.reduce((total, orc) => total + orc.valorTotal, 0);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por cliente, email ou ID..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          {orcamentosFiltrados.length} orçamentos encontrados
        </p>
        <p className="text-sm font-medium">
          Total: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(totalValor)}
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={filtroStatus === 'todos' ? 'default' : 'outline'}
          onClick={() => setFiltroStatus('todos')}
        >
          Todos
        </Button>
        <Button
          variant={filtroStatus === 'pendente' ? 'default' : 'outline'}
          onClick={() => setFiltroStatus('pendente')}
        >
          Pendentes
        </Button>
        <Button
          variant={filtroStatus === 'aprovado' ? 'default' : 'outline'}
          onClick={() => setFiltroStatus('aprovado')}
        >
          Aprovados
        </Button>
        <Button
          variant={filtroStatus === 'recusado' ? 'default' : 'outline'}
          onClick={() => setFiltroStatus('recusado')}
        >
          Recusados
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orcamentosFiltrados.map((orcamento: Orcamento) => (
              <TableRow key={orcamento.id}>
                <TableCell className="font-mono">
                  {orcamento.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{orcamento.cliente.nome}</div>
                    <div className="text-sm text-gray-500">{orcamento.cliente.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(orcamento.data).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    orcamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                    orcamento.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {orcamento.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(orcamento.valorTotal)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removerOrcamento(orcamento.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orcamentosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    Nenhum orçamento encontrado
                  </div>
                  <Button variant="link" onClick={() => setFiltroStatus('todos')}>
                    Limpar filtros
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orcamentos;
