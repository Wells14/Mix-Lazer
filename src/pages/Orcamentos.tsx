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
import { OrcamentoItems } from "@/components/Orcamentos/OrcamentoItems";

const Orcamentos = () => {
  const [selectedTab, setSelectedTab] = useState("lista");
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  const { 
    orcamentos,
    filtroCliente,
    filtroStatus,
    pesquisa,
    itensPorPagina,
    paginaAtual,
    setFiltroCliente,
    setFiltroStatus,
    setPesquisa,
    setItensPorPagina,
    setPaginaAtual,
    toggleExpansao,
    adicionarItem,
    removerItem,
    editarItem,
    atualizarStatus,
    duplicarOrcamento,
    excluirOrcamento
  } = useOrcamentosStore();

  const handleEnviarEmail = (cliente: string) => {
    toast.success(`E-mail enviado para ${cliente}`);
  };

  const handleEnviarMensagem = (cliente: string) => {
    toast.success(`Mensagem enviada para ${cliente}`);
  };

  const handleEditarOrcamento = (id: number) => {
    toast.info(`Editando orçamento #${id}`);
  };

  const handleVisualizarOrcamento = (id: number) => {
    toast.info(`Visualizando orçamento #${id}`);
  };

  const handleDuplicarOrcamento = (id: number) => {
    duplicarOrcamento(id);
    toast.success("Orçamento duplicado com sucesso!");
  };

  const handleExcluirOrcamento = (id: number) => {
    excluirOrcamento(id);
    toast.success("Orçamento excluído com sucesso!");
  };

  const handleAdicionarItem = (orcamentoId: number) => {
    const novoItem = {
      id: Math.random().toString(36).substr(2, 9),
      nome: "Novo Item",
      tipo: "produto"
    };
    adicionarItem(orcamentoId, novoItem);
    toast.success("Item adicionado com sucesso!");
  };

  const handleEditarItem = (orcamentoId: number, itemId: string) => {
    toast.info(`Editando item ${itemId} do orçamento #${orcamentoId}`);
  };

  const filteredOrcamentos = orcamentos.filter(orc => {
    const matchesCliente = orc.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
    const matchesStatus = filtroStatus === "todos" || orc.status === filtroStatus;
    const matchesPesquisa = orc.items.some(item => 
      item.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );
    return matchesCliente && matchesStatus && (pesquisa === "" || matchesPesquisa);
  });

  const paginatedOrcamentos = filteredOrcamentos.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const totalPages = Math.ceil(filteredOrcamentos.length / itensPorPagina);
  const valorTotal = filteredOrcamentos.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Orçamentos</h1>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="lista" className="data-[state=active]:bg-white">
              <span className="flex items-center gap-2">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="funil" className="data-[state=active]:bg-white">
              <span className="flex items-center gap-2">Funil de Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="tarefas" className="data-[state=active]:bg-white">
              <span className="flex items-center gap-2">Tarefas</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex justify-between items-center mt-4 gap-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1">
            <Input
              placeholder="Cliente"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="max-w-sm bg-white"
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Pesquisar"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="max-w-sm bg-white"
            />
          </div>
          <div className="flex-1">
            <select
              className="w-full max-w-sm h-10 rounded-md border border-gray-200 bg-white px-3 py-2"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos os Status</option>
              <option value="Novo Orçamento">Novo Orçamento</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setShowNovoOrcamento(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12 font-semibold">#</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Entrega</TableHead>
              <TableHead className="font-semibold">Relacionamento</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrcamentos.map((orcamento) => (
              <>
                <TableRow key={orcamento.id} className="cursor-pointer" onClick={() => toggleExpansao(orcamento.id)}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>{orcamento.id}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      orcamento.status === "Aprovado" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {orcamento.status}
                    </span>
                  </TableCell>
                  <TableCell>{orcamento.data}</TableCell>
                  <TableCell>{orcamento.cliente}</TableCell>
                  <TableCell>{orcamento.entrega}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnviarEmail(orcamento.cliente);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnviarMensagem(orcamento.cliente);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>R$ {orcamento.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarOrcamento(orcamento.id);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisualizarOrcamento(orcamento.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicarOrcamento(orcamento.id)}>
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
                {orcamento.expandido && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="pl-12">
                        {orcamento.items.length > 0 ? (
                          orcamento.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.nome}</span>
                                  <span className="text-sm text-gray-500">Quantidades</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditarItem(orcamento.id, item.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removerItem(orcamento.id, item.id)}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-gray-500">Nenhum item na lista.</div>
                        )}
                        <Button 
                          variant="ghost" 
                          className="text-blue-500 mt-2"
                          onClick={() => handleAdicionarItem(orcamento.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Item
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 flex justify-between items-center border-t bg-white">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Valor Total</span>
            <span className="font-bold text-gray-900">R$ {valorTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="border rounded p-1"
              value={itensPorPagina}
              onChange={(e) => setItensPorPagina(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{paginaAtual}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setPaginaAtual(Math.min(totalPages, paginaAtual + 1))}
              disabled={paginaAtual === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {showNovoOrcamento && (
        <OrcamentoForm onClose={() => setShowNovoOrcamento(false)} />
      )}
    </div>
  );
};

export default Orcamentos;