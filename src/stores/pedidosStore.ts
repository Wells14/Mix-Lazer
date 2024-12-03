import { create } from 'zustand';

export interface Item {
  id: string;
  nome: string;
  tipo: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Pedido {
  id: number;
  status: string;
  data: string;
  cliente: string;
  entrega: string;
  valor: number;
  items: Item[];
  expandido?: boolean;
  automacoes?: string[];
}

interface PedidosStore {
  pedidos: Pedido[];
  filtroCliente: string;
  filtroStatus: string;
  pesquisa: string;
  itensPorPagina: number;
  paginaAtual: number;
  
  setFiltroCliente: (filtro: string) => void;
  setFiltroStatus: (filtro: string) => void;
  setPesquisa: (termo: string) => void;
  setItensPorPagina: (quantidade: number) => void;
  setPaginaAtual: (pagina: number) => void;
  toggleExpansao: (id: number) => void;
  adicionarItem: (pedidoId: number, item: Item) => void;
  removerItem: (pedidoId: number, itemId: string) => void;
  editarItem: (pedidoId: number, itemId: string, novoItem: Item) => void;
  atualizarStatus: (pedidoId: number, novoStatus: string) => void;
  duplicarPedido: (id: number) => void;
  excluirPedido: (id: number) => void;
  criarNovoPedido: (pedido: Omit<Pedido, 'id'>) => void;
}

export const usePedidosStore = create<PedidosStore>((set) => ({
  pedidos: [
    {
      id: 11,
      status: "Aguardando",
      data: "27/11/24",
      cliente: "Cliente Empresa Exemplo",
      entrega: "27/11/24",
      valor: 380.00,
      automacoes: ["email", "whatsapp", "pdf", "arte", "producao"],
      items: [
        { 
          id: "1", 
          nome: "Lona Simples", 
          tipo: "material",
          quantidade: 5,
          valorUnitario: 76.00,
          valorTotal: 380.00
        }
      ]
    },
    {
      id: 10,
      status: "Entregue",
      data: "27/11/24",
      cliente: "Cliente Empresa Exemplo",
      entrega: "27/11/24",
      valor: 1288.02,
      automacoes: ["email", "whatsapp", "pdf", "arte", "producao"],
      items: [
        { 
          id: "2", 
          nome: "Apostila Padrão", 
          tipo: "documento",
          quantidade: 10,
          valorUnitario: 89.20,
          valorTotal: 892.02
        },
        { 
          id: "3", 
          nome: "Lona Simples", 
          tipo: "material",
          quantidade: 5,
          valorUnitario: 79.20,
          valorTotal: 396.00
        }
      ]
    },
    {
      id: 9,
      status: "Arte",
      data: "27/11/24",
      cliente: "Cleberson Calcme",
      entrega: "27/11/24",
      valor: 500.00,
      automacoes: ["email", "whatsapp", "pdf", "arte", "producao"],
      items: [
        { 
          id: "4", 
          nome: "Cartão de Visita 4x0 c/ Verniz Localizado", 
          tipo: "produto",
          quantidade: 1000,
          valorUnitario: 0.50,
          valorTotal: 500.00
        }
      ]
    },
    {
      id: 8,
      status: "Produção",
      data: "27/11/24",
      cliente: "Cliente Empresa Exemplo",
      entrega: "27/11/24",
      valor: 380.00,
      automacoes: ["email", "whatsapp", "pdf", "arte", "producao"],
      items: [
        { 
          id: "5", 
          nome: "Lona Simples", 
          tipo: "material",
          quantidade: 5,
          valorUnitario: 76.00,
          valorTotal: 380.00
        }
      ]
    }
  ],
  filtroCliente: "",
  filtroStatus: "todos",
  pesquisa: "",
  itensPorPagina: 10,
  paginaAtual: 1,

  setFiltroCliente: (filtro) => set({ filtroCliente: filtro }),
  setFiltroStatus: (filtro) => set({ filtroStatus: filtro }),
  setPesquisa: (termo) => set({ pesquisa: termo }),
  setItensPorPagina: (quantidade) => set({ itensPorPagina: quantidade }),
  setPaginaAtual: (pagina) => set({ paginaAtual: pagina }),
  
  toggleExpansao: (id) => set((state) => ({
    pedidos: state.pedidos.map(ped => 
      ped.id === id ? { ...ped, expandido: !ped.expandido } : ped
    )
  })),

  adicionarItem: (pedidoId, item) => set((state) => ({
    pedidos: state.pedidos.map(ped => 
      ped.id === pedidoId 
        ? { ...ped, items: [...ped.items, item] }
        : ped
    )
  })),

  removerItem: (pedidoId, itemId) => set((state) => ({
    pedidos: state.pedidos.map(ped => 
      ped.id === pedidoId 
        ? { ...ped, items: ped.items.filter(item => item.id !== itemId) }
        : ped
    )
  })),

  editarItem: (pedidoId, itemId, novoItem) => set((state) => ({
    pedidos: state.pedidos.map(ped => 
      ped.id === pedidoId 
        ? { 
            ...ped, 
            items: ped.items.map(item => 
              item.id === itemId ? { ...item, ...novoItem } : item
            )
          }
        : ped
    )
  })),

  atualizarStatus: (pedidoId, novoStatus) => set((state) => ({
    pedidos: state.pedidos.map(ped => 
      ped.id === pedidoId ? { ...ped, status: novoStatus } : ped
    )
  })),

  duplicarPedido: (id) => set((state) => {
    const pedidoParaDuplicar = state.pedidos.find(ped => ped.id === id);
    if (!pedidoParaDuplicar) return state;

    const novoId = Math.max(...state.pedidos.map(ped => ped.id)) + 1;
    const novoPedido = {
      ...pedidoParaDuplicar,
      id: novoId,
      status: "Aguardando",
      items: pedidoParaDuplicar.items.map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      }))
    };

    return {
      pedidos: [...state.pedidos, novoPedido]
    };
  }),

  excluirPedido: (id) => set((state) => ({
    pedidos: state.pedidos.filter(ped => ped.id !== id)
  })),

  criarNovoPedido: (pedido) => set((state) => {
    const novoId = Math.max(...state.pedidos.map(ped => ped.id)) + 1;
    return {
      pedidos: [
        { ...pedido, id: novoId },
        ...state.pedidos
      ]
    };
  })
}));
