import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Orcamento } from '@/types/orcamento';
import type { NovoOrcamentoFormData } from '@/types/novoOrcamento';
import { useNotificacoesStore } from '@/services/notificacoes';

interface OrcamentosStore {
  orcamentos: Orcamento[];
  adicionarOrcamento: (dados: NovoOrcamentoFormData) => void;
  atualizarOrcamento: (orcamento: Orcamento) => void;
  removerOrcamento: (id: string) => void;
}

// Dados iniciais para demonstração
const dadosIniciais: Orcamento[] = [
  {
    id: '1',
    cliente: {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999'
    },
    data: new Date('2024-02-10'),
    status: 'pendente',
    itens: [
      {
        id: '1',
        descricao: 'Desenvolvimento de Website',
        quantidade: 1,
        valorUnitario: 5000,
        valorTotal: 5000
      }
    ],
    valorTotal: 5000,
    observacoes: 'Website institucional com 5 páginas'
  },
  {
    id: '2',
    cliente: {
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 88888-8888'
    },
    data: new Date('2024-02-09'),
    status: 'aprovado',
    itens: [
      {
        id: '1',
        descricao: 'Manutenção Mensal',
        quantidade: 1,
        valorUnitario: 1500,
        valorTotal: 1500
      }
    ],
    valorTotal: 1500,
    observacoes: 'Manutenção mensal do sistema'
  }
];

export const useOrcamentosStore = create<OrcamentosStore>()(
  persist(
    (set) => ({
      orcamentos: dadosIniciais,
      adicionarOrcamento: (dados) => {
        const { adicionarNotificacao } = useNotificacoesStore.getState();
        set((state) => {
          const novoOrcamento = {
            id: crypto.randomUUID(),
            ...dados,
            data: new Date(),
            status: 'pendente',
            valorTotal: dados.itens.reduce((total, item) => total + item.valorTotal, 0)
          };
          adicionarNotificacao('success', `Novo orçamento criado para ${dados.cliente.nome}`);
          return { orcamentos: [...state.orcamentos, novoOrcamento] };
        });
      },

      atualizarOrcamento: (orcamentoAtualizado) => {
        const { adicionarNotificacao } = useNotificacoesStore.getState();
        set((state) => {
          adicionarNotificacao('info', `Orçamento ${orcamentoAtualizado.id.substring(0, 8)} atualizado`);
          return {
            orcamentos: state.orcamentos.map(orcamento => 
              orcamento.id === orcamentoAtualizado.id ? orcamentoAtualizado : orcamento
            )
          };
        });
      },

      removerOrcamento: (id) => {
        const { adicionarNotificacao } = useNotificacoesStore.getState();
        set((state) => {
          const orcamento = state.orcamentos.find(o => o.id === id);
          if (orcamento) {
            adicionarNotificacao('warning', `Orçamento ${id.substring(0, 8)} removido`);
          }
          return {
            orcamentos: state.orcamentos.filter(orcamento => orcamento.id !== id)
          };
        });
      },
    }),
    {
      name: 'orcamentos-storage'
    }
  )
);
