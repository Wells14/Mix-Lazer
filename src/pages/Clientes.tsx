import { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClienteForm } from '@/components/Clientes/ClienteForm';
import { Cliente, ClienteFiltros } from '@/types/cliente';
import { ClienteService } from '@/services/ClienteService';
import { toast } from 'sonner';
import { 
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Mail,
    Phone
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filtros, setFiltros] = useState<ClienteFiltros>({
        ordenacao: 'nome',
        ordem: 'asc'
    });
    const [busca, setBusca] = useState('');
    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const carregarClientes = async () => {
        try {
            setLoading(true);
            const data = await ClienteService.listarClientes({
                ...filtros,
                busca
            });
            setClientes(data);
        } catch (error) {
            toast.error('Erro ao carregar clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarClientes();
    }, [filtros, busca]);

    const handleExcluir = async (cliente: Cliente) => {
        if (!confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
            return;
        }

        try {
            await ClienteService.excluirCliente(cliente.id);
            toast.success('Cliente excluído com sucesso!');
            carregarClientes();
        } catch (error) {
            toast.error('Erro ao excluir cliente');
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <Button onClick={() => {
                    setClienteSelecionado(undefined);
                    setShowForm(true);
                }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Buscar clientes..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10"
                    />
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {filtros.tipo || 'Todos'} ▼
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFiltros({ ...filtros, tipo: undefined })}>
                            Todos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFiltros({ ...filtros, tipo: 'PF' })}>
                            Pessoa Física
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFiltros({ ...filtros, tipo: 'PJ' })}>
                            Pessoa Jurídica
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Cadastro</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : clientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Nenhum cliente encontrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            clientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{cliente.nome}</p>
                                            <p className="text-sm text-gray-500">
                                                {cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {cliente.email}
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {cliente.telefone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{cliente.documento}</TableCell>
                                    <TableCell>{formatDate(cliente.dataCadastro)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setClienteSelecionado(cliente);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleExcluir(cliente)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ClienteForm
                cliente={clienteSelecionado}
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSave={carregarClientes}
            />
        </div>
    );
}
