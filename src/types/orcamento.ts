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
  tipo: 'produto' | 'servico';
  nome: string;
  quantidade: number;
  unidade: string;
  largura: number;
  altura: number;
  custoUnitario: number;
  precoUnitario: number;
  precoTotal: number;
  descricao?: string;
}

export interface OrcamentosState {
  itens: ItemOrcamento[];
  adicionarItemOrcamento: (item: ItemOrcamento) => void;
  atualizarItemOrcamento: (id: string, item: ItemOrcamento) => void;
  removerItemOrcamento: (id: string) => void;
}

export interface Orcamento {
  id: string;
  data: string;
  clienteId: string;
  itens: ItemOrcamento[];
  subtotal: number;
  desconto?: number;
  total: number;
  observacoes?: string;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'cancelado';
  formaPagamento?: string;
  prazoEntrega?: string;
  validadeOrcamento?: string;
}
