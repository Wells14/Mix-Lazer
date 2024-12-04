export interface Cliente {
  nome: string;
  email: string;
  telefone: string;
}

export interface ItemOrcamento {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Orcamento {
  id: string;
  cliente: Cliente;
  data: Date;
  status: string;
  itens: ItemOrcamento[];
  valorTotal: number;
  observacoes?: string;
}
