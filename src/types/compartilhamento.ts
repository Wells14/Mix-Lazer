export interface Compartilhamento {
    id: string;
    tipo: 'orcamento' | 'produto' | 'cliente';
    itemId: string;
    titulo: string;
    descricao?: string;
    dataCompartilhamento: string;
    dataExpiracao?: string;
    linkCompartilhamento: string;
    acessos: number;
    ultimoAcesso?: string;
    permissoes: {
        visualizar: boolean;
        editar: boolean;
        compartilhar: boolean;
    };
}

export interface CompartilhamentoFiltros {
    tipo?: 'orcamento' | 'produto' | 'cliente';
    dataInicio?: string;
    dataFim?: string;
    ordenacao?: 'dataCriacao' | 'acessos' | 'dataExpiracao';
    ordem?: 'asc' | 'desc';
}

export interface NovoCompartilhamento {
    tipo: 'orcamento' | 'produto' | 'cliente';
    itemId: string;
    titulo: string;
    descricao?: string;
    dataExpiracao?: string;
    permissoes: {
        visualizar: boolean;
        editar: boolean;
        compartilhar: boolean;
    };
}
