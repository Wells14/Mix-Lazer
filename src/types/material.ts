export interface MaterialProduto {
  id: string;
  nome: string;
  descricao?: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  fornecedor?: string;
  categoria?: string;
  codigoInterno?: string;
  observacoes?: string;
}
