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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Orcamento } from "@/types/orcamento";

export default function Orcamentos() {
  const [selectedTab, setSelectedTab] = useState("todos");
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

  const handleEnviarMensagem = (cliente: string) => {
    toast.success(`Mensagem enviada para ${cliente}`);
  };

  const handleEditarOrcamento = (orcamento: Orcamento) => {
    setOrcamentoEmEdicao(orcamento);
  };

  const handleFecharEdicao = () => {
    setOrcamentoEmEdicao(null);
  };

  const handleVisualizarOrcamento = (orcamento: Orcamento) => {
    toast.info(`Visualizando orçamento #${orcamento.numero}`);
  };

  const handleDuplicarOrcamento = async (orcamento: Orcamento) => {
    try {
      const novoOrcamento: Omit<Orcamento, 'id' | 'numero'> = {
        ...orcamento,
        data: new Date().toISOString(),
        validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'rascunho'
      };

      await adicionarOrcamento(novoOrcamento);
      toast.success("Orçamento duplicado com sucesso!");
    } catch (error) {
      toast.error("Erro ao duplicar orçamento");
    }
  };

  const handleExcluirOrcamento = async (id: string) => {
    try {
      await removerOrcamento(id);
      toast.success("Orçamento excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir orçamento");
    }
  };

  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    const matchCliente = filtro.cliente 
      ? orcamento.cliente.nome.toLowerCase().includes(filtro.cliente.toLowerCase())
      : true;
    
    const matchStatus = filtro.status
      ? orcamento.status === filtro.status
      : true;

    const matchData = (!filtro.dataInicio || !filtro.dataFim)
      ? true
      : new Date(orcamento.data) >= filtro.dataInicio && 
        new Date(orcamento.data) <= filtro.dataFim;

    return matchCliente && matchStatus && matchData;
  });

  const totalPaginas = Math.ceil(orcamentosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const orcamentosPaginados = orcamentosFiltrados.slice(inicio, fim);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Button onClick={() => setShowNovoOrcamento(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Buscar por cliente"
            value={filtro.cliente}
            onChange={(e) => setFiltro({ ...filtro, cliente: e.target.value })}
            className="max-w-xs"
          />
          <Input
            type="date"
            value={filtro.dataInicio?.toISOString().split('T')[0] || ''}
            onChange={(e) => setFiltro({ ...filtro, dataInicio: e.target.value ? new Date(e.target.value) : null })}
            className="max-w-xs"
          />
          <Input
            type="date"
            value={filtro.dataFim?.toISOString().split('T')[0] || ''}
            onChange={(e) => setFiltro({ ...filtro, dataFim: e.target.value ? new Date(e.target.value) : null })}
            className="max-w-xs"
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
            <TabsTrigger value="enviado">Enviado</TabsTrigger>
            <TabsTrigger value="aprovado">Aprovado</TabsTrigger>
            <TabsTrigger value="recusado">Recusado</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

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
              <TableCell>#{orcamento.numero}</TableCell>
              <TableCell>{orcamento.cliente.nome}</TableCell>
              <TableCell>{formatDate(orcamento.data)}</TableCell>
              <TableCell>{formatCurrency(orcamento.valorTotal)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  orcamento.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                  orcamento.status === 'recusado' ? 'bg-red-100 text-red-800' :
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
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEnviarMensagem(orcamento.cliente.nome)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditarOrcamento(orcamento)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVisualizarOrcamento(orcamento)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicarOrcamento(orcamento)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleExcluirOrcamento(orcamento.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
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

      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
          disabled={paginaAtual === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="py-2 px-4">
          Página {paginaAtual} de {totalPaginas}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showNovoOrcamento} onOpenChange={setShowNovoOrcamento}>
        <DialogContent className="max-w-4xl">
          <NovoOrcamentoForm
            onSave={async (novoOrcamento) => {
              await adicionarOrcamento(novoOrcamento);
              setShowNovoOrcamento(false);
              toast.success("Orçamento criado com sucesso!");
            }}
            onCancel={() => setShowNovoOrcamento(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!orcamentoEmEdicao} onOpenChange={() => setOrcamentoEmEdicao(null)}>
        <DialogContent className="max-w-4xl">
          {orcamentoEmEdicao && (
            <OrcamentoForm
              orcamento={orcamentoEmEdicao}
              onSave={async (orcamentoAtualizado) => {
                await atualizarOrcamento(orcamentoAtualizado);
                setOrcamentoEmEdicao(null);
                toast.success("Orçamento atualizado com sucesso!");
              }}
              onCancel={handleFecharEdicao}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}