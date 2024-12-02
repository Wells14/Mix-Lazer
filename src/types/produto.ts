export interface Dimensoes {
    altura: number;
    largura: number;
    profundidade: number;
    unidade: 'cm' | 'm';
}

export interface CustoProducao {
    materiais: number;
    maoDeObra: number;
    custoFixo: number;
    outros: number;
}

export interface Produto {
    id: string;
    codigo: string;
    nome: string;
    descricao: string;
    categoria: string;
    dimensoes: Dimensoes;
    custoProducao: CustoProducao;
    precoBase: number;
    margemLucro: number;
    precoVenda: number;
    estoque: number;
    estoqueMinimo: number;
    imagens: string[];
    ativo: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
    tags?: string[];
}

export interface ProdutoFiltros {
    busca?: string;
    categoria?: string;
    ordenacao?: 'nome' | 'codigo' | 'precoVenda' | 'estoque' | 'dataCriacao';
    ordem?: 'asc' | 'desc';
    apenasAtivos?: boolean;
    estoqueMinimo?: boolean;
}
