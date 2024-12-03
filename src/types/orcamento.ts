export interface CustoOperacional {
  nome: string;
  valorHora: number;
  tempoEstimado: number;
  custoUnitario: number;
  custoTotal: number;
}

export interface CustoMaterial {
  nome: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  custoUnitario: number;
  custoTotal: number;
  desperdicio: number;
}

export interface Acabamento {
  nome: string;
  custo: number;
  tempoEstimado: number;
  custoUnitario: number;
  custoTotal: number;
}

export interface ConfiguracaoImposto {
  nome: string;
  porcentagem: number;
  valor: number;
  aplicarSobre: 'valorTotal' | 'valorProdutos' | 'valorServicos';
}

export interface MargemLucro {
  porcentagem: number;
  valor: number;
  tipo: 'sobre_custo' | 'sobre_venda';
}

export interface ItemOrcamento {
  id: string;
  orcamentoId?: string;
  tipo: 'produto' | 'servico';
  nome: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  largura: number;
  altura: number;
  custoUnitario: number;
  precoUnitario: number;
  precoTotal: number;
  custoOperacional?: CustoOperacional[];
  custoMaterial?: CustoMaterial[];
  acabamentos?: Acabamento[];
  margemLucro?: MargemLucro;
}

export interface Orcamento {
  id: string;
  numero: string;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'cancelado';
  data: string;
  validade: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
    endereco?: string;
  }
  prazoEntrega: string;
  formaPagamento: string;
  observacoes?: string;
  itens: ItemOrcamento[];
  subtotal: number;
  descontos: number;
  impostos: number;
  total: number;
  valorTotal?: number;
  custoTotal: number;
  margemLucroTotal: number;
  margemContribuicao: number;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
  expandido?: boolean;
}
