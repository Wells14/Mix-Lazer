import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ExcelExport } from '@/components/ExcelExport';
import { PDFGenerator } from '@/components/PDFGenerator';
import { Plus, Search, Mail, Phone, MapPin, FileText } from 'lucide-react';

// Dados de exemplo
const clientesData = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua A, 123',
    observacoes: 'Cliente VIP',
    ultimaCompra: '2024-01-15',
    valorTotal: 1500.00
  },
  // Adicione mais clientes aqui
];

export function Clientes() {
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [observacoes, setObservacoes] = useState('');

  const clientesFiltrados = clientesData.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirDetalhesCliente = (cliente: any) => {
    setClienteSelecionado(cliente);
    setObservacoes(cliente.observacoes || '');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex gap-2">
          <ExcelExport
            data={clientesData}
            filename="clientes.xlsx"
            sheetName="Clientes"
          />
          <PDFGenerator
            title="Lista de Clientes"
            content={{
              table: {
                headers: ['Nome', 'Email', 'Telefone', 'Última Compra', 'Valor Total'],
                rows: clientesData.map(c => [
                  c.nome,
                  c.email,
                  c.telefone,
                  c.ultimaCompra,
                  `R$ ${c.valorTotal.toFixed(2)}`
                ])
              }
            }}
            filename="clientes.pdf"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
              </DialogHeader>
              {/* Formulário de novo cliente aqui */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Buscar clientes..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="max-w-sm"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <Card
              key={cliente.id}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => abrirDetalhesCliente(cliente)}
            >
              <div className="space-y-2">
                <h3 className="font-semibold">{cliente.nome}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {cliente.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {cliente.telefone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {cliente.endereco}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm">
                    <span className="font-medium">Última Compra:</span> {cliente.ultimaCompra}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Total em Compras:</span>{' '}
                    R$ {cliente.valorTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {clienteSelecionado && (
        <Dialog open={!!clienteSelecionado} onOpenChange={() => setClienteSelecionado(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input value={clienteSelecionado.nome} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={clienteSelecionado.email} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input value={clienteSelecionado.telefone} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <Input value={clienteSelecionado.endereco} readOnly />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Observações</label>
                <RichTextEditor
                  initialValue={observacoes}
                  onChange={setObservacoes}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setClienteSelecionado(null)}>
                  Fechar
                </Button>
                <PDFGenerator
                  title={`Ficha do Cliente - ${clienteSelecionado.nome}`}
                  content={{
                    text: `
                      Nome: ${clienteSelecionado.nome}
                      Email: ${clienteSelecionado.email}
                      Telefone: ${clienteSelecionado.telefone}
                      Endereço: ${clienteSelecionado.endereco}
                      Última Compra: ${clienteSelecionado.ultimaCompra}
                      Total em Compras: R$ ${clienteSelecionado.valorTotal.toFixed(2)}
                      
                      Observações:
                      ${observacoes}
                    `
                  }}
                  filename={`cliente-${clienteSelecionado.id}.pdf`}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
