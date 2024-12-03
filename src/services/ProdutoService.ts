import { Produto, ProdutoFiltros } from '../types/produto';
import { CacheService } from './CacheService';
import { LogService } from './LogService';
import { v4 as uuidv4 } from 'uuid';

export class ProdutoService {
    private static CACHE_PREFIX = 'produto';

    private static calcularPrecoVenda(custoProducao: number, margemLucro: number): number {
        const custoTotal = custoProducao;
        return custoTotal * (1 + margemLucro / 100);
    }

    private static gerarCodigo(): string {
        // Gera um código único no formato PRD-XXXXX
        const numero = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return `PRD-${numero}`;
    }

    static async cadastrarProduto(produto: Omit<Produto, 'id' | 'codigo' | 'dataCriacao' | 'dataAtualizacao' | 'precoVenda'>): Promise<Produto> {
        try {
            const custoTotal = Object.values(produto.custoProducao).reduce((a, b) => a + b, 0);
            const precoVenda = this.calcularPrecoVenda(custoTotal, produto.margemLucro);

            const novoProduto: Produto = {
                ...produto,
                id: uuidv4(),
                codigo: this.gerarCodigo(),
                precoVenda,
                dataCriacao: new Date(),
                dataAtualizacao: new Date()
            };

            const cacheKey = `${this.CACHE_PREFIX}_${novoProduto.id}`;
            await CacheService.setCached(cacheKey, novoProduto);
            
            LogService.log('info', 'Produto cadastrado com sucesso', { produtoId: novoProduto.id });
            return novoProduto;
        } catch (error) {
            LogService.log('error', 'Erro ao cadastrar produto', { error });
            throw new Error('Não foi possível cadastrar o produto');
        }
    }

    static async atualizarProduto(id: string, dadosAtualizacao: Partial<Produto>): Promise<Produto> {
        try {
            const produto = await this.buscarProduto(id);
            if (!produto) throw new Error('Produto não encontrado');

            const custoTotal = Object.values({
                ...produto.custoProducao,
                ...dadosAtualizacao.custoProducao
            }).reduce((a, b) => a + b, 0);

            const margemLucro = dadosAtualizacao.margemLucro ?? produto.margemLucro;
            const precoVenda = this.calcularPrecoVenda(custoTotal, margemLucro);

            const produtoAtualizado: Produto = {
                ...produto,
                ...dadosAtualizacao,
                precoVenda,
                dataAtualizacao: new Date()
            };

            const cacheKey = `${this.CACHE_PREFIX}_${id}`;
            await CacheService.setCached(cacheKey, produtoAtualizado);

            LogService.log('info', 'Produto atualizado com sucesso', { produtoId: id });
            return produtoAtualizado;
        } catch (error) {
            LogService.log('error', 'Erro ao atualizar produto', { error, produtoId: id });
            throw new Error('Não foi possível atualizar o produto');
        }
    }

    static async buscarProduto(id: string): Promise<Produto | null> {
        try {
            const cacheKey = `${this.CACHE_PREFIX}_${id}`;
            const produto = await CacheService.getCached(cacheKey);
            return produto || null;
        } catch (error) {
            LogService.log('error', 'Erro ao buscar produto', { error, produtoId: id });
            throw new Error('Não foi possível buscar o produto');
        }
    }

    static async listarProdutos(filtros?: ProdutoFiltros): Promise<Produto[]> {
        try {
            const produtos = await CacheService.getAllWithPrefix(this.CACHE_PREFIX);
            let produtosFiltrados = Object.values(produtos) as Produto[];

            if (filtros?.apenasAtivos) {
                produtosFiltrados = produtosFiltrados.filter(p => p.ativo);
            }

            if (filtros?.estoqueMinimo) {
                produtosFiltrados = produtosFiltrados.filter(p => p.estoque <= p.estoqueMinimo);
            }

            if (filtros?.busca) {
                const busca = filtros.busca.toLowerCase();
                produtosFiltrados = produtosFiltrados.filter(p => 
                    p.nome.toLowerCase().includes(busca) ||
                    p.codigo.toLowerCase().includes(busca) ||
                    p.descricao.toLowerCase().includes(busca) ||
                    p.tags?.some(tag => tag.toLowerCase().includes(busca))
                );
            }

            if (filtros?.categoria) {
                produtosFiltrados = produtosFiltrados.filter(p => 
                    p.categoria === filtros.categoria
                );
            }

            if (filtros?.ordenacao) {
                produtosFiltrados.sort((a, b) => {
                    const ordem = filtros.ordem === 'desc' ? -1 : 1;
                    switch (filtros.ordenacao) {
                        case 'nome':
                            return ordem * a.nome.localeCompare(b.nome);
                        case 'codigo':
                            return ordem * a.codigo.localeCompare(b.codigo);
                        case 'precoVenda':
                            return ordem * (a.precoVenda - b.precoVenda);
                        case 'estoque':
                            return ordem * (a.estoque - b.estoque);
                        case 'dataCriacao':
                            return ordem * (new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime());
                        default:
                            return 0;
                    }
                });
            }

            return produtosFiltrados;
        } catch (error) {
            LogService.log('error', 'Erro ao listar produtos', { error });
            throw new Error('Não foi possível listar os produtos');
        }
    }

    static async excluirProduto(id: string): Promise<void> {
        try {
            const cacheKey = `${this.CACHE_PREFIX}_${id}`;
            await CacheService.removeCached(cacheKey);
            LogService.log('info', 'Produto excluído com sucesso', { produtoId: id });
        } catch (error) {
            LogService.log('error', 'Erro ao excluir produto', { error, produtoId: id });
            throw new Error('Não foi possível excluir o produto');
        }
    }

    static async atualizarEstoque(id: string, quantidade: number, tipo: 'entrada' | 'saida'): Promise<Produto> {
        try {
            const produto = await this.buscarProduto(id);
            if (!produto) throw new Error('Produto não encontrado');

            const novoEstoque = tipo === 'entrada' 
                ? produto.estoque + quantidade
                : produto.estoque - quantidade;

            if (novoEstoque < 0) {
                throw new Error('Estoque não pode ficar negativo');
            }

            const produtoAtualizado = await this.atualizarProduto(id, {
                estoque: novoEstoque,
                dataAtualizacao: new Date()
            });

            LogService.log('info', `${tipo === 'entrada' ? 'Entrada' : 'Saída'} de estoque registrada`, {
                produtoId: id,
                quantidade,
                estoqueAnterior: produto.estoque,
                estoqueAtual: novoEstoque
            });

            return produtoAtualizado;
        } catch (error) {
            LogService.log('error', 'Erro ao atualizar estoque', { error, produtoId: id });
            throw new Error('Não foi possível atualizar o estoque');
        }
    }

    static async listarCategorias(): Promise<string[]> {
        try {
            const produtos = await this.listarProdutos();
            const categorias = new Set(produtos.map(p => p.categoria));
            return Array.from(categorias).sort();
        } catch (error) {
            LogService.log('error', 'Erro ao listar categorias', { error });
            throw new Error('Não foi possível listar as categorias');
        }
    }
}
