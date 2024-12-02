export type TipoRelatorio = 
    | 'vendas'
    | 'produtos'
    | 'clientes'
    | 'financeiro';

export type FormatoRelatorio = 
    | 'pdf'
    | 'excel'
    | 'csv';

export interface FiltrosRelatorio {
    dataInicio?: string;
    dataFim?: string;
    tipo: TipoRelatorio;
    formato: FormatoRelatorio;
    incluirGraficos?: boolean;
    incluirDetalhes?: boolean;
}

export interface RelatorioVendas {
    periodo: {
        inicio: string;
        fim: string;
    };
    totais: {
        quantidade: number;
        valor: number;
        desconto: number;
        ticketMedio: number;
    };
    porStatus: {
        status: string;
        quantidade: number;
        valor: number;
    }[];
    porCliente: {
        clienteId: string;
        nomeCliente: string;
        quantidade: number;
        valor: number;
    }[];
    porProduto: {
        produtoId: string;
        nomeProduto: string;
        quantidade: number;
        valor: number;
    }[];
}

export interface RelatorioProdutos {
    totais: {
        quantidade: number;
        valorEstoque: number;
        produtosBaixoEstoque: number;
    };
    porCategoria: {
        categoria: string;
        quantidade: number;
        valor: number;
    }[];
    maisVendidos: {
        produtoId: string;
        nome: string;
        quantidade: number;
        valor: number;
    }[];
    menosVendidos: {
        produtoId: string;
        nome: string;
        quantidade: number;
        valor: number;
    }[];
    baixoEstoque: {
        produtoId: string;
        nome: string;
        estoqueAtual: number;
        estoqueMinimo: number;
    }[];
}

export interface RelatorioClientes {
    totais: {
        quantidade: number;
        ativos: number;
        inativos: number;
    };
    porRegiao: {
        estado: string;
        quantidade: number;
    }[];
    maioresCompradores: {
        clienteId: string;
        nome: string;
        quantidadeCompras: number;
        valorTotal: number;
    }[];
    ultimasCompras: {
        clienteId: string;
        nome: string;
        dataUltimaCompra: string;
        valorUltimaCompra: number;
    }[];
}

export interface RelatorioFinanceiro {
    periodo: {
        inicio: string;
        fim: string;
    };
    receitas: {
        total: number;
        porFormaPagamento: {
            forma: string;
            valor: number;
            percentual: number;
        }[];
        porPeriodo: {
            data: string;
            valor: number;
        }[];
    };
    descontos: {
        total: number;
        porPeriodo: {
            data: string;
            valor: number;
        }[];
    };
    indicadores: {
        ticketMedio: number;
        taxaConversao: number;
        crescimento: number;
    };
}
