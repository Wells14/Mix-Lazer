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
import { Orcamento, ItemOrcamento } from "@/types/orcamento";

const Orcamentos = () => {
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
    // TODO: Implementar visualização detalhada
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

    return matchCliente && matchStatus;
  });

  const totalPaginas = Math.ceil(orcamentosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const orcamentosPaginados = orcamentosFiltrados.slice(inicio, fim);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="rascunhos">Rascunhos</TabsTrigger>
            <TabsTrigger value="enviados">Enviados</TabsTrigger>
            <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={() => setShowNovoOrcamento(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Filtrar por cliente"
            value={filtro.cliente}
            onChange={(e) => setFiltro({ ...filtro, cliente: e.target.value })}
          />
          <Input
            placeholder="Filtrar por status"
            value={filtro.status}
            onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentosPaginados.map((orcamento) => (
                <TableRow key={orcamento.id}>
                  <TableCell>{orcamento.numero}</TableCell>
                  <TableCell>{formatDate(new Date(orcamento.data))}</TableCell>
                  <TableCell>{orcamento.cliente.nome}</TableCell>
                  <TableCell>{formatCurrency(orcamento.total || 0)}</TableCell>
                  <TableCell>{orcamento.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEnviarEmail(orcamento.cliente.email)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEnviarMensagem(orcamento.cliente.telefone)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditarOrcamento(orcamento)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVisualizarOrcamento(orcamento)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleDuplicarOrcamento(orcamento)}>
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExcluirOrcamento(orcamento.id)}>
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
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {paginaAtual} de {totalPaginas}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={showNovoOrcamento} onOpenChange={setShowNovoOrcamento}>
        <DialogContent className="max-w-4xl">
          <NovoOrcamentoForm onSuccess={() => setShowNovoOrcamento(false)} />
        </DialogContent>
      </Dialog>

      {orcamentoEmEdicao && (
        <Dialog open={!!orcamentoEmEdicao} onOpenChange={handleFecharEdicao}>
          <DialogContent className="max-w-4xl">
            <OrcamentoForm 
              orcamento={orcamentoEmEdicao} 
              onSuccess={handleFecharEdicao}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Orcamentos;