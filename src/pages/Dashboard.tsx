import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { VendasChart } from '@/components/Dashboard/VendasChart';
import { VendasPorCategoria } from '@/components/Dashboard/VendasPorCategoria';
import { ProdutosMaisVendidos } from '@/components/Dashboard/ProdutosMaisVendidos';
import { DashboardService } from '@/services/DashboardService';
import { DashboardData } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package
} from 'lucide-react';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const dashboardData = await DashboardService.getDashboardData();
            setData(dashboardData);
        } catch (error) {
            toast.error('Erro ao carregar dados do dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    if (loading || !data) {
        return (
            <div className="container mx-auto py-6">
                <div className="text-center">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button
                    onClick={carregarDados}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Atualizar dados
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <MetricCard
                    title="Vendas Totais"
                    value={formatCurrency(data.vendas.total)}
                    icon={DollarSign}
                    description={`${data.vendas.quantidade} vendas`}
                    trend={{
                        value: data.vendas.comparacaoMesAnterior,
                        isPositive: data.vendas.comparacaoMesAnterior > 0
                    }}
                />
                <MetricCard
                    title="Ticket Médio"
                    value={formatCurrency(data.vendas.ticketMedio)}
                    icon={ShoppingBag}
                />
                <MetricCard
                    title="Clientes"
                    value={data.clientes.total.toString()}
                    icon={Users}
                    description={`${data.clientes.ativos} clientes ativos`}
                    trend={{
                        value: data.clientes.comparacaoMesAnterior,
                        isPositive: data.clientes.comparacaoMesAnterior > 0
                    }}
                />
                <MetricCard
                    title="Produtos"
                    value={data.estoque.total.toString()}
                    icon={Package}
                    description={`${data.estoque.produtosBaixoEstoque} com estoque baixo`}
                />
            </div>

            <div className="grid grid-cols-7 gap-4">
                <VendasChart data={data.vendasPorPeriodo} />
                <VendasPorCategoria data={data.vendasPorCategoria} />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <ProdutosMaisVendidos produtos={data.produtosMaisVendidos} />
            </div>
        </div>
    );
}
