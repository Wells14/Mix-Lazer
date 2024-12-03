import { Cliente, ClienteFiltros } from '../types/cliente';
import { CacheService } from './CacheService';
import { LogService } from './LogService';
import { v4 as uuidv4 } from 'uuid';

export class ClienteService {
    private static CACHE_PREFIX = 'cliente';

    static async cadastrarCliente(cliente: Omit<Cliente, 'id' | 'dataCadastro' | 'ultimaAtualizacao'>): Promise<Cliente> {
        try {
            const novoCliente: Cliente = {
                ...cliente,
                id: uuidv4(),
                dataCadastro: new Date(),
                ultimaAtualizacao: new Date()
            };

            const cacheKey = `${this.CACHE_PREFIX}_${novoCliente.id}`;
            await CacheService.setCached(cacheKey, novoCliente);
            
            LogService.log('info', 'Cliente cadastrado com sucesso', { clienteId: novoCliente.id });
            return novoCliente;
        } catch (error) {
            LogService.log('error', 'Erro ao cadastrar cliente', { error });
            throw new Error('Não foi possível cadastrar o cliente');
        }
    }

    static async atualizarCliente(id: string, dadosAtualizacao: Partial<Cliente>): Promise<Cliente> {
        try {
            const cliente = await this.buscarCliente(id);
            if (!cliente) throw new Error('Cliente não encontrado');

            const clienteAtualizado: Cliente = {
                ...cliente,
                ...dadosAtualizacao,
                ultimaAtualizacao: new Date()
            };

            const cacheKey = `${this.CACHE_PREFIX}_${id}`;
            await CacheService.setCached(cacheKey, clienteAtualizado);

            LogService.log('info', 'Cliente atualizado com sucesso', { clienteId: id });
            return clienteAtualizado;
        } catch (error) {
            LogService.log('error', 'Erro ao atualizar cliente', { error, clienteId: id });
            throw new Error('Não foi possível atualizar o cliente');
        }
    }

    static async buscarCliente(id: string): Promise<Cliente | null> {
        try {
            const cacheKey = `${this.CACHE_PREFIX}_${id}`;
            const cliente = await CacheService.getCached(cacheKey);
            return cliente || null;
        } catch (error) {
            LogService.log('error', 'Erro ao buscar cliente', { error, clienteId: id });
            throw new Error('Não foi possível buscar o cliente');
        }
    }

    static async listarClientes(filtros?: ClienteFiltros): Promise<Cliente[]> {
        try {
            // Implementar lógica de filtros e paginação
            const clientes = await CacheService.getAllWithPrefix(this.CACHE_PREFIX);
            
            let clientesFiltrados = Object.values(clientes) as Cliente[];

            if (filtros?.busca) {
                const busca = filtros.busca.toLowerCase();
                clientesFiltrados = clientesFiltrados.filter(cliente => 
                    cliente.nome.toLowerCase().includes(busca) ||
                    cliente.email.toLowerCase().includes(busca) ||
                    cliente.documento.includes(busca)
                );
            }

            if (filtros?.tipo) {
                clientesFiltrados = clientesFiltrados.filter(cliente => 
                    cliente.tipo === filtros.tipo
                );
            }

            if (filtros?.ordenacao) {
                clientesFiltrados.sort((a, b) => {
                    const ordem = filtros.ordem === 'desc' ? -1 : 1;
                    switch (filtros.ordenacao) {
                        case 'nome':
                            return ordem * a.nome.localeCompare(b.nome);
                        case 'dataCadastro':
                            return ordem * (new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime());
                        case 'ultimaAtualizacao':
                            return ordem * (new Date(a.ultimaAtualizacao).getTime() - new Date(b.ultimaAtualizacao).getTime());
                        default:
                            return 0;
                    }
                });
            }

            return clientesFiltrados;
        } catch (error) {
            LogService.log('error', 'Erro ao listar clientes', { error });
            throw new Error('Não foi possível listar os clientes');
        }
    }

    static async excluirCliente(id: string): Promise<void> {
        try {
            const cacheKey = `${this.CACHE_PREFIX}_${id}`;
            await CacheService.removeCached(cacheKey);
            LogService.log('info', 'Cliente excluído com sucesso', { clienteId: id });
        } catch (error) {
            LogService.log('error', 'Erro ao excluir cliente', { error, clienteId: id });
            throw new Error('Não foi possível excluir o cliente');
        }
    }
}
