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
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';

const mensagens = [
  {
    id: '1',
    cliente: 'João Silva',
    telefone: '(11) 98765-4321',
    ultimaMensagem: 'Bom dia! Gostaria de saber o prazo de entrega do banner.',
    status: 'nao_lida',
    horario: '10:30',
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    telefone: '(11) 98765-4322',
    ultimaMensagem: 'Ok, muito obrigada!',
    status: 'lida',
    horario: '09:45',
  },
  {
    id: '3',
    cliente: 'Pedro Oliveira',
    telefone: '(11) 98765-4323',
    ultimaMensagem: 'Qual o valor do cartão de visita?',
    status: 'respondida',
    horario: '09:15',
  },
];

export function WhatsApp() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">WhatsApp</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Mensagens Hoje</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-gray-500">+5 em relação a ontem</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Não Lidas</h3>
          <p className="text-3xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-500">Necessitam resposta</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Respondidas</h3>
          <p className="text-3xl font-bold text-green-600">21</p>
          <p className="text-sm text-gray-500">87.5% de taxa de resposta</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Tempo Médio</h3>
          <p className="text-3xl font-bold">5min</p>
          <p className="text-sm text-gray-500">Tempo de resposta</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Conversas Recentes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Última Mensagem</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensagens.map((mensagem) => (
              <TableRow key={mensagem.id}>
                <TableCell>{mensagem.cliente}</TableCell>
                <TableCell>{mensagem.telefone}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {mensagem.ultimaMensagem}
                </TableCell>
                <TableCell>{mensagem.horario}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      mensagem.status === 'nao_lida'
                        ? 'destructive'
                        : mensagem.status === 'lida'
                        ? 'secondary'
                        : 'success'
                    }
                  >
                    {mensagem.status === 'nao_lida'
                      ? 'Não Lida'
                      : mensagem.status === 'lida'
                      ? 'Lida'
                      : 'Respondida'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Send className="h-4 w-4" />
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
