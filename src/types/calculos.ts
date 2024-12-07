export interface LogCalculo {
    data: string;
    tipo: 'produto' | 'servico';
    valores: {
        custos: {
            materiais: number;
            acabamento: number;
            operacional: number;
            maoDeObra: number;
            total: number;
        };
        margemLucro: number;
        impostos: number;
        precoFinal: number;
        margemContribuicao: number;
    };
}

export interface Cliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    endereco?: string;
    cnpj?: string;
    cpf?: string;
}

export interface Produto {
    id: string;
    nome: string;
    descricao?: string;
    unidadeMedida: string;
    precoUnitario: number;
    custoUnitario: number;
    margemLucro: number;
    estoque?: number;
    estoqueMinimo?: number;
    categoria?: string;
    fornecedor?: string;
    codigoInterno?: string;
}

export interface MaterialProduto {
    id: string;
    produtoId: string;
    quantidade: number;
    custoUnitario: number;
    custoTotal: number;
    descricao?: string;
}

export interface CustoMaterial {
    id: string;
    nome: string;
    precoUnitario: number;
    quantidade: number;
    unidadeMedida: string;
    categoria?: string;
    fornecedor?: string;
}

export interface CustoAcabamento {
    id: string;
    nome: string;
    custoMetroQuadrado: number;
    areaTotal: number;
    descricao?: string;
    tempoAplicacao?: number; // em horas
}

export interface CustoOperacional {
    custoHora: number;
    tempoProducao: number; // em horas
    custoFixo: number;
    custoVariavel?: number;
    depreciacao?: number;
    manutencao?: number;
    energia?: number;
    agua?: number;
    aluguel?: number;
    internet?: number;
    telefone?: number;
    marketing?: number;
    outros?: number;
}

export interface CustoMaoDeObra {
    id: string;
    cargo: string;
    custoHora: number;
    horasTrabalhadas: number;
    encargos: number; // percentual
    beneficios?: number;
    custoTotal?: number;
}

export interface MargemLucro {
    percentual: number;
    valorBase: number;
    tipo: 'percentual' | 'valor_fixo';
    margemMinima?: number;
    margemMaxima?: number;
    estrategia?: 'competitiva' | 'premium' | 'economica';
}

export interface Imposto {
    nome: string;
    aliquota: number;
    base: 'valor_total' | 'valor_produtos' | 'valor_servicos';
    tipo: 'federal' | 'estadual' | 'municipal';
    regime?: 'simples' | 'lucro_presumido' | 'lucro_real';
    isento?: boolean;
}

export interface Desconto {
    tipo: 'percentual' | 'valor_fixo';
    valor: number;
    motivoDesconto?: string;
    validadeInicio?: Date;
    validadeFim?: Date;
    clienteId?: string;
    produtoId?: string;
}

export interface CondicaoPagamento {
    id: string;
    nome: string;
    parcelas: number;
    taxaJuros?: number;
    diasPrimeiraParcela?: number;
    intervaloEntreParcelas?: number;
    desconto?: Desconto;
}

export interface DespesaFixa {
    id: string;
    nome: string;
    valor: number;
    periodicidade: 'mensal' | 'anual' | 'semanal';
    categoria: string;
    dataVencimento?: Date;
    pago?: boolean;
}

export interface DespesaVariavel {
    id: string;
    nome: string;
    valor: number;
    baseCalculo: 'faturamento' | 'producao' | 'vendas';
    percentual: number;
    categoria: string;
}

export interface Comissao {
    vendedorId: string;
    percentual: number;
    baseCalculo: 'valor_total' | 'margem_contribuicao';
    valorMinimo?: number;
    valorMaximo?: number;
}

export interface CacheConfig {
    prefix: string;
    ttl: number;
}

export interface ResultadoCalculo {
    custoMateriais: number;
    custoAcabamento: number;
    custoOperacional: number;
    custoMaoDeObra: number;
    custoTotal: number;
    margemLucro: number;
    impostos: number;
    precoFinal: number;
    margemContribuicao: number;
}

export interface AnaliseFinanceira {
    faturamentoPrevisto: number;
    custosFixos: number;
    custosVariaveis: number;
    margemContribuicao: number;
    pontoEquilibrio: number;
    lucratividade: number;
    rentabilidade: number;
    payback: number;
    roi: number;
}

export interface Orcamento {
    id: string;
    clienteId: string;
    data: Date;
    validade: Date;
    status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
    itens: MaterialProduto[];
    custoMaoDeObra: CustoMaoDeObra[];
    custoOperacional: CustoOperacional;
    margemLucro: MargemLucro;
    impostos: Imposto[];
    desconto?: Desconto;
    condicaoPagamento: CondicaoPagamento;
    comissao?: Comissao;
    observacoes?: string;
    resultado: ResultadoCalculo;
}
