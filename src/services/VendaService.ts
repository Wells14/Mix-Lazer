import { Venda, VendaFiltros, NovaVenda, ItemVenda } from '@/types/venda';
import { CacheService } from './cacheService';
import { LogService } from './logService';
import { ClienteService } from './ClienteService';
import { ProdutoService } from './ProdutoService';
import { v4 as uuidv4 } from 'uuid';

export class VendaService {
    private static CACHE_PREFIX = 'venda';
    private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    static async criarVenda(dados: NovaVenda): Promise<Venda> {
        try {
            // Busca informações do cliente
            const cliente = await ClienteService.buscarCliente(dados.clienteId);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            // Processa os itens da venda
            const itens: ItemVenda[] = [];
            let subtotal = 0;

            for (const item of dados.itens) {
                const produto = await ProdutoService.buscarProduto(item.produtoId);
                if (!produto) {
                    throw new Error(`Produto ${item.produtoId} não encontrado`);
                }

                const precoTotal = item.quantidade * item.precoUnitario;
                itens.push({
                    id: uuidv4(),
                    produtoId: produto.id,
                    nomeProduto: produto.nome,
                    quantidade: item.quantidade,
                    precoUnitario: item.precoUnitario,
                    precoTotal,
                });

                subtotal += precoTotal;
            }

            const desconto = dados.desconto || 0;
            const total = subtotal - desconto;

            const novaVenda: Venda = {
                id: uuidv4(),
                clienteId: cliente.id,
                nomeCliente: cliente.nome,
                data: new Date().toISOString(),
                itens,
                subtotal,
                desconto,
                total,
                status: 'pendente',
                formaPagamento: dados.formaPagamento,
                parcelas: dados.parcelas,
                observacoes: dados.observacoes,
            };

            await this.salvarVenda(novaVenda);
            return novaVenda;
        } catch (error) {
            LogService.log('error', 'Erro ao criar venda', { error });
            throw new Error('Não foi possível criar a venda');
        }
    }

    static async listarVendas(filtros?: VendaFiltros): Promise<Venda[]> {
        try {
            const vendas = await this.getVendas();
            
            let resultado = [...vendas];

            if (filtros?.clienteId) {
                resultado = resultado.filter(v => v.clienteId === filtros.clienteId);
            }

            if (filtros?.status) {
                resultado = resultado.filter(v => v.status === filtros.status);
            }

            if (filtros?.dataInicio) {
                resultado = resultado.filter(v => 
                    new Date(v.data) >= new Date(filtros.dataInicio!)
                );
            }

            if (filtros?.dataFim) {
                resultado = resultado.filter(v => 
                    new Date(v.data) <= new Date(filtros.dataFim!)
                );
            }

            if (filtros?.valorMinimo !== undefined) {
                resultado = resultado.filter(v => v.total >= filtros.valorMinimo!);
            }

            if (filtros?.valorMaximo !== undefined) {
                resultado = resultado.filter(v => v.total <= filtros.valorMaximo!);
            }

            if (filtros?.ordenacao) {
                resultado.sort((a, b) => {
                    const ordem = filtros.ordem === 'desc' ? -1 : 1;
                    
                    switch (filtros.ordenacao) {
                        case 'data':
                            return ordem * (new Date(a.data).getTime() - new Date(b.data).getTime());
                        case 'valor':
                            return ordem * (a.total - b.total);
                        case 'cliente':
                            return ordem * a.nomeCliente.localeCompare(b.nomeCliente);
                        default:
                            return 0;
                    }
                });
            }

            return resultado;
        } catch (error) {
            LogService.log('error', 'Erro ao listar vendas', { error });
            throw new Error('Não foi possível listar as vendas');
        }
    }

    static async buscarVenda(id: string): Promise<Venda | null> {
        try {
            const vendas = await this.getVendas();
            return vendas.find(v => v.id === id) || null;
        } catch (error) {
            LogService.log('error', 'Erro ao buscar venda', { error });
            throw new Error('Não foi possível buscar a venda');
        }
    }

    static async atualizarStatus(id: string, status: 'pendente' | 'aprovada' | 'cancelada'): Promise<Venda> {
        try {
            const venda = await this.buscarVenda(id);
            if (!venda) {
                throw new Error('Venda não encontrada');
            }

            const vendaAtualizada = {
                ...venda,
                status
            };

            await this.salvarVenda(vendaAtualizada);
            return vendaAtualizada;
        } catch (error) {
            LogService.log('error', 'Erro ao atualizar status da venda', { error });
            throw new Error('Não foi possível atualizar o status da venda');
        }
    }

    static async calcularEstatisticas(dataInicio?: string, dataFim?: string) {
        try {
            const vendas = await this.getVendas();
            let vendasFiltradas = vendas;

            if (dataInicio) {
                vendasFiltradas = vendasFiltradas.filter(v => 
                    new Date(v.data) >= new Date(dataInicio)
                );
            }

            if (dataFim) {
                vendasFiltradas = vendasFiltradas.filter(v => 
                    new Date(v.data) <= new Date(dataFim)
                );
            }

            const aprovadas = vendasFiltradas.filter(v => v.status === 'aprovada');

            return {
                total: aprovadas.reduce((sum, v) => sum + v.total, 0),
                quantidade: aprovadas.length,
                ticketMedio: aprovadas.length > 0
                    ? aprovadas.reduce((sum, v) => sum + v.total, 0) / aprovadas.length
                    : 0,
                totalDesconto: aprovadas.reduce((sum, v) => sum + v.desconto, 0),
            };
        } catch (error) {
            LogService.log('error', 'Erro ao calcular estatísticas', { error });
            throw new Error('Não foi possível calcular as estatísticas');
        }
    }

    private static async getVendas(): Promise<Venda[]> {
        const cacheKey = `${this.CACHE_PREFIX}_list`;
        const cached = await CacheService.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        // Em produção, isso viria do backend
        const vendas: Venda[] = [];
        await CacheService.setCached(cacheKey, vendas, this.CACHE_DURATION);
        
        return vendas;
    }

    private static async salvarVenda(venda: Venda): Promise<void> {
        const vendas = await this.getVendas();
        const index = vendas.findIndex(v => v.id === venda.id);
        
        if (index >= 0) {
            vendas[index] = venda;
        } else {
            vendas.push(venda);
        }

        const cacheKey = `${this.CACHE_PREFIX}_list`;
        await CacheService.setCached(cacheKey, vendas, this.CACHE_DURATION);
    }
}
