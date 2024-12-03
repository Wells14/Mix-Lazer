import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustoOperacional, CustoMaterial, Acabamento, ConfiguracaoImposto } from '../types/orcamento';

interface ProdutoPreDefinido {
  id: string;
  nome: string;
  tipo: string;
  descricao?: string;
  materiais: CustoMaterial[];
  acabamentos: Acabamento[];
  custosOperacionais: CustoOperacional[];
  margemLucroPadrao: number;
}

interface ConfiguracaoOrcamento {
  // Produtos e serviços pré-definidos
  produtos: ProdutoPreDefinido[];
  
  // Configurações de impostos
  impostos: ConfiguracaoImposto[];
  
  // Custos operacionais padrão
  custosOperacionaisPadrao: CustoOperacional[];
  
  // Acabamentos disponíveis
  acabamentosPadrao: Acabamento[];
  
  // Materiais cadastrados
  materiaisCadastrados: CustoMaterial[];
  
  // Margens de lucro padrão por tipo de produto/serviço
  margensPadrao: Record<string, number>;
  
  // Condições de pagamento disponíveis
  condicoesPagamento: string[];
  
  // Prazos de entrega padrão
  prazosEntrega: string[];
}

interface ConfiguracaoOrcamentoStore extends ConfiguracaoOrcamento {
  // Produtos e serviços
  adicionarProduto: (produto: ProdutoPreDefinido) => void;
  atualizarProduto: (id: string, produto: ProdutoPreDefinido) => void;
  removerProduto: (id: string) => void;
  
  // Impostos
  adicionarImposto: (imposto: ConfiguracaoImposto) => void;
  atualizarImposto: (nome: string, imposto: ConfiguracaoImposto) => void;
  removerImposto: (nome: string) => void;
  
  // Custos operacionais
  adicionarCustoOperacional: (custo: CustoOperacional) => void;
  atualizarCustoOperacional: (nome: string, custo: CustoOperacional) => void;
  removerCustoOperacional: (nome: string) => void;
  
  // Acabamentos
  adicionarAcabamento: (acabamento: Acabamento) => void;
  atualizarAcabamento: (nome: string, acabamento: Acabamento) => void;
  removerAcabamento: (nome: string) => void;
  
  // Materiais
  adicionarMaterial: (material: CustoMaterial) => void;
  atualizarMaterial: (nome: string, material: CustoMaterial) => void;
  removerMaterial: (nome: string) => void;
  
  // Margens
  definirMargemPadrao: (tipo: string, margem: number) => void;
  
  // Condições de pagamento
  adicionarCondicaoPagamento: (condicao: string) => void;
  removerCondicaoPagamento: (condicao: string) => void;
  
  // Prazos de entrega
  adicionarPrazoEntrega: (prazo: string) => void;
  removerPrazoEntrega: (prazo: string) => void;
}

export const useConfiguracaoOrcamentoStore = create<ConfiguracaoOrcamentoStore>()(
  persist(
    (set) => ({
      produtos: [],
      impostos: [],
      custosOperacionaisPadrao: [],
      acabamentosPadrao: [],
      materiaisCadastrados: [],
      margensPadrao: {},
      condicoesPagamento: [
        'À vista',
        '30 dias',
        '30/60 dias',
        '30/60/90 dias'
      ],
      prazosEntrega: [
        'Imediato',
        '5 dias úteis',
        '10 dias úteis',
        '15 dias úteis'
      ],

      // Implementação dos métodos
      adicionarProduto: (produto) =>
        set((state) => ({
          produtos: [...state.produtos, produto]
        })),

      atualizarProduto: (id, produto) =>
        set((state) => ({
          produtos: state.produtos.map((p) =>
            p.id === id ? produto : p
          )
        })),

      removerProduto: (id) =>
        set((state) => ({
          produtos: state.produtos.filter((p) => p.id !== id)
        })),

      adicionarImposto: (imposto) =>
        set((state) => ({
          impostos: [...state.impostos, imposto]
        })),

      atualizarImposto: (nome, imposto) =>
        set((state) => ({
          impostos: state.impostos.map((i) =>
            i.nome === nome ? imposto : i
          )
        })),

      removerImposto: (nome) =>
        set((state) => ({
          impostos: state.impostos.filter((i) => i.nome !== nome)
        })),

      adicionarCustoOperacional: (custo) =>
        set((state) => ({
          custosOperacionaisPadrao: [...state.custosOperacionaisPadrao, custo]
        })),

      atualizarCustoOperacional: (nome, custo) =>
        set((state) => ({
          custosOperacionaisPadrao: state.custosOperacionaisPadrao.map((c) =>
            c.nome === nome ? custo : c
          )
        })),

      removerCustoOperacional: (nome) =>
        set((state) => ({
          custosOperacionaisPadrao: state.custosOperacionaisPadrao.filter((c) => c.nome !== nome)
        })),

      adicionarAcabamento: (acabamento) =>
        set((state) => ({
          acabamentosPadrao: [...state.acabamentosPadrao, acabamento]
        })),

      atualizarAcabamento: (nome, acabamento) =>
        set((state) => ({
          acabamentosPadrao: state.acabamentosPadrao.map((a) =>
            a.nome === nome ? acabamento : a
          )
        })),

      removerAcabamento: (nome) =>
        set((state) => ({
          acabamentosPadrao: state.acabamentosPadrao.filter((a) => a.nome !== nome)
        })),

      adicionarMaterial: (material) =>
        set((state) => ({
          materiaisCadastrados: [...state.materiaisCadastrados, material]
        })),

      atualizarMaterial: (nome, material) =>
        set((state) => ({
          materiaisCadastrados: state.materiaisCadastrados.map((m) =>
            m.nome === nome ? material : m
          )
        })),

      removerMaterial: (nome) =>
        set((state) => ({
          materiaisCadastrados: state.materiaisCadastrados.filter((m) => m.nome !== nome)
        })),

      definirMargemPadrao: (tipo, margem) =>
        set((state) => ({
          margensPadrao: {
            ...state.margensPadrao,
            [tipo]: margem
          }
        })),

      adicionarCondicaoPagamento: (condicao) =>
        set((state) => ({
          condicoesPagamento: [...state.condicoesPagamento, condicao]
        })),

      removerCondicaoPagamento: (condicao) =>
        set((state) => ({
          condicoesPagamento: state.condicoesPagamento.filter((c) => c !== condicao)
        })),

      adicionarPrazoEntrega: (prazo) =>
        set((state) => ({
          prazosEntrega: [...state.prazosEntrega, prazo]
        })),

      removerPrazoEntrega: (prazo) =>
        set((state) => ({
          prazosEntrega: state.prazosEntrega.filter((p) => p !== prazo)
        }))
    }),
    {
      name: 'configuracao-orcamento-storage'
    }
  )
);
