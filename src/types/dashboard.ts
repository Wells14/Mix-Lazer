export interface MetricaVendas {
    total: number;
    quantidade: number;
    ticketMedio: number;
    comparacaoMesAnterior: number;
}

export interface MetricaEstoque {
    total: number;
    produtosBaixoEstoque: number;
    valorTotal: number;
}

export interface MetricaClientes {
    total: number;
    novos: number;
    ativos: number;
    comparacaoMesAnterior: number;
}

export interface VendaPorPeriodo {
    data: string;
    valor: number;
    quantidade: number;
}

export interface VendaPorCategoria {
    categoria: string;
    valor: number;
    quantidade: number;
    percentual: number;
}

export interface ProdutoMaisVendido {
    id: string;
    nome: string;
    quantidade: number;
    valor: number;
}

export interface DashboardData {
    vendas: MetricaVendas;
    estoque: MetricaEstoque;
    clientes: MetricaClientes;
    vendasPorPeriodo: VendaPorPeriodo[];
    vendasPorCategoria: VendaPorCategoria[];
    produtosMaisVendidos: ProdutoMaisVendido[];
}
