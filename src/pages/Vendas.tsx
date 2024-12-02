import { useState, useEffect } from 'react';
import { VendaService } from '@/services/VendaService';
import { Venda, VendaFiltros } from '@/types/venda';
import { VendaList } from '@/components/Vendas/VendaList';
import { VendaDetalhes } from '@/components/Vendas/VendaDetalhes';
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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function Vendas() {
    const [loading, setLoading] = useState(true);
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [filtros, setFiltros] = useState<VendaFiltros>({
        ordenacao: 'data',
        ordem: 'desc',
    });
    const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const carregarVendas = async () => {
        try {
            setLoading(true);
            const data = await VendaService.listarVendas(filtros);
            setVendas(data);
        } catch (error) {
            toast.error('Erro ao carregar vendas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarVendas();
    }, [filtros]);

    const handleViewVenda = (venda: Venda) => {
        setVendaSelecionada(venda);
        setDialogOpen(true);
    };

    const handleUpdateStatus = async (id: string, status: 'aprovada' | 'cancelada') => {
        try {
            await VendaService.atualizarStatus(id, status);
            toast.success(`Venda ${status === 'aprovada' ? 'aprovada' : 'cancelada'} com sucesso`);
            carregarVendas();
        } catch (error) {
            toast.error('Erro ao atualizar status da venda');
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Histórico de Vendas</h1>
                <Button onClick={carregarVendas}>
                    Atualizar
                </Button>
            </div>

            <div className="flex gap-4">
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
                    value={filtros.status}
                    onValueChange={(value: any) =>
                        setFiltros({ ...filtros, status: value })
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovada">Aprovada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                </Select>

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
                        <SelectItem value="data">Data</SelectItem>
                        <SelectItem value="valor">Valor</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
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
                <VendaList
                    vendas={vendas}
                    onView={handleViewVenda}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Venda</DialogTitle>
                    </DialogHeader>
                    {vendaSelecionada && (
                        <VendaDetalhes venda={vendaSelecionada} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
