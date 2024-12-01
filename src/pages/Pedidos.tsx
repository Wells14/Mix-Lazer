import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  MessageSquare,
  FileText,
  Palette,
  Factory,
  Edit2, 
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreVertical
} from "lucide-react";

const STATUS_COLORS = {
  'Aguardando': 'bg-blue-500 text-white',
  'Entregue': 'bg-green-500 text-white',
  'Arte': 'bg-orange-500 text-white',
  'Produção': 'bg-purple-500 text-white'
};

const MOCK_DATA = [
  {
    id: 11,
    status: 'Aguardando',
    data: '27/11/24',
    cliente: 'Cliente Empresa Exemplo',
    entrega: '27/11/24',
    valor: 380.00,
    items: [
      { id: 1, nome: 'Lona Simples', quantidade: 5, valorUnitario: 76.00, valorTotal: 380.00 }
    ]
  },
  {
    id: 10,
    status: 'Entregue',
    data: '27/11/24',
    cliente: 'Cliente Empresa Exemplo',
    entrega: '27/11/24',
    valor: 1288.02,
    items: [
      { id: 1, nome: 'Apostila Padrão', quantidade: 10, valorUnitario: 89.20, valorTotal: 892.02 },
      { id: 2, nome: 'Lona Simples', quantidade: 5, valorUnitario: 79.20, valorTotal: 396.00 }
    ]
  }
];

const Pedidos = () => {
  const [activeTab, setActiveTab] = useState("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const valorTotal = MOCK_DATA.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
        
        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="lista" className="flex items-center gap-2">
              Lista
            </TabsTrigger>
            <TabsTrigger value="entrega" className="flex items-center gap-2">
              Entrega Fracionada
            </TabsTrigger>
            <TabsTrigger value="tarefas" className="flex items-center gap-2">
              Tarefas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Pesquisar"
              className="max-w-sm"
            />
          </div>
          <select
            className="flex-1 max-w-sm h-10 rounded-md border border-gray-200 px-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="aguardando">Aguardando</option>
            <option value="entregue">Entregue</option>
            <option value="arte">Arte</option>
            <option value="producao">Produção</option>
          </select>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Automações</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DATA.map((pedido) => (
              <>
                <TableRow key={pedido.id} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRow(pedido.id)}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
                  </TableCell>
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[pedido.status as keyof typeof STATUS_COLORS]}`}>
                      {pedido.status}
                    </span>
                  </TableCell>
                  <TableCell>{pedido.data}</TableCell>
                  <TableCell>{pedido.cliente}</TableCell>
                  <TableCell>{pedido.entrega}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <FileText className="h-4 w-4 text-gray-500" />
                      <Palette className="h-4 w-4 text-gray-500" />
                      <Factory className="h-4 w-4 text-gray-500" />
                    </div>
                  </TableCell>
                  <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRows.includes(pedido.id) && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="pl-12">
                        {pedido.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">{item.nome}</span>
                                  <span className="ml-2 text-sm text-gray-500">{item.quantidade} unidades</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">R$ {item.valorUnitario.toFixed(2)} un</span>
                                  <span className="font-medium">R$ {item.valorTotal.toFixed(2)}</span>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button variant="ghost" className="text-blue-500 mt-2">
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
        <div className="p-4 flex justify-between items-center border-t">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Valor Total</span>
            <span className="font-bold text-gray-900">R$ {valorTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <select className="border rounded p-1">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>1</span>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
