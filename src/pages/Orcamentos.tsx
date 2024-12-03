import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Mail, 
  MessageSquare, 
  Edit2, 
  Eye, 
  MoreVertical, 
  Plus,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useOrcamentosStore } from "@/stores/orcamentosStore";
import { toast } from "sonner";
import { OrcamentoForm } from "@/components/Orcamentos/OrcamentoForm";
import { NovoOrcamentoForm } from "@/components/Orcamentos/NovoOrcamentoForm";
import { ListaItensOrcamento } from "@/components/Orcamentos/ListaItensOrcamento";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Orcamento } from "@/types/orcamento";
import type { NovoOrcamentoFormData } from "@/types/novoOrcamento";

export default function Orcamentos() {
  const [selectedTab, setSelectedTab] = useState<string>("todos");
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  const [orcamentoEmEdicao, setOrcamentoEmEdicao] = useState<Orcamento | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [filtro, setFiltro] = useState({
    cliente: "",
    status: "",
    dataInicio: null as Date | null,
    dataFim: null as Date | null
  });

  const { 
    orcamentos,
    adicionarOrcamento,
    atualizarOrcamento,
    removerOrcamento
  } = useOrcamentosStore();

  const handleEnviarEmail = (cliente: string) => {
    toast.success(`E-mail enviado para ${cliente}`);
  };

  const handleEnviarWhatsApp = (cliente: string) => {
    toast.success(`Mensagem enviada para ${cliente}`);
  };

  const handleNovoOrcamento = async (dados: NovoOrcamentoFormData) => {
    try {
      adicionarOrcamento(dados);
      setShowNovoOrcamento(false);
      toast.success('Orçamento criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar orçamento');
    }
  };

  const handleEditarOrcamento = async (orcamento: Orcamento) => {
    try {
      await atualizarOrcamento(orcamento);
      setOrcamentoEmEdicao(null);
      toast.success('Orçamento atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar orçamento');
    }
  };

  const handleRemoverOrcamento = async (id: string) => {
    try {
      await removerOrcamento(id);
      toast.success('Orçamento removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover orçamento');
    }
  };

  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    const matchCliente = orcamento.cliente.nome.toLowerCase().includes(filtro.cliente.toLowerCase());
    const matchStatus = !filtro.status || orcamento.status === filtro.status;
    const dataOrcamento = new Date(orcamento.data);
    const matchDataInicio = !filtro.dataInicio || dataOrcamento >= filtro.dataInicio;
    const matchDataFim = !filtro.dataFim || dataOrcamento <= filtro.dataFim;
    return matchCliente && matchStatus && matchDataInicio && matchDataFim;
  });

  const orcamentosPaginados = orcamentosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const totalPaginas = Math.ceil(orcamentosFiltrados.length / itensPorPagina);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button onClick={() => setShowNovoOrcamento(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por cliente..."
            value={filtro.cliente}
            onChange={(e) => setFiltro({ ...filtro, cliente: e.target.value })}
          />
          <Input
            type="date"
            value={filtro.dataInicio?.toISOString().split('T')[0] || ''}
            onChange={(e) => setFiltro({ ...filtro, dataInicio: e.target.value ? new Date(e.target.value) : null })}
          />
          <Input
            type="date"
            value={filtro.dataFim?.toISOString().split('T')[0] || ''}
            onChange={(e) => setFiltro({ ...filtro, dataFim: e.target.value ? new Date(e.target.value) : null })}
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
            <TabsTrigger value="enviado">Enviados</TabsTrigger>
            <TabsTrigger value="aprovado">Aprovados</TabsTrigger>
            <TabsTrigger value="rejeitado">Rejeitados</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentosPaginados.map((orcamento) => (
                <TableRow key={orcamento.id}>
                  <TableCell>{orcamento.numero}</TableCell>
                  <TableCell>{orcamento.cliente.nome}</TableCell>
                  <TableCell>{formatDate(orcamento.data)}</TableCell>
                  <TableCell>{formatCurrency(orcamento.total)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      orcamento.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                      orcamento.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                      orcamento.status === 'enviado' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEnviarEmail(orcamento.cliente.nome)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEnviarWhatsApp(orcamento.cliente.nome)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setOrcamentoEmEdicao(orcamento)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoverOrcamento(orcamento.id)}>
                            <X className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {orcamentosPaginados.length} de {orcamentosFiltrados.length} orçamentos
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showNovoOrcamento} onOpenChange={setShowNovoOrcamento}>
        <DialogContent className="max-w-4xl">
          <NovoOrcamentoForm
            onSubmit={handleNovoOrcamento}
            onCancel={() => setShowNovoOrcamento(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!orcamentoEmEdicao} onOpenChange={(open) => !open && setOrcamentoEmEdicao(null)}>
        <DialogContent className="max-w-4xl">
          {orcamentoEmEdicao && (
            <OrcamentoForm
              orcamento={orcamentoEmEdicao}
              onSubmit={handleEditarOrcamento}
              onCancel={() => setOrcamentoEmEdicao(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}