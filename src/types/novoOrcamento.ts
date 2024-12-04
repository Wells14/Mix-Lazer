import type { Cliente, ItemOrcamento } from './orcamento';

export interface NovoOrcamentoFormData {
  cliente: Cliente;
  itens: ItemOrcamento[];
  observacoes?: string;
}
