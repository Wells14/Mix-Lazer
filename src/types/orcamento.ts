export interface CustoOperacional {
  nome: string;
  valorHora: number;
  tempoEstimado: number;
}

export interface CustoMaterial {
  nome: string;
  unidade: string;
  precoUnitario: number;
  quantidade: number;
  desperdicio: number;
}

export interface Acabamento {
  nome: string;
  custo: number;
  tempoEstimado: number;
}

export interface ConfiguracaoImposto {
  nome: string;
  porcentagem: number;
  aplicarSobre: 'valorTotal' | 'valorProdutos' | 'valorServicos';
}

export interface MargemLucro {
  porcentagem: number;
  tipo: 'sobre_custo' | 'sobre_venda';
}

export interface ItemOrcamento {
  id: string;
  tipo: 'produto' | 'servico';
  nome: string;
  descricao?: string;
  quantidade: number;
  unidade: string;
  largura?: number;
  altura?: number;
  materiais: CustoMaterial[];
  acabamentos: Acabamento[];
  custosOperacionais: CustoOperacional[];
  custoUnitario: number;
  margemLucro: MargemLucro;
  impostos: ConfiguracaoImposto[];
  precoUnitario: number;
  precoTotal: number;
}

export interface Orcamento {
  id: number;
  numero: string;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'reprovado' | 'cancelado';
  data: string;
  validade: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    endereco?: string;
  };
  prazoEntrega: string;
  condicoesEntrega?: string;
  formaPagamento?: string;
  observacoes?: string;
  itens: ItemOrcamento[];
  
  // Totalizadores
  subtotal: number;
  descontos: number;
  impostos: number;
  total: number;
  
  // Custos
  custoTotal: number;
  margemLucroTotal: number;
  margemContribuicao: number;
  
  // Metadados
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
}
