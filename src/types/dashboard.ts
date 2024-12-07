export interface ProdutoMaisVendido {
  id: string;
  nome: string;
  quantidade: number;
  valor: number;
}

export interface VendaPorPeriodo {
  periodo: string;
  valor: number;
  quantidade: number;
}

export interface VendaPorCategoria {
  categoria: string;
  valor: number;
  quantidade: number;
  percentual: number;
}

export interface DashboardData {
  vendas: {
    total: number;
    quantidade: number;
    ticketMedio: number;
    comparacaoMesAnterior: {
      valor: number;
      percentual: number;
    };
  };
  estoque: {
    total: number;
    produtosBaixoEstoque: number;
    valorTotal: number;
  };
  clientes: {
    total: number;
    novos: number;
    ativos: number;
    comparacaoMesAnterior: {
      valor: number;
      percentual: number;
    };
  };
  produtos: {
    total: number;
    maisVendidos: ProdutoMaisVendido[];
  };
}
