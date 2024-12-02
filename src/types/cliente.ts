export interface Endereco {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface Cliente {
    id: string;
    tipo: 'PF' | 'PJ';
    nome: string;
    email: string;
    telefone: string;
    documento: string; // CPF ou CNPJ
    endereco: Endereco;
    dataCadastro: Date;
    ultimaAtualizacao: Date;
    observacoes?: string;
    orcamentos?: string[]; // IDs dos orçamentos relacionados
}

export interface ClienteFiltros {
    busca?: string;
    tipo?: 'PF' | 'PJ';
    ordenacao?: 'nome' | 'dataCadastro' | 'ultimaAtualizacao';
    ordem?: 'asc' | 'desc';
}
