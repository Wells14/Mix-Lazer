export interface ItemVenda {
    id: string;
    produtoId: string;
    nomeProduto: string;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
}

export interface Venda {
    id: string;
    clienteId: string;
    nomeCliente: string;
    data: string;
    itens: ItemVenda[];
    subtotal: number;
    desconto: number;
    total: number;
    status: 'pendente' | 'aprovada' | 'cancelada';
    formaPagamento?: string;
    parcelas?: number;
    observacoes?: string;
}

export interface VendaFiltros {
    clienteId?: string;
    dataInicio?: string;
    dataFim?: string;
    status?: 'pendente' | 'aprovada' | 'cancelada';
    valorMinimo?: number;
    valorMaximo?: number;
    ordenacao?: 'data' | 'valor' | 'cliente';
    ordem?: 'asc' | 'desc';
}

export interface NovaVenda {
    clienteId: string;
    itens: {
        produtoId: string;
        quantidade: number;
        precoUnitario: number;
    }[];
    desconto?: number;
    formaPagamento?: string;
    parcelas?: number;
    observacoes?: string;
}
