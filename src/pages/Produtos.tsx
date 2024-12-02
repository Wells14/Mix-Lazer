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
import { ProdutoForm } from '@/components/Produtos/ProdutoForm';
import { Produto, ProdutoFiltros } from '@/types/produto';
import { ProdutoService } from '@/services/ProdutoService';
import { toast } from 'sonner';
import { 
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Package,
    AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Produtos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [filtros, setFiltros] = useState<ProdutoFiltros>({
        ordenacao: 'nome',
        ordem: 'asc',
        apenasAtivos: true
    });
    const [busca, setBusca] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const carregarProdutos = async () => {
        try {
            setLoading(true);
            const data = await ProdutoService.listarProdutos({
                ...filtros,
                busca
            });
            setProdutos(data);
        } catch (error) {
            toast.error('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const carregarCategorias = async () => {
        try {
            const data = await ProdutoService.listarCategorias();
            setCategorias(data);
        } catch (error) {
            toast.error('Erro ao carregar categorias');
        }
    };

    useEffect(() => {
        carregarProdutos();
        carregarCategorias();
    }, [filtros, busca]);

    const handleExcluir = async (produto: Produto) => {
        if (!confirm(`Deseja realmente excluir o produto ${produto.nome}?`)) {
            return;
        }

        try {
            await ProdutoService.excluirProduto(produto.id);
            toast.success('Produto excluído com sucesso!');
            carregarProdutos();
        } catch (error) {
            toast.error('Erro ao excluir produto');
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <Button onClick={() => {
                    setProdutoSelecionado(undefined);
                    setShowForm(true);
                }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Produto
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Buscar produtos..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10"
                    />
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {filtros.categoria || 'Todas Categorias'} ▼
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFiltros({ ...filtros, categoria: undefined })}>
                            Todas Categorias
                        </DropdownMenuItem>
                        {categorias.map((categoria) => (
                            <DropdownMenuItem 
                                key={categoria}
                                onClick={() => setFiltros({ ...filtros, categoria })}
                            >
                                {categoria}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant={filtros.apenasAtivos ? 'default' : 'outline'}
                    onClick={() => setFiltros({ ...filtros, apenasAtivos: !filtros.apenasAtivos })}
                >
                    Apenas Ativos
                </Button>

                <Button
                    variant={filtros.estoqueMinimo ? 'default' : 'outline'}
                    onClick={() => setFiltros({ ...filtros, estoqueMinimo: !filtros.estoqueMinimo })}
                >
                    Estoque Mínimo
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : produtos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Nenhum produto encontrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            produtos.map((produto) => (
                                <TableRow key={produto.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{produto.nome}</p>
                                            <p className="text-sm text-gray-500">{produto.codigo}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{produto.categoria}</TableCell>
                                    <TableCell>{formatCurrency(produto.precoVenda)}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 mr-2" />
                                                {produto.estoque} unidades
                                            </div>
                                            {produto.estoque <= produto.estoqueMinimo && (
                                                <div className="flex items-center text-amber-500">
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    Estoque baixo
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            produto.ativo 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {produto.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </TableCell>
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
                                                        setProdutoSelecionado(produto);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleExcluir(produto)}
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

            <ProdutoForm
                produto={produtoSelecionado}
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSave={carregarProdutos}
            />
        </div>
    );
}
