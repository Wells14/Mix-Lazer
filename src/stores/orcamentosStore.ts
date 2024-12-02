import { create } from 'zustand';
import { Orcamento, ItemOrcamento } from '@/types/orcamento';
import { v4 as uuidv4 } from 'uuid';

interface OrcamentosStore {
  orcamentos: Orcamento[];
  filtro: {
    cliente?: string;
    status?: string;
    dataInicio?: Date;
    dataFim?: Date;
  };
  paginacao: {
    pagina: number;
    itensPorPagina: number;
  };
  adicionarOrcamento: (orcamento: Omit<Orcamento, 'id' | 'numero'>) => Promise<Orcamento>;
  atualizarOrcamento: (id: string, orcamento: Orcamento) => void;
  removerOrcamento: (id: string) => void;
  adicionarItemOrcamento: (orcamentoId: string, item: Omit<ItemOrcamento, 'id' | 'orcamentoId'>) => Promise<ItemOrcamento>;
  atualizarItemOrcamento: (orcamentoId: string, itemId: string, item: Partial<ItemOrcamento>) => void;
  removerItemOrcamento: (orcamentoId: string, itemId: string) => void;
  setFiltro: (filtro: OrcamentosStore['filtro']) => void;
  setPaginacao: (paginacao: OrcamentosStore['paginacao']) => void;
}

const gerarNumeroOrcamento = async () => {
  // Implementação para gerar número de orçamento
  return '000001';
};

export const useOrcamentosStore = create<OrcamentosStore>((set) => ({
  orcamentos: [],
  filtro: {},
  paginacao: {
    pagina: 1,
    itensPorPagina: 10
  },

  adicionarOrcamento: async (orcamento) => {
    try {
      const novoNumero = await gerarNumeroOrcamento();
      const novoOrcamento: Orcamento = {
        id: uuidv4(),
        numero: novoNumero,
        ...orcamento,
        total: orcamento.total || 0,
        valorTotal: orcamento.total || 0,
        itens: []
      };
      set((state) => ({
        orcamentos: [...state.orcamentos, novoOrcamento],
      }));
      return novoOrcamento;
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
      throw error;
    }
  },

  atualizarOrcamento: (id, orcamentoAtualizado) => set((state) => ({
    orcamentos: state.orcamentos.map((orcamento) =>
      orcamento.id === id ? { ...orcamento, ...orcamentoAtualizado } : orcamento
    )
  })),

  removerOrcamento: (id) => set((state) => ({
    orcamentos: state.orcamentos.filter((orcamento) => orcamento.id !== id)
  })),

  adicionarItemOrcamento: async (orcamentoId, item) => {
    try {
      const novoItem: ItemOrcamento = {
        id: uuidv4(),
        orcamentoId,
        ...item,
      };

      set((state) => ({
        orcamentos: state.orcamentos.map((orcamento) =>
          orcamento.id === orcamentoId
            ? {
                ...orcamento,
                itens: [...orcamento.itens, novoItem],
              }
            : orcamento
        ),
      }));

      return novoItem;
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      throw error;
    }
  },

  atualizarItemOrcamento: async (orcamentoId, itemId, item) => {
    try {
      set((state) => ({
        orcamentos: state.orcamentos.map((orcamento) =>
          orcamento.id === orcamentoId
            ? {
                ...orcamento,
                itens: orcamento.itens.map((i) =>
                  i.id === itemId ? { ...i, ...item } : i
                ),
              }
            : orcamento
        ),
      }));
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      throw error;
    }
  },

  removerItemOrcamento: async (orcamentoId, itemId) => {
    try {
      set((state) => ({
        orcamentos: state.orcamentos.map((orcamento) =>
          orcamento.id === orcamentoId
            ? {
                ...orcamento,
                itens: orcamento.itens.filter((item) => item.id !== itemId),
              }
            : orcamento
        ),
      }));
    } catch (error) {
      console.error("Erro ao remover item:", error);
      throw error;
    }
  },

  setFiltro: (novoFiltro) => set({ filtro: novoFiltro }),

  setPaginacao: (novaPaginacao) => set({ paginacao: novaPaginacao })
}));
