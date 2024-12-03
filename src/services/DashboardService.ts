import { DashboardData } from '../types/dashboard';
import { ProdutoService } from './ProdutoService';
import { ClienteService } from './ClienteService';
import { CacheService } from './CacheService';
import { LogService } from './LogService';

export class DashboardService {
    private static CACHE_PREFIX = 'dashboard';
    private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    static async getDashboardData(): Promise<DashboardData> {
        try {
            const cacheKey = `${this.CACHE_PREFIX}_data`;
            const cachedData = await CacheService.getCached(cacheKey);
            
            if (cachedData) {
                return cachedData;
            }

            // Dados simulados para demonstração
            // Em produção, isso viria do banco de dados
            const dashboardData: DashboardData = {
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
                    total: 80,
                    novos: 5,
                    ativos: 65,
                    comparacaoMesAnterior: 8.3
                },
                vendasPorPeriodo: [
                    { data: '2024-01-01', valor: 1200, quantidade: 5 },
                    { data: '2024-01-02', valor: 1500, quantidade: 7 },
                    { data: '2024-01-03', valor: 800, quantidade: 3 },
                    { data: '2024-01-04', valor: 2000, quantidade: 8 },
                    { data: '2024-01-05', valor: 1800, quantidade: 6 },
                    { data: '2024-01-06', valor: 1600, quantidade: 5 },
                    { data: '2024-01-07', valor: 2100, quantidade: 9 }
                ],
                vendasPorCategoria: [
                    { categoria: 'Móveis', valor: 5000, quantidade: 15, percentual: 33.33 },
                    { categoria: 'Decoração', valor: 3000, quantidade: 12, percentual: 20 },
                    { categoria: 'Iluminação', valor: 4000, quantidade: 10, percentual: 26.67 },
                    { categoria: 'Outros', valor: 3000, quantidade: 8, percentual: 20 }
                ],
                produtosMaisVendidos: [
                    { id: '1', nome: 'Mesa de Jantar', quantidade: 10, valor: 3000 },
                    { id: '2', nome: 'Sofá 3 Lugares', quantidade: 8, valor: 4000 },
                    { id: '3', nome: 'Luminária de Teto', quantidade: 15, valor: 1500 },
                    { id: '4', nome: 'Cadeira Escritório', quantidade: 12, valor: 2400 }
                ]
            };

            // Armazena no cache
            await CacheService.setCached(cacheKey, dashboardData, this.CACHE_DURATION);
            
            return dashboardData;
        } catch (error) {
            LogService.log('error', 'Erro ao buscar dados do dashboard', { error });
            throw new Error('Não foi possível carregar os dados do dashboard');
        }
    }

    static async getEstoqueBaixo() {
        try {
            const produtos = await ProdutoService.listarProdutos({ 
                estoqueMinimo: true 
            });
            return produtos;
        } catch (error) {
            LogService.log('error', 'Erro ao buscar produtos com estoque baixo', { error });
            throw new Error('Não foi possível carregar os produtos com estoque baixo');
        }
    }

    static async getClientesRecentes() {
        try {
            const clientes = await ClienteService.listarClientes({
                ordenacao: 'dataCadastro',
                ordem: 'desc'
            });
            return clientes.slice(0, 5); // Retorna os 5 clientes mais recentes
        } catch (error) {
            LogService.log('error', 'Erro ao buscar clientes recentes', { error });
            throw new Error('Não foi possível carregar os clientes recentes');
        }
    }
}
