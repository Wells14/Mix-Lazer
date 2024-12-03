import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Orcamento, ItemOrcamento } from '@/types/orcamento';
import { NovoOrcamentoFormData } from '@/types/novoOrcamento';

interface OrcamentosState {
  orcamentos: Orcamento[];
  orcamentoAtual: Orcamento | null;
  adicionarOrcamento: (dados: NovoOrcamentoFormData) => void;
  atualizarOrcamento: (orcamento: Orcamento) => void;
  removerOrcamento: (id: string) => void;
  selecionarOrcamento: (id: string) => void;
  adicionarItem: (orcamentoId: string, item: Omit<ItemOrcamento, 'id' | 'orcamentoId'>) => void;
  atualizarItem: (orcamentoId: string, item: ItemOrcamento) => void;
  removerItem: (orcamentoId: string, itemId: string) => void;
  calcularTotais: (orcamentoId: string) => void;
}

export const useOrcamentosStore = create<OrcamentosState>((set, get) => ({
  orcamentos: [],
  orcamentoAtual: null,

  adicionarOrcamento: (dados: NovoOrcamentoFormData) => {
    const novoOrcamento: Orcamento = {
      id: uuidv4(),
      numero: `ORC-${new Date().getFullYear()}-${String(get().orcamentos.length + 1).padStart(4, '0')}`,
      status: 'rascunho',
      data: dados.data.toISOString(),
      validade: dados.validade.toISOString(),
      cliente: dados.cliente,
      prazoEntrega: dados.prazoEntrega,
      formaPagamento: dados.formaPagamento,
      observacoes: dados.observacoes,
      itens: [],
      subtotal: 0,
      descontos: 0,
      impostos: 0,
      total: 0,
      custoTotal: 0,
      margemLucroTotal: 0,
      margemContribuicao: 0,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      versao: 1
    };

    set((state) => ({
      orcamentos: [...state.orcamentos, novoOrcamento],
      orcamentoAtual: novoOrcamento
    }));
  },

  atualizarOrcamento: (orcamento: Orcamento) => {
    set((state) => ({
      orcamentos: state.orcamentos.map((o) =>
        o.id === orcamento.id ? { ...orcamento, versao: (o.versao || 1) + 1 } : o
      ),
      orcamentoAtual: orcamento.id === state.orcamentoAtual?.id ? orcamento : state.orcamentoAtual
    }));
  },

  removerOrcamento: (id: string) => {
    set((state) => ({
      orcamentos: state.orcamentos.filter((o) => o.id !== id),
      orcamentoAtual: state.orcamentoAtual?.id === id ? null : state.orcamentoAtual
    }));
  },

  selecionarOrcamento: (id: string) => {
    set((state) => ({
      orcamentoAtual: state.orcamentos.find((o) => o.id === id) || null
    }));
  },

  adicionarItem: (orcamentoId: string, item: Omit<ItemOrcamento, 'id' | 'orcamentoId'>) => {
    const novoItem: ItemOrcamento = {
      id: uuidv4(),
      orcamentoId,
      ...item
    };

    set((state) => ({
      orcamentos: state.orcamentos.map((o) =>
        o.id === orcamentoId
          ? {
              ...o,
              itens: [...o.itens, novoItem],
              atualizadoEm: new Date().toISOString()
            }
          : o
      )
    }));

    get().calcularTotais(orcamentoId);
  },

  atualizarItem: (orcamentoId: string, item: ItemOrcamento) => {
    set((state) => ({
      orcamentos: state.orcamentos.map((o) =>
        o.id === orcamentoId
          ? {
              ...o,
              itens: o.itens.map((i) => (i.id === item.id ? item : i)),
              atualizadoEm: new Date().toISOString()
            }
          : o
      )
    }));

    get().calcularTotais(orcamentoId);
  },

  removerItem: (orcamentoId: string, itemId: string) => {
    set((state) => ({
      orcamentos: state.orcamentos.map((o) =>
        o.id === orcamentoId
          ? {
              ...o,
              itens: o.itens.filter((i) => i.id !== itemId),
              atualizadoEm: new Date().toISOString()
            }
          : o
      )
    }));

    get().calcularTotais(orcamentoId);
  },

  calcularTotais: (orcamentoId: string) => {
    set((state) => {
      const orcamento = state.orcamentos.find((o) => o.id === orcamentoId);
      if (!orcamento) return state;

      const subtotal = orcamento.itens.reduce((total, item) => total + item.precoTotal, 0);
      const custoTotal = orcamento.itens.reduce((total, item) => total + item.custoUnitario * item.quantidade, 0);
      const margemLucroTotal = subtotal - custoTotal;
      const margemContribuicao = custoTotal > 0 ? (margemLucroTotal / custoTotal) * 100 : 0;

      const impostos = subtotal * 0.1; // 10% de impostos por padrão
      const total = subtotal + impostos - orcamento.descontos;

      return {
        orcamentos: state.orcamentos.map((o) =>
          o.id === orcamentoId
            ? {
                ...o,
                subtotal,
                custoTotal,
                margemLucroTotal,
                margemContribuicao,
                impostos,
                total,
                atualizadoEm: new Date().toISOString()
              }
            : o
        )
      };
    });
  }
}));
