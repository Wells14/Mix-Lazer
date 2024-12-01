import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Orcamento, ItemOrcamento } from '../types/orcamento';
import { CalculoOrcamentoService } from '../services/calculoOrcamento';

interface OrcamentosStore {
  orcamentos: Orcamento[];
  filtroCliente: string;
  filtroStatus: string;
  pesquisa: string;
  itensPorPagina: number;
  paginaAtual: number;
  
  // Filtros e paginação
  setFiltroCliente: (filtro: string) => void;
  setFiltroStatus: (filtro: string) => void;
  setPesquisa: (termo: string) => void;
  setItensPorPagina: (quantidade: number) => void;
  setPaginaAtual: (pagina: number) => void;
  
  // Operações com orçamentos
  criarOrcamento: (orcamento: Omit<Orcamento, 'id' | 'numero'>) => void;
  duplicarOrcamento: (id: number) => void;
  excluirOrcamento: (id: number) => void;
  atualizarOrcamento: (id: number, orcamento: Partial<Orcamento>) => void;
  
  // Operações com itens
  adicionarItem: (orcamentoId: number, item: Omit<ItemOrcamento, 'id'>) => void;
  removerItem: (orcamentoId: number, itemId: string) => void;
  atualizarItem: (orcamentoId: number, itemId: string, item: Partial<ItemOrcamento>) => void;
  
  // Cálculos e atualizações
  recalcularOrcamento: (id: number) => void;
  atualizarStatus: (id: number, status: Orcamento['status']) => void;
}

export const useOrcamentosStore = create<OrcamentosStore>()(
  persist(
    (set, get) => ({
      orcamentos: [],
      filtroCliente: '',
      filtroStatus: '',
      pesquisa: '',
      itensPorPagina: 10,
      paginaAtual: 1,

      setFiltroCliente: (filtro) => set({ filtroCliente: filtro }),
      setFiltroStatus: (filtro) => set({ filtroStatus: filtro }),
      setPesquisa: (termo) => set({ pesquisa: termo }),
      setItensPorPagina: (quantidade) => set({ itensPorPagina: quantidade }),
      setPaginaAtual: (pagina) => set({ paginaAtual: pagina }),

      criarOrcamento: (orcamento) => {
        const orcamentos = get().orcamentos;
        const novoId = Math.max(0, ...orcamentos.map(o => o.id)) + 1;
        const novoNumero = `ORC${new Date().getFullYear()}${String(novoId).padStart(4, '0')}`;
        
        const novoOrcamento: Orcamento = {
          ...orcamento,
          id: novoId,
          numero: novoNumero,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
          versao: 1
        };
        
        set({ orcamentos: [...orcamentos, novoOrcamento] });
      },

      duplicarOrcamento: (id) => {
        const orcamentos = get().orcamentos;
        const orcamento = orcamentos.find(o => o.id === id);
        
        if (orcamento) {
          const { criarOrcamento } = get();
          const duplicata = {
            ...orcamento,
            numero: undefined,
            status: 'rascunho' as const,
            data: new Date().toISOString(),
            versao: 1
          };
          
          criarOrcamento(duplicata);
        }
      },

      excluirOrcamento: (id) => {
        set(state => ({
          orcamentos: state.orcamentos.filter(o => o.id !== id)
        }));
      },

      atualizarOrcamento: (id, atualizacao) => {
        set(state => ({
          orcamentos: state.orcamentos.map(o => 
            o.id === id 
              ? { 
                  ...o, 
                  ...atualizacao, 
                  atualizadoEm: new Date().toISOString(),
                  versao: o.versao + 1
                }
              : o
          )
        }));
      },

      adicionarItem: (orcamentoId, item) => {
        const novoItem: ItemOrcamento = {
          ...item,
          id: Math.random().toString(36).substr(2, 9)
        };
        
        // Calcula os valores do item
        const itemCalculado = CalculoOrcamentoService.calcularItem(novoItem);
        
        set(state => ({
          orcamentos: state.orcamentos.map(o => 
            o.id === orcamentoId
              ? { 
                  ...o, 
                  itens: [...o.itens, itemCalculado],
                  atualizadoEm: new Date().toISOString(),
                  versao: o.versao + 1
                }
              : o
          )
        }));
        
        // Recalcula os totais do orçamento
        get().recalcularOrcamento(orcamentoId);
      },

      removerItem: (orcamentoId, itemId) => {
        set(state => ({
          orcamentos: state.orcamentos.map(o => 
            o.id === orcamentoId
              ? { 
                  ...o, 
                  itens: o.itens.filter(i => i.id !== itemId),
                  atualizadoEm: new Date().toISOString(),
                  versao: o.versao + 1
                }
              : o
          )
        }));
        
        // Recalcula os totais do orçamento
        get().recalcularOrcamento(orcamentoId);
      },

      atualizarItem: (orcamentoId, itemId, atualizacao) => {
        set(state => ({
          orcamentos: state.orcamentos.map(o => 
            o.id === orcamentoId
              ? { 
                  ...o, 
                  itens: o.itens.map(i => 
                    i.id === itemId
                      ? CalculoOrcamentoService.calcularItem({ ...i, ...atualizacao })
                      : i
                  ),
                  atualizadoEm: new Date().toISOString(),
                  versao: o.versao + 1
                }
              : o
          )
        }));
        
        // Recalcula os totais do orçamento
        get().recalcularOrcamento(orcamentoId);
      },

      recalcularOrcamento: (id) => {
        set(state => ({
          orcamentos: state.orcamentos.map(o => {
            if (o.id !== id) return o;

            // Calcula subtotal
            const subtotal = o.itens.reduce((total, item) => total + item.precoTotal, 0);

            // Calcula impostos totais
            const impostos = o.itens.reduce((total, item) => 
              total + (item.precoTotal - (item.precoTotal / (1 + item.impostos.reduce((acc, imp) => acc + imp.porcentagem, 0) / 100))),
              0
            );

            // Calcula custo total
            const custoTotal = o.itens.reduce((total, item) => total + (item.custoUnitario * item.quantidade), 0);

            // Calcula margem de lucro total
            const margemLucroTotal = subtotal - custoTotal - impostos;

            // Calcula margem de contribuição
            const margemContribuicao = ((subtotal - custoTotal) / subtotal) * 100;

            return {
              ...o,
              subtotal,
              impostos,
              total: subtotal,
              custoTotal,
              margemLucroTotal,
              margemContribuicao,
              atualizadoEm: new Date().toISOString(),
              versao: o.versao + 1
            };
          })
        }));
      },

      atualizarStatus: (id, status) => {
        set(state => ({
          orcamentos: state.orcamentos.map(o => 
            o.id === id
              ? { 
                  ...o, 
                  status,
                  atualizadoEm: new Date().toISOString(),
                  versao: o.versao + 1
                }
              : o
          )
        }));
      }
    }),
    {
      name: 'orcamentos-storage'
    }
  )
);
