// Tipos básicos do sistema
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DashboardData {
  vendas: {
    total: number;
    quantidade: number;
    ticketMedio: number;
  };
  estoque: {
    total: number;
    produtosBaixoEstoque: number;
  };
  clientes: {
    total: number;
    novos: number;
    ativos: number;
  };
  produtos: {
    total: number;
    maisVendidos: Array<{
      id: string;
      nome: string;
      quantidade: number;
      valor: number;
    }>;
  };
}

export interface Cliente {
  id: string;
  tipo: 'PF' | 'PJ';
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  observacoes?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  dimensoes: {
    unidade: 'cm' | 'm';
    largura: number;
    altura: number;
    profundidade: number;
  };
  custoProducao: {
    materiais: number;
    maoDeObra: number;
    custoFixo: number;
    outros: number;
  };
  precoBase: number;
  margemLucro: number;
  ativo: boolean;
  tags?: string[];
}

export interface Venda {
  id: string;
  clienteId: string;
  data: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    total: number;
  }>;
  total: number;
  status: 'pendente' | 'pago' | 'cancelado';
  formaPagamento?: string;
  observacoes?: string;
}
