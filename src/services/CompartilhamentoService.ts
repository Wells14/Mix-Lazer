import { Compartilhamento, CompartilhamentoFiltros, NovoCompartilhamento } from '@/types/compartilhamento';
import { CacheService } from './CacheService';
import { LogService } from './LogService';
import { v4 as uuidv4 } from 'uuid';

export class CompartilhamentoService {
    private static CACHE_PREFIX = 'compartilhamento';
    private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    static async criarCompartilhamento(dados: NovoCompartilhamento): Promise<Compartilhamento> {
        try {
            const id = uuidv4();
            const novoCompartilhamento: Compartilhamento = {
                id,
                ...dados,
                dataCompartilhamento: new Date().toISOString(),
                linkCompartilhamento: `${window.location.origin}/share/${id}`,
                acessos: 0
            };

            await this.salvarCompartilhamento(novoCompartilhamento);
            return novoCompartilhamento;
        } catch (error) {
            LogService.log('error', 'Erro ao criar compartilhamento', { error });
            throw new Error('Não foi possível criar o compartilhamento');
        }
    }

    static async listarCompartilhamentos(filtros?: CompartilhamentoFiltros): Promise<Compartilhamento[]> {
        try {
            const compartilhamentos = await this.getCompartilhamentos();
            
            let resultado = [...compartilhamentos];

            if (filtros?.tipo) {
                resultado = resultado.filter(c => c.tipo === filtros.tipo);
            }

            if (filtros?.dataInicio) {
                resultado = resultado.filter(c => 
                    new Date(c.dataCompartilhamento) >= new Date(filtros.dataInicio!)
                );
            }

            if (filtros?.dataFim) {
                resultado = resultado.filter(c => 
                    new Date(c.dataCompartilhamento) <= new Date(filtros.dataFim!)
                );
            }

            if (filtros?.ordenacao) {
                resultado.sort((a, b) => {
                    const ordem = filtros.ordem === 'desc' ? -1 : 1;
                    
                    switch (filtros.ordenacao) {
                        case 'dataCriacao':
                            return ordem * (new Date(a.dataCompartilhamento).getTime() - new Date(b.dataCompartilhamento).getTime());
                        case 'acessos':
                            return ordem * (a.acessos - b.acessos);
                        case 'dataExpiracao':
                            if (!a.dataExpiracao) return 1;
                            if (!b.dataExpiracao) return -1;
                            return ordem * (new Date(a.dataExpiracao).getTime() - new Date(b.dataExpiracao).getTime());
                        default:
                            return 0;
                    }
                });
            }

            return resultado;
        } catch (error) {
            LogService.log('error', 'Erro ao listar compartilhamentos', { error });
            throw new Error('Não foi possível listar os compartilhamentos');
        }
    }

    static async buscarCompartilhamento(id: string): Promise<Compartilhamento | null> {
        try {
            const compartilhamentos = await this.getCompartilhamentos();
            return compartilhamentos.find(c => c.id === id) || null;
        } catch (error) {
            LogService.log('error', 'Erro ao buscar compartilhamento', { error });
            throw new Error('Não foi possível buscar o compartilhamento');
        }
    }

    static async atualizarCompartilhamento(id: string, dados: Partial<Compartilhamento>): Promise<Compartilhamento> {
        try {
            const compartilhamento = await this.buscarCompartilhamento(id);
            if (!compartilhamento) {
                throw new Error('Compartilhamento não encontrado');
            }

            const compartilhamentoAtualizado = {
                ...compartilhamento,
                ...dados
            };

            await this.salvarCompartilhamento(compartilhamentoAtualizado);
            return compartilhamentoAtualizado;
        } catch (error) {
            LogService.log('error', 'Erro ao atualizar compartilhamento', { error });
            throw new Error('Não foi possível atualizar o compartilhamento');
        }
    }

    static async excluirCompartilhamento(id: string): Promise<void> {
        try {
            const compartilhamentos = await this.getCompartilhamentos();
            const novosCompartilhamentos = compartilhamentos.filter(c => c.id !== id);
            await this.salvarTodosCompartilhamentos(novosCompartilhamentos);
        } catch (error) {
            LogService.log('error', 'Erro ao excluir compartilhamento', { error });
            throw new Error('Não foi possível excluir o compartilhamento');
        }
    }

    static async registrarAcesso(id: string): Promise<void> {
        try {
            const compartilhamento = await this.buscarCompartilhamento(id);
            if (!compartilhamento) {
                throw new Error('Compartilhamento não encontrado');
            }

            await this.atualizarCompartilhamento(id, {
                acessos: compartilhamento.acessos + 1,
                ultimoAcesso: new Date().toISOString()
            });
        } catch (error) {
            LogService.log('error', 'Erro ao registrar acesso', { error });
            throw new Error('Não foi possível registrar o acesso');
        }
    }

    private static async getCompartilhamentos(): Promise<Compartilhamento[]> {
        const cacheKey = `${this.CACHE_PREFIX}_list`;
        const cached = await CacheService.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        // Em produção, isso viria do backend
        const compartilhamentos: Compartilhamento[] = [];
        await CacheService.setCached(cacheKey, compartilhamentos, this.CACHE_DURATION);
        
        return compartilhamentos;
    }

    private static async salvarCompartilhamento(compartilhamento: Compartilhamento): Promise<void> {
        const compartilhamentos = await this.getCompartilhamentos();
        const index = compartilhamentos.findIndex(c => c.id === compartilhamento.id);
        
        if (index >= 0) {
            compartilhamentos[index] = compartilhamento;
        } else {
            compartilhamentos.push(compartilhamento);
        }

        await this.salvarTodosCompartilhamentos(compartilhamentos);
    }

    private static async salvarTodosCompartilhamentos(compartilhamentos: Compartilhamento[]): Promise<void> {
        const cacheKey = `${this.CACHE_PREFIX}_list`;
        await CacheService.setCached(cacheKey, compartilhamentos, this.CACHE_DURATION);
    }
}
