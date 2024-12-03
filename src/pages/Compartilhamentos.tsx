import { useState, useEffect } from 'react';
import { CompartilhamentoService } from '@/services/CompartilhamentoService';
import { Compartilhamento, CompartilhamentoFiltros } from '@/types/compartilhamento';
import { CompartilhamentoList } from '@/components/Compartilhamento/CompartilhamentoList';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function Compartilhamentos() {
    const [loading, setLoading] = useState(true);
    const [compartilhamentos, setCompartilhamentos] = useState<Compartilhamento[]>([]);
    const [filtros, setFiltros] = useState<CompartilhamentoFiltros>({
        ordenacao: 'dataCriacao',
        ordem: 'desc',
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [compartilhamentoParaExcluir, setCompartilhamentoParaExcluir] = useState<string | null>(null);

    const carregarCompartilhamentos = async () => {
        try {
            setLoading(true);
            const data = await CompartilhamentoService.listarCompartilhamentos(filtros);
            setCompartilhamentos(data);
        } catch (error) {
            toast.error('Erro ao carregar compartilhamentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCompartilhamentos();
    }, [filtros]);

    const handleEdit = (compartilhamento: Compartilhamento) => {
        // Implementar edição
        console.log('Editar', compartilhamento);
    };

    const handleDelete = (id: string) => {
        setCompartilhamentoParaExcluir(id);
        setDialogOpen(true);
    };

    const confirmarExclusao = async () => {
        if (!compartilhamentoParaExcluir) return;

        try {
            await CompartilhamentoService.excluirCompartilhamento(compartilhamentoParaExcluir);
            toast.success('Compartilhamento excluído com sucesso');
            carregarCompartilhamentos();
        } catch (error) {
            toast.error('Erro ao excluir compartilhamento');
        } finally {
            setDialogOpen(false);
            setCompartilhamentoParaExcluir(null);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Compartilhamentos</h1>
                <Button onClick={carregarCompartilhamentos}>
                    Atualizar
                </Button>
            </div>

            <div className="flex gap-4">
                <Select
                    value={filtros.tipo}
                    onValueChange={(value: any) =>
                        setFiltros({ ...filtros, tipo: value })
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="orcamento">Orçamentos</SelectItem>
                        <SelectItem value="produto">Produtos</SelectItem>
                        <SelectItem value="cliente">Clientes</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) =>
                        setFiltros({ ...filtros, dataInicio: e.target.value })
                    }
                    className="w-[180px]"
                />

                <Input
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) =>
                        setFiltros({ ...filtros, dataFim: e.target.value })
                    }
                    className="w-[180px]"
                />

                <Select
                    value={filtros.ordenacao}
                    onValueChange={(value: any) =>
                        setFiltros({ ...filtros, ordenacao: value })
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dataCriacao">Data de Criação</SelectItem>
                        <SelectItem value="acessos">Acessos</SelectItem>
                        <SelectItem value="dataExpiracao">Data de Expiração</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filtros.ordem}
                    onValueChange={(value: any) =>
                        setFiltros({ ...filtros, ordem: value })
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordem" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Crescente</SelectItem>
                        <SelectItem value="desc">Decrescente</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="text-center">Carregando...</div>
            ) : (
                <CompartilhamentoList
                    compartilhamentos={compartilhamentos}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir este compartilhamento?
                            Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmarExclusao}
                        >
                            Excluir
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
