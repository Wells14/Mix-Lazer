import { DashboardData } from '../types/dashboard';

export class DashboardService {
    static async getDashboardData(): Promise<DashboardData> {
        // Dados simulados para demonstração
        return {
            vendas: {
                total: 15000,
                quantidade: 45,
                ticketMedio: 333.33,
                comparacaoMesAnterior: 12.5
            },
            estoque: {
                total: 150,
                produtosBaixoEstoque: 8,
                valorTotal: 25000
            },
            clientes: {
                total: 120,
                ativos: 85,
                novos: 12,
                comparacaoMesAnterior: 8.3
            },
            vendasPorPeriodo: [
                { data: '2024-01', valor: 12000, quantidade: 40 },
                { data: '2024-02', valor: 15000, quantidade: 45 },
                { data: '2024-03', valor: 18000, quantidade: 50 }
            ],
            vendasPorCategoria: [
                { categoria: 'Eletrônicos', valor: 5000, quantidade: 20, percentual: 33.33 },
                { categoria: 'Móveis', valor: 3500, quantidade: 15, percentual: 23.33 },
                { categoria: 'Decoração', valor: 2500, quantidade: 10, percentual: 16.67 }
            ],
            produtosMaisVendidos: [
                { id: '1', nome: 'Produto A', quantidade: 25, valor: 2500 },
                { id: '2', nome: 'Produto B', quantidade: 18, valor: 1800 },
                { id: '3', nome: 'Produto C', quantidade: 15, valor: 1500 }
            ]
        };
    }
}
